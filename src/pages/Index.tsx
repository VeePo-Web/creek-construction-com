import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProjects from "@/components/FeaturedProjects";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import CrewMoment from "@/components/CrewMoment";
import TestimonialStrip from "@/components/TestimonialStrip";
import MiniFaq from "@/components/MiniFaq";
import InlineQuoteSection from "@/components/InlineQuoteSection";

/**
 * Homepage rhythm (Pass 10 — minimalism audit):
 *   Hero → InlineQuote → Services → CrewMoment → Featured → Testimonials → MiniFaq → Closer
 * One mid-page form anchor (InlineQuote), one terminal CTA (Closer). Supporting strips carry no CTA.
 */
const Index = () => {
  useDocumentTitle(
    "Excellence in the Work",
    "Creek Construction — WCB-covered, fully insured exterior contractor in Calgary, Edmonton & Alberta. Decks, fencing, sheds, painting & siding. Free written quotes.",
  );

  return (
    <main
      className="min-h-screen"
      aria-label="Creek Construction — residential exterior construction in Alberta"
    >
      <SkipToContent target="section-services" />
      <LocalBusinessJsonLd />
      <Navigation />

      <Hero />
      <InlineQuoteSection background="secondary" />
      <Services />
      <CrewMoment background="secondary" />
      <FeaturedProjects background="background" />
      <TestimonialStrip background="secondary" />
      <MiniFaq background="background" />
      <QuoteCloserCard id="section-contact" background="secondary" />
      <Footer />
    </main>
  );
};

export default Index;
