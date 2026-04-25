import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import ImageDivider from "@/components/ImageDivider";
import SubPageHero from "@/components/SubPageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ProductJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import saunaBackyardHero from "@/assets/sauna-backyard-hero.jpg";
import saunaInteriorDetail from "@/assets/sauna-interior-detail.jpg";

const faqs = [
  {
    question: "What does \u2018starting at ~$8,000\u2019 include?",
    answer: "The sauna structure, cedar interior (walls, ceiling, benches), traditional electric heater with stones, delivery to your property, and full installation by our team. Electrical circuit and base/pad are property-specific \u2014 your Sauna Plan covers exactly what\u2019s needed for yours.",
  },
  {
    question: "Will this work at \u221230\u00B0C?",
    answer: "Yes. Every B&P sauna is built to our Winter-Ready Standard: continuous insulation envelope, sealed penetrations at every junction, and vapour management designed for Alberta\u2019s coldest conditions. The colder it is outside, the more you\u2019ll appreciate the performance.",
  },
  {
    question: "What electrical prep do I need?",
    answer: "A dedicated 240V circuit from your panel to the sauna location. Your Sauna Plan includes the exact specs to share with your electrician \u2014 amperage, wire gauge, and breaker requirements. Most electricians complete it in a few hours.",
  },
  {
    question: "How long does installation take?",
    answer: "Typically one day. Our team delivers and installs the sauna, commissions the heater, and walks you through care \u2014 all in a single visit. You can use it that evening.",
  },
  {
    question: "What if my yard access is tight?",
    answer: "Tell us about gate widths, slopes, stairs, or tight turns in your Sauna Plan request. We assess access as part of the process and will let you know if anything needs attention before delivery day.",
  },
  {
    question: "Is the 8\u00D78 big enough?",
    answer: "The 8\u00D78 footprint comfortably seats 4\u20136 people and is specifically sized for the daily-use sweet spot: efficient heat-up time, proper heat circulation, and enough room for a real ritual. It\u2019s not a compromise \u2014 it\u2019s the curated standard.",
  },
];

const Work = () => {
  useDocumentTitle("Signature 8×8 Cedar Sauna", "The B&P Signature 8×8 outdoor cedar sauna — engineered for Alberta winters, installed turnkey. Starting at ~$8,000.");
  const features = [
    { title: "Daily-Use Footprint", description: "8×8 interior — enough room for 4–6 people, efficient heat-up, and a layout that works for daily ritual." },
    { title: "Winter Performance", description: "Continuous insulation envelope, sealed penetrations, and vapour management designed for -40°C Alberta winters." },
    { title: "Cedar Interior", description: "Premium western red cedar throughout — benches, walls, ceiling. Natural warmth, aroma, and moisture resistance." },
    { title: "Turnkey Install", description: "Delivered and installed by the same team that built it. One day from truck to first heat." },
  ];

  return (
    <main className="min-h-screen bg-background" aria-label="Signature 8×8 — B&P Sauna">
      <ProductJsonLd />
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://bpsauna.ca/" },
        { name: "Signature 8×8", url: "https://bpsauna.ca/signature" },
      ]} />
      <Navigation transparent />

      <SubPageHero
        image={saunaBackyardHero}
        imageAlt="Signature 8×8 cedar barrel sauna in an Edmonton backyard at golden hour"
        breadcrumbLabel="Signature 8×8"
        sectionLabel="THE ALBERTA STANDARD"
        title="Signature 8×8"
        subtitle="Sized for daily use, not occasional novelty."
        description="Engineered for winter performance. Built with premium cedar. Installed turnkey by the same team."
        skipToId="signature-content"
      />

      <section id="signature-content" className="py-20 relative grain-overlay" aria-labelledby="features-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 700px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <h2 id="features-heading" className="sr-only">Signature 8×8 Features</h2>
              <div className="flex items-center gap-3 mb-16">
                <div className="w-12 h-px bg-cedar/15" />
                <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">04 Features · 01 Standard</span>
              </div>
            </ScrollRevealMotion>

            <div className="grid md:grid-cols-2 gap-x-20 gap-y-8" role="list">
              {features.map((feature, i) => (
                <ScrollRevealMotion key={i} delay={0.1 + i * 0.12}>
                  <div className="group/feat" role="listitem">
                    <div
                      className="grain-texture flex items-start space-x-6 pl-5 py-5 pr-6 rounded-sm transition-all duration-500 shadow-contact hover:shadow-elevated group-hover/feat:bg-cedar/[0.03] group-hover/feat:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ 
                        borderLeft: `3px solid hsl(28 50% 52% / ${[0.2, 0.4, 0.6, 0.85][i]})`,
                        border: '1px solid hsl(25 12% 88% / 0.5)',
                        borderLeftWidth: '3px',
                        borderLeftColor: `hsl(28 50% 52% / ${[0.2, 0.4, 0.6, 0.85][i]})`,
                      }}
                    >
                      <span className="text-minimal text-cedar/70 font-medium group-hover/feat:text-cedar transition-colors duration-500">0{i + 1}</span>
                      <div>
                        <h3 className="text-2xl font-light text-architectural-premium mb-4 transition-colors duration-500 group-hover/feat:text-cedar">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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
        image={saunaInteriorDetail}
        alt="Cedar sauna interior detail showing handcrafted benches, glowing heater stones, and warm LED lighting"
        caption="Interior — Cedar & Stone"
      />

      {/* Investment */}
      <section className="py-24 bg-secondary relative grain-overlay section-bleed-top" aria-labelledby="investment-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="absolute top-0 inset-x-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)' }} />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 justify-center mb-8">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">III</span>
                <div className="w-8 h-px bg-cedar/20" />
                <h2 id="investment-heading" className="text-minimal text-muted-foreground">INVESTMENT</h2>
              </div>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.1}>
              <div className="grain-texture shadow-contact border border-border/40 rounded-sm p-10 md:p-12 hover:shadow-elevated transition-all duration-500">
                <div className="flex justify-center py-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-cedar/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                    <div className="w-12 h-px bg-cedar/20" />
                  </div>
                </div>
                <h2 className="text-headline mb-4" style={{ fontSize: 'clamp(2rem, 3.5vw + 0.25rem, 3.25rem)' }}>Starting Around $8,000 — Installed</h2>
                <p className="text-lg text-foreground/60 italic font-serif mb-8">
                  No hidden costs. No surprise add‑ons.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  Includes the sauna structure, cedar interior, traditional electric heater, delivery, and installation.
                </p>
                <p className="text-muted-foreground mb-12">
                  Electrical prep and base/pad are property-specific — your Sauna Plan will cover exactly what's needed.
                </p>
                <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-background grain-overlay relative" aria-labelledby="faq-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">IV</span>
                  <div className="w-8 h-px bg-cedar/20" />
                  <span className="text-minimal text-muted-foreground">COMMON QUESTIONS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-cedar/15" />
                  <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">06 Answers</span>
                </div>
              </div>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.1}>
              <h2 id="faq-heading" className="text-headline mb-4" style={{ fontSize: 'clamp(2rem, 3.5vw + 0.25rem, 3.25rem)' }}>
                Before You Decide
              </h2>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.15}>
              <p className="text-lg text-foreground/60 italic font-serif mb-16">
                Straight answers to the questions we hear most.
              </p>
            </ScrollRevealMotion>
            
            <ScrollRevealMotion delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4" aria-label="Frequently asked questions about the Signature 8×8 sauna">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="faq-thermal grain-texture border px-6 transition-all duration-500 shadow-contact hover:shadow-elevated hover:border-cedar/30 data-[state=open]:border-cedar/40 data-[state=open]:bg-cedar/[0.03] data-[state=open]:shadow-thermal group/faq rounded-sm"
                    style={{
                      borderColor: `hsl(28 50% 52% / ${0.1 + (i / (faqs.length - 1)) * 0.35})`,
                      borderLeft: `3px solid hsl(28 50% 52% / ${0.15 + (i / (faqs.length - 1)) * 0.6})`,
                    }}
                  >
                    <AccordionTrigger className="text-left text-lg font-light text-foreground hover:no-underline py-6 hover:text-cedar transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-sm">
                      <span className="flex items-center gap-4">
                        <span className="text-[11px] tracking-[0.2em] text-cedar/30 tabular-nums font-medium transition-colors duration-500 group-hover/faq:text-cedar/60 group-data-[state=open]/faq:text-cedar">{String(i + 1).padStart(2, '0')}</span>
                        <span>{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pl-10">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.3} className="mt-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-px bg-cedar/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                <div className="w-12 h-px bg-cedar/20" />
              </div>
              <p className="text-lg italic font-serif text-foreground/40 tracking-wide mb-8">
                Still have questions? Your Sauna Plan call covers everything.
              </p>
              <CedarCTA to="/plan" variant="secondary">START YOUR PLAN</CedarCTA>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.4} className="mt-20 pt-8 border-t border-border/20 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground/30 uppercase">The Signature Standard</span>
              <span className="text-[9px] tracking-[0.2em] text-foreground/15 italic font-serif">Est. Alberta · B&P</span>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default Work;
