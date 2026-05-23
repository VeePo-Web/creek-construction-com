import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import Footer from "@/components/Footer";
import CedarCTA from "@/components/CedarCTA";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import PageHero from "@/components/ui/page-hero";
import GalleryWall from "@/components/GalleryWall";
import TestimonialStrip from "@/components/TestimonialStrip";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SECTION_PADDING, MAX_WIDTH } from "@/lib/spacing";
import { SEO_ROUTES } from "@/config/seo";

const Work = () => {
  useDocumentTitle(
    SEO_ROUTES.work.title,
    SEO_ROUTES.work.description,
    { path: SEO_ROUTES.work.path },
  );

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-background"
      aria-label="Gallery — Creek Construction"
    >
      <SkipToContent target="section-gallery" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://creekconstruction.ca/" },
          { name: "Work", url: "https://creekconstruction.ca/work" },
        ]}
      />
      <Navigation />

      <PageHero
        variant="cinematic-bleed"
        title={["The work."]}
        query={{ shot_type: ["hero", "elevation", "wide"], min_quality: "reference", kind: "image" }}
        videoQuery={{ kind: "video", min_quality: "portfolio" }}
        height="78vh"
        minHeight="600px"
      >
        <CedarCTA />
      </PageHero>

      <section
        id="section-gallery"
        className={`${SECTION_PADDING.default} min-h-[100svh] flex flex-col justify-center`}
        aria-label="Photography wall"
      >
        <div className="container-page">
          <div className={`${MAX_WIDTH.wide} mx-auto`}>
            <GalleryWall priorityCount={6} />
          </div>
        </div>
      </section>

      <TestimonialStrip background="secondary" />

      <QuoteCloserCard background="background" />

      <Footer />
    </main>
  );
};

export default Work;
