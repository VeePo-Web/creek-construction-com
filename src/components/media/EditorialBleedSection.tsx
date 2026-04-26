import MediaSlot from "@/components/media/MediaSlot";
import ProvenanceCaption from "@/components/media/ProvenanceCaption";
import type { MediaQuery } from "@/lib/api/public-media";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { cn } from "@/lib/utils";

interface EditorialBleedProps {
  /** Selector for which photo (or video) fills the bleed. */
  query: MediaQuery;
  /** Section numeral for the provenance caption. */
  numeral?: string;
  /** Location label, e.g. "Bridgeland · Calgary". */
  location?: string;
  /** Year of the work shown. */
  year?: number;
  /** Subject line, e.g. "Cedar privacy fence". */
  subject?: string;
  /** Render a video bleed if the query matches one. Default false (photo). */
  asVideo?: boolean;
  /** Tighter/wider aspect — default "bleed" (21:9). */
  aspect?: "bleed" | "cinema" | "hero";
  /** When true, this is the LCP candidate and gets fetchpriority high. */
  priority?: boolean;
  className?: string;
  /** When set, renders nothing (and contributes no CLS) if no media matches.
   *  Default: true — pages stay clean when media is missing. */
  hideIfEmpty?: boolean;
}

/**
 * EditorialBleedSection — a full-bleed photo (or video) sandwiched between
 * page sections, with a subtle provenance caption underneath.
 *
 * The photo is the divider. Never paired with text overlays. Never used twice
 * in a row. Discipline keeps it editorial.
 */
const EditorialBleedSection = ({
  query,
  numeral,
  location,
  year,
  subject,
  asVideo = false,
  aspect = "bleed",
  priority = false,
  className,
  hideIfEmpty = true,
}: EditorialBleedProps) => {
  const aspectClass =
    aspect === "cinema"
      ? "aspect-cinema"
      : aspect === "hero"
        ? "aspect-hero"
        : "aspect-bleed";

  return (
    <section
      aria-hidden="true"
      className={cn("relative w-full bg-stone-50", className)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}
    >
      <div className={cn("relative w-full overflow-hidden", aspectClass)}>
        <MediaSlot
          variant={asVideo ? "bleed" : "picture"}
          query={query}
          priority={priority}
          sizes={MEDIA_SIZES.BLEED_FULL}
          wrapperClassName="absolute inset-0 w-full h-full"
          fallback={hideIfEmpty ? null : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(150 30% 18%) 0%, hsl(150 30% 8%) 100%)",
              }}
            />
          )}
          {...(asVideo
            ? { height: "100%", aspectRatio: undefined, opacity: 1 }
            : {})}
        />
        {/* Subtle top + bottom vignette for editorial weight */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, hsl(var(--background)) 0%, transparent 100%)",
          }}
        />
      </div>
      {(numeral || location || year || subject) && (
        <div className="container mx-auto px-6 -mt-2 mb-6">
          <ProvenanceCaption
            numeral={numeral}
            location={location}
            year={year}
            subject={subject}
            variant="standard"
          />
        </div>
      )}
    </section>
  );
};

export default EditorialBleedSection;
