import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import EditorialBleedSection from "@/components/media/EditorialBleedSection";

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
      <a
        href="#section-services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <LocalBusinessJsonLd />
      <Navigation />

      <Hero />

      {/* Slim trust band — sits directly under the hero, replaces the previous
          jarring section gradient with a calm full-width signal row. */}
      <TrustStrip />

      {/* One editorial bleed between trust and services. Discipline: never two
          bleeds in a row. Renders nothing if no hero/wide shot is approved. */}
      <EditorialBleedSection
        query={{
          shot_type: ["hero", "wide"],
          min_quality: "hero",
          kind: "image",
        }}
        location="Calgary · Edmonton · Alberta"
        year={new Date().getFullYear()}
        subject="Recent work"
      />

      <Services />
      <About />
      <Testimonials />

      {/* Featured projects gallery — pulls from the `projects` table.
          Renders nothing until at least 3 featured projects exist. */}
      <FeaturedProjects />

      <Portfolio />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
