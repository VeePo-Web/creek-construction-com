import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import ServiceTile from "@/components/ui/service-tile";
import FaqAccordion, { type FaqItem } from "@/components/ui/faq-accordion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { SECTION_PADDING, MAX_WIDTH, GRID_GAP } from "@/lib/spacing";

const FAQS: FaqItem[] = [
  {
    q: "How long does a typical project take?",
    a: "Decks and fences usually run 3–7 build days once we’re on-site, depending on size and weather. Painting and siding scale with square footage. We give you a real timeline in writing with your quote — not a vague window.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes. We warranty our workmanship — if something we built fails because of how we built it, we come back and fix it. Manufacturer warranties on materials are passed through to you.",
  },
  {
    q: "How does payment work?",
    a: "Most projects are split into milestones — a deposit on scheduling, a progress payment partway through, and the balance on final walkthrough. No payment is due before you’ve signed off on the quote.",
  },
  {
    q: "What about permits?",
    a: "If your municipality requires a permit for the work, we handle pulling it and include it in the quote. We’ll tell you upfront whether one is needed.",
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

      <PageHero
        variant="evergreen"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
        numeral="I"
        sectionLabel="EXTERIOR CONSTRUCTION"
        title="Six things, done right."
        subtitle="All residential. All exterior. All built to outlast Alberta winters."
        skipToId="all-services-heading"
      >
        <CedarCTA>Request a Quote</CedarCTA>
      </PageHero>

      {/* Full service list */}
      <section className={`${SECTION_PADDING.default} grain-overlay`} aria-labelledby="all-services-heading">
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              numeral="II"
              label="EVERY SERVICE"
              headingId="all-services-heading"
              heading="What we build."
              subheading="Click any service to start a quote with it pre-selected."
            />

            <div className={`grid md:grid-cols-2 ${GRID_GAP.default} mt-12`} role="list">
              {SERVICES.map((s, i) => (
                <ScrollRevealMotion key={s.id} delay={i * 0.06} y={24}>
                  <ServiceTile
                    item={s}
                    index={i}
                    total={SERVICES.length}
                    variant="compact"
                    onClick={() => openModal([s.id])}
                  />
                </ScrollRevealMotion>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${SECTION_PADDING.default} bg-secondary grain-overlay`} aria-labelledby="faq-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              numeral="III"
              label="COMMON QUESTIONS"
              headingId="faq-heading"
              heading="Straight answers."
              subheading="If we don’t address yours, ask on the call."
            />
            <ScrollRevealMotion delay={0.2}>
              <FaqAccordion items={FAQS} className="mt-10" />
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
