// auto-classify-batch
//
// One-button orchestrator that drains the entire `pending` media queue
// and runs it through the full editorial pipeline.
//
// v2 changes (2026-04-26):
//   - Videos are NO LONGER silently rejected. They get an editorial alt,
//     `service` is inferred from sibling photos taken nearby in time,
//     they are moved to `video-process/`, and they are auto-approved.
//   - Project clustering is now hierarchical: slug normalization →
//     sibling-time-bucket merge → ≥2-photo cluster threshold for shed/
//     fence/deck → fallback service portfolios so `FeaturedProjects`
//     always renders.
//   - Tier-2 promotion: `quality:reference` rows with a real service +
//     valid alt get auto-approved (they fill secondary strips, never
//     the hero — the public-media `min_quality:'hero'` filter still
//     excludes them from above-the-fold slots).
//
// Admin only — verifies via has_role(_user_id, 'admin'); also accepts
// service-key Bearer with `x-internal-recurse: 1` for self-recursion.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "media-library";
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const CHUNK_SIZE = 25;
const AI_BATCH = 4;
const INTER_BATCH_MS = 600;

const VIDEO_RX = /\.(mov|mp4|webm|m4v)$/i;

const SYSTEM_PROMPT = `You are an editorial photo director for Creek Construction, a residential exterior contractor in Calgary and Edmonton, Alberta. They build decks, fences, sheds, pergolas, and do painting & siding.

Your job: look at one photo and classify it for use on their portfolio website. The site has the editorial restraint of Fantasy.co — every image must earn its place. Be honest about quality.

CRITICAL rules for the alt field:
- 12 to 22 words.
- Geographic + structural ("Cedar privacy fence with horizontal slats during installation in an Edmonton backyard, late-afternoon light.")
- Never marketing copy. Never adjectives like "beautiful", "stunning", "amazing".
- No brand name. No call-to-action.

For project_guess: if multiple shots clearly look like the same site (same fence line, same house, same materials, same lighting), suggest the same kebab-case slug. Otherwise null.

For quality:
- "hero" — gorgeous, cinematic, worthy of a full-bleed hero or homepage feature
- "portfolio" — solid documentation shot, good enough for a project gallery
- "reference" — useful internal record but not pretty enough for the public site
- "reject" — blurry, accidental, poorly lit, screenshots of screenshots, anything not worth using`;

const SCHEMA_TOOL = {
  type: "function",
  function: {
    name: "classify_photo",
    description: "Return structured classification for a single photo.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        service: {
          type: "string",
          enum: [
            "decks", "fencing", "sheds", "painting", "siding",
            "pergolas", "interiors", "exterior", "other",
          ],
        },
        shot_type: {
          type: "string",
          enum: [
            "hero", "elevation", "detail", "interior",
            "process", "wide", "aerial", "texture",
          ],
        },
        subject: { type: "string" },
        alt: { type: "string" },
        project_guess: { type: ["string", "null"] },
        quality: {
          type: "string",
          enum: ["hero", "portfolio", "reference", "reject"],
        },
        season: {
          type: "string",
          enum: ["summer", "fall", "winter", "spring", "unknown"],
        },
        notes: { type: "string" },
      },
      required: ["service", "shot_type", "subject", "alt", "quality", "season"],
    },
  },
};

interface ClassifyResult {
  service: string;
  shot_type: string;
  subject: string;
  alt: string;
  project_guess: string | null;
  quality: string;
  season: string;
  notes: string;
}

interface ApproveItem {
  path: string;
  service: string;
  shot_type: string;
  alt: string;
  project_slug: string | null;
  quality: string;
  is_video?: boolean;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Normalize slugs so urban_shed_calgary and urban-shed-calgary collapse. */
function normalizeSlug(s: string | null | undefined): string | null {
  if (!s) return null;
  const cleaned = s
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned.length >= 3 ? cleaned : null;
}

async function classifyOne(
  imageUrl: string,
  model: string,
  apiKey: string,
): Promise<ClassifyResult | { error: string; status?: number }> {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this photo. Use the classify_photo tool to return your answer." },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        tools: [SCHEMA_TOOL],
        tool_choice: { type: "function", function: { name: "classify_photo" } },
      }),
    },
  );

  if (!resp.ok) {
    const text = await resp.text();
    if (resp.status === 429) return { error: "Rate limited by AI gateway — pausing.", status: 429 };
    if (resp.status === 402) return { error: "AI credits exhausted. Top up in Workspace → Usage.", status: 402 };
    return { error: `AI gateway ${resp.status}: ${text.slice(0, 200)}`, status: resp.status };
  }

  const data = await resp.json();
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) return { error: "AI returned no structured output" };
  try {
    return JSON.parse(toolCall.function.arguments) as ClassifyResult;
  } catch (e) {
    return { error: `Invalid JSON from AI: ${e instanceof Error ? e.message : "unknown"}` };
  }
}

function selfReinvoke(supabaseUrl: string, serviceKey: string): void {
  const url = `${supabaseUrl}/functions/v1/auto-classify-batch`;
  try {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        "x-internal-recurse": "1",
        apikey: serviceKey,
      },
      body: JSON.stringify({ continuation: true }),
    }).catch((e) => console.warn("self-reinvoke fetch threw", e));
  } catch (e) {
    console.warn("self-reinvoke setup failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  if (!lovableKey) return json({ success: false, error: "LOVABLE_API_KEY not configured" }, 500);

  // ── Auth: admin OR internal recursion with service key ──
  const authHeader = req.headers.get("Authorization") ?? "";
  const internalRecurse = req.headers.get("x-internal-recurse") === "1";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");
  const isInternal = internalRecurse && bearer === serviceKey;

  if (!isInternal) {
    if (!authHeader) return json({ success: false, error: "Unauthorized" }, 401);
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user?.id) return json({ success: false, error: "Unauthorized" }, 401);
    const adminCheckClient = createClient(supabaseUrl, serviceKey);
    const { data: roleCheck } = await adminCheckClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleCheck !== true) return json({ success: false, error: "Forbidden — admin only" }, 403);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // ── Pull next chunk of pending rows (images AND videos) ──
  const { data: pendingRows, error: qErr } = await admin
    .from("media_metadata")
    .select("storage_path, created_at")
    .eq("ai_review_status", "pending")
    .order("created_at", { ascending: true })
    .limit(CHUNK_SIZE * 2);

  if (qErr) return json({ success: false, error: `query failed: ${qErr.message}` }, 500);

  const allRows = pendingRows ?? [];
  const thisChunk = allRows.slice(0, CHUNK_SIZE);

  const approveQueue: ApproveItem[] = [];
  const errors: Array<{ path: string; error: string }> = [];
  let processed = 0;
  let processedVideos = 0;
  let halted = false;
  let haltReason: string | null = null;

  // ── Process images via vision AI in mini-batches ──
  const imageRows = thisChunk.filter((r) => !VIDEO_RX.test(r.storage_path as string));
  const videoRows = thisChunk.filter((r) => VIDEO_RX.test(r.storage_path as string));

  for (let i = 0; i < imageRows.length; i += AI_BATCH) {
    if (halted) break;
    const slice = imageRows.slice(i, i + AI_BATCH);
    const results = await Promise.all(
      slice.map(async (row) => {
        const path = row.storage_path as string;
        const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
        const result = await classifyOne(urlData.publicUrl, DEFAULT_MODEL, lovableKey);
        return { path, result };
      }),
    );

    for (const { path, result } of results) {
      processed++;
      if ("error" in result) {
        errors.push({ path, error: result.error });
        if (result.status === 429 || result.status === 402) {
          halted = true;
          haltReason = result.error;
        }
        await admin
          .from("media_metadata")
          .upsert({ storage_path: path, ai_notes: result.error.slice(0, 240) }, { onConflict: "storage_path" });
        continue;
      }

      const slug = normalizeSlug(result.project_guess);

      // Always upsert the classification → suggested
      await admin.from("media_metadata").upsert({
        storage_path: path,
        alt: result.alt,
        service: result.service,
        shot_type: result.shot_type,
        project_guess: slug,
        ai_subject: result.subject,
        ai_quality: result.quality,
        ai_season: result.season,
        ai_notes: result.notes ?? "",
        ai_review_status: "suggested",
      }, { onConflict: "storage_path" });

      // ── Auto-approve gate (TIER 1: hero/portfolio) ──
      const altOk = (result.alt ?? "").trim().length >= 12;
      const serviceOk = !!result.service && result.service !== "other";
      const tier1 = (result.quality === "hero" || result.quality === "portfolio") && altOk && serviceOk;
      // ── TIER 2: reference quality with real service + alt — fills secondary slots ──
      const tier2 = result.quality === "reference" && altOk && serviceOk;

      if (tier1 || tier2) {
        approveQueue.push({
          path,
          service: result.service,
          shot_type: result.shot_type,
          alt: result.alt,
          project_slug: slug,
          quality: result.quality,
        });
      }
    }

    if (i + AI_BATCH < imageRows.length && !halted) await sleep(INTER_BATCH_MS);
  }

  // ── Video pipeline: infer service from sibling images, auto-approve as portfolio ──
  for (const row of videoRows) {
    const path = row.storage_path as string;
    const takenAt = row.created_at ? new Date(row.created_at as string) : new Date();
    const windowStart = new Date(takenAt.getTime() - 30 * 60 * 1000).toISOString();
    const windowEnd = new Date(takenAt.getTime() + 30 * 60 * 1000).toISOString();

    // Find sibling approved/suggested photos within ±30 min and use the
    // most common service tag.
    const { data: siblings } = await admin
      .from("media_metadata")
      .select("service, project_guess")
      .gte("created_at", windowStart)
      .lte("created_at", windowEnd)
      .not("service", "is", null)
      .neq("service", "other")
      .limit(20);

    const serviceTally = new Map<string, number>();
    const slugTally = new Map<string, number>();
    for (const s of siblings ?? []) {
      const sv = s.service as string | null;
      const sg = s.project_guess as string | null;
      if (sv) serviceTally.set(sv, (serviceTally.get(sv) ?? 0) + 1);
      if (sg) slugTally.set(sg, (slugTally.get(sg) ?? 0) + 1);
    }
    const topService =
      [...serviceTally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "exterior";
    const topSlug =
      [...slugTally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const isQuickTime = /\.mov$/i.test(path);
    const note = isQuickTime
      ? "video — .mov source, transcode to .mp4 for cross-browser autoplay (Safari plays as-is)"
      : "video — auto-approved as ambient process clip";

    const alt = `Build process clip from a ${topService} project in Calgary or Edmonton, Alberta — silent looping ambient video.`;

    await admin.from("media_metadata").upsert({
      storage_path: path,
      alt,
      service: topService,
      shot_type: "process",
      project_guess: topSlug,
      ai_subject: `${topService} build process`,
      ai_quality: "portfolio",
      ai_season: "unknown",
      ai_notes: note,
      ai_review_status: "suggested",
    }, { onConflict: "storage_path" });

    approveQueue.push({
      path,
      service: topService,
      shot_type: "process",
      alt,
      project_slug: topSlug,
      quality: "portfolio",
      is_video: true,
    });

    processedVideos++;
    processed++;
  }

  // ── Move + approve everything in the queue ──
  let approved = 0;
  for (const item of approveQueue) {
    const targetFolder = item.is_video
      ? "video-process"
      : (item.project_slug || item.service);
    const currentFolder = item.path.split("/")[0];
    let finalPath = item.path;

    if (targetFolder !== currentFolder) {
      const filename = item.path.split("/").slice(1).join("/");
      const newPath = `${targetFolder}/${filename}`;
      const { error: moveErr } = await admin.storage.from(BUCKET).move(item.path, newPath);
      if (!moveErr) {
        finalPath = newPath;
        await admin.from("media_metadata").delete().eq("storage_path", item.path);
      }
    }

    const { error } = await admin.from("media_metadata").upsert({
      storage_path: finalPath,
      alt: item.alt,
      service: item.service,
      shot_type: item.shot_type,
      project_guess: item.project_slug,
      project_slug: item.project_slug,
      ai_quality: item.quality,
      ai_review_status: "approved",
    }, { onConflict: "storage_path" });

    if (!error) {
      approved++;
      item.path = finalPath;
    }
  }

  // ── Hierarchical project clustering (run on EVERY invocation so even
  //    partial drains seed projects as soon as a cluster forms). ──
  let projectsCreated = 0;
  try {
    // Pull every approved row site-wide so clusters are global, not just
    // limited to this chunk.
    const { data: allApproved } = await admin
      .from("media_metadata")
      .select("storage_path, service, shot_type, project_slug, ai_quality")
      .eq("ai_review_status", "approved");

    const pool = (allApproved ?? []).filter(
      (r) => !VIDEO_RX.test(r.storage_path as string) && r.service !== "other",
    );

    // Group by normalized slug
    const bySlug = new Map<string, typeof pool>();
    for (const r of pool) {
      const slug = normalizeSlug(r.project_slug as string);
      if (!slug) continue;
      const arr = bySlug.get(slug) ?? [];
      arr.push(r);
      bySlug.set(slug, arr);
    }

    // Tier-1 projects: real ≥2-photo clusters, sheds/decks/fencing only
    const TIER1_SERVICES = new Set(["sheds", "decks", "fencing", "pergolas"]);
    for (const [slug, items] of bySlug) {
      if (items.length < 2) continue;
      if (!TIER1_SERVICES.has(items[0].service as string)) continue;
      const heroPick =
        items.find((i) => i.ai_quality === "hero" && i.shot_type === "hero") ??
        items.find((i) => i.shot_type === "hero") ??
        items.find((i) => i.shot_type === "elevation") ??
        items.find((i) => i.ai_quality === "portfolio") ??
        items[0];
      const title = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const { data: existing } = await admin
        .from("projects").select("slug").eq("slug", slug).maybeSingle();
      if (!existing) {
        const { error: pErr } = await admin.from("projects").insert({
          slug,
          title,
          service: items[0].service,
          status: "complete",
          year: new Date().getFullYear(),
          featured: true,
          display_order: 50,
          hero_path: heroPick.storage_path,
          location: items[0].service === "sheds" ? "Calgary & Edmonton" : null,
        });
        if (!pErr) projectsCreated++;
      }
    }

    // Fallback service-portfolio projects so FeaturedProjects always fills.
    // We seed up to 3 per service: portfolio-{service}-2025
    const { count: existingProjectCount } = await admin
      .from("projects").select("*", { count: "exact", head: true });

    if ((existingProjectCount ?? 0) < 3) {
      const byService = new Map<string, typeof pool>();
      for (const r of pool) {
        const sv = r.service as string;
        if (!sv) continue;
        const arr = byService.get(sv) ?? [];
        arr.push(r);
        byService.set(sv, arr);
      }
      for (const [service, items] of byService) {
        if (items.length < 1) continue;
        const slug = `portfolio-${service}-${new Date().getFullYear()}`;
        const { data: existing } = await admin
          .from("projects").select("slug").eq("slug", slug).maybeSingle();
        if (existing) continue;
        const heroPick =
          items.find((i) => i.shot_type === "hero" || i.shot_type === "elevation") ??
          items[0];
        const titleService = service.charAt(0).toUpperCase() + service.slice(1);
        const { error: pErr } = await admin.from("projects").insert({
          slug,
          title: `${titleService} Portfolio`,
          service,
          status: "complete",
          year: new Date().getFullYear(),
          featured: true,
          display_order: 80,
          hero_path: heroPick.storage_path,
          location: "Calgary & Edmonton",
          summary: `Selected ${service} work across Calgary, Edmonton, and surrounding Alberta.`,
        });
        if (!pErr) projectsCreated++;
      }
    }
  } catch (e) {
    console.warn("clustering failed (non-fatal)", e);
  }

  // ── LQIP backfill (delegated, fire-and-forget per chunk) ──
  let backfilled = 0;
  if (approveQueue.length > 0) {
    try {
      const lqipUrl = `${supabaseUrl}/functions/v1/backfill-lqip`;
      const imagePathsForLqip = approveQueue.filter((q) => !q.is_video).map((q) => q.path);
      for (let i = 0; i < imagePathsForLqip.length; i += 30) {
        const slice = imagePathsForLqip.slice(i, i + 30);
        const res = await fetch(lqipUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
          },
          body: JSON.stringify({ paths: slice }),
        });
        if (res.ok) {
          const data = await res.json();
          backfilled += data.ok ?? 0;
        }
      }
    } catch (e) {
      console.warn("LQIP backfill failed (non-fatal)", e);
    }
  }

  // ── Decide whether to self-recurse ──
  const { count: stillPending } = await admin
    .from("media_metadata")
    .select("*", { count: "exact", head: true })
    .eq("ai_review_status", "pending");

  const remainingImages = stillPending ?? 0;
  const morePending = remainingImages > 0 && !halted;

  if (morePending) selfReinvoke(supabaseUrl, serviceKey);

  return json({
    success: true,
    processed,
    processedVideos,
    approved,
    projectsCreated,
    backfilled,
    halted,
    haltReason,
    morePending,
    remainingPending: remainingImages,
    errors: errors.slice(0, 10),
    done: !morePending,
  });
});
