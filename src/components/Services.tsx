import { Check, Minus } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";

const Services = () => {
  const services = [
    {
      number: "01",
      title: "OUTDOOR-ONLY SPECIALIZATION",
      description: "Built specifically for Alberta backyards, acreages, and mountain properties. No indoor units, no compromises."
    },
    {
      number: "02", 
      title: "CEDAR-INTERIOR CRAFTSMANSHIP",
      description: "Premium cedar that creates warmth, aroma, and timeless ambience. Every joint, bench, and panel built to last."
    },
    {
      number: "03",
      title: "TURNKEY INSTALLATION",
      description: "One team sells, delivers, and installs. No trades to coordinate, no project to manage. We handle everything."
    },
    {
      number: "04",
      title: "TRADITIONAL ELECTRIC HEAT",
      description: "Authentic sauna ritual with modern reliability. No gas lines, no wood splitting — just consistent, controllable heat."
    }
  ];

  return (
    <section id="section-services" className="py-32 md:py-40 bg-background relative grain-overlay" aria-labelledby="services-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1200px' }}>
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)' }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <SectionHeader
              numeral="II"
              label="THE BUILD"
              headingId="services-heading"
              heading="Built for the Ritual"
              subheading="Every detail engineered for Alberta conditions."
              badge="04 Pillars"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8" role="list">
            {services.map((service, index) => (
              <ScrollRevealMotion key={index} delay={index * 0.1} y={32}>
                <div className="group" role="listitem">
                  <div
                    className="service-card-warmth grain-texture flex items-start space-x-6 pl-5 py-6 pr-6 rounded-sm transition-all duration-500 shadow-contact hover:shadow-elevated group-hover:bg-cedar/[0.03] group-hover:translate-y-[-3px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                    tabIndex={0}
                    style={{ 
                      border: '1px solid hsl(25 12% 88% / 0.5)',
                      borderLeftWidth: '3px',
                      borderLeftColor: `hsl(28 50% 52% / ${[0.2, 0.4, 0.6, 0.85][index]})`,
                    }}
                  >
                    <span className="text-3xl font-serif text-cedar/40 leading-none select-none transition-colors duration-500 group-hover:text-cedar/70" style={{ textShadow: '0 1px 2px hsl(28 50% 52% / 0.1)' }}>
                      {service.number}
                    </span>
                    <div>
                      <h3 className="text-headline text-foreground group-hover:text-cedar transition-colors duration-500" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollRevealMotion>
            ))}
          </div>
          
          {/* Editorial breathing divider */}
          <ScrollRevealMotion delay={0.1} className="mt-32 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-cedar/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-cedar/30" />
              <div className="w-12 h-px bg-cedar/20" />
            </div>
          </ScrollRevealMotion>

          {/* Section CTA */}
          <ScrollRevealMotion delay={0.15} className="mt-16 text-center">
            <CedarCTA to="/plan">START YOUR PLAN</CedarCTA>
          </ScrollRevealMotion>

          {/* Responsibility Matrix */}
          <div className="mt-16 grid md:grid-cols-2 gap-0 md:gap-0" style={{ contain: 'layout style' }}>
            {/* WE HANDLE — dominant, warm card with depth */}
            <ScrollRevealMotion delay={0} y={40}>
              <div
                aria-label="What we handle"
                className="grain-texture p-10 md:p-12 border border-cedar/20 rounded-sm h-full shadow-elevated hover:shadow-thermal hover:border-cedar/35 transition-all duration-700 hover:translate-y-[-4px]"
                style={{
                  background: 'linear-gradient(135deg, hsl(28 50% 52% / 0.07) 0%, hsl(28 50% 52% / 0.02) 100%)',
                }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-cedar">WE HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-cedar/50 tabular-nums">06 ITEMS</span>
                </div>
                <div className="space-y-3" role="list">
                  {[
                    "Site assessment and placement guidance",
                    "Your Sauna Plan — base, electrical, and timeline",
                    "Complete sauna build to winter-ready standard",
                    "Delivery to your property",
                    "Same-day installation",
                    "Heater commissioning and care walkthrough",
                  ].map((item, i) => (
                    <div key={i} role="listitem" tabIndex={0} className="flex items-start space-x-3 py-2.5 pl-3 rounded-sm transition-all duration-500 hover:bg-cedar/[0.05] hover:pl-5 cursor-default group/we focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{ borderLeft: `2px solid hsl(28 50% 52% / ${0.12 + (i / 5) * 0.35})` }}
                    >
                      <Check className="h-3.5 w-3.5 text-cedar/70 mt-0.5 flex-shrink-0 transition-colors duration-500 group-hover/we:text-cedar" aria-hidden="true" />
                      <p className="text-foreground text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollRevealMotion>
            
            {/* YOU HANDLE — minimal, lightweight */}
            <ScrollRevealMotion delay={0.15} y={40}>
              <div aria-label="What you handle" className="grain-texture p-10 md:p-12 border border-border/60 rounded-sm h-full shadow-contact hover:shadow-elevated hover:border-cedar/20 transition-all duration-500 hover:translate-y-[-2px]">
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-muted-foreground">YOU HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground/40 tabular-nums">03 ITEMS</span>
                </div>
                <div className="space-y-3" role="list">
                  {[
                    { task: "Electrical circuit", note: "We write the specs for your electrician" },
                    { task: "Level base or pad", note: "We recommend the simplest option for your property" },
                    { task: "Being home on install day", note: "We coordinate the schedule with you" },
                  ].map((item, i) => (
                    <div key={i} role="listitem" tabIndex={0} className="flex items-start space-x-3 py-2.5 pl-3 rounded-sm transition-all duration-500 hover:bg-accent/5 hover:pl-5 cursor-default group/you focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{ borderLeft: '2px solid hsl(25 12% 88% / 0.5)' }}
                    >
                      <Minus className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 flex-shrink-0 transition-colors duration-500 group-hover/you:text-cedar/60" aria-hidden="true" />
                      <div>
                        <p className="text-foreground text-sm transition-colors duration-500 group-hover/you:text-cedar">{item.task}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-border/30">
                  <p className="text-sm text-signature text-foreground/40">
                    The ratio speaks for itself — we handle the complexity so you don't have to.
                  </p>
                </div>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
