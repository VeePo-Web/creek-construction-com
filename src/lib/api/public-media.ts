/**
 * Public-side client for approved cloud media.
 *
 * Reads from `media_metadata` where `ai_review_status = 'approved'`
 * (RLS allows public read on that subset). Builds public CDN URLs for
 * the storage paths.
 *
 * Selectors are intentionally narrow — page authors should describe
 * *what they want* (a hero for decks, a process bleed for sheds) rather
 * than name specific files.
 */

import { supabase } from "@/integrations/supabase/client";

export type ServiceCategory =
  | "decks"
  | "platforms"
  | "pergolas"
  | "sheds"
  | "garage"
  | "fencing"
  | "walkways"
  | "pressure-wash"
  | "painting"
  | "exterior-paint"
  | "sanding"
  | "siding"
  | "roofing"
  | "roof-repairs"
  | "roof-new"
  | "fixtures"
  | "landscaping"
  | "gardens"
  | "gutters"
  | "fireplaces"
  | "interiors"
  | "exterior"
  | "other";

export type ShotType =
  | "hero"
  | "elevation"
  | "detail"
  | "interior"
  | "process"
  | "wide"
  | "aerial"
  | "texture";

export type Quality = "hero" | "portfolio" | "reference" | "reject";
export type Season = "summer" | "fall" | "winter" | "spring" | "unknown";

export interface ApprovedMedia {
  storage_path: string;
  url: string;
  alt: string;
  caption?: string | null;
  service: ServiceCategory | null;
  shot_type: ShotType | null;
  project_slug: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  quality: Quality | null;
  season: Season | null;
  lqip: string | null;
  is_video: boolean;
}

const BUCKET = "media-library";

function publicUrlFor(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function isVideoPath(p: string): boolean {
  return /\.(mov|mp4|webm|m4v)$/i.test(p);
}

function rowToMedia(r: Record<string, unknown>): ApprovedMedia {
  const path = r.storage_path as string;
  return {
    storage_path: path,
    url: publicUrlFor(path),
    alt: (r.alt as string) ?? "",
    caption: (r.caption as string) ?? null,
    service: (r.service as ServiceCategory) ?? null,
    shot_type: (r.shot_type as ShotType) ?? null,
    project_slug:
      (r.project_slug as string) ?? (r.project_guess as string) ?? null,
    width: (r.width as number) ?? null,
    height: (r.height as number) ?? null,
    duration_seconds: (r.duration_seconds as number) ?? null,
    quality: (r.ai_quality as Quality) ?? null,
    season: (r.ai_season as Season) ?? null,
    lqip: (r.lqip as string) ?? null,
    is_video: isVideoPath(path),
  };
}

export interface MediaQuery {
  service?: ServiceCategory;
  shot_type?: ShotType | ShotType[];
  project_slug?: string;
  /** Only return shots flagged at least this quality (default: 'portfolio'). */
  min_quality?: Quality;
  /** Filter to videos / images only. */
  kind?: "image" | "video" | "any";
  season?: Season;
  limit?: number;
}

const QUALITY_ORDER: Quality[] = ["reject", "reference", "portfolio", "hero"];

export async function fetchApprovedMedia(
  q: MediaQuery = {},
): Promise<ApprovedMedia[]> {
  let query = supabase
    .from("media_metadata")
    .select(
      "storage_path, alt, caption, service, shot_type, project_slug, project_guess, width, height, duration_seconds, ai_quality, ai_season, lqip",
    )
    .eq("ai_review_status", "approved");

  if (q.service) query = query.eq("service", q.service);
  if (q.project_slug) query = query.eq("project_slug", q.project_slug);
  if (q.season) query = query.eq("ai_season", q.season);

  if (q.shot_type) {
    if (Array.isArray(q.shot_type)) {
      query = query.in("shot_type", q.shot_type);
    } else {
      query = query.eq("shot_type", q.shot_type);
    }
  }
  if (q.limit) query = query.limit(q.limit);

  const { data, error } = await query;
  if (error) {
    console.warn("fetchApprovedMedia error", error);
    return [];
  }

  let items = (data ?? []).map(rowToMedia);

  // Quality filter (client-side because of the enum ordering)
  const minQ = q.min_quality ?? "portfolio";
  const minIdx = QUALITY_ORDER.indexOf(minQ);
  items = items.filter((m) => {
    if (!m.quality) return false;
    return QUALITY_ORDER.indexOf(m.quality) >= minIdx;
  });

  // Filter by kind
  if (q.kind === "image") items = items.filter((m) => !m.is_video);
  if (q.kind === "video") items = items.filter((m) => m.is_video);

  // Editorial sort: hero quality first, then by shot_type weight
  const SHOT_WEIGHT: Record<string, number> = {
    hero: 100,
    wide: 80,
    elevation: 70,
    process: 60,
    interior: 55,
    detail: 50,
    aerial: 45,
    texture: 40,
  };
  items.sort((a, b) => {
    const aQ = a.quality === "hero" ? 1 : 0;
    const bQ = b.quality === "hero" ? 1 : 0;
    if (aQ !== bQ) return bQ - aQ;
    const aW = SHOT_WEIGHT[a.shot_type ?? ""] ?? 0;
    const bW = SHOT_WEIGHT[b.shot_type ?? ""] ?? 0;
    return bW - aW;
  });

  return items;
}

export interface DBProject {
  slug: string;
  title: string;
  service: string;
  location: string | null;
  year: number | null;
  status: "in-progress" | "complete";
  summary: string | null;
  hero_path: string | null;
  hero_url: string | null;
  video_path: string | null;
  video_url: string | null;
  featured: boolean;
  display_order: number;
}

export async function fetchProjects(opts: {
  featured?: boolean;
  service?: string;
  limit?: number;
} = {}): Promise<DBProject[]> {
  let query = supabase
    .from("projects")
    .select(
      "slug, title, service, location, year, status, summary, hero_path, video_path, featured, display_order",
    )
    .order("display_order", { ascending: true });

  if (opts.featured) query = query.eq("featured", true);
  if (opts.service) query = query.eq("service", opts.service);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.warn("fetchProjects error", error);
    return [];
  }

  return (data ?? []).map((p: Record<string, unknown>) => ({
    slug: p.slug as string,
    title: p.title as string,
    service: p.service as string,
    location: (p.location as string) ?? null,
    year: (p.year as number) ?? null,
    status: p.status as "in-progress" | "complete",
    summary: (p.summary as string) ?? null,
    hero_path: (p.hero_path as string) ?? null,
    hero_url: p.hero_path ? publicUrlFor(p.hero_path as string) : null,
    video_path: (p.video_path as string) ?? null,
    video_url: p.video_path ? publicUrlFor(p.video_path as string) : null,
    featured: (p.featured as boolean) ?? false,
    display_order: (p.display_order as number) ?? 100,
  }));
}
