import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
// ProgressiveImage removed — native img used for 404 hero LCP
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import steamFog from "@/assets/404-steam-fog.jpg";

const NotFound = () => {
  const location = useLocation();
  const imgRef = useRef<HTMLImageElement>(null);
  useDocumentTitle("Page Not Found", "The page you're looking for doesn't exist. Find your way back to B&P Sauna.");

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("[404]", location.pathname);
    }
  }, [location.pathname]);

  // Subtle Ken Burns drift on the background
  useEffect(() => {
    const img = imgRef.current;
    if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    img.style.willChange = "transform";
    img.style.animation = "hero-drift 30s ease-in-out infinite";
    return () => {
      if (img) {
        img.style.willChange = "auto";
        img.style.animation = "";
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-background" aria-label="Page not found — B&P Sauna">
      <a href="#not-found-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg">Skip to content</a>
      <Navigation is404 />

      {/* Cinematic full-viewport hero for 404 */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden grain-overlay" aria-labelledby="not-found-heading">
        {/* Background image with drift */}
        <div ref={imgRef} className="absolute inset-0 scale-[1.15]">
          <img
            src={steamFog}
            alt=""
            aria-hidden="true"
            width="1920"
            height="1280"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
        {/* Dark cinematic overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(20 10% 4% / 0.7) 0%, hsl(20 10% 4% / 0.5) 40%, hsl(20 10% 4% / 0.4) 60%, hsl(20 10% 4% / 0.75) 100%)",
          }}
        />
        {/* Radial edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, hsl(20 10% 4% / 0.5) 100%)",
          }}
        />

        <div id="not-found-content" role="alert" aria-live="polite" className="relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Provenance line */}
          <ScrollRevealMotion>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-white/15" />
              <span className="text-[11px] tracking-[0.25em] text-white/30 font-light tabular-nums">404</span>
              <div className="w-8 h-px bg-cedar/30" />
              <span className="text-minimal text-white/30">LOST IN THE STEAM</span>
              <div className="w-12 h-px bg-white/15" />
            </div>
          </ScrollRevealMotion>

          {/* Thermal crescendo accent — three rising embers */}
          <ScrollRevealMotion delay={0.05}>
            <div className="flex items-center justify-center gap-3 mb-8">
              {[0.15, 0.35, 0.6].map((opacity, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: `hsl(28 50% 52% / ${opacity})` }}
                />
              ))}
            </div>
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.1}>
            <h1
              id="not-found-heading"
              className="text-display text-white mb-8"
              style={{ fontWeight: 300, letterSpacing: "-0.015em" }}
            >
              <span
                className="block"
                style={{
                  clipPath: "inset(100% 0 0 0)",
                  animation: "clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
                }}
              >
                Nothing Here
              </span>
            </h1>
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.2}>
            <p className="text-lg text-white/50 italic font-serif mb-4">
              The path you followed leads nowhere — but the warmth is close.
            </p>
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.25}>
            <p className="text-white/35 mb-12 max-w-md mx-auto text-sm leading-relaxed">
              This page doesn\u2019t exist. Let\u2019s get you back on track.
            </p>
          </ScrollRevealMotion>

          {/* Cedar divider */}
          <ScrollRevealMotion delay={0.3}>
            <div className="divider-line mx-auto mb-12" />
          </ScrollRevealMotion>

          <ScrollRevealMotion delay={0.35}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6" role="navigation" aria-label="Recovery navigation">
              <CedarCTA to="/">BACK TO HOME</CedarCTA>
              <CedarCTA to="/resources" variant="secondary">BROWSE RESOURCES</CedarCTA>
            </div>
          </ScrollRevealMotion>

          {/* Signature */}
          <ScrollRevealMotion delay={0.4}>
            <div className="mt-20">
              <p className="text-sm font-serif italic text-white/20">
                — B&P Sauna · Alberta-built cedar saunas
              </p>
            </div>
          </ScrollRevealMotion>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotFound;
