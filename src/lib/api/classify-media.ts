/**
 * AI vision classification client.
 * Calls the `classify-media` edge function with bounded concurrency.
 */

import { supabase } from "@/integrations/supabase/client";

export interface AIClassification {
  service: string;
  shot_type: string;
  subject: string;
  alt: string;
  project_guess: string | null;
  quality: string;
  season: string;
  notes?: string;
}

export interface ClassifyResultItem {
  path: string;
  success: boolean;
  classification?: AIClassification;
  error?: string;
}

interface ClassifyResponse {
  success: boolean;
  error?: string;
  processed?: number;
  results?: ClassifyResultItem[];
}

const FUNCTION_NAME = "classify-media";

async function getAuthHeader(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in");
  return `Bearer ${token}`;
}

async function classifyBatch(paths: string[]): Promise<ClassifyResponse> {
  const auth = await getAuthHeader();
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FUNCTION_NAME}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ paths }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `HTTP ${res.status}: ${text.slice(0, 240)}` };
  }
  return (await res.json()) as ClassifyResponse;
}

/**
 * Classify N paths, batching server-side calls (max 10 per call to stay
 * comfortably under the edge function's 20-cap and avoid AI rate limits).
 * onItem fires for every completed file so the UI can update live.
 */
export async function classifyMany(
  paths: string[],
  opts: {
    batchSize?: number;
    onBatchStart?: (paths: string[]) => void;
    onItem?: (item: ClassifyResultItem) => void;
    onError?: (err: string) => void;
  } = {},
): Promise<ClassifyResultItem[]> {
  const batchSize = opts.batchSize ?? 10;
  const all: ClassifyResultItem[] = [];

  for (let i = 0; i < paths.length; i += batchSize) {
    const slice = paths.slice(i, i + batchSize);
    opts.onBatchStart?.(slice);
    const res = await classifyBatch(slice);
    if (!res.success) {
      opts.onError?.(res.error ?? "Unknown error");
      // Mark every item in this slice as failed so the UI moves on
      for (const p of slice) {
        const item: ClassifyResultItem = {
          path: p,
          success: false,
          error: res.error,
        };
        all.push(item);
        opts.onItem?.(item);
      }
      // Stop on rate limit / payment errors — no point hammering
      if (
        res.error?.includes("Rate limited") ||
        res.error?.includes("credits exhausted")
      ) {
        break;
      }
      continue;
    }
    for (const item of res.results ?? []) {
      all.push(item);
      opts.onItem?.(item);
    }
  }
  return all;
}
