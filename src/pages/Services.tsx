import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import FaqAccordion, { type FaqItem } from "@/components/ui/faq-accordion";
import { Check, Minus, ArrowRight } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SERVICE_GROUPS, getItemsForGroup } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { BACKDROP, bronzeStep } from "@/lib/colors";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";

const FAQS: FaqItem[] = [
  {
    q: "How long does a typical project take?",
    a: "Decks and fences usually run 3–7 build days once we’re on-site, depending on size and weather. Painting, siding, and roofing scale with square footage. We give you a real timeline in writing with your quote — not a vague window.",
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

const WE_HANDLE = [
  "Site assessment and accurate quote",
  "Materials sourcing — quality first, price second",
  "Permits where required",
  "The actual build, by our crew (not subbed out)",
  "Daily cleanup and a clean site at handover",
  "Final walkthrough + warranty on our workmanship",
];

const YOU_HANDLE = [
  { task: "Property access on build days", note: "We coordinate the schedule with you" },
  { task: "HOA or strata approvals if applicable", note: "We’ll provide drawings or specs you can submit" },
  { task: "Color and material preferences", note: "We’ll show you options that fit your budget" },
  { task: "Paying invoices on agreed milestones", note: "Clear, written, no surprises" },
];

const Services = () => {
  useDocumentTitle(
    "Services",
    "Decks, roofing, siding, painting, fences, landscaping and more — full residential exterior construction across Alberta.",
  );
  const { openModal } = useQuoteModal();

  return (
    <main className="min-h-screen bg-background" aria-label="Services — Creek Construction">
      <Navigation />

      <PageHero
        variant="service-portrait"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
        sectionLabel="EXTERIOR CONSTRUCTION"
        title={["Built outside.", "Built to last."]}
        italic="Fifteen services. One crew."
        subtitle="All residential. All exterior. All built to outlast Alberta winters."
        skipToId="all-services-heading"
        queries={[
          { service: "decks", shot_type: ["hero", "elevation", "wide"], min_quality: "reference", kind: "image" },
          { service: "fencing", shot_type: ["detail", "process", "elevation"], min_quality: "reference", kind: "image" },
          { service: "sheds", shot_type: ["wide", "hero", "interior"], min_quality: "reference", kind: "image" },
        ]}
      >
        <CedarCTA>Request a Quote</CedarCTA>
      </PageHero>

      {/* Catalogue — five groups, fifteen items */}
      <section
        id="section-catalogue"
        className={`${SECTION_PADDING.default}`}
        aria-labelledby="all-services-heading"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1400px" }}
      >
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              variant="quiet"
              label="THE FULL MENU"
              headingId="all-services-heading"
              heading="Everything we build."
              subheading="Click any service to start a quote with it pre-selected."
            />

            <div className="mt-16 space-y-16">
              {SERVICE_GROUPS.map((group, gIdx) => {
                const items = getItemsForGroup(group.id);
                const Icon = group.icon;
                const opacity = bronzeStep(gIdx, SERVICE_GROUPS.length);
                return (
                  <div key={group.id} aria-labelledby={`group-${group.id}`}>
                    <div
                      className="flex items-baseline justify-between gap-6 pb-4 mb-6 border-b"
                      style={{ borderBottomColor: `hsl(var(--cedar) / ${opacity})` }}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className="h-5 w-5 text-cedar" aria-hidden strokeWidth={1.5} />
                        <h3
                          id={`group-${group.id}`}
                          className="font-serif text-2xl md:text-3xl text-foreground"
                        >
                          {group.title}
                        </h3>
                      </div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 tabular-nums shrink-0">
                        {String(gIdx + 1).padStart(2, "0")} / {String(SERVICE_GROUPS.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openModal([item.id])}
                          className="group flex items-baseline justify-between gap-4 py-4 text-left border-b border-border/40 transition-colors duration-300 hover:bg-cedar/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-sm px-3 -mx-3 min-h-[44px]"
                          aria-label={`Request a quote for ${item.title}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-base text-foreground transition-colors duration-300 group-hover:text-cedar">
                              {item.title}
                            </p>
                            {item.short && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.short}</p>
                            )}
                          </div>
                          <span
                            className="text-[10px] tracking-[0.18em] uppercase text-cedar/60 group-hover:text-cedar transition-colors duration-300 inline-flex items-center gap-1 shrink-0"
                            aria-hidden
                          >
                            Quote
                            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      ))}
                      {items.length % 2 === 1 && (
                        <div className="hidden sm:block border-b border-border/20" aria-hidden />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Responsibility matrix */}
      <section
        id="section-contract"
        className={`${SECTION_PADDING.default} bg-secondary`}
        aria-labelledby="contract-heading"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 800px" }}
      >
        <div className="container mx-auto px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              variant="quiet"
              label="HOW WE SPLIT THE WORK"
              headingId="contract-heading"
              heading="What we handle. What you handle."
              subheading="Clear from the start — no scope drift, no surprises."
            />

            <div className="mt-12 grid md:grid-cols-2 gap-0">
              <div
                aria-label="What we handle"
                className="p-10 md:p-12 border border-cedar/20 rounded-sm h-full shadow-elevated"
                style={{ background: BACKDROP.bronzeWash }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-cedar">WE HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-cedar/50 tabular-nums">
                    {String(WE_HANDLE.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-3" role="list">
                  {WE_HANDLE.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start gap-3 py-2.5 pl-3 rounded-sm transition-colors duration-300 hover:bg-cedar/[0.05]"
                      style={{ borderLeft: `2px solid hsl(var(--cedar) / ${bronzeStep(i, WE_HANDLE.length)})` }}
                    >
                      <Check className="h-3.5 w-3.5 text-cedar/70 mt-0.5 flex-shrink-0" aria-hidden />
                      <p className="text-foreground text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                aria-label="What you handle"
                className="p-10 md:p-12 border border-border/60 rounded-sm h-full shadow-contact bg-background"
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="text-minimal text-muted-foreground">YOU HANDLE</h3>
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground/40 tabular-nums">
                    {String(YOU_HANDLE.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-3" role="list">
                  {YOU_HANDLE.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start gap-3 py-2.5 pl-3 rounded-sm transition-colors duration-300 hover:bg-cedar/[0.03]"
                      style={{ borderLeft: "2px solid hsl(35 15% 86% / 0.5)" }}
                    >
                      <Minus className="h-3.5 w-3.5 text-muted-foreground/40 mt-0.5 flex-shrink-0" aria-hidden />
                      <div>
                        <p className="text-foreground text-sm">{item.task}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="section-faq"
        className={`${SECTION_PADDING.default} bg-background`}
        aria-labelledby="faq-heading"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              variant="quiet"
              label="COMMON QUESTIONS"
              headingId="faq-heading"
              heading="Straight answers."
              subheading="If we don’t address yours, ask on the call."
            />
            <FaqAccordion items={FAQS} className="mt-10" />

            <div className="mt-16 text-center">
              <CedarCTA>Request a Quote</CedarCTA>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
