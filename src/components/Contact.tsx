import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import { useCountUp } from "@/hooks/useCountUp";
import saunaAcreagePremium from "@/assets/sauna-acreage-premium.jpg";

const ContactMetric = ({ numValue, prefix = "", suffix = "", label, border }: {
  numValue: number; prefix?: string; suffix?: string; label: string; border: number;
}) => {
  const { ref, display } = useCountUp({ end: numValue, prefix, suffix, duration: 1.4, decimals: 0 });
  return (
    <div
      className="group/trust cursor-default text-center py-4 rounded-sm transition-all duration-500 hover:bg-cedar/[0.03] grain-texture shadow-contact border border-border/40"
      style={{ borderTop: `2px solid hsl(28 50% 52% / ${border})` }}
    >
      <p ref={ref as React.RefObject<HTMLParagraphElement>} className="text-3xl font-light text-architectural transition-colors duration-500 group-hover/trust:text-cedar tabular-nums">
        {display}
      </p>
      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 mt-2">{label}</p>
    </div>
  );
};

const Contact = () => {
  const communities = [
    "Edmonton", "Sherwood Park", "Red Deer", "Calgary", 
    "Cochrane", "Canmore", "Bragg Creek"
  ];

  return (
    <section id="section-contact" className="py-32 md:py-40 bg-background relative overflow-hidden grain-overlay" aria-labelledby="contact-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
      {/* Premium acreage background — ultra-faint atmospheric depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={saunaAcreagePremium}
          alt=""
          role="presentation"
          aria-hidden="true"
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03]"
          style={{ filter: 'blur(2px) saturate(0.5)' }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="absolute top-0 inset-x-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(180deg, hsl(20 10% 8% / 0.10) 0%, transparent 100%)',
      }} />
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-[1]" style={{
        background: 'linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.06) 100%)',
      }} />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <SectionHeader
                numeral="VII"
                label="START HERE"
                headingId="contact-heading"
                heading="Get My Sauna Plan"
                subheading="From first call to first session — handled."
              />
              
              <ScrollRevealMotion delay={0.2}>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Tell us about your property and timeline. We'll send you a Sauna Plan — 
                  placement guidance, base/pad notes, electrical checklist, and next steps. 
                  No pressure, no obligation.
                </p>
              </ScrollRevealMotion>

              {/* Signature pull-quote */}
              <ScrollRevealMotion delay={0.3}>
                <div
                  className="relative pl-8 py-5 my-10"
                  style={{ borderLeft: '2px solid hsl(28 50% 52% / 0.2)', marginLeft: '-0.15em' }}
                >
                  <span className="quote-mark-float absolute -top-3 -left-1" aria-hidden="true">{"\u201C"}</span>
                  <p className="text-xl font-serif italic text-foreground/50 leading-snug pt-6">
                    Most people call back within a week. The Plan makes the decision simple.
                  </p>
                </div>
              </ScrollRevealMotion>

              <ScrollRevealMotion delay={0.4}>
                <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
              </ScrollRevealMotion>
            </div>
            
            <div>
              <ScrollRevealMotion delay={0.2}>
                <h3 className="text-minimal text-muted-foreground mb-6">SERVICE AREAS</h3>
                <div className="flex flex-wrap gap-3 mb-10" role="list" aria-label="Service areas">
                  {communities.map((city, i) => {
                    const baseOpacity = 0.1 + (i / (communities.length - 1)) * 0.5;
                    return (
                       <span
                        key={city}
                        role="listitem"
                        className="service-area-tag text-sm text-muted-foreground border rounded-sm px-4 py-2.5 min-h-[44px] flex items-center transition-all duration-500 cursor-default hover:text-foreground hover:bg-cedar/[0.04] hover:pl-5 hover:border-cedar/60 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 grain-texture shadow-contact"
                        tabIndex={0}
                        style={{ borderColor: `hsl(28 50% 52% / ${baseOpacity})`, transitionDelay: `${i * 30}ms` }}
                      >
                        {city}
                      </span>
                    );
                  })}
                </div>
              </ScrollRevealMotion>
              
              <ScrollRevealMotion delay={0.35}>
                <h3 className="text-minimal text-muted-foreground mb-6">WHAT HAPPENS NEXT</h3>
                <div className="space-y-3" role="list">
                  {[
                    { num: "01", text: "We review your details within 24–48 hours", intensity: 0.2 },
                    { num: "02", text: "You receive your Sauna Plan document", intensity: 0.4 },
                    { num: "03", text: "We walk through it together — no obligation", intensity: 0.7 },
                  ].map((step, i) => (
                    <ScrollRevealMotion key={step.num} delay={0.4 + i * 0.08}>
                      <div className="flex items-start space-x-3 py-4 min-h-[44px] transition-all duration-500 hover:bg-accent/5 hover:pl-5 cursor-default group/step rounded-sm focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-background grain-texture shadow-contact border border-border/40" tabIndex={0} role="listitem" style={{
                        borderLeft: `2px solid hsl(28 50% 52% / ${step.intensity})`,
                        paddingLeft: '1rem',
                      }}>
                        <span className="text-cedar font-medium text-minimal mt-0.5 transition-opacity duration-500 opacity-60 group-hover/step:opacity-100">{step.num}</span>
                        <p className="text-muted-foreground text-sm transition-colors duration-500 group-hover/step:text-foreground">{step.text}</p>
                      </div>
                    </ScrollRevealMotion>
                  ))}
                </div>
              </ScrollRevealMotion>

              {/* Trust metrics — card-glass treatment */}
              <ScrollRevealMotion delay={0.5}>
                <div className="mt-10 card-glass grain-texture shadow-contact border border-border/40 p-8 hover-lift">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-cedar/20" />
                    <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">At a Glance</span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <ContactMetric numValue={24} suffix="h" label="Response" border={0.2} />
                    <ContactMetric numValue={0} prefix="$" suffix="" label="Plan Cost" border={0.5} />
                    <ContactMetric numValue={1} suffix=" day" label="Install" border={0.8} />
                  </div>
                </div>
              </ScrollRevealMotion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
