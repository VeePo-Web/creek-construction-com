import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

const Index = () => {
  useDocumentTitle(
    "Excellence in the Work",
    "Creek Construction — residential exterior construction across Calgary, Edmonton, and surrounding Alberta. Decks, fencing, sheds, painting, siding. Free quotes.",
  );

  return (
    <main className="min-h-screen" aria-label="Creek Construction — residential exterior construction in Alberta">
      <a
        href="#section-services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <LocalBusinessJsonLd />
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Portfolio />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
