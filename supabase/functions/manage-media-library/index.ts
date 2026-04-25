// Admin Media Library — handles list/upload/move/rename/delete on the media-library bucket.
// All operations require an authenticated user with the 'admin' role.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "media-library";

function sanitizeFilename(name: string): string {
  // Keep extension; replace anything weird in the basename.
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${cleanBase || "file"}${ext.toLowerCase()}`;
}

function sanitizeFolder(folder: string): string {
  return folder
    .toLowerCase()
    .replace(/[^a-z0-9-_/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "")
    .slice(0, 80);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// deno-lint-ignore no-explicit-any
async function uniqueName(
  admin: any,
  folder: string,
  filename: string,
  upsert: boolean,
): Promise<string> {
  if (upsert) return filename;
  const dot = filename.lastIndexOf(".");
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot) : "";
  let candidate = filename;
  let n = 2;
  // List once per folder, then probe in-memory to avoid N round-trips.
  const { data: existing } = await admin.storage
    .from(BUCKET)
    .list(folder, { limit: 1000 });
  const names = new Set((existing ?? []).map((f) => f.name));
  while (names.has(candidate)) {
    candidate = `${base}-${n}${ext}`;
    n += 1;
    if (n > 999) break;
  }
  return candidate;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ---- Auth: verify caller and admin role ----
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
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleCheck, error: roleErr } = await admin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleErr || roleCheck !== true) {
      return json({ success: false, error: "Forbidden — admin only" }, 403);
    }

    // ---- Routing: multipart upload OR JSON op ----
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const operation = form.get("operation");
      if (operation !== "upload") {
        return json(
          { success: false, error: "multipart only supports operation=upload" },
          400,
        );
      }

      const file = form.get("file") as File | null;
      const folderRaw = (form.get("folder") as string | null) ?? "uncategorized";
      const filenameRaw =
        (form.get("filename") as string | null) ?? file?.name ?? "";
      const upsertStr = (form.get("upsert") as string | null) ?? "false";
      const upsert = upsertStr === "true";

      if (!file || !filenameRaw) {
        return json({ success: false, error: "missing file or filename" }, 400);
      }
      const folder = sanitizeFolder(folderRaw) || "uncategorized";
      const filename = sanitizeFilename(filenameRaw);
      const finalName = await uniqueName(admin, folder, filename, upsert);
      const path = `${folder}/${finalName}`;
      const buffer = await file.arrayBuffer();

      const { error: upErr } = await admin.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert,
          cacheControl: "31536000",
        });
      if (upErr) {
        console.error("upload error", upErr);
        return json({ success: false, error: upErr.message }, 500);
      }
      const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
      // Seed metadata row (best-effort, ignore conflict)
      await admin.from("media_metadata").upsert(
        {
          storage_path: path,
        },
        { onConflict: "storage_path", ignoreDuplicates: true },
      );
      return json({
        success: true,
        path,
        url: urlData.publicUrl,
        renamed: finalName !== filename ? finalName : undefined,
      });
    }

    const body = await req.json();
    const op = body?.operation as string;

    switch (op) {
      case "list": {
        // List top-level (folders + any root files), then list each folder.
        const { data: rootEntries, error: rootErr } = await admin.storage
          .from(BUCKET)
          .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });
        if (rootErr) return json({ success: false, error: rootErr.message }, 500);

        const folders = (rootEntries ?? []).filter((e) => e.id === null);
        const rootFiles = (rootEntries ?? []).filter((e) => e.id !== null);

        type Img = {
          name: string;
          path: string;
          url: string;
          size: number;
          contentType: string | null;
          updatedAt: string | null;
        };
        type Cat = { name: string; files: Img[] };

        const categories: Cat[] = [];

        for (const folder of folders) {
          const { data: entries, error } = await admin.storage
            .from(BUCKET)
            .list(folder.name, {
              limit: 1000,
              sortBy: { column: "updated_at", order: "desc" },
            });
          if (error) {
            console.error(`list ${folder.name}`, error);
            continue;
          }
          const files: Img[] = (entries ?? [])
            .filter((f) => f.id !== null && f.name !== ".keep")
            .map((f) => {
              const path = `${folder.name}/${f.name}`;
              const { data: u } = admin.storage.from(BUCKET).getPublicUrl(path);
              return {
                name: f.name,
                path,
                url: u.publicUrl,
                size: (f.metadata as Record<string, unknown> | null)?.size as number ?? 0,
                contentType:
                  ((f.metadata as Record<string, unknown> | null)?.mimetype as string) ??
                  null,
                updatedAt: f.updated_at ?? null,
              };
            });
          categories.push({ name: folder.name, files });
        }

        if (rootFiles.length > 0) {
          const files: Img[] = rootFiles.map((f) => {
            const { data: u } = admin.storage.from(BUCKET).getPublicUrl(f.name);
            return {
              name: f.name,
              path: f.name,
              url: u.publicUrl,
              size: (f.metadata as Record<string, unknown> | null)?.size as number ?? 0,
              contentType:
                ((f.metadata as Record<string, unknown> | null)?.mimetype as string) ??
                null,
              updatedAt: f.updated_at ?? null,
            };
          });
          categories.unshift({ name: "uncategorized", files });
        }

        // Pull metadata rows so the client can render alt/caption/etc.
        const { data: metaRows } = await admin
          .from("media_metadata")
          .select("storage_path, alt, caption, project_slug, shot_type, width, height, duration_seconds");
        const metaByPath = new Map<string, Record<string, unknown>>();
        (metaRows ?? []).forEach((r: Record<string, unknown>) => {
          metaByPath.set(r.storage_path as string, r);
        });

        return json({ success: true, categories, metadata: Object.fromEntries(metaByPath) });
      }

      case "createFolder": {
        const folder = sanitizeFolder(body.folder ?? "");
        if (!folder) return json({ success: false, error: "invalid folder name" }, 400);
        const path = `${folder}/.keep`;
        const { error } = await admin.storage
          .from(BUCKET)
          .upload(path, new Uint8Array(0), {
            contentType: "text/plain",
            upsert: true,
          });
        if (error) return json({ success: false, error: error.message }, 500);
        return json({ success: true, folder });
      }

      case "move": {
        const sourcePath = String(body.sourcePath);
        const targetFolder = sanitizeFolder(String(body.targetFolder));
        const fileName = sourcePath.split("/").pop()!;
        const finalName = await uniqueName(admin, targetFolder, fileName, false);
        const targetPath = `${targetFolder}/${finalName}`;

        const { error: mvErr } = await admin.storage
          .from(BUCKET)
          .move(sourcePath, targetPath);
        if (mvErr) return json({ success: false, error: mvErr.message }, 500);

        await admin
          .from("media_metadata")
          .update({ storage_path: targetPath })
          .eq("storage_path", sourcePath);

        const { data: u } = admin.storage.from(BUCKET).getPublicUrl(targetPath);
        return json({ success: true, newPath: targetPath, url: u.publicUrl });
      }

      case "bulkMove": {
        const paths: string[] = body.paths ?? [];
        const targetFolder = sanitizeFolder(String(body.targetFolder));
        const results: Array<{ path: string; success: boolean; error?: string; newPath?: string }> = [];
        for (const sourcePath of paths) {
          try {
            const fileName = sourcePath.split("/").pop()!;
            const finalName = await uniqueName(admin, targetFolder, fileName, false);
            const targetPath = `${targetFolder}/${finalName}`;
            const { error } = await admin.storage
              .from(BUCKET)
              .move(sourcePath, targetPath);
            if (error) {
              results.push({ path: sourcePath, success: false, error: error.message });
              continue;
            }
            await admin
              .from("media_metadata")
              .update({ storage_path: targetPath })
              .eq("storage_path", sourcePath);
            results.push({ path: sourcePath, success: true, newPath: targetPath });
          } catch (err) {
            results.push({
              path: sourcePath,
              success: false,
              error: err instanceof Error ? err.message : "unknown",
            });
          }
        }
        return json({ success: results.every((r) => r.success), results });
      }

      case "rename": {
        const oldPath = String(body.oldPath);
        const newName = sanitizeFilename(String(body.newName));
        const folder = oldPath.split("/").slice(0, -1).join("/");
        const newPath = folder ? `${folder}/${newName}` : newName;
        const { error } = await admin.storage
          .from(BUCKET)
          .move(oldPath, newPath);
        if (error) return json({ success: false, error: error.message }, 500);
        await admin
          .from("media_metadata")
          .update({ storage_path: newPath })
          .eq("storage_path", oldPath);
        const { data: u } = admin.storage.from(BUCKET).getPublicUrl(newPath);
        return json({ success: true, newPath, url: u.publicUrl });
      }

      case "delete": {
        const path = String(body.path);
        const { error } = await admin.storage.from(BUCKET).remove([path]);
        if (error) return json({ success: false, error: error.message }, 500);
        await admin.from("media_metadata").delete().eq("storage_path", path);
        return json({ success: true });
      }

      case "bulkDelete": {
        const paths: string[] = body.paths ?? [];
        const { error } = await admin.storage.from(BUCKET).remove(paths);
        if (error) return json({ success: false, error: error.message }, 500);
        await admin.from("media_metadata").delete().in("storage_path", paths);
        return json({
          success: true,
          results: paths.map((p) => ({ path: p, success: true })),
        });
      }

      case "updateMetadata": {
        const storage_path = String(body.storage_path);
        const patch = body.patch ?? {};
        // Whitelist updatable columns
        const allowed = ["alt", "caption", "project_slug", "shot_type", "width", "height", "duration_seconds"];
        const cleanPatch: Record<string, unknown> = { storage_path };
        for (const k of allowed) {
          if (k in patch) cleanPatch[k] = patch[k];
        }
        const { error } = await admin
          .from("media_metadata")
          .upsert(cleanPatch, { onConflict: "storage_path" });
        if (error) return json({ success: false, error: error.message }, 500);
        return json({ success: true });
      }

      default:
        return json({ success: false, error: `unknown operation: ${op}` }, 400);
    }
  } catch (err) {
    console.error("function error", err);
    return json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500,
    );
  }
});
