// auto-classify-batch
//
// One-button orchestrator that takes the entire `pending` queue of media
// assets and runs it through the full editorial pipeline:
//
//   1. Vision-classify each image (Lovable AI gateway, Gemini Flash).
//   2. Auto-approve anything scoring hero/portfolio quality + real service
//      tag + ≥12-character alt text.
//   3. Move auto-approved files from `uncategorized/` into the right
//      service or project folder so the gallery selectors find them.
//   4. Cluster: any `project_guess` with ≥3 approved photos seeds a row in
//      `projects` (featured=true, hero pick = best hero shot).
//   5. Fire LQIP + width/height backfill for the freshly approved set
//      (delegated to the existing `backfill-lqip` function).
//
// The function processes up to CHUNK_SIZE images per invocation and then
// self-invokes (fire-and-forget) if more pending rows remain. This keeps
// every request well under the Supabase 150s sync limit while letting the
// caller fire-and-forget a single button press for ~hundreds of images.
//
// Admin only — verifies via has_role(_user_id, 'admin').

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "media-library";
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const CHUNK_SIZE = 25;          // images per invocation
const AI_BATCH = 4;             // parallel AI calls inside a chunk
const INTER_BATCH_MS = 600;     // throttle between mini-batches (RPM ceiling)

// ─────────────────────────────────────────────────────────────────────
// Editorial system prompt — kept in lockstep with classify-media so the
// taxonomy stays consistent across both code paths.
// ─────────────────────────────────────────────────────────────────────

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
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
              {
                type: "text",
                text: "Classify this photo. Use the classify_photo tool to return your answer.",
              },
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
    if (resp.status === 429) {
      return { error: "Rate limited by AI gateway — pausing.", status: 429 };
    }
    if (resp.status === 402) {
      return { error: "AI credits exhausted. Top up in Workspace → Usage.", status: 402 };
    }
    return { error: `AI gateway ${resp.status}: ${text.slice(0, 200)}`, status: resp.status };
  }

  const data = await resp.json();
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) return { error: "AI returned no structured output" };
  try {
    return JSON.parse(toolCall.function.arguments) as ClassifyResult;
  } catch (e) {
    return {
      error: `Invalid JSON from AI: ${e instanceof Error ? e.message : "unknown"}`,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Self-invocation: fires a follow-up request if more pending rows remain.
// Uses the service role key as Bearer auth, with a `x-internal-recurse`
// header that bypasses the user-admin check. The header is only honored
// when the Bearer token equals SUPABASE_SERVICE_ROLE_KEY — which is never
// available to the browser, so this is safe.
// ─────────────────────────────────────────────────────────────────────

async function selfReinvoke(supabaseUrl: string, serviceKey: string): Promise<void> {
  const url = `${supabaseUrl}/functions/v1/auto-classify-batch`;
  // Fire and forget — do NOT await the response body.
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");

  if (!lovableKey) {
    return json({ success: false, error: "LOVABLE_API_KEY not configured" }, 500);
  }

  // ── Auth: admin user OR internal self-recursion with service key ──
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
    if (userErr || !userData?.user?.id) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }
    const adminCheckClient = createClient(supabaseUrl, serviceKey);
    const { data: roleCheck } = await adminCheckClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleCheck !== true) {
      return json({ success: false, error: "Forbidden — admin only" }, 403);
    }
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // ── Pull next chunk of pending images ──
  const { data: pendingRows, error: qErr } = await admin
    .from("media_metadata")
    .select("storage_path")
    .eq("ai_review_status", "pending")
    .order("created_at", { ascending: true })
    .limit(CHUNK_SIZE * 4); // grab a buffer so we can skip videos cleanly

  if (qErr) {
    return json({ success: false, error: `query failed: ${qErr.message}` }, 500);
  }

  const allPaths = (pendingRows ?? []).map((r) => r.storage_path as string);
  const imagePaths = allPaths.filter((p) => !/\.(mov|mp4|webm|m4v)$/i.test(p));
  const videoPaths = allPaths.filter((p) => /\.(mov|mp4|webm|m4v)$/i.test(p));

  // Mark videos as "skipped" so they stop showing as pending.
  if (videoPaths.length > 0) {
    await admin
      .from("media_metadata")
      .update({
        ai_review_status: "rejected",
        ai_notes: "video — auto-classifier skipped (vision is image-only)",
      })
      .in("storage_path", videoPaths);
  }

  const thisChunk = imagePaths.slice(0, CHUNK_SIZE);
  if (thisChunk.length === 0) {
    return json({
      success: true,
      processed: 0,
      approved: 0,
      projectsCreated: 0,
      backfilled: 0,
      done: true,
      message: "No pending images.",
    });
  }

  // ── Classify the chunk in parallel mini-batches ──
  const approveQueue: ApproveItem[] = [];
  const errors: Array<{ path: string; error: string }> = [];
  let processed = 0;
  let halted = false;
  let haltReason: string | null = null;

  for (let i = 0; i < thisChunk.length; i += AI_BATCH) {
    if (halted) break;
    const slice = thisChunk.slice(i, i + AI_BATCH);
    const results = await Promise.all(
      slice.map(async (path) => {
        const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
        const result = await classifyOne(urlData.publicUrl, DEFAULT_MODEL, lovableKey);
        return { path, result };
      }),
    );

    for (const { path, result } of results) {
      processed++;
      if ("error" in result) {
        errors.push({ path, error: result.error });
        // 429 / 402 means stop hitting the gateway for this invocation
        if (result.status === 429 || result.status === 402) {
          halted = true;
          haltReason = result.error;
        }
        await admin
          .from("media_metadata")
          .upsert(
            { storage_path: path, ai_notes: result.error.slice(0, 240) },
            { onConflict: "storage_path" },
          );
        continue;
      }

      // Always upsert classification → suggested
      await admin.from("media_metadata").upsert(
        {
          storage_path: path,
          alt: result.alt,
          service: result.service,
          shot_type: result.shot_type,
          project_guess: result.project_guess,
          ai_subject: result.subject,
          ai_quality: result.quality,
          ai_season: result.season,
          ai_notes: result.notes ?? "",
          ai_review_status: "suggested",
        },
        { onConflict: "storage_path" },
      );

      // Auto-approve gate
      const altOk = (result.alt ?? "").trim().length >= 12;
      const serviceOk = !!result.service && result.service !== "other";
      const qualityOk = result.quality === "hero" || result.quality === "portfolio";
      if (altOk && serviceOk && qualityOk) {
        approveQueue.push({
          path,
          service: result.service,
          shot_type: result.shot_type,
          alt: result.alt,
          project_slug: result.project_guess?.trim() || null,
          quality: result.quality,
        });
      }
    }

    if (i + AI_BATCH < thisChunk.length && !halted) {
      await sleep(INTER_BATCH_MS);
    }
  }

  // ── Move + approve auto-approvable items ──
  let approved = 0;
  for (const item of approveQueue) {
    const targetFolder = item.project_slug || item.service;
    const currentFolder = item.path.split("/")[0];
    let finalPath = item.path;

    if (targetFolder !== currentFolder) {
      const filename = item.path.split("/").slice(1).join("/");
      const newPath = `${targetFolder}/${filename}`;
      const { error: moveErr } = await admin.storage
        .from(BUCKET)
        .move(item.path, newPath);
      if (!moveErr) {
        finalPath = newPath;
        // Delete the old metadata row so we don't end up with two
        await admin.from("media_metadata").delete().eq("storage_path", item.path);
      }
      // If move failed (file may be in use elsewhere), keep current path.
    }

    const { error } = await admin.from("media_metadata").upsert(
      {
        storage_path: finalPath,
        alt: item.alt,
        service: item.service,
        shot_type: item.shot_type,
        project_guess: item.project_slug,
        project_slug: item.project_slug,
        ai_quality: item.quality,
        ai_review_status: "approved",
      },
      { onConflict: "storage_path" },
    );
    if (!error) {
      approved++;
      item.path = finalPath; // mutate for subsequent project clustering
    }
  }

  // ── Cluster: any project_slug with ≥3 approved photos becomes a project ──
  let projectsCreated = 0;
  const bySlug = new Map<string, ApproveItem[]>();
  for (const item of approveQueue) {
    if (!item.project_slug) continue;
    const arr = bySlug.get(item.project_slug) ?? [];
    arr.push(item);
    bySlug.set(item.project_slug, arr);
  }
  for (const [slug, items] of bySlug) {
    if (items.length < 3) continue;
    const heroPick =
      items.find((i) => i.quality === "hero" && i.shot_type === "hero") ??
      items.find((i) => i.shot_type === "hero") ??
      items.find((i) => i.quality === "hero") ??
      items[0];
    const title = slug
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const { data: existing } = await admin
      .from("projects")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) {
      const { error: pErr } = await admin.from("projects").insert({
        slug,
        title,
        service: items[0].service,
        status: "complete",
        year: new Date().getFullYear(),
        featured: true,
        display_order: 50,
        hero_path: heroPick.path,
      });
      if (!pErr) projectsCreated++;
    }
  }

  // ── LQIP backfill (delegated, fire-and-forget per chunk) ──
  let backfilled = 0;
  if (approveQueue.length > 0) {
    try {
      const lqipUrl = `${supabaseUrl}/functions/v1/backfill-lqip`;
      for (let i = 0; i < approveQueue.length; i += 30) {
        const slice = approveQueue.slice(i, i + 30).map((q) => q.path);
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

  const remainingImages = (stillPending ?? 0);
  const morePending = remainingImages > 0 && !halted;

  if (morePending) {
    // Fire-and-forget the next chunk
    selfReinvoke(supabaseUrl, serviceKey);
  }

  return json({
    success: true,
    processed,
    approved,
    projectsCreated,
    backfilled,
    halted,
    haltReason,
    morePending,
    remainingPending: remainingImages,
    errors: errors.slice(0, 10), // surface first 10 errors only
    done: !morePending,
  });
});
