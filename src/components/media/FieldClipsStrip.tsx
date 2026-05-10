import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";
import SectionHeader from "@/components/SectionHeader";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { cn } from "@/lib/utils";

/**
 * FieldClipsStrip — a quietly cinematic strip of build-process clips.
 *
 * Why click-to-play instead of an ambient looping bleed?
 *   The on-file source clips are .mov (QuickTime) which Chrome and Firefox
 *   refuse to autoplay reliably. Rather than ship a bleed that's broken in
 *   80% of browsers, we present each clip as a tile the user activates —
 *   a plain, honest editorial gesture (think a small contact sheet). When
 *   the source is later transcoded to .mp4, the same tiles will autoplay.
 *
 * Discipline:
 *   - One clip plays at a time (clicking another pauses the first).
 *   - Always muted, playsinline, controls hidden in favor of a single play
 *     overlay — keeps the editorial restraint.
 *   - Section silently disappears if no approved videos exist.
 */
const FieldClipsStrip = () => {
  const { items, loading } = useApprovedMedia({
    kind: "video",
    min_quality: "portfolio",
    limit: 6,
  });

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const refs = useRef<Array<HTMLVideoElement | null>>([]);

  // Pause every other clip when one starts playing.
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) v.play().catch(() => undefined);
      else v.pause();
    });
  }, [activeIdx]);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section
      className={cn(SECTION_PADDING.default, "bg-secondary relative")}
      aria-labelledby="field-clips-heading"
    >
      <div className="container-page">
        <div className={`${MAX_WIDTH.wide} mx-auto`}>
          <div className="mb-12">
            <SectionHeader
              numeral="VI"
              label="FROM THE FIELD"
              headingId="field-clips-heading"
              heading="Process clips."
              subheading="Short field recordings from active builds — silent, no edits."
              
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {items.map((clip, i) => {
              const isActive = activeIdx === i;
              return (
                <ScrollRevealMotion key={clip.storage_path} delay={i * 0.06} y={20}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(isActive ? null : i)}
                    className="group relative block w-full aspect-[4/5] overflow-hidden rounded-sm bg-stone-200 grain-overlay shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                    aria-label={isActive ? `Pause clip ${i + 1}` : `Play clip ${i + 1}: ${clip.alt}`}
                  >
                    <video
                      ref={(el) => { refs.current[i] = el; }}
                      src={clip.url}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onEnded={() => setActiveIdx(null)}
                    />
                    {/* Vignette + play affordance */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500 pointer-events-none",
                        isActive ? "opacity-0" : "opacity-100",
                      )}
                      style={{
                        background:
                          "radial-gradient(ellipse at center, hsl(150 30% 8% / 0.10) 0%, hsl(150 30% 6% / 0.55) 100%)",
                      }}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                        isActive ? "opacity-0 group-hover:opacity-100" : "opacity-100",
                      )}
                      aria-hidden
                    >
                      <span className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-cedar text-cedar-foreground shadow-floating transition-transform duration-300 group-hover:scale-110">
                        {isActive ? (
                          <Pause className="h-5 w-5" strokeWidth={2.5} />
                        ) : (
                          <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={2.5} />
                        )}
                      </span>
                    </div>
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/90 mb-1">
                        Clip {String(i + 1).padStart(2, "0")} · {clip.service ?? "field"}
                      </p>
                    </div>
                  </button>
                </ScrollRevealMotion>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldClipsStrip;
