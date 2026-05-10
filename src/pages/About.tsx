import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CONTACT } from "@/config/contact";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { BODY } from "@/lib/typography";
import { CREEK_PROCESS as STEPS } from "@/config/process";

const About = () => {
  useDocumentTitle(
    "About",
    "Creek Construction — locally owned residential exterior contractor serving Calgary, Edmonton, and surrounding Alberta.",
  );

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-background" aria-label="About — Creek Construction">
      <SkipToContent target="section-story" />
      <Navigation />


      <PageHero
        variant="evergreen-typographic"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
        
        sectionLabel="Our Story"
        title={["Built on the", "work itself."]}
        subtitle="Calgary and Edmonton. The crew you meet is the crew on-site."
        ambientClipQuery={{ kind: "video", min_quality: "portfolio" }}
        triptychQueries={[
          { shot_type: ["process", "detail"], min_quality: "reference", kind: "image" },
          { shot_type: ["detail", "interior"], min_quality: "reference", kind: "image" },
          { shot_type: ["wide", "elevation", "hero"], min_quality: "reference", kind: "image" },
        ]}
      >
        <CedarCTA />
      </PageHero>

      <section id="section-story" className={`${SECTION_PADDING.default}`} aria-labelledby="story-heading">
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="WHO WE ARE"
              headingId="story-heading"
              heading="A small crew that takes the work seriously."
              align="center"
            />
            <div className="space-y-6 mt-10 max-w-[62ch] mx-auto text-center">
              <p className={BODY.lead}>
                Creek Construction is a locally owned, residential-exterior contractor working
                across the Calgary and Edmonton metros. We build decks, fences, sheds, pergolas —
                and we paint, side, and repair the parts of your home that face the weather.
              </p>
              <p className={BODY.lead}>
                We don’t subcontract the build. The crew you meet at the quote is the crew on-site
                doing the work.
              </p>
              <p className="font-serif italic text-xl md:text-2xl text-foreground/85 text-balance mt-6 pt-8 hairline">
                “We don’t subcontract, and that decides everything else.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="section-process" className={`${SECTION_PADDING.default} bg-secondary`} aria-labelledby="process-heading">
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="HOW WE WORK"
              headingId="process-heading"
              heading="The Creek Process."
              subheading="Five steps. Nothing surprising along the way."
              align="center"
            />

            <div className="mt-12 max-w-[62ch] mx-auto" role="list">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  role="listitem"
                  className={`group relative flex items-start gap-4 sm:gap-5 pl-4 sm:pl-5 py-5 sm:py-6 transition-colors duration-300 ${i === 0 ? "border-t border-cedar/12" : ""} border-b border-cedar/12`}
                >
                  <span aria-hidden className="absolute left-0 top-4 bottom-4 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]" />
                  <span className="font-mono text-[11px] tracking-[0.22em] text-cedar/55 tabular-nums mt-1.5 w-7 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-base font-medium text-foreground mb-1.5">{s.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="section-areas" className={`${SECTION_PADDING.default}`} aria-labelledby="areas-heading">
        <div className="container mx-auto px-5 sm:px-6">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              label="WHERE WE WORK"
              headingId="areas-heading"
              heading="Calgary, Edmonton, and the towns in between."
              align="center"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 mt-10">
              {CONTACT.cities.map((city) => (
                <span
                  key={city}
                  className="eyebrow text-muted-foreground/75 border border-cedar/15 rounded-[2px] px-3 py-2.5 inline-flex items-center justify-center min-h-[44px] hover:text-foreground hover:border-cedar/30 transition-colors duration-300"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 text-center max-w-[48ch] mx-auto mt-8">
              Not on the list? Ask anyway — we’ll let you know if we can travel.
            </p>
          </div>
        </div>
      </section>

      <QuoteCloserCard background="secondary" />

      <Footer />
    </main>
  );
};

export default About;
