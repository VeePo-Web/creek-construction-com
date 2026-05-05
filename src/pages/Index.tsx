import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/ui/skip-to-content";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import CrewMoment from "@/components/CrewMoment";
import TestimonialStrip from "@/components/TestimonialStrip";
import MiniFaq from "@/components/MiniFaq";

/**
 * Homepage rhythm (Pass 7 — funnel discipline):
 *
 *   Hero → ProofBand → Services → CrewMoment → About →
 *   FeaturedProjects → TestimonialStrip → MiniFaq → Contact → Footer
 *
 * Every scroll milestone resolves to a CedarCTA. Same rhythm reused
 * across every public page.
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
      <About />
      <FeaturedProjects />
      <TestimonialStrip />
      <MiniFaq background="secondary" />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
