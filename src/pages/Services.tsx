import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import MiniFaq from "@/components/MiniFaq";
import EditorialImageBreak from "@/components/media/EditorialImageBreak";
import { Check, Minus, ArrowUpRight } from "lucide-react";
import { HEADLINE } from "@/lib/typography";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { FAQS_SERVICES } from "@/config/faqs";
import saunaStonesPremium from "@/assets/sauna-stones-premium.jpg";
import heroArchitecture from "@/assets/hero-architecture.jpg";
import cedarTexturePremium from "@/assets/cedar-texture-premium.jpg";

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

      {/* Catalogue — single flat list of every service we offer */}
      <section
        id="section-catalogue"
        className={`${SECTION_PADDING.default} min-h-[100svh] flex flex-col justify-center`}
        aria-labelledby="all-services-heading"
      >
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <div className="max-w-3xl">
              <SectionHeader
                headingId="all-services-heading"
                heading="Everything we build."
              />
            </div>

            <ul role="list" className="mt-14 md:mt-16">
              {SERVICES.map((service) => {
                return (
                  <li key={service.id} role="listitem" className="hairline">
                    <button
                      type="button"
                      onClick={() => openModal([service.id])}
                      aria-label={`Get my free quote for ${service.title}`}
                      className="group relative w-full text-left grid grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-2 items-baseline py-6 md:py-7 pl-3 md:pl-5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px]"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-3 bottom-3 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]"
                      />
                      <h3 className="col-span-12 md:col-span-6 font-serif text-xl md:text-2xl text-foreground tracking-[-0.02em] leading-[1.2]">
                        <span className="link-underline group-hover:[background-size:100%_1px]">
                          {service.title}
                        </span>
                      </h3>
                      <p className="col-span-12 md:col-span-5 text-sm text-muted-foreground/85 leading-relaxed text-pretty">
                        {service.description}
                      </p>
                      <span
                        aria-hidden
                        className="hidden md:flex md:col-span-1 md:items-center md:justify-end text-cedar/45 group-hover:text-cedar transition-colors"
                      >
                        <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <EditorialImageBreak
        src={saunaStonesPremium}
        alt="Stone surface detail with steam and warm light — material craft."
        intensity="calm"
      />

      {/* Responsibility matrix */}
      <section
        id="section-contract"
        className={`${SECTION_PADDING.default} bg-secondary min-h-[100svh] flex flex-col justify-center`}
        aria-labelledby="contract-heading"
      >
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              headingId="contract-heading"
              heading="What we handle. What you handle."
              align="center"
            />

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <figure className="lg:col-span-4 aspect-[16/9] lg:aspect-[4/5] w-full overflow-hidden">
                <img
                  src={cedarTexturePremium}
                  alt="Macro of cedar grain — the material we work in every day."
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-full object-cover"
                  width={1200}
                  height={1500}
                />
              </figure>

              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6 lg:gap-8">
                <div
                  aria-label="What we handle"
                  className="hairline pt-7 sm:pt-8 md:pt-10 px-1 sm:px-2 h-full"
                >
                  <div className="mb-8">
                    <p className="eyebrow">WE HANDLE</p>
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
                  <div className="mb-8">
                    <p className="eyebrow opacity-65">YOU HANDLE</p>
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
        </div>
      </section>

      {/* FAQ — shared module, single source of truth */}
      <MiniFaq items={FAQS_SERVICES} background="background" />

      <EditorialImageBreak
        src={heroArchitecture}
        alt="Architectural exterior elevation with horizontal cedar cladding."
        aspect="16/9"
        intensity="calm"
      />

      <QuoteCloserCard background="secondary" />

      <Footer />
    </main>
  );
};

export default Services;
