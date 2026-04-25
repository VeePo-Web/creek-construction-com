import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import ImageDivider from "@/components/ImageDivider";
import SubPageHero from "@/components/SubPageHero";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import saunaMountainHero from "@/assets/sauna-mountain-hero.jpg";
import saunaAcreagePremium from "@/assets/sauna-acreage-premium.jpg";

const Services = () => {
  useDocumentTitle("Custom Builds", "Bespoke outdoor cedar saunas tailored to your Alberta property. Premium materials, proven build standard, turnkey installation.");
  const steps = [
    { number: "01", title: "DISCOVERY", description: "We learn about your property, access, vision, and how you want to use the space. No generic questionnaires.", icon: "◯" },
    { number: "02", title: "DESIGN", description: "Footprint, layout, glass, ventilation, and aesthetic details — tailored to your property and preferences.", icon: "△" },
    { number: "03", title: "BUILD", description: "Your sauna enters production. Cedar interior, insulation envelope, heater integration — built to our winter-ready standard.", icon: "◻" },
    { number: "04", title: "DELIVER + INSTALL", description: "One team delivers and installs on your prepared base. Heater commissioned, care walkthrough complete.", icon: "◆" },
  ];

  return (
    <main className="min-h-screen bg-background" aria-label="Custom Builds — B&P Sauna">
      <ServiceJsonLd />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://bpsauna.ca/" },
        { name: "Custom Builds", url: "https://bpsauna.ca/custom" },
      ]} />
      <Navigation transparent />

      <SubPageHero
        image={saunaMountainHero}
        imageAlt="Custom cedar sauna with panoramic glass windows overlooking Rocky Mountains at blue hour"
        breadcrumbLabel="Custom Builds"
        sectionLabel="BESPOKE BUT CONTROLLED"
        title="Custom Builds"
        subtitle="Tailored to your property. Built to our standard."
        description="Not infinite options — considered choices within a proven build standard. Premium without the uncertainty."
        skipToId="custom-content"
      />

      <ImageDivider
        image={saunaAcreagePremium}
        alt="Custom cedar sauna on an Alberta acreage at golden hour with mountains in the distance"
        caption="Acreage Build — Sherwood Park"
      />

      {/* Process Timeline */}
      <section id="custom-content" className="pt-24 pb-32 relative grain-overlay" aria-labelledby="process-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
        <img
          src={saunaAcreagePremium}
          alt=""
          role="presentation"
          aria-hidden="true"
          width="1920"
          height="1280"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none"
          style={{ filter: 'blur(2px)' }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)' }} />
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-baseline justify-between mb-16">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">II</span>
                  <div className="w-8 h-px bg-cedar/20" />
                  <h2 id="process-heading" className="text-minimal text-muted-foreground">THE PROCESS</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-cedar/15" />
                  <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">04 Phases</span>
                </div>
              </div>
            </ScrollRevealMotion>

            <div className="relative">
              <div
                className="absolute left-[23px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px hidden md:block pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, hsl(28 50% 52% / 0.08) 0%, hsl(28 50% 52% / 0.25) 33%, hsl(28 50% 52% / 0.5) 66%, hsl(28 50% 52% / 0.8) 100%)',
                }}
              />

              <div className="space-y-16 md:space-y-24" role="list" aria-label="Custom build process phases">
                {steps.map((step, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <ScrollRevealMotion key={step.number} delay={0.1 + i * 0.12}>
                      <div role="listitem" className={`relative md:grid md:grid-cols-2 md:gap-16 items-center`}>
                        <div className="hidden md:block absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-2 md:top-1/2 md:-translate-y-1/2 z-10">
                          <div
                            className="w-[18px] h-[18px] rounded-full border-2 bg-background transition-all duration-700 timeline-node-active"
                            style={{
                              borderColor: `hsl(28 50% 52% / ${[0.25, 0.45, 0.65, 0.9][i]})`,
                              animationDelay: `${i * 0.5}s`,
                            }}
                          >
                            <div
                              className="w-[6px] h-[6px] rounded-full bg-cedar mx-auto mt-[4px]"
                              style={{ opacity: [0.3, 0.5, 0.7, 1][i] }}
                            />
                          </div>
                        </div>

                        <div className={`pl-10 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:col-start-2 md:pl-16'}`}>
                          <div className="group/step">
                            <div
                              className="grain-texture py-6 px-6 -mx-2 transition-all duration-500 group-hover/step:bg-cedar/[0.03] shadow-contact border border-border/50 hover:shadow-elevated rounded-sm focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                              tabIndex={0}
                              style={{
                                borderLeft: isEven ? 'none' : `2px solid hsl(28 50% 52% / ${[0.15, 0.35, 0.55, 0.8][i]})`,
                                borderRight: isEven ? `2px solid hsl(28 50% 52% / ${[0.15, 0.35, 0.55, 0.8][i]})` : 'none',
                              }}
                            >
                              <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                                <span className="text-cedar/20 text-lg select-none">{step.icon}</span>
                                <span className="text-minimal text-cedar/60 font-medium">{step.number}</span>
                                <div className="w-6 h-px bg-cedar/20" />
                              </div>
                              <h3 className="text-2xl font-light text-architectural mb-4 transition-colors duration-500 group-hover/step:text-cedar">
                                {step.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {isEven ? <div className="hidden md:block" /> : null}
                      </div>
                    </ScrollRevealMotion>
                  );
                })}
              </div>
            </div>

            <ScrollRevealMotion delay={0.3}>
              <div className="mt-20 text-center">
                <CedarCTA to="/plan">START YOUR CUSTOM BUILD</CedarCTA>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      {/* Editorial Pull-Quote */}
      <section className="py-24 bg-secondary relative grain-overlay section-bleed-top" aria-labelledby="closing-heading">
        <div className="absolute top-0 inset-x-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)' }} />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollRevealMotion>
              <div className="flex justify-center py-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-cedar/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                  <div className="w-12 h-px bg-cedar/20" />
                </div>
              </div>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.1}>
              <h2 id="closing-heading" className="text-headline mb-6" style={{ fontSize: 'clamp(1.75rem, 3vw + 0.25rem, 2.75rem)' }}>
                Every Custom Build Starts with a Conversation
              </h2>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.2}>
              <p className="text-lg text-foreground/60 italic font-serif mb-12">
                Tell us about your property and we'll start mapping what's possible.
              </p>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.3}>
              <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.4}>
              <p className="text-sm font-serif italic text-foreground/25 mt-10">
                — Bespoke But Controlled · Est. Alberta
              </p>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
