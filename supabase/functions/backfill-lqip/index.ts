// Backfill LQIP + dimensions for approved (or any subset of) media rows.
// Admin-only. POST { paths: [], force?: boolean }.
//
// For each path:
//   1. Download the image bytes from Storage.
//   2. Decode → write `width` and `height` to media_metadata.
//   3. Resize to 16px wide → JPEG quality 40 → base64 → write to `lqip`.
//
// Why 16px: tiny enough to inline (~300 bytes), big enough that a 20px
// blur looks like a real photo. Same trick Next.js uses for `placeholder="blur"`.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  Image,
  decode,
} from "https://deno.land/x/imagescript@1.2.17/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "media-library";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function processOne(
  url: string,
): Promise<
  | { ok: true; width: number; height: number; lqip: string }
  | { ok: false; error: string }
> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return { ok: false, error: `fetch ${resp.status}` };
    const ct = resp.headers.get("content-type") ?? "";
    // imagescript supports PNG + JPEG. Skip everything else (HEIC etc.)
    if (!/image\/(png|jpe?g)/i.test(ct)) {
      return { ok: false, error: `unsupported content-type: ${ct}` };
    }
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const decoded = await decode(bytes);
    if (!(decoded instanceof Image)) {
      return { ok: false, error: "decode failed" };
    }
    const width = decoded.width;
    const height = decoded.height;
    // Generate LQIP — resize to 16px wide preserving aspect, then JPEG q=40
    const targetW = 16;
    const targetH = Math.max(1, Math.round((targetW * height) / width));
    const tiny = decoded.resize(targetW, targetH);
    const lqipBytes = await tiny.encodeJPEG(40);
    // Base64 encode in a memory-safe chunked way
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < lqipBytes.length; i += chunk) {
      bin += String.fromCharCode(
        ...lqipBytes.subarray(i, Math.min(i + chunk, lqipBytes.length)),
      );
    }
    const b64 = btoa(bin);
    return { ok: true, width, height, lqip: `data:image/jpeg;base64,${b64}` };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "unknown decode error",
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

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData?.user?.id) {
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

    const body = await req.json().catch(() => ({}));
    const inputPaths: string[] | undefined = body?.paths;
    const force: boolean = body?.force === true;

    // If no paths supplied, process every approved row missing lqip OR width.
    let paths: string[] = inputPaths ?? [];
    if (!inputPaths || inputPaths.length === 0) {
      let q = admin
        .from("media_metadata")
        .select("storage_path, lqip, width")
        .eq("ai_review_status", "approved");
      if (!force) q = q.or("lqip.is.null,width.is.null");
      const { data: rows, error } = await q.limit(60);
      if (error) {
        return json({ success: false, error: error.message }, 500);
      }
      paths = (rows ?? []).map((r) => r.storage_path as string);
    }

    if (paths.length > 60) {
      return json(
        { success: false, error: "Max 60 paths per call (rerun for the rest)" },
        400,
      );
    }

    const results: Array<{
      path: string;
      success: boolean;
      width?: number;
      height?: number;
      error?: string;
    }> = [];

    for (const path of paths) {
      // Skip videos
      if (/\.(mov|mp4|webm|m4v)$/i.test(path)) {
        results.push({ path, success: false, error: "video skipped" });
        continue;
      }
      const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
      const out = await processOne(urlData.publicUrl);
      if (!out.ok) {
        results.push({ path, success: false, error: out.error });
        continue;
      }
      const { error: upErr } = await admin
        .from("media_metadata")
        .upsert(
          {
            storage_path: path,
            lqip: out.lqip,
            width: out.width,
            height: out.height,
          },
          { onConflict: "storage_path" },
        );
      if (upErr) {
        results.push({ path, success: false, error: upErr.message });
      } else {
        results.push({
          path,
          success: true,
          width: out.width,
          height: out.height,
        });
      }
    }

    return json({
      success: true,
      processed: results.length,
      ok: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (err) {
    console.error("backfill-lqip error", err);
    return json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500,
    );
  }
});
