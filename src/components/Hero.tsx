import { useEffect, useRef, useState, useMemo } from "react";
import CedarCTA from "@/components/CedarCTA";
import heroImage from "@/assets/hero-sauna-premium.jpg";

const PARTICLE_COUNT = 6;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    top: `${20 + Math.random() * 60}%`,
    size: `${2 + Math.random() * 3}px`,
    opacity: 0.06 + Math.random() * 0.12,
    duration: `${6 + Math.random() * 6}s`,
    delay: `${Math.random() * 4}s`,
    travel: `${-(40 + Math.random() * 80)}px`,
    drift: `${(Math.random() - 0.5) * 40}px`,
  }));
}

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);
  const particles = useMemo(() => generateParticles(), []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    img.style.willChange = "transform";

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxTravel = window.innerHeight * 0.3;
          const offset = Math.min(scrollY * 0.3, maxTravel);
          img.style.transform = `translateY(${offset}px) scale(1.15)`;
          setScrollIndicatorVisible(scrollY < 80);
          const content = contentRef.current;
          if (content) {
            const progress = Math.min(scrollY / (window.innerHeight * 0.6), 1);
            content.style.opacity = `${1 - progress}`;
            content.style.transform = `translateY(${-scrollY * 0.12}px)`;
          }
          if (overlayRef.current) {
            const overlayProgress = Math.min(scrollY / window.innerHeight, 1);
            overlayRef.current.style.opacity = `${overlayProgress * 0.45}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          if (contentRef.current) contentRef.current.style.willChange = "opacity, transform";
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          img.style.willChange = "auto";
          if (contentRef.current) contentRef.current.style.willChange = "auto";
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (img) img.style.willChange = 'auto';
      if (contentRef.current) contentRef.current.style.willChange = 'auto';
    };
  }, []);

  return (
    <section ref={sectionRef} id="section-hero" className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Hero — Traditional Heat, Outdoor-Only, Installed Turnkey" style={{ contain: 'layout style paint' }}>
      <img
        ref={imgRef}
        src={heroImage}
        alt="Premium cedar outdoor sauna glowing with warm amber light in snowy Alberta winter landscape at blue hour with steam rising"
        width="1920"
        height="1080"
        className="absolute inset-0 w-full h-full object-cover hero-drift-active hero-image-entrance"
        fetchPriority="high"
        decoding="sync"
        sizes="100vw"
        style={{ animation: 'hero-drift 25s ease-in-out infinite' }}
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, hsl(20 10% 8% / 0.7) 0%, hsl(20 10% 8% / 0.35) 40%, hsl(20 10% 8% / 0.6) 100%)',
      }} />
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0, backgroundColor: 'hsl(20 10% 8%)' }}
      />

      {/* Atmospheric particles — floating embers/steam */}
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              top: p.top,
              '--particle-size': p.size,
              '--particle-opacity': p.opacity,
              '--particle-duration': p.duration,
              '--particle-delay': p.delay,
              '--particle-travel': p.travel,
              '--particle-drift': p.drift,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div ref={contentRef} className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Editorial provenance line */}
        <div className="flex items-center justify-center gap-3 mb-10 opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
          <div className="w-8 h-px bg-white/20" />
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-light">Alberta · Est. 2024</span>
          <div className="w-8 h-px bg-white/20" />
        </div>

        <h1 className="text-display-shimmer text-white mb-10" style={{ fontWeight: 300, letterSpacing: '-0.015em' }}>
          <span className="block" style={{ clipPath: 'inset(100% 0 0 0)', animation: 'clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' }}>
            Traditional Heat.
          </span>
          <span className="block" style={{ clipPath: 'inset(100% 0 0 0)', animation: 'clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' }}>
            Outdoor-Only.
          </span>
          <span className="block" style={{ clipPath: 'inset(100% 0 0 0)', animation: 'clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards', fontSize: '1.05em' }}>
            Installed Turnkey.
          </span>
        </h1>
        <p className="text-subhead text-white/75 font-light max-w-2xl mx-auto mb-10 opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_1.1s_forwards]">
          Alberta-built cedar saunas — delivered and installed so your ritual starts immediately.
        </p>
        <div className="divider-line mx-auto mb-12 opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_1.3s_forwards]" />
        <div className="opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_1.5s_forwards]">
          <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
        </div>
      </div>
      
      {/* Scroll indicator — fades out as user scrolls */}
      <div
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-700 ${scrollIndicatorVisible ? 'opacity-0 animate-[reveal_1.2s_cubic-bezier(0.16,1,0.3,1)_1.8s_forwards]' : 'opacity-0'}`}
        style={{ opacity: isVisible ? undefined : 0, pointerEvents: 'none' }}
        role="presentation"
        aria-hidden="true"
      >
        <span className="text-[9px] tracking-[0.3em] text-white/25 uppercase">Explore</span>
        <div className="scroll-indicator" />
      </div>
      
      {/* Bottom cedar gradient transition — triple layer for cinematic depth */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(28 50% 52% / 0.03) 30%, hsl(28 50% 52% / 0.08) 60%, hsl(var(--background) / 0.4) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, hsl(28 50% 52% / 0.15) 30%, hsl(28 50% 52% / 0.25) 50%, hsl(28 50% 52% / 0.15) 70%, transparent 90%)',
        }}
      />
    </section>
  );
};

export default Hero;