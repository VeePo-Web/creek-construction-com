// Link used via CedarCTA
import { Check, X } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import ImageDivider from "@/components/ImageDivider";
import SubPageHero from "@/components/SubPageHero";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import saunaInteriorPremium from "@/assets/sauna-interior-hero.jpg";
import saunaStonesClose from "@/assets/sauna-stones-premium.jpg";
import saunaInteriorEditorial from "@/assets/sauna-interior-editorial.jpg";

const About = () => {
  useDocumentTitle("Our Standard", "How B&P builds outdoor cedar saunas for Alberta winters — continuous insulation, sealed penetrations, and premium western red cedar.");
  const standards = [
    { title: "Winter-Ready Insulation", description: "Continuous insulation envelope rated for Alberta's coldest. No thermal bridges, no compromises on R-value." },
    { title: "Vapour & Moisture Management", description: "Properly positioned vapour barrier, ventilation design that allows the sauna to dry between sessions, preventing mould and rot." },
    { title: "Cedar Interior", description: "Western red cedar on walls, ceiling, and benches. Naturally moisture-resistant, aromatic, and beautiful with age." },
    { title: "Traditional Electric Heat", description: "Quality heaters with proper stone mass for thermal inertia. Consistent, controllable heat with the option for löyly (steam)." },
    { title: "Sealed Penetrations", description: "Every door, window, electrical entry, and roof junction treated as a potential failure point. Sealed for winter performance." },
    { title: "Structural Integrity", description: "Built like a small building, not a backyard kit. Engineered for snow load, wind, and decades of daily use." },
  ];

  const typicalItems = [
    "Partial or inconsistent insulation",
    "Gaps at doors, windows, and wiring entry points",
    "Standard lumber or thin cedar veneer interior",
    "Undersized or infrared-only heater",
    "Prefab kit assembly",
  ];

  const bpItems = [
    "Continuous insulation envelope, no thermal bridges",
    "Every penetration sealed and flashed for winter",
    "Full western red cedar walls, ceiling, and benches",
    "Traditional electric heater with proper stone mass",
    "Engineered for snow load, wind, and decades of daily use",
  ];

  return (
    <main className="min-h-screen bg-background" aria-label="Our Standard — B&P Sauna">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://bpsauna.ca/" },
        { name: "Our Standard", url: "https://bpsauna.ca/standard" },
      ]} />
      <Navigation transparent />

      <SubPageHero
        image={saunaInteriorPremium}
        imageAlt="Premium cedar sauna interior with handcrafted joints and steaming stones"
        breadcrumbLabel="Our Standard"
        sectionLabel="HOW WE BUILD"
        title="Our Standard"
        subtitle="Six non-negotiables. Every sauna. Every time."
        description="Every B&P Sauna is built to the same winter-ready standard. Here's what that means — in plain English."
        skipToId="standard-content"
      />

      {/* The Six Non-Negotiables */}
      <section id="standard-content" className="py-20 relative grain-overlay" aria-labelledby="standards-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)' }} />
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-baseline justify-between mb-12">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">II</span>
                  <div className="w-8 h-px bg-cedar/20" />
                  <h2 id="standards-heading" className="text-minimal text-muted-foreground">THE SIX NON-NEGOTIABLES</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-cedar/15" />
                  <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">06 Pillars</span>
                </div>
              </div>
            </ScrollRevealMotion>
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-16" role="list">
              {standards.map((item, i) => (
                <ScrollRevealMotion key={i} delay={0.08 + i * 0.1}>
                  <div className="group/item" role="listitem">
                    <div
                    className="grain-texture flex items-start space-x-6 pl-4 py-4 -ml-2 transition-all duration-500 group-hover/item:bg-accent/[0.04] group-hover/item:pl-6 rounded-sm shadow-contact border border-border/40 hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.12, 0.25, 0.38, 0.52, 0.68, 0.85][i]})` }}
                    >
                      <span className="text-minimal text-cedar font-medium">0{i + 1}</span>
                      <div>
                        <h3 className="text-2xl font-light text-architectural mb-4 transition-colors duration-500 group-hover/item:text-cedar">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </ScrollRevealMotion>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ImageDivider
        image={saunaInteriorEditorial}
        alt="Premium cedar sauna interior showing handcrafted benches, glowing heater stones with steam, and warm amber wall sconce lighting"
        caption="Interior — Cedar & Stone · Handcrafted Detail"
      />

      {/* Winter-Ready Comparison */}
      <section id="comparison" className="py-20 bg-secondary relative grain-overlay section-bleed-top" aria-labelledby="comparison-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 700px' }}>
        <img
          src={saunaStonesClose}
          alt=""
          role="presentation"
          aria-hidden="true"
          width="1920"
          height="1280"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none"
          style={{ filter: 'blur(1px)' }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)' }} />
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 mb-16">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">III</span>
                <div className="w-8 h-px bg-cedar/20" />
                <h2 id="comparison-heading" className="text-minimal text-muted-foreground">WHAT WINTER-READY ACTUALLY MEANS</h2>
              </div>
            </ScrollRevealMotion>
            <div className="grid md:grid-cols-2 gap-16" role="group" aria-label="Build quality comparison">
              <ScrollRevealMotion delay={0.1}>
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-8">TYPICAL OUTDOOR SAUNA</h3>
                  <div className="space-y-4" role="list" aria-label="Typical outdoor sauna shortcomings">
                    {typicalItems.map((item, i) => (
                   <div
                        key={i}
                        role="listitem"
                        className="grain-texture flex items-start gap-4 py-3 px-4 -ml-2 comparison-row-typical cursor-default group/typical rounded-sm shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 transition-all duration-500 hover:shadow-elevated"
                        tabIndex={0}
                        style={{ borderLeft: '2px solid hsl(var(--muted-foreground) / 0.12)' }}
                      >
                        <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0 transition-colors duration-500 group-hover/typical:text-destructive/60" aria-hidden="true" />
                        <p className="text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollRevealMotion>
              <ScrollRevealMotion delay={0.2}>
                <div>
                  <h3 className="text-minimal text-cedar mb-8">B&P STANDARD</h3>
                  <div className="space-y-4" role="list" aria-label="B&P Standard features">
                    {bpItems.map((item, i) => (
                      <div
                        key={i}
                        role="listitem"
                        className="grain-texture flex items-start gap-4 py-3 px-4 -ml-2 comparison-row-bp cursor-default group/bp rounded-sm shadow-contact border border-border/40 hover:shadow-elevated hover:border-cedar/25 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 transition-all duration-500"
                        tabIndex={0}
                        style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.2, 0.35, 0.5, 0.65, 0.85][i]})` }}
                      >
                        <Check className="h-4 w-4 text-cedar/60 mt-0.5 shrink-0 transition-colors duration-500 group-hover/bp:text-cedar" aria-hidden="true" />
                        <p className="text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollRevealMotion>
            </div>
          </div>
        </div>
      </section>

      {/* Before Your Sauna Arrives */}
      <section id="before-arrival" className="py-20 relative grain-overlay" aria-labelledby="before-arrival-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">IV</span>
                <div className="w-8 h-px bg-cedar/20" />
                <h2 id="before-arrival-heading" className="text-minimal text-muted-foreground">BEFORE YOUR SAUNA ARRIVES</h2>
              </div>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.1}>
              <p className="text-lg text-foreground/60 italic font-serif mb-12">
                Two simple preparations on your end.
              </p>
            </ScrollRevealMotion>
            <div className="grid md:grid-cols-2 gap-16">
              <ScrollRevealMotion delay={0.15}>
                <div className="group/prep">
                  <div
                    className="flex items-start space-x-6 pl-4 py-4 -ml-2 transition-all duration-500 group-hover/prep:bg-cedar/[0.04] group-hover/prep:pl-6 hover:shadow-elevated rounded-sm grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                    tabIndex={0}
                    style={{ borderLeft: '2px solid hsl(28 50% 52% / 0.3)' }}
                  >
                    <span className="text-minimal text-cedar font-medium">01</span>
                    <div>
                      <h3 className="text-2xl font-light text-architectural mb-4 transition-colors duration-500 group-hover/prep:text-cedar">Electrical Prep</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Your sauna needs a dedicated 240V circuit. We include specific electrical notes 
                        in your Sauna Plan — share them with your electrician so the circuit is ready 
                        before delivery day.
                      </p>
                      <CedarCTA to="/resources/electrical-requirements-guide" variant="secondary">READ THE ELECTRICAL GUIDE</CedarCTA>
                    </div>
                  </div>
                </div>
              </ScrollRevealMotion>
              <ScrollRevealMotion delay={0.25}>
                <div className="group/prep">
                  <div
                    className="flex items-start space-x-6 pl-4 py-4 -ml-2 transition-all duration-500 group-hover/prep:bg-cedar/[0.04] group-hover/prep:pl-6 hover:shadow-elevated rounded-sm grain-texture shadow-contact border border-border/40 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                    tabIndex={0}
                    style={{ borderLeft: '2px solid hsl(28 50% 52% / 0.7)' }}
                  >
                    <span className="text-minimal text-cedar font-medium">02</span>
                    <div>
                      <h3 className="text-2xl font-light text-architectural mb-4 transition-colors duration-500 group-hover/prep:text-cedar">Base & Site Prep</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Your sauna sits on a level base — concrete pad, gravel pad, or deck. 
                        We assess access (gate width, slope, equipment clearance) and recommend 
                        the right base for your property type.
                      </p>
                      <CedarCTA to="/plan" variant="secondary">GET YOUR SAUNA PLAN</CedarCTA>
                    </div>
                  </div>
                </div>
              </ScrollRevealMotion>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Close */}
      <section className="py-32 bg-secondary relative grain-overlay section-bleed-top" aria-label="Editorial statement and call to action — The B&P Standard">
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
              <h2 className="text-headline max-w-3xl mx-auto mb-6" style={{ fontSize: 'clamp(1.75rem, 3vw + 0.25rem, 2.75rem)' }}>
                We don't build kits. We build structures rated for
                decades of Alberta winters and daily use.
              </h2>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.2}>
              <p className="text-lg text-foreground/50 italic font-serif mb-2">
                — The B&P Standard
              </p>
              <p className="text-[9px] tracking-[0.2em] text-foreground/15 uppercase mb-12">Six Non-Negotiables · Every Sauna · Every Time</p>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.3}>
              <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.4}>
              <p className="text-sm font-serif italic text-foreground/25 mt-10">
                — Our Standard · Est. Alberta
              </p>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
