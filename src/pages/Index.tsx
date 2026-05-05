import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import QuoteCloserCard from "@/components/QuoteCloserCard";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import CrewMoment from "@/components/CrewMoment";
import TestimonialStrip from "@/components/TestimonialStrip";
import MiniFaq from "@/components/MiniFaq";

/**
 * Homepage rhythm (Pass 8 — strict 2-tone alternation):
 *
 *   Hero(B/W) → Services(bg) → CrewMoment(secondary) → About(bg) →
 *   FeaturedProjects(secondary) → TestimonialStrip(bg) → MiniFaq(secondary) →
 *   QuoteCloserCard(bg, id="section-contact") → Footer
 *
 * Every adjacent pair contrasts. Every section resolves to a CedarCTA.
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
      <CrewMoment background="secondary" />
      <About background="background" />
      <FeaturedProjects background="secondary" />
      <TestimonialStrip background="background" />
      <MiniFaq background="secondary" />
      <QuoteCloserCard id="section-contact" background="background" />
      <Footer />
    </main>
  );
};

export default Index;
