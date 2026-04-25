import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { useCountUp } from "@/hooks/useCountUp";
import saunaInterior from "@/assets/sauna-interior-premium.jpg";

const StatCard = ({ value, prefix = "", suffix = "", label, heading, borderOpacity, note }: {
  value: number; prefix?: string; suffix?: string; label: string; heading: string; borderOpacity: number; note?: string;
}) => {
  const { ref, display } = useCountUp({ end: value, prefix, suffix, duration: 1.8, decimals: 0 });
  return (
    <div
      className="group/stat cursor-default py-3 pl-5 transition-all duration-500 hover:bg-accent/[0.04] hover:pl-7 hover:shadow-elevated rounded-sm grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
      tabIndex={0}
      style={{ borderLeft: `2px solid hsl(28 50% 52% / ${borderOpacity})` }}
    >
      <h3 className="text-minimal text-muted-foreground mb-3">{heading}</h3>
      <p ref={ref as React.RefObject<HTMLParagraphElement>} className="text-3xl md:text-4xl font-light text-architectural transition-all duration-500 group-hover/stat:text-cedar group-hover/stat:drop-shadow-[0_0_16px_hsl(28_50%_52%/0.2)] tabular-nums">
        {display}
      </p>
      <p className="text-muted-foreground mt-1">{label}</p>
      {note && <p className="text-sm text-muted-foreground/70 mt-1 transition-colors duration-500 group-hover/stat:text-cedar/50">{note}</p>}
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 md:py-40 bg-secondary relative grain-overlay section-bleed-top" aria-labelledby="about-heading">
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(20 10% 8% / 0.08) 100%)' }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionHeader
                numeral="III"
                label="THE ALBERTA STANDARD"
                headingId="about-heading"
                heading="Signature 8×8"
                subheading="The foundation of your daily ritual."
              />
              
              <ScrollRevealMotion delay={0.2}>
                <div className="space-y-8 mt-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Sized for daily use, not occasional novelty. The Signature 8×8 is our 
                    flagship — engineered for Alberta winters, built with premium cedar, 
                    and installed turnkey by the same team that built it.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Most Alberta properties choose the Signature 8×8. It's the right footprint 
                    for a real ritual — enough room for comfort, sized for efficient heat-up, 
                    and designed to belong on your property.
                  </p>
                </div>
              </ScrollRevealMotion>

              {/* Interior image with cinematic vignette */}
              <ScrollRevealMotion delay={0.3} y={16}>
                <div className="mt-12 overflow-hidden rounded-sm relative group">
                    <img
                      src={saunaInterior}
                      alt="Cedar sauna interior with heater stones, wooden bucket, and warm amber glow from recessed lighting"
                      width="800"
                      height="600"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  {/* Cinematic dual-layer vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, hsl(var(--foreground) / 0.1) 0%, transparent 25%, transparent 65%, hsl(var(--foreground) / 0.3) 100%), radial-gradient(ellipse at center, transparent 50%, hsl(20 10% 8% / 0.15) 100%)',
                    }}
                  />
                  {/* Cedar warmth on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700"
                    style={{
                      background: 'linear-gradient(180deg, transparent 50%, hsl(28 50% 52% / 0.12) 100%)',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-white/60">Interior — Signature 8×8</p>
                  </div>
                </div>
              </ScrollRevealMotion>
            </div>
            
            <div>
              <ScrollRevealMotion delay={0.2}>
                <div className="flex items-baseline justify-between mb-6">
                  <h3 className="text-minimal text-muted-foreground">THE FIRST HEAT™ PROCESS</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-cedar/15" />
                    <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">05 Steps</span>
                  </div>
                </div>
                <div className="space-y-5" role="list">
                  {[
                    { title: "Discovery", desc: "We learn about your property, timeline, and vision", opacity: "20" },
                    { title: "Sauna Plan", desc: "Placement, base/pad, electrical — mapped and clear", opacity: "40" },
                    { title: "Build Slot", desc: "Your sauna enters production with a confirmed schedule", opacity: "60" },
                    { title: "Delivery + Install", desc: "One team delivers and installs — no trades to coordinate", opacity: "80" },
                    { title: "First Session", desc: "Care walkthrough, optimal heat-up routine, your ritual begins", opacity: "100" },
                  ].map((step, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start space-x-4 pl-6 py-3 -ml-px rounded-sm transition-all duration-500 hover:bg-accent/5 hover:pl-8 hover:shadow-elevated group/step cursor-default grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ borderLeft: `2px solid hsl(28 50% 52% / ${parseInt(step.opacity) / 100})` }}
                    >
                      <span className="text-cedar/30 text-xs tabular-nums mt-1 transition-colors duration-500 group-hover/step:text-cedar/70">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h4 className="text-lg font-medium mb-1.5 transition-colors duration-500 group-hover/step:text-cedar">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollRevealMotion>
              
              <ScrollRevealMotion delay={0.35}>
                <div className="pt-8 mt-8 border-t border-border">
                  <div className="grid grid-cols-2 gap-8" role="group" aria-label="Key statistics">
                    <StatCard value={7} suffix="" label="Alberta Communities" heading="SERVING" borderOpacity={0.15} />
                    <StatCard value={8000} prefix="~$" suffix="" label="Installed turnkey" heading="STARTING AT" borderOpacity={0.4} note="No hidden costs." />
                  </div>
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.4}>
                <div className="mt-10">
                  <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
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
