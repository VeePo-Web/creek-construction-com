import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SCRIM } from "@/lib/colors";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { useFirstApprovedMedia } from "@/hooks/useApprovedMedia";
import { useHeroPreload } from "@/hooks/useHeroPreload";
import { EditorialFallback } from "@/components/media/MediaSlot";
import type { ApprovedMedia, MediaQuery } from "@/lib/api/public-media";

/**
 * Triptych rhythm.
 *   equal       — 33/33/33  · About, Contact (default editorial story)
 *   asymmetric  — 40/30/30  · Home (lead column anchors the headline)
 *   cinematic   — 60/20/20  · Work opt-in (one hero plate + two field strips)
 */
export type TriptychRhythm = "equal" | "asymmetric" | "cinematic";

/**
 * Scrim direction. Pick by where the headline column lives:
 *   left      — Services, About (headline in left ~50%)
 *   leftWide  — Home (asymmetric — headline + provenance card on the left half)
 *   bottom    — Contact, Work (headline bottom-anchored)
 *   none      — for places that own their own scrim (rare)
 */
export type ScrimDirection = "left" | "leftWide" | "bottom" | "none";

interface HeroTriptychProps {
  /** Exactly three queries — one per column. */
  queries: [MediaQuery, MediaQuery, MediaQuery];
  rhythm?: TriptychRhythm;
  scrim?: ScrimDirection;
  /** Optional icon per column for the stone fallback. */
  fallbackIcons?: [LucideIcon?, LucideIcon?, LucideIcon?];
  /** Optional 10px tracked caption per column for the stone fallback. */
  fallbackCaptions?: [string?, string?, string?];
  /** When true, column A is preloaded as the LCP candidate. */
  priority?: boolean;
  className?: string;
}

const RHYTHM_FLEX: Record<TriptychRhythm, [number, number, number]> = {
  equal: [1, 1, 1],
  asymmetric: [40, 30, 30],
  cinematic: [60, 20, 20],
};

const RHYTHM_PRELOAD_SIZE: Record<TriptychRhythm, string> = {
  equal: MEDIA_SIZES.THIRD,
  asymmetric: MEDIA_SIZES.PORTRAIT_HALF,
  cinematic: MEDIA_SIZES.HERO_FULL,
};

/**
 * HeroTriptych — the canonical "show the work" backdrop.
 *
 * Three approved photographs composed as a horizontal triptych behind the
 * hero chrome. Each column is independently pulled from the cloud library
 * and animates with staggered Ken Burns. A calibrated scrim guarantees
 * AAA contrast on the headline. When a column has no approved photo, the
 * warm stone EditorialFallback renders — never green.
 *
 * Mobile collapse:
 *   ≥ md (768px)  → 3-column triptych
 *   sm–md         → vertical stack 40/30/30 vh
 *   < sm (640px)  → single image (column A) with bottom scrim
 */
const HeroTriptych = ({
  queries,
  rhythm = "equal",
  scrim = "left",
  fallbackIcons,
  fallbackCaptions,
  priority = false,
  className,
}: HeroTriptychProps) => {
  const a = useFirstApprovedMedia(queries[0]);
  const b = useFirstApprovedMedia(queries[1]);
  const c = useFirstApprovedMedia(queries[2]);

  // Preload column A as the LCP candidate.
  useHeroPreload(priority ? a.item?.url : undefined, RHYTHM_PRELOAD_SIZE[rhythm]);

  // Hairline gutter draw-in: 0 → 1px after first paint. Honors reduced motion.
  const [guttersDrawn, setGuttersDrawn] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setGuttersDrawn(true);
      return;
    }
    const id = window.setTimeout(() => setGuttersDrawn(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  const columns: Array<{
    media: ApprovedMedia | null;
    icon?: LucideIcon;
    caption?: string;
    delayMs: number;
  }> = [
    { media: a.item, icon: fallbackIcons?.[0], caption: fallbackCaptions?.[0], delayMs: 0 },
    { media: b.item, icon: fallbackIcons?.[1], caption: fallbackCaptions?.[1], delayMs: 600 },
    { media: c.item, icon: fallbackIcons?.[2], caption: fallbackCaptions?.[2], delayMs: 1200 },
  ];

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ contain: "layout style paint" }}
    >
      {/* ─── Photographic columns ─── */}

      {/* ≥ md: 3-column triptych using flex (bulletproof full-height stretch).
          < md: hidden — replaced by the single-image branch below. */}
      <div className="absolute inset-0 hidden md:flex flex-row items-stretch h-full w-full">
        {columns.map((col, i) => (
          <TriptychColumn
            key={i}
            column={i as 0 | 1 | 2}
            media={col.media}
            icon={col.icon}
            caption={col.caption}
            delayMs={col.delayMs}
            priority={priority && i === 0}
            guttersDrawn={guttersDrawn}
            className="relative h-full self-stretch"
            style={{
              flex: `${RHYTHM_FLEX[rhythm][i]} 1 0%`,
              minWidth: 0,
            }}
          />
        ))}
      </div>

      {/* Mobile-only single-image variant (< md): one editorial frame.
          Replaces the prior 3-slab vertical stack which created a
          ~110vh wall on phones and pushed all CTAs below the fold. */}
      <div className="md:hidden absolute inset-0">
        <TriptychColumn
          column={0}
          media={a.item}
          icon={fallbackIcons?.[0]}
          caption={fallbackCaptions?.[0]}
          delayMs={0}
          priority={priority}
          guttersDrawn={guttersDrawn}
          className="h-full min-h-full w-full"
        />
      </div>

      {/* ─── Scrims (always last so they win the stack) ─── */}

      {/* Top nav-legibility scrim — always on. */}
      <div
        className="absolute inset-x-0 top-0 h-16 md:h-20 pointer-events-none"
        style={{ background: SCRIM.topNav }}
      />

      {/* Direction scrim — desktop. */}
      {scrim !== "none" && (
        <>
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              background:
                scrim === "leftWide"
                  ? SCRIM.leftWide
                  : scrim === "left"
                    ? SCRIM.left
                    : SCRIM.bottom,
            }}
          />
          {/* Mobile scrim — covers slab A's top so the headline column
              is always legible regardless of which photo loaded. */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              background:
                scrim === "bottom" ? SCRIM.bottom : SCRIM.mobileTop,
            }}
          />
        </>
      )}

      {/* Bottom fade into next section's cream. */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: SCRIM.bottomFade, opacity: 0.55 }}
      />

      {/* Universal grain pass for editorial texture. */}
      <div className="absolute inset-0 grain-overlay opacity-25 pointer-events-none" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// One column — image or stone fallback, with hairline cedar gutter.
// ─────────────────────────────────────────────────────────────────────

interface TriptychColumnProps {
  column: 0 | 1 | 2;
  media: ApprovedMedia | null;
  icon?: LucideIcon;
  caption?: string;
  delayMs: number;
  priority?: boolean;
  guttersDrawn: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TriptychColumn = ({
  column,
  media,
  icon,
  caption,
  delayMs,
  priority,
  guttersDrawn,
  className,
  style,
}: TriptychColumnProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setLoaded(false);
    const node = imgRef.current;
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, [media?.url]);

  const gutterStyle =
    column > 0
      ? {
          boxShadow: guttersDrawn
            ? "inset 1px 0 0 hsl(var(--cedar) / 0.18)"
            : "inset 0 0 0 hsl(var(--cedar) / 0)",
          transition: "box-shadow 700ms ease-out",
        }
      : undefined;

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={{ ...gutterStyle, ...style }}
    >
      {media ? (
        <>
          {/* LQIP backdrop — zero-flash placeholder until the full image decodes */}
          {media.lqip && (
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundImage: `url(${media.lqip.startsWith("data:") ? media.lqip : `data:image/jpeg;base64,${media.lqip}`})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(20px)",
                transform: "scale(1.08)",
                opacity: loaded ? 0 : 1,
              }}
            />
          )}
          <img
            ref={imgRef}
            src={media.url}
            alt=""
            width={media.width ?? 1600}
            height={media.height ?? 1067}
            className="absolute inset-0 w-full h-full object-cover hero-kenburns transition-opacity duration-700"
            style={{
              animationDelay: `${delayMs}ms`,
              animationDuration: "16s",
              opacity: loaded ? 1 : 0,
              objectPosition: "center 38%",
            }}
            loading={priority ? "eager" : "lazy"}
            {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
            decoding={priority ? "sync" : "async"}
            sizes={MEDIA_SIZES.THIRD}
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <EditorialFallback variant="stone" icon={icon} caption={caption} />
      )}
    </div>
  );
};

export default HeroTriptych;
