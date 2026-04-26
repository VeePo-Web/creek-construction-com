import { useEffect, useState } from "react";
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

const RHYTHM_COLS: Record<TriptychRhythm, string> = {
  equal: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
  asymmetric: "minmax(0,40fr) minmax(0,30fr) minmax(0,30fr)",
  cinematic: "minmax(0,60fr) minmax(0,20fr) minmax(0,20fr)",
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

      {/* ≥ md: 3-column triptych. < md: vertical stack 40/30/30. < sm: hide cols B/C. */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: RHYTHM_COLS[rhythm],
        }}
      >
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
            // Tailwind handles the responsive collapse — mobile stacks to rows.
            className={cn(
              // Default desktop: column visible
              "relative h-full",
              // sm-md: stack vertically, hide grid layout's column placement
              i === 1 && "max-md:hidden",
              i === 2 && "max-md:hidden",
            )}
          />
        ))}
      </div>

      {/* Mobile-only stacked variant (sm–md): three short slabs */}
      <div className="md:hidden absolute inset-0 grid grid-rows-[40vh_30vh_30vh] sm:grid-rows-[1fr]">
        {/* On <sm screens, only render column A as a single image. */}
        <div className="relative h-full">
          <TriptychColumn
            column={0}
            media={a.item}
            icon={fallbackIcons?.[0]}
            caption={fallbackCaptions?.[0]}
            delayMs={0}
            priority={priority}
            guttersDrawn={guttersDrawn}
            className="h-full"
          />
        </div>
        <div className="relative h-full hidden sm:block max-md:block">
          <TriptychColumn
            column={1}
            media={b.item}
            icon={fallbackIcons?.[1]}
            caption={fallbackCaptions?.[1]}
            delayMs={600}
            guttersDrawn={guttersDrawn}
            className="h-full"
          />
        </div>
        <div className="relative h-full hidden sm:block max-md:block">
          <TriptychColumn
            column={2}
            media={c.item}
            icon={fallbackIcons?.[2]}
            caption={fallbackCaptions?.[2]}
            delayMs={1200}
            guttersDrawn={guttersDrawn}
            className="h-full"
          />
        </div>
      </div>

      {/* ─── Scrims (always last so they win the stack) ─── */}

      {/* Top nav-legibility scrim — always on. */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: SCRIM.topNav }}
      />

      {/* Direction scrim — desktop. On mobile we always use the bottom scrim
           because the headline overlays the top stacked slab. */}
      {scrim !== "none" && (
        <>
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{ background: scrim === "left" ? SCRIM.left : SCRIM.bottom }}
          />
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{ background: SCRIM.bottom }}
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
}: TriptychColumnProps) => {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={
        column > 0
          ? {
              boxShadow: guttersDrawn
                ? "inset 1px 0 0 hsl(var(--cedar) / 0.18)"
                : "inset 0 0 0 hsl(var(--cedar) / 0)",
              transition: "box-shadow 700ms ease-out",
            }
          : undefined
      }
    >
      {media ? (
        <img
          src={media.url}
          alt=""
          width={media.width ?? 1600}
          height={media.height ?? 1067}
          className="absolute inset-0 w-full h-full object-cover hero-kenburns"
          style={{
            animationDelay: `${delayMs}ms`,
            animationDuration: "16s",
          }}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          sizes={MEDIA_SIZES.THIRD}
        />
      ) : (
        <EditorialFallback variant="stone" icon={icon} caption={caption} />
      )}
    </div>
  );
};

export default HeroTriptych;
