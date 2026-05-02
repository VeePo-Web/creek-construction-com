import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import EditorialBleedSection from "@/components/media/EditorialBleedSection";

/**
 * Homepage rhythm:
 *
 *   Hero → Bleed → Services → About → FeaturedProjects → Contact (closer) → Footer
 *
 * The hero now owns ALL trust signals (stats + chips) in a single combined
 * post-hero band. The previous standalone <TrustStrip /> was deleted — three
 * trust bands collapsed to one. Every page closes with the same shared
 * <QuoteCloserCard /> evergreen plate via <Contact />.
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
      <a
        href="#section-services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <LocalBusinessJsonLd />
      <Navigation />

      <Hero />

      {/* One editorial bleed between hero proof-band and services. Discipline:
          never two bleeds in a row. Falls back to a quiet evergreen plate so
          the slot always anchors visually even before media is approved. */}
      <EditorialBleedSection
        query={{
          shot_type: ["hero", "wide"],
          min_quality: "hero",
          kind: "image",
        }}
        location="Calgary · Edmonton · Alberta"
        year={new Date().getFullYear()}
        subject="Recent work"
        hideIfEmpty={false}
      />

      <Services />
      <About />

      {/* Featured projects gallery — pulls from the `projects` table.
          Renders nothing until at least 3 featured projects exist. */}
      <FeaturedProjects />

      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
