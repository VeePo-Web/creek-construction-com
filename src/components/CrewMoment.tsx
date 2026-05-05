import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { BODY } from "@/lib/typography";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { useReveal } from "@/hooks/useReveal";

interface CrewMomentProps {
  eyebrow?: string;
  heading?: string;
  paragraphs?: string[];
  asSection?: boolean;
  background?: "background" | "secondary";
}

/**
 * CrewMoment — single human moment between proof bands. One photo, two
 * short paragraphs, one CedarCTA. Creek's editorial answer to the
 * "Meet the Owner" beat without bio fluff.
 */
const CrewMoment = ({
  eyebrow = "OUR CREW",
  heading = "The crew on-site is the crew you meet.",
  paragraphs = [
    "We don’t subcontract the build. The same hands that quote your project are the ones putting in the screws — that’s how we keep quality consistent across every job.",
    "It also means you get a straight answer to every question, on the phone or on the boards. No middlemen, no project manager telling you what the crew said.",
  ],
  asSection = true,
  background = "background",
}: CrewMomentProps) => {
  const { ref, cls, style } = useReveal();

  const inner = (
    <div ref={ref} className={`${MAX_WIDTH.wide} mx-auto ${cls}`} style={style}>
      <div className={`grid md:grid-cols-2 ${GRID_GAP.editorial} items-center`}>
        <MediaSlot
          query={{
            shot_type: ["portrait", "process", "detail"],
            kind: "image",
            min_quality: "reference",
          }}
          sizes={MEDIA_SIZES.PORTRAIT_HALF}
          wrapperClassName="aspect-portrait w-full rounded-sm overflow-hidden"
          cedarHover
          fallbackVariant="cedar"
          fallbackCaption="On the boards · Alberta"
        />

        <div>
          <SectionHeader
            variant="quiet"
            label={eyebrow}
            headingId="crew-heading"
            heading={heading}
          />
          <div className="mt-6 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className={BODY.lead}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10">
            <CedarCTA />
          </div>
        </div>
      </div>
    </div>
  );

  if (!asSection) return inner;

  return (
    <section
      id="section-crew"
      className={`${SECTION_PADDING.default} ${background === "secondary" ? "bg-secondary" : "bg-background"}`}
      aria-labelledby="crew-heading"
    >
      <div className="container mx-auto px-6">{inner}</div>
    </section>
  );
};

export default CrewMoment;
