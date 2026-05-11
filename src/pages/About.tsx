import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import SectionHeader from "@/components/SectionHeader";
import PageHero from "@/components/ui/page-hero";
import MediaSlot from "@/components/media/MediaSlot";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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

      <section id="section-story" className={`${SECTION_PADDING.default} min-h-[100svh] flex flex-col justify-center`} aria-labelledby="story-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
              headingId="story-heading"
              heading="A small crew that takes the work seriously."
              align="center"
            />

            <div className="grid lg:grid-cols-[6fr_5fr] gap-10 lg:gap-14 items-center mt-12">
              <div className="space-y-6">
                <p className={BODY.lead}>
                  Creek Construction is a locally owned, residential-exterior contractor working
                  across the Calgary and Edmonton metros. We build decks, fences, sheds, pergolas —
                  and we paint, side, and repair the parts of your home that face the weather.
                </p>
              </div>
              <figure className="relative aspect-[3/4] w-full overflow-hidden">
                <MediaSlot
                  query={{ shot_type: ["detail", "elevation"], min_quality: "reference", kind: "image" }}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  wrapperClassName="absolute inset-0"
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="section-process" className={`${SECTION_PADDING.default} bg-secondary min-h-[100svh] flex flex-col justify-center`} aria-labelledby="process-heading">
        <div className="container-page">
          <div className={`${MAX_WIDTH.content} mx-auto`}>
            <SectionHeader
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

      <QuoteCloserCard background="secondary" />

      <Footer />
    </main>
  );
};

export default About;
