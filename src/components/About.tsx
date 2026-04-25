import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { useCountUp } from "@/hooks/useCountUp";
import MediaSlot from "@/components/media/MediaSlot";
import { MEDIA_SIZES } from "@/lib/media-sizes";

const StatCard = ({
  value,
  prefix = "",
  suffix = "",
  label,
  heading,
  borderOpacity,
  note,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  heading: string;
  borderOpacity: number;
  note?: string;
}) => {
  const { ref, display } = useCountUp({ end: value, prefix, suffix, duration: 1.8, decimals: 0 });
  return (
    <div
      className="group/stat cursor-default py-3 pl-5 transition-all duration-500 hover:bg-accent/[0.04] hover:pl-7 hover:shadow-elevated rounded-sm grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
      tabIndex={0}
      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${borderOpacity})` }}
    >
      <h3 className="text-minimal text-muted-foreground mb-3">{heading}</h3>
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="text-3xl md:text-4xl font-light text-architectural transition-all duration-500 group-hover/stat:text-cedar tabular-nums"
      >
        {display}
      </p>
      <p className="text-muted-foreground mt-1">{label}</p>
      {note && (
        <p className="text-sm text-muted-foreground/70 mt-1 transition-colors duration-500 group-hover/stat:text-cedar/50">
          {note}
        </p>
      )}
    </div>
  );
};

const About = () => {
  const steps = [
    { title: "Request", desc: "Tell us what you're building. Takes two minutes.", opacity: 20 },
    { title: "Site Visit & Quote", desc: "We come look. Honest scope, fair price, in writing.", opacity: 40 },
    { title: "Schedule", desc: "We lock in a start date you can actually plan around.", opacity: 60 },
    { title: "Build", desc: "Our crew, on-site. No surprises, no upsells, just the work.", opacity: 80 },
    { title: "Walkthrough & Warranty", desc: "We walk it together. If something isn't right, we fix it.", opacity: 100 },
  ];

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-secondary relative grain-overlay"
      aria-labelledby="about-heading"
    >
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--evergreen) / 0.06) 100%)" }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionHeader
                numeral="III"
                label="OUR APPROACH"
                headingId="about-heading"
                heading="Excellence is the marketing."
                subheading="No gimmicks. No high-pressure sales. Just the work."
              />

              <ScrollRevealMotion delay={0.2}>
                <div className="space-y-6 mt-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We don't run loud ads or push warranties you'll never use. We do
                    residential exterior construction across Calgary and Edmonton — and
                    we get the work right the first time. That's the whole pitch.
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our crews own the build from quote to final nail. Materials are
                    selected to last in Alberta — not to pad an invoice. Sites stay
                    clean. Timelines stay realistic. And when we hand it over, it
                    looks like it was always supposed to be there.
                  </p>
                </div>
              </ScrollRevealMotion>

              {/* Editorial photo + pull quote — portrait of the work, then a brand promise */}
              <ScrollRevealMotion delay={0.3} y={16}>
                <div className="mt-12 grid sm:grid-cols-5 gap-6 items-stretch">
                  {/* Portrait photo (or evergreen plate fallback) */}
                  <div className="sm:col-span-2">
                    <MediaSlot
                      query={{
                        shot_type: ["interior", "process", "detail"],
                        kind: "image",
                        min_quality: "portfolio",
                      }}
                      sizes={MEDIA_SIZES.PORTRAIT_HALF}
                      wrapperClassName="aspect-portrait w-full rounded-sm"
                      cedarHover
                      fallback={
                        <div
                          className="aspect-portrait w-full rounded-sm relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(150 25% 14%) 0%, hsl(150 30% 8%) 100%)",
                          }}
                        >
                          <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(ellipse at 30% 70%, hsl(28 55% 45% / 0.18) 0%, transparent 60%)",
                            }}
                          />
                          <p className="absolute bottom-5 left-5 right-5 text-[10px] tracking-[0.25em] uppercase text-cedar/60">
                            On the boards
                          </p>
                        </div>
                      }
                    />
                  </div>

                  {/* Brand promise slab */}
                  <div
                    className="sm:col-span-3 relative px-6 md:px-8 py-8 md:py-10 rounded-sm grain-texture overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--evergreen)) 0%, hsl(150 25% 12%) 100%)",
                      borderLeft: "3px solid hsl(var(--cedar))",
                    }}
                  >
                    <div
                      className="absolute inset-0 grain-overlay opacity-40 pointer-events-none"
                      aria-hidden
                    />
                    <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 mb-4 relative z-10">
                      Brand promise
                    </p>
                    <p className="font-serif text-lg md:text-xl text-evergreen-foreground/90 leading-snug relative z-10">
                      "We don't market gimmicks. We market the work itself."
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-cedar/15" />
                    <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">
                      05 Steps
                    </span>
                  </div>
                </div>
                <div className="space-y-4" role="list">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start space-x-4 pl-6 py-4 -ml-px rounded-sm transition-all duration-500 hover:bg-accent/5 hover:pl-8 hover:shadow-elevated group/step cursor-default grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${step.opacity / 100})` }}
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

              <ScrollRevealMotion delay={0.35}>
                <div className="pt-8 mt-8 border-t border-border">
                  <div className="grid grid-cols-3 gap-4" role="group" aria-label="Key stats">
                    <StatCard value={2} suffix="" label="Major metros" heading="SERVING" borderOpacity={0.2} note="Calgary + Edmonton" />
                    <StatCard value={0} prefix="$" suffix="" label="No obligation" heading="QUOTES" borderOpacity={0.5} note="Always free" />
                    <StatCard value={48} suffix="h" label="Typical reply" heading="RESPONSE" borderOpacity={0.85} />
                  </div>
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.4}>
                <div className="mt-10">
                  <CedarCTA>Request a Quote</CedarCTA>
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
