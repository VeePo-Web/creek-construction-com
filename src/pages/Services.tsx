import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Decks and fences usually run 3–7 build days once we're on-site, depending on size and weather. Painting and siding scale with square footage. We give you a real timeline in writing with your quote — not a vague window.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes. We warranty our workmanship — if something we built fails because of how we built it, we come back and fix it. Manufacturer warranties on materials are passed through to you.",
  },
  {
    q: "How does payment work?",
    a: "Most projects are split into milestones — a deposit on scheduling, a progress payment partway through, and the balance on final walkthrough. No payment is due before you've signed off on the quote.",
  },
  {
    q: "What about permits?",
    a: "If your municipality requires a permit for the work, we handle pulling it and include it in the quote. We'll tell you upfront whether one is needed.",
  },
];

const Services = () => {
  useDocumentTitle(
    "Services",
    "Decks, fencing, sheds, painting, siding, pergolas — full residential exterior construction in Calgary, Edmonton, and surrounding Alberta.",
  );
  const { openModal } = useQuoteModal();

  return (
    <main className="min-h-screen bg-background" aria-label="Services — Creek Construction">
      <Navigation />

      {/* Lightweight evergreen hero — no photo */}
      <section className="relative bg-evergreen text-evergreen-foreground py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] tracking-[0.2em] uppercase">
            <Link to="/" className="text-evergreen-foreground/40 hover:text-cedar transition-colors">Home</Link>
            <span className="text-evergreen-foreground/20">·</span>
            <span className="text-cedar/80">Services</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[11px] tracking-[0.2em] text-cedar/60 tabular-nums">I</span>
            <div className="w-8 h-px bg-cedar/40" />
            <span className="text-minimal text-cedar">EXTERIOR CONSTRUCTION</span>
          </div>
          <h1 className="font-serif text-evergreen-foreground mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Six things, done right.
          </h1>
          <p className="text-lg text-evergreen-foreground/70 italic font-serif max-w-xl mb-8">
            All residential. All exterior. All built to outlast Alberta winters.
          </p>
          <CedarCTA>Request a Quote</CedarCTA>
        </div>
      </section>

      {/* Full service list */}
      <section className="py-24 md:py-32 grain-overlay" aria-labelledby="all-services-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              numeral="II"
              label="EVERY SERVICE"
              headingId="all-services-heading"
              heading="What we build."
              subheading="Click any service to start a quote with it pre-selected."
            />

            <div className="grid md:grid-cols-2 gap-6 mt-12" role="list">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <ScrollRevealMotion key={s.id} delay={i * 0.06} y={24}>
                    <button
                      type="button"
                      onClick={() => openModal([s.id])}
                      role="listitem"
                      className="group w-full text-left grain-texture flex items-start gap-5 p-6 rounded-sm transition-all duration-500 shadow-contact hover:shadow-elevated hover:bg-cedar/[0.03] hover:translate-y-[-2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      style={{
                        border: "1px solid hsl(35 15% 86% / 0.6)",
                        borderLeftWidth: "3px",
                        borderLeftColor: `hsl(var(--cedar) / ${s.intensity})`,
                      }}
                    >
                      <div
                        className="shrink-0 w-12 h-12 rounded-sm flex items-center justify-center"
                        style={{ background: `hsl(var(--cedar) / ${0.08 + s.intensity * 0.05})` }}
                      >
                        <Icon className="h-5 w-5 text-cedar" aria-hidden />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3 mb-2">
                          <h3 className="font-serif text-2xl text-foreground group-hover:text-cedar transition-colors duration-500">
                            {s.title}
                          </h3>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                      </div>
                    </button>
                  </ScrollRevealMotion>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-secondary grain-overlay" aria-labelledby="faq-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              numeral="III"
              label="COMMON QUESTIONS"
              headingId="faq-heading"
              heading="Straight answers."
              subheading="If we don't address yours, ask on the call."
            />
            <ScrollRevealMotion delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4 mt-10">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="grain-texture border px-6 transition-all duration-500 shadow-contact hover:shadow-elevated hover:border-cedar/30 data-[state=open]:border-cedar/40 data-[state=open]:bg-cedar/[0.03] rounded-sm bg-background"
                    style={{
                      borderColor: `hsl(var(--cedar) / ${0.1 + (i / (FAQS.length - 1)) * 0.3})`,
                      borderLeft: `3px solid hsl(var(--cedar) / ${0.2 + (i / (FAQS.length - 1)) * 0.6})`,
                    }}
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-light text-foreground hover:no-underline py-5 hover:text-cedar transition-colors duration-500">
                      <span className="flex items-center gap-4">
                        <span className="text-[11px] tracking-[0.2em] text-cedar/40 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{f.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pl-10">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.3} className="mt-16 text-center">
              <CedarCTA>Request a Quote</CedarCTA>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
