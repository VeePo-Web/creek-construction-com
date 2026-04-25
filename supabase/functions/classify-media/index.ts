// Classify media assets using Lovable AI (vision).
// Admin-only. POST { paths: [], model?: 'google/gemini-2.5-pro' }.
// Writes results into media_metadata with ai_review_status='suggested'.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "media-library";
const DEFAULT_MODEL = "google/gemini-2.5-pro";

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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
            "decks",
            "fencing",
            "sheds",
            "painting",
            "siding",
            "pergolas",
            "interiors",
            "exterior",
            "other",
          ],
        },
        shot_type: {
          type: "string",
          enum: [
            "hero",
            "elevation",
            "detail",
            "interior",
            "process",
            "wide",
            "aerial",
            "texture",
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
      required: [
        "service",
        "shot_type",
        "subject",
        "alt",
        "quality",
        "season",
      ],
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

async function classifyOne(
  imageUrl: string,
  model: string,
  apiKey: string,
): Promise<ClassifyResult | { error: string }> {
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
        tool_choice: {
          type: "function",
          function: { name: "classify_photo" },
        },
      }),
    },
  );

  if (!resp.ok) {
    const text = await resp.text();
    if (resp.status === 429)
      return { error: "Rate limited by Lovable AI — try again in a minute." };
    if (resp.status === 402)
      return {
        error:
          "AI credits exhausted — top up at Settings > Workspace > Usage.",
      };
    return { error: `AI gateway ${resp.status}: ${text.slice(0, 200)}` };
  }

  const data = await resp.json();
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    return { error: "AI returned no structured output" };
  }
  try {
    return JSON.parse(toolCall.function.arguments) as ClassifyResult;
  } catch (e) {
    return {
      error: `Invalid JSON from AI: ${e instanceof Error ? e.message : "unknown"}`,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) {
      return json(
        { success: false, error: "LOVABLE_API_KEY not configured" },
        500,
      );
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleCheck } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleCheck !== true) {
      return json({ success: false, error: "Forbidden — admin only" }, 403);
    }

    const body = await req.json();
    const paths: string[] = body.paths ?? [];
    const model: string = body.model ?? DEFAULT_MODEL;

    if (!Array.isArray(paths) || paths.length === 0) {
      return json({ success: false, error: "paths[] required" }, 400);
    }
    if (paths.length > 20) {
      return json(
        { success: false, error: "Max 20 paths per request" },
        400,
      );
    }

    const results: Array<{
      path: string;
      success: boolean;
      classification?: ClassifyResult;
      error?: string;
    }> = [];

    for (const path of paths) {
      // Skip videos — vision models only handle images
      if (/\.(mov|mp4|webm|m4v)$/i.test(path)) {
        results.push({
          path,
          success: false,
          error: "video — skipped (use video classifier)",
        });
        continue;
      }
      const { data: urlData } = admin.storage
        .from(BUCKET)
        .getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      const classified = await classifyOne(imageUrl, model, lovableKey);
      if ("error" in classified) {
        results.push({ path, success: false, error: classified.error });
        // Mark as pending again so it can be retried later
        await admin
          .from("media_metadata")
          .upsert(
            {
              storage_path: path,
              ai_notes: classified.error,
            },
            { onConflict: "storage_path" },
          );
        continue;
      }

      const { error: upErr } = await admin
        .from("media_metadata")
        .upsert(
          {
            storage_path: path,
            alt: classified.alt,
            service: classified.service,
            shot_type: classified.shot_type,
            project_guess: classified.project_guess,
            ai_subject: classified.subject,
            ai_quality: classified.quality,
            ai_season: classified.season,
            ai_notes: classified.notes ?? "",
            ai_review_status: "suggested",
          },
          { onConflict: "storage_path" },
        );

      if (upErr) {
        results.push({
          path,
          success: false,
          error: `DB write failed: ${upErr.message}`,
        });
      } else {
        results.push({ path, success: true, classification: classified });
      }
    }

    return json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (err) {
    console.error("classify-media error", err);
    return json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500,
    );
  }
});
