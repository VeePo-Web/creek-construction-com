import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFound = () => {
  const location = useLocation();
  useDocumentTitle("Page Not Found", "The page you’re looking for doesn’t exist. Find your way back to Creek Construction.");

  useEffect(() => {
    if (import.meta.env.DEV) console.warn("[404]", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-background flex flex-col" aria-label="Page not found — Creek Construction">
      <Navigation />

      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-evergreen text-evergreen-foreground py-32">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-12 h-px bg-evergreen-foreground/15" />
            <span className="text-[11px] tracking-[0.25em] text-evergreen-foreground/40 tabular-nums">404</span>
            <div className="w-8 h-px bg-cedar/40" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-evergreen-foreground/40">Off the map</span>
            <div className="w-12 h-px bg-evergreen-foreground/15" />
          </div>

          <h1 className="font-serif text-evergreen-foreground mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Nothing here.
          </h1>

          <p className="text-lg text-evergreen-foreground/60 italic font-serif mb-10">
            That page doesn’t exist — but the work does.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CedarCTA to="/">Back to Home</CedarCTA>
            <CedarCTA to="/services" variant="secondary">Browse Services</CedarCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotFound;
