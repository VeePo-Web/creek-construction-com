import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Hero from "@/components/Hero";
import RitualIdentity from "@/components/RitualIdentity";
import ImageDivider from "@/components/ImageDivider";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import LifeAfterFirstHeat from "@/components/LifeAfterFirstHeat";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import cedarTexture from "@/assets/cedar-texture-premium.jpg";
import saunaStonesSteam from "@/assets/sauna-stones-premium.jpg";
import saunaWinterSteam from "@/assets/sauna-winter-steam.jpg";

const Index = () => {
  useDocumentTitle("Traditional Heat. Outdoor-Only. Installed Turnkey.", "Alberta-built outdoor cedar saunas with traditional electric heat. Delivered and installed turnkey. Starting at ~$8,000.");

  return (
    <main className="min-h-screen" aria-label="B&P Sauna — Alberta-built outdoor cedar saunas">
      {/* Skip to content — WCAG 2.1 bypass block */}
      <a
        href="#section-truth"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <LocalBusinessJsonLd />
      <Navigation transparent />
      <Hero />
      <RitualIdentity />
      <ImageDivider image={cedarTexture} alt="Cedar wood grain close-up with warm light" caption="Western Red Cedar — Alberta Standard" index={0} total={3} />
      <Services />
      <About />
      <ImageDivider image={saunaStonesSteam} alt="Water droplets on hot volcanic sauna stones with steam rising in warm amber light" caption="Löyly — The Steam Ritual" index={1} total={3} />
      <Testimonials />
      <Portfolio />
      <ImageDivider image={saunaWinterSteam} alt="Cedar barrel sauna glowing in Alberta winter twilight with steam rising" caption="Winter Ready — Built for −40°C" index={2} total={3} />
      <LifeAfterFirstHeat />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;