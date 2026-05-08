import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { BODY } from "@/lib/typography";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";
import { STATS_TRIO } from "@/config/stats";

interface CrewMomentProps {
  eyebrow?: string;
  heading?: string;
  paragraphs?: string[];
  asSection?: boolean;
  background?: "background" | "secondary";
  /** Override heading id (only needed if two appear on one page). */
  headingId?: string;
  /** Render the 3-up stat row beneath the paragraphs. */
  showStats?: boolean;
  /** Faint hairline at the section top — used when adjacent to a same-bg section. */
  topRule?: boolean;
}

/**
 * CrewMoment — single human moment between proof bands. One photo, two
 * short paragraphs, one CedarCTA. Creek's editorial answer to the
 * "Meet the Owner" beat without bio fluff.
 */
const CrewMoment = ({
  eyebrow,
  heading = "The crew on-site is the crew you meet.",
  paragraphs = [
    "We don’t subcontract. The crew you meet at the quote is the crew on-site — that’s how we keep quality consistent, and it’s why we’d rather do fewer projects exceptionally well than chase volume.",
  ],
  asSection = true,
  background = "background",
  headingId = "crew-heading",
  showStats = false,
  showCta = false,
}: CrewMomentProps & { showCta?: boolean }) => {
  const { ref, cls, style } = useReveal();

  const inner = (
    <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
      <div className={`grid lg:grid-cols-[5fr_7fr] ${GRID_GAP.editorial} items-center`}>
        <MediaSlot
          query={{
            shot_type: ["process", "detail", "interior"],
            kind: "image",
            min_quality: "reference",
          }}
          sizes={MEDIA_SIZES.PORTRAIT_HALF}
          wrapperClassName="aspect-[4/5] md:aspect-[3/4] lg:aspect-portrait w-full rounded-sm overflow-hidden"
          cedarHover
          fallbackVariant="cedar"
          fallbackCaption="On the boards · Alberta"
        />

        <div>
          <SectionHeader
            variant="quiet"
            label={eyebrow}
            headingId={headingId}
            heading={heading}
            disableMotion
          />
          <div className="mt-6 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className={BODY.lead}>
                {p}
              </p>
            ))}
          </div>
          {showStats && (
            <div
              className="mt-10 pt-8 border-t border-cedar/15 grid grid-cols-3 gap-4"
              role="group"
              aria-label="Creek by the numbers"
            >
              {STATS_TRIO.map((s) => (
                <div key={s.label} className="text-left">
                  <p className="font-serif text-2xl md:text-[1.75rem] text-foreground leading-none tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 mt-2 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
          {showCta && (
            <div className="mt-10">
              <CedarCTA />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!asSection) return inner;

  return (
    <section
      id="section-crew"
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-5 sm:px-6">{inner}</div>
    </section>
  );
};

export default CrewMoment;
