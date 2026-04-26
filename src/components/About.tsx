import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import BronzeRule from "@/components/ui/bronze-rule";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import { bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";
import { BODY } from "@/lib/typography";

const STEPS = [
  { title: "Request", desc: "Tell us what you're building. Takes two minutes." },
  { title: "Site Visit & Quote", desc: "We come look. Honest scope, fair price, in writing." },
  { title: "Schedule", desc: "We lock in a start date you can actually plan around." },
  { title: "Build", desc: "Our crew, on-site. No surprises, no upsells, just the work." },
  { title: "Walkthrough & Warranty", desc: "We walk it together. If something isn't right, we fix it." },
];

/**
 * About — homepage approach section.
 *
 * Calmer than the previous version: the duplicate StatTrio (already in
 * the hero provenance card) and the standalone "Request a Quote" CTA
 * are gone. The brand-promise plate is the section's terminal moment;
 * the Contact section closes the page.
 */
const About = () => {
  return (
    <section
      id="section-about"
      className={`${SECTION_PADDING.default} bg-secondary`}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-6">
        <div className={`${MAX_WIDTH.wide} mx-auto`}>
          <div className={`grid md:grid-cols-2 ${GRID_GAP.editorial} items-start`}>
            <div>
              <SectionHeader
                variant="quiet"
                label="OUR APPROACH"
                headingId="about-heading"
                heading="Excellence is the marketing."
                subheading="No gimmicks. No high-pressure sales. Just the work."
              />

              <ScrollRevealMotion delay={0.2}>
                <div className="space-y-6 mt-4">
                  <p className={BODY.lead}>
                    We don't run loud ads or push warranties you'll never use. We do
                    residential exterior construction across Calgary and Edmonton — and
                    we get the work right the first time. That's the whole pitch.
                  </p>

                  <p className={BODY.lead}>
                    Our crews own the build from quote to final nail. Materials are
                    selected to last in Alberta — not to pad an invoice. Sites stay
                    clean. Timelines stay realistic. And when we hand it over, it
                    looks like it was always supposed to be there.
                  </p>
                </div>
              </ScrollRevealMotion>

              {/* Editorial photo + brand promise plate — the terminal moment
                  of this column. No stats below; no CTA below. */}
              <ScrollRevealMotion delay={0.3} y={16}>
                <div className="mt-12 grid sm:grid-cols-5 gap-6 items-stretch">
                  <div className="sm:col-span-2">
                    <MediaSlot
                      query={{
                        shot_type: ["interior", "process", "detail"],
                        kind: "image",
                        min_quality: "reference",
                      }}
                      sizes={MEDIA_SIZES.PORTRAIT_HALF}
                      wrapperClassName="aspect-portrait w-full rounded-sm overflow-hidden"
                      cedarHover
                      fallbackVariant="cedar"
                      fallbackCaption="On the boards · Calgary"
                    />
                  </div>

                  <div
                    className="sm:col-span-3 relative px-6 md:px-8 py-8 md:py-10 rounded-sm grain-texture overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--evergreen)) 0%, hsl(150 25% 12%) 100%)",
                      borderLeft: "3px solid hsl(var(--cedar))",
                    }}
                  >
                    
                    <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-4 relative z-10">
                      Brand promise
                    </p>
                    <p className="font-serif text-lg md:text-xl text-evergreen-foreground/90 leading-snug relative z-10">
                      &ldquo;We don&rsquo;t market gimmicks. We market the work itself.&rdquo;
                    </p>
                    <p className="text-xs tracking-wide text-evergreen-foreground/40 mt-6 relative z-10">
                      — Creek Construction
                    </p>
                  </div>
                </div>
              </ScrollRevealMotion>
            </div>

            <div>
              <ScrollRevealMotion delay={0.2}>
                <div className="flex items-baseline justify-between mb-6">
                  <h3 className="text-minimal text-muted-foreground">THE CREEK PROCESS</h3>
                  <BronzeRule label={`0${STEPS.length} Steps`} variant="default" width="short" />
                </div>
                <div className="space-y-4" role="list">
                  {STEPS.map((step, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start space-x-4 pl-6 py-4 rounded-sm transition-[background-color,transform,box-shadow] duration-300 hover:bg-accent/5 hover:translate-x-1 hover:shadow-elevated group/step cursor-default grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(i, STEPS.length)})` }}
                    >
                      <span className="text-cedar/30 text-xs tabular-nums mt-1 transition-colors duration-500 group-hover/step:text-cedar/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="text-lg font-medium mb-1.5 transition-colors duration-500 group-hover/step:text-cedar">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollRevealMotion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
