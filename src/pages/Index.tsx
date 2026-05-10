import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HomeGalleryStrip from "@/components/HomeGalleryStrip";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import CrewMoment from "@/components/CrewMoment";
import TestimonialStrip from "@/components/TestimonialStrip";
import BrandStatement from "@/components/BrandStatement";
import EditorialImageBreak from "@/components/media/EditorialImageBreak";
import saunaBackyardPremium from "@/assets/sauna-backyard-premium.jpg";
import saunaMountainPremium from "@/assets/sauna-mountain-premium.jpg";

/**
 * Homepage rhythm (Pass 31 — Apple-grade calm):
 *   Hero → BrandStatement → Services → Featured → Crew → Testimonials → Closer
 * MiniFaq lives on /services to keep the homepage scan uncluttered.
 */
const Index = () => {
  useDocumentTitle(
    "Excellence in the Work",
    "Creek Construction — WCB-covered, fully insured exterior contractor in Calgary, Edmonton & Alberta. Decks, fencing, sheds, painting & siding. Free written quotes.",
  );

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-background"
      aria-label="Creek Construction — residential exterior construction in Alberta"
    >
      <SkipToContent target="section-services" />
      <LocalBusinessJsonLd />
      <Navigation />

      <Hero />
      <BrandStatement />
      <EditorialImageBreak
        src={saunaBackyardPremium}
        alt="Cedar exterior at golden hour with warm interior light spilling onto the deck."
        intensity="cinematic"
      />
      <Services />
      <HomeGalleryStrip background="secondary" />
      <CrewMoment background="background" topRule />
      <TestimonialStrip background="secondary" />
      <EditorialImageBreak
        src={saunaMountainPremium}
        alt="Cedar building set against an Alberta mountain horizon at dusk."
        intensity="calm"
      />
      <QuoteCloserCard id="section-contact" background="background" />
      <Footer />
    </main>
  );
};

export default Index;
