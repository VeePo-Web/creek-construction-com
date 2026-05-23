import { Link, useParams } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceCatalogJsonLd } from "@/components/JsonLd";
import { AREA_HUB, AREA_PAGES, CITY_AREAS, METRO_AREAS, areaPath, getAreaPage } from "@/config/areas";
import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { BODY, HEADLINE } from "@/lib/typography";

const makeFaqs = (name: string) => [
  {
    q: `Does Creek Construction serve ${name}?`,
    a: `Yes. Creek Construction serves ${name} for residential exterior projects including decks, fences, siding, painting, sheds, roofing, landscaping, and related outdoor work.`,
  },
  {
    q: `Can I get a written quote in ${name}?`,
    a: `Yes. Creek Construction provides written quotes so homeowners in ${name} can compare scope, materials, timing, and price before work begins.`,
  },
  {
    q: `What exterior projects do you handle in ${name}?`,
    a: `Creek Construction handles decks, fences, siding, exterior painting, sheds, roof repairs, new roof builds, landscaping, walkways, and other residential exterior projects in ${name}.`,
  },
];

const AreasWeServe = () => {
  const { slug } = useParams();
  const page = getAreaPage(slug);
  const { openModal } = useQuoteModal();

  useDocumentTitle(
    page?.title ?? "Area Not Found",
    page?.description ?? "That Creek Construction service area page does not exist.",
    page
      ? { path: areaPath(page.slug) }
      : { path: `/areas-we-serve/${slug ?? ""}`, noindex: true },
  );

  if (!page) {
    return (
      <main id="main-content" className="min-h-screen bg-background">
        <Navigation />
        <section className={`${SECTION_PADDING.default} min-h-[70svh] flex items-center`}>
          <div className="container-page">
            <div className={`${MAX_WIDTH.content} mx-auto`}>
              <h1 className={HEADLINE.section}>Area not found.</h1>
              <p className={`${BODY.lead} mt-6`}>
                That service area page is not available. Return to the full service area list.
              </p>
              <div className="mt-8">
                <CedarCTA to="/areas-we-serve">View areas we serve</CedarCTA>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const faqs = makeFaqs(page.name);
  const breadcrumbItems = [
    { name: "Home", url: `${CONTACT.siteUrl}/` },
    { name: "Areas We Serve", url: `${CONTACT.siteUrl}/areas-we-serve` },
    ...(page.slug ? [{ name: page.name, url: `${CONTACT.siteUrl}${areaPath(page.slug)}` }] : []),
  ];

  const linkedCities = page.kind === "metro"
    ? CITY_AREAS.filter((city) => page.cities?.includes(city.name))
    : CITY_AREAS;

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-background"
      aria-label={`${page.name} service area — Creek Construction`}
    >
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceCatalogJsonLd />
      <FaqJsonLd items={faqs} />
      <Navigation />

      <section className={`${SECTION_PADDING.calm} min-h-[80svh] flex flex-col justify-center`} aria-labelledby="areas-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.wide} mx-auto grid lg:grid-cols-[7fr_5fr] gap-12 lg:gap-16 items-end`}>
            <div>
              <p className="eyebrow mb-5">AREAS WE SERVE</p>
              <h1 id="areas-heading" className={`${HEADLINE.hero} leading-[1.02] max-w-[12ch]`}>
                {page.h1}
              </h1>
            </div>
            <div>
              <p className={BODY.lead}>{page.intro}</p>
              <div className="mt-8">
                <CedarCTA />
              </div>
            </div>
          </div>
        </div>
      </section>

      {page.kind === "hub" && (
        <section className={`${SECTION_PADDING.default} bg-secondary`} aria-labelledby="metro-heading">
          <div className="container-page">
            <div className={`${MAX_WIDTH.wide} mx-auto`}>
              <h2 id="metro-heading" className={HEADLINE.section}>Three service regions.</h2>
              <div className="mt-12 grid md:grid-cols-3 gap-8">
                {METRO_AREAS.map((metro) => (
                  <Link
                    key={metro.slug}
                    to={areaPath(metro.slug)}
                    className="group block hairline pt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
                  >
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-cedar transition-colors duration-300">
                      {metro.name}
                    </h3>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {metro.cities?.join(", ")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`${SECTION_PADDING.default} ${page.kind === "hub" ? "bg-background" : "bg-secondary"}`} aria-labelledby="services-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.wide} mx-auto grid lg:grid-cols-[4fr_8fr] gap-10 lg:gap-14`}>
            <div>
              <h2 id="services-heading" className={HEADLINE.section}>Services available here.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openModal([service.id])}
                  className="group text-left hairline pt-5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <span className="font-serif text-xl text-foreground group-hover:text-cedar transition-colors duration-300">
                    {service.title}
                  </span>
                  <span className="block mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION_PADDING.default} bg-background`} aria-labelledby="nearby-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.wide} mx-auto`}>
            <h2 id="nearby-heading" className={HEADLINE.section}>
              {page.kind === "city" ? "Nearby service areas." : "City pages."}
            </h2>
            <div className="mt-10 flex flex-wrap gap-2">
              {(page.kind === "city"
                ? CITY_AREAS.filter((city) => page.nearby?.includes(city.name))
                : linkedCities
              ).map((city) => (
                <Link
                  key={city.slug}
                  to={areaPath(city.slug)}
                  className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-cedar/15 text-sm text-foreground/80 hover:text-cedar hover:border-cedar/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                >
                  {city.name}
                </Link>
              ))}
              {page.kind !== "hub" && (
                <Link
                  to={areaPath(AREA_HUB.slug)}
                  className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-cedar/15 text-sm text-foreground/80 hover:text-cedar hover:border-cedar/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                >
                  All service areas
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION_PADDING.default} bg-secondary`} aria-labelledby="area-faq-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <h2 id="area-faq-heading" className={HEADLINE.section}>Service area questions.</h2>
            <div className="mt-10 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q} className="hairline pt-6">
                  <h3 className="font-serif text-2xl text-foreground">{faq.q}</h3>
                  <p className={`${BODY.default} mt-3`}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteCloserCard background="background" />
      <Footer />
    </main>
  );
};

export default AreasWeServe;
