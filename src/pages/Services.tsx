import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import MiniFaq from "@/components/MiniFaq";
import { Check, Minus, ArrowUpRight } from "lucide-react";
import { HEADLINE } from "@/lib/typography";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { FAQS_SERVICES } from "@/config/faqs";

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
    <main id="main-content" className="min-h-screen overflow-x-clip bg-background" aria-label="Services — Creek Construction">
      <SkipToContent target="section-catalogue" />
      <Navigation />

      <PageHero
        variant="service-portrait"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
        sectionLabel="Exterior Construction"
        title={["Built outside.", "Built to last."]}
        skipToId="all-services-heading"
        queries={[
          { service: "decks", shot_type: ["hero", "elevation", "wide"], min_quality: "reference", kind: "image" },
          { service: "fencing", shot_type: ["detail", "process", "elevation"], min_quality: "reference", kind: "image" },
          { service: "sheds", shot_type: ["wide", "hero", "interior"], min_quality: "reference", kind: "image" },
        ]}
      >
        <CedarCTA />
      </PageHero>

      {/* Catalogue — five groups, fifteen items */}
      <section
        id="section-catalogue"
        className={`${SECTION_PADDING.default}`}
        aria-labelledby="all-services-heading"
      >
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <div className="max-w-3xl">
              <SectionHeader
                label="THE FULL MENU"
                headingId="all-services-heading"
                heading="Everything we build."
              />
            </div>

            <div className="mt-16 space-y-10 md:space-y-14">
              {SERVICE_GROUPS.map((group, gIdx) => {
                const items = getItemsForGroup(group.id);
                return (
                  <div key={group.id} aria-labelledby={`group-${group.id}`} className={gIdx > 0 ? "pt-10 md:pt-14 hairline" : ""}>
                    <div className="mb-6 md:mb-8 flex items-baseline gap-3">
                      <span className="eyebrow tabular-nums opacity-60">
                        {String(gIdx + 1).padStart(2, "0")}
                      </span>
                      <h3
                        id={`group-${group.id}`}
                        className={HEADLINE.sub}
                      >
                        {group.title}
                      </h3>
                    </div>

                    <ul role="list" className="grid sm:grid-cols-2 gap-x-6 sm:gap-x-10">
                      {items.map((item) => (
                        <li key={item.id} role="listitem" className="border-b border-cedar/12">
                          <button
                            type="button"
                            onClick={() => openModal([item.id])}
                            className="group relative w-full flex items-baseline justify-between gap-4 py-4 md:py-5 pl-3 sm:pl-4 pr-2 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px]"
                            aria-label={`Get my free quote for ${item.title}`}
                          >
                            <span
                              aria-hidden
                              className="absolute left-0 top-3 bottom-3 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-base text-foreground">
                                {item.title}
                              </p>
                              {item.short && (
                                <p className="text-xs text-muted-foreground mt-1">{item.short}</p>
                              )}
                            </div>
                            <ArrowUpRight
                              className="hidden sm:block h-4 w-4 text-cedar/45 group-hover:text-cedar opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                              strokeWidth={1.5}
                              aria-hidden
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
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
      >
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="HOW WE SPLIT THE WORK"
              headingId="contract-heading"
              heading="What we handle. What you handle."
              align="center"
            />

            <div className="mt-12 grid lg:grid-cols-2 gap-6 lg:gap-8">
              <div
                aria-label="What we handle"
                className="hairline pt-7 sm:pt-8 md:pt-10 px-1 sm:px-2 h-full"
              >
                <div className="flex items-baseline justify-between gap-2 flex-wrap mb-8">
                  <p className="eyebrow">WE HANDLE</p>
                  <span className="eyebrow tabular-nums opacity-60">
                    {String(WE_HANDLE.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-2.5" role="list">
                  {WE_HANDLE.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start gap-3 py-2"
                    >
                      <Check className="h-3.5 w-3.5 text-cedar/70 mt-1 flex-shrink-0" aria-hidden />
                      <p className="text-foreground text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                aria-label="What you handle"
                className="hairline pt-7 sm:pt-8 md:pt-10 px-1 sm:px-2 h-full"
              >
                <div className="flex items-baseline justify-between gap-2 flex-wrap mb-8">
                  <p className="eyebrow opacity-65">YOU HANDLE</p>
                  <span className="eyebrow tabular-nums opacity-60">
                    {String(YOU_HANDLE.length).padStart(2, "0")} ITEMS
                  </span>
                </div>
                <div className="space-y-2.5" role="list">
                  {YOU_HANDLE.map((item, i) => (
                    <div
                      key={i}
                      role="listitem"
                      className="flex items-start gap-3 py-2"
                    >
                      <Minus className="h-3.5 w-3.5 text-muted-foreground/40 mt-1 flex-shrink-0" aria-hidden />
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

      {/* FAQ — shared module, single source of truth */}
      <MiniFaq items={FAQS_SERVICES} background="background" />

      <QuoteCloserCard background="secondary" />

      <Footer />
    </main>
  );
};

export default Services;
