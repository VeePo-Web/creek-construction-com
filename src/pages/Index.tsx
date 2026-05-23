import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HomeGalleryStrip from "@/components/HomeGalleryStrip";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd, OrganizationJsonLd, ServiceCatalogJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import CrewMoment from "@/components/CrewMoment";
import TestimonialStrip from "@/components/TestimonialStrip";
import BrandStatement from "@/components/BrandStatement";
import VideoShowcase from "@/components/VideoShowcase";
import { SEO_ROUTES } from "@/config/seo";

/**
 * Homepage rhythm:
 *   Hero → BrandStatement → Services → Gallery → Crew → Testimonials → Closer
 */
const Index = () => {
  useDocumentTitle(
    SEO_ROUTES.home.title,
    SEO_ROUTES.home.description,
    { path: SEO_ROUTES.home.path },
  );

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-background"
      aria-label="Creek Construction — residential exterior construction in Alberta"
    >
      <SkipToContent target="section-services" />
      <LocalBusinessJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ServiceCatalogJsonLd />
      <Navigation />

      <Hero />
      <BrandStatement />
      <Services />
      <HomeGalleryStrip background="secondary" />
      {/*
        VideoShowcase — drop your video into /public/videos/ then add:
          videoSrc="/videos/creek-build.mp4"
          videoSrcWebm="/videos/creek-build.webm"   (optional, better compression)
        Until a file is provided the section shows the poster + "coming soon" badge.
      */}
      <VideoShowcase
        heading="See how we build."
        caption="Cedar deck build · Edmonton, AB"
      />
      <CrewMoment background="background" topRule />
      <TestimonialStrip background="secondary" />
      <QuoteCloserCard id="section-contact" background="background" />
      <Footer />
    </main>
  );
};

export default Index;
