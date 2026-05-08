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

/**
 * Homepage rhythm (Pass 13 — funnel discipline):
 *   Hero → Services → CrewMoment → Featured → Testimonials → MiniFaq → Closer
 * One terminal CTA (Closer). Mid-page InlineQuote was removed: pasting an
 * 8-field form mid-homepage breaks the editorial scan and competes with
 * the closer. The full form lives on /contact.
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
      <Services />
      <CrewMoment background="background" topRule />
      <FeaturedProjects background="secondary" />
      <TestimonialStrip background="secondary" topRule />
      <MiniFaq background="background" topPad="generous" />
      <QuoteCloserCard id="section-contact" background="secondary" />
      <Footer />
    </main>
  );
};

export default Index;
