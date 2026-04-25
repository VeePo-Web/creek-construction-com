import { useEffect, useRef } from "react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import CedarCTA from "@/components/CedarCTA";
import saunaWinterSteam from "@/assets/sauna-winter-steam.jpg";

const LifeAfterFirstHeat = () => {
  const bgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const img = bgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const vh = window.innerHeight;
          if (rect.bottom > 0 && rect.top < vh) {
            const progress = (vh - rect.top) / (vh + rect.height);
            const offset = (progress - 0.5) * 30;
            img.style.transform = `scale(1.12) translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.style.willChange = 'transform';
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          img.style.willChange = 'auto';
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (img) img.style.willChange = 'auto';
    };
  }, []);

  const vignettes = [
    {
      time: "Tuesday evening,",
      temp: " −15°C.",
      scene: "You step outside. The cedar door closes behind you. The heater stones are ready. The day turns off.",
    },
    {
      time: "Saturday morning,",
      temp: " fresh snow.",
      scene: "Coffee first. Then heat. The routine doesn't require motivation — it's right there, waiting.",
    },
    {
      time: "Sunday with friends.",
      temp: "",
      scene: "Someone says: \u201CI need one of these.\u201D You smile. You knew they would.",
    },
  ];

  return (
    <section ref={containerRef} id="section-vignettes" className="py-32 md:py-40 relative overflow-hidden grain-overlay section-bleed-top" aria-labelledby="vignettes-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
      {/* Cinematic background — faint sauna glow with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src={saunaWinterSteam}
          alt=""
          role="presentation"
          aria-hidden="true"
          width="1920"
          height="1280"
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.12)' }}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--secondary) / 0.92) 0%, hsl(var(--secondary) / 0.88) 40%, hsl(var(--secondary) / 0.94) 100%)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(20 10% 8% / 0.08) 100%)',
        }} />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-cedar/40 z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            numeral="VI"
            label="AFTER FIRST HEAT"
            headingId="vignettes-heading"
            cedarLabel
            heading="What Life Looks Like After First Heat"
            subheading="Not a product. A turning point."
          />
          
          <ScrollRevealMotion delay={0.2}>
            <div className="flex items-center gap-3 mb-10 mt-12">
              <div className="w-12 h-px bg-cedar/15" />
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground/50 uppercase">03 Moments</span>
            </div>
          </ScrollRevealMotion>

          {/* CSS-only sibling dimming via group/vignettes */}
          <div className="space-y-4 mb-20 group/vignettes" role="list">
            {vignettes.map((v, i) => (
              <ScrollRevealMotion key={i} delay={0.3 + i * 0.15}>
                <div
                  role="listitem"
                  className="flex items-start space-x-6 pl-6 py-6 -ml-px cursor-default rounded-sm group/vignette transition-all duration-500 ease-smooth group-hover/vignettes:opacity-60 group-hover/vignettes:scale-[0.98] hover:!opacity-100 hover:!scale-100 hover:bg-accent/5 hover:pl-8 hover:shadow-elevated grain-texture shadow-contact border border-border/40"
                  style={{
                    borderLeft: `2px solid hsl(28 50% 52% / ${[0.15, 0.4, 0.8][i]})`,
                  }}
                >
                  <span className="text-2xl md:text-3xl font-serif text-cedar/15 leading-none select-none mt-1 transition-colors duration-500 group-hover/vignette:text-cedar/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-lg mb-2 transition-colors duration-500 group-hover/vignette:text-cedar">
                      {v.time}{v.temp && <span className="text-cedar/80 group-hover/vignette:text-cedar">{v.temp}</span>}
                    </p>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">{v.scene}</p>
                  </div>
                </div>
              </ScrollRevealMotion>
            ))}
          </div>

          {/* Editorial pull-quote — warm panel treatment with hover warmth */}
          <ScrollRevealMotion delay={0.2}>
            <div
              className="relative px-10 md:px-14 py-12 mb-16 rounded-sm group/quote transition-all duration-700 hover:shadow-elegant"
              style={{
                background: 'linear-gradient(135deg, hsl(28 50% 52% / 0.04) 0%, hsl(28 50% 52% / 0.02) 50%, transparent 100%)',
                borderLeft: '2px solid hsl(28 50% 52% / 0.25)',
                marginLeft: '-0.15em',
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-700 pointer-events-none rounded-sm"
                style={{ background: 'linear-gradient(135deg, hsl(28 50% 52% / 0.03) 0%, transparent 60%)' }}
              />
              <div className="absolute top-6 left-6 md:left-10 quote-mark-float transition-all duration-700 group-hover/quote:text-cedar/25 group-hover/quote:scale-105" aria-hidden="true" style={{ transformOrigin: 'top left' }}>{"\u201C"}</div>
              <p className="text-2xl md:text-3xl text-foreground text-architectural leading-snug pt-8 relative z-10">
                Not an occasional novelty.
              </p>
              <p className="text-2xl md:text-3xl text-cedar text-architectural leading-snug mt-2 relative z-10 transition-all duration-500 group-hover/quote:drop-shadow-[0_0_8px_hsl(28_50%_52%/0.2)]">
                Your standard.
              </p>
              <div className="flex items-center gap-3 mt-8 relative z-10">
                <div className="w-8 h-px bg-cedar/20 transition-all duration-500 group-hover/quote:w-12 group-hover/quote:bg-cedar/35" />
                <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase transition-colors duration-500 group-hover/quote:text-cedar/40">The Daily Ritual</span>
              </div>
            </div>
          </ScrollRevealMotion>
          
          {/* CTA with editorial signature */}
          <ScrollRevealMotion delay={0.3}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground/40 uppercase min-h-[44px] flex items-center">
                Free consultation · No obligation
              </span>
            </div>
          </ScrollRevealMotion>

          {/* Closing editorial line */}
          <ScrollRevealMotion delay={0.4}>
            <div className="mt-20 pt-8 border-t border-border/20 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground/30 uppercase">The Ritual Continues</span>
              <div className="w-8 h-px bg-cedar/15" />
            </div>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default LifeAfterFirstHeat;
