/**
 * Typed client for the admin Media Library edge function.
 *
 * Concurrency model: uploadMany processes a queue with a configurable in-flight
 * limit (default 4) so we can fire 200 files at once without saturating the
 * upload pipe or the edge function's memory.
 */

import { supabase } from "@/integrations/supabase/client";

export interface MediaFile {
  name: string;
  path: string;
  url: string;
  size: number;
  contentType: string | null;
  updatedAt: string | null;
}

export interface MediaCategory {
  name: string;
  files: MediaFile[];
}

export interface MediaMetadata {
  alt?: string | null;
  caption?: string | null;
  project_slug?: string | null;
  shot_type?: string | null;
  width?: number | null;
  height?: number | null;
  duration_seconds?: number | null;
}

interface ListResponse {
  success: boolean;
  error?: string;
  categories?: MediaCategory[];
  metadata?: Record<string, MediaMetadata>;
}

interface UploadResponse {
  success: boolean;
  error?: string;
  path?: string;
  url?: string;
  renamed?: string;
}

interface SimpleResponse {
  success: boolean;
  error?: string;
}

interface PathResponse extends SimpleResponse {
  newPath?: string;
  url?: string;
}

interface BulkResponse extends SimpleResponse {
  results?: { path: string; success: boolean; error?: string; newPath?: string }[];
}

const FUNCTION_NAME = "manage-media-library";

async function getAuthHeader(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in");
  return `Bearer ${token}`;
}

async function callJson<T>(body: unknown): Promise<T> {
  const auth = await getAuthHeader();
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `HTTP ${res.status}: ${text}` } as T;
  }
  return (await res.json()) as T;
}

export interface UploadProgressEvent {
  /** 0 → 1 */
  progress: number;
  /** bytes loaded */
  loaded: number;
  /** bytes total */
  total: number;
}

async function uploadOne(
  file: File,
  folder: string,
  opts: {
    upsert?: boolean;
    onProgress?: (e: UploadProgressEvent) => void;
    signal?: AbortSignal;
  } = {},
): Promise<UploadResponse> {
  const auth = await getAuthHeader();
  const form = new FormData();
  form.append("operation", "upload");
  form.append("file", file);
  form.append("folder", folder);
  form.append("filename", file.name);
  form.append("upsert", opts.upsert ? "true" : "false");

  // Use XHR so we get real upload-progress events (fetch can't expose them in the browser)
  return new Promise<UploadResponse>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}`,
    );
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    if (opts.onProgress) {
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          opts.onProgress!({
            progress: ev.loaded / ev.total,
            loaded: ev.loaded,
            total: ev.total,
          });
        }
      };
    }

    xhr.onload = () => {
      try {
        const parsed = JSON.parse(xhr.responseText);
        resolve(parsed);
      } catch {
        resolve({
          success: false,
          error: `HTTP ${xhr.status}: ${xhr.responseText.slice(0, 200)}`,
        });
      }
    };
    xhr.onerror = () =>
      resolve({ success: false, error: "Network error during upload" });
    xhr.onabort = () =>
      resolve({ success: false, error: "Upload cancelled" });

    if (opts.signal) {
      opts.signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.send(form);
  });
}

export interface QueuedUpload {
  id: string;
  file: File;
  folder: string;
}

export interface UploadResult extends UploadResponse {
  id: string;
}

/**
 * Upload N files with bounded concurrency.
 * Calls onProgress(id, progress) for each file as bytes flow.
 */
async function uploadMany(
  items: QueuedUpload[],
  opts: {
    concurrency?: number;
    upsert?: boolean;
    onItemStart?: (id: string) => void;
    onItemProgress?: (id: string, e: UploadProgressEvent) => void;
    onItemComplete?: (id: string, result: UploadResult) => void;
    signal?: AbortSignal;
  } = {},
): Promise<UploadResult[]> {
  const { concurrency = 4, upsert = false } = opts;
  const queue = [...items];
  const results: UploadResult[] = [];

  const worker = async () => {
    while (queue.length > 0) {
      if (opts.signal?.aborted) break;
      const item = queue.shift();
      if (!item) break;
      opts.onItemStart?.(item.id);
      const result = await uploadOne(item.file, item.folder, {
        upsert,
        signal: opts.signal,
        onProgress: (e) => opts.onItemProgress?.(item.id, e),
      });
      const withId: UploadResult = { ...result, id: item.id };
      results.push(withId);
      opts.onItemComplete?.(item.id, withId);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length || 1) }, () => worker()),
  );
  return results;
}

export const mediaLibrary = {
  list: () => callJson<ListResponse>({ operation: "list" }),
  createFolder: (folder: string) =>
    callJson<SimpleResponse & { folder?: string }>({
      operation: "createFolder",
      folder,
    }),
  move: (sourcePath: string, targetFolder: string) =>
    callJson<PathResponse>({
      operation: "move",
      sourcePath,
      targetFolder,
    }),
  bulkMove: (paths: string[], targetFolder: string) =>
    callJson<BulkResponse>({
      operation: "bulkMove",
      paths,
      targetFolder,
    }),
  rename: (oldPath: string, newName: string) =>
    callJson<PathResponse>({
      operation: "rename",
      oldPath,
      newName,
    }),
  delete: (path: string) =>
    callJson<SimpleResponse>({ operation: "delete", path }),
  bulkDelete: (paths: string[]) =>
    callJson<BulkResponse>({ operation: "bulkDelete", paths }),
  updateMetadata: (storage_path: string, patch: Partial<MediaMetadata>) =>
    callJson<SimpleResponse>({
      operation: "updateMetadata",
      storage_path,
      patch,
    }),
  uploadOne,
  uploadMany,
};

export type MediaLibraryClient = typeof mediaLibrary;
