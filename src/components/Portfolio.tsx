import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import SectionHeader from "@/components/SectionHeader";
import saunaBackyard from "@/assets/portfolio-backyard.jpg";
import saunaAcreage from "@/assets/portfolio-acreage.jpg";
import saunaMountain from "@/assets/portfolio-mountain.jpg";

function useScaleReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.add("reveal-scale-visible");
      return;
    }

    el.classList.add("reveal-scale-initial");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("reveal-scale-initial");
          el.classList.add("reveal-scale-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function useImageParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const viewportH = window.innerHeight;
          if (rect.bottom > 0 && rect.top < viewportH) {
            const progress = (viewportH - rect.top) / (viewportH + rect.height);
            const offset = (progress - 0.5) * 40;
            img.style.transform = `translateY(${offset}px) scale(1.08)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    img.style.willChange = 'transform';
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (img) img.style.willChange = 'auto';
    };
  }, []);

  return { containerRef, imgRef };
}

/* Shared overlay for portfolio images — cinematic vignette + cedar warmth */
const PortfolioOverlays = () => (
  <>
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(180deg, hsl(var(--foreground) / 0.08) 0%, transparent 30%, transparent 70%, hsl(var(--foreground) / 0.2) 100%), radial-gradient(ellipse at center, transparent 50%, hsl(20 10% 8% / 0.18) 100%)',
    }} />
    <div
      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      style={{ background: 'linear-gradient(180deg, transparent 40%, hsl(28 50% 52% / 0.1) 100%)' }}
    />
  </>
);

/* Shared hover info overlay for portfolio images */
const PortfolioHoverInfo = ({ project, index }: { project: { title: string; location: string; linkTo: string }; index: number }) => (
  <>
    <div className="absolute inset-0 flex items-end justify-between p-8 md:p-12 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-700">
      <div className="translate-y-4 group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-700">
        <p className="text-minimal text-white/70 mb-2">{project.location}</p>
        <h3 className="text-headline text-white">{project.title}</h3>
      </div>
      <Link
        to={project.linkTo}
        className="translate-y-4 group-hover:translate-y-0 focus-visible:translate-y-0 transition-all duration-700 delay-75 flex items-center gap-2 text-minimal text-white/70 hover:text-cedar border-b border-transparent hover:border-cedar/50 pb-0.5 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 rounded-sm min-h-[44px] min-w-[44px]"
        aria-label={`View details for ${project.title} — ${project.location}`}
      >
        <span>VIEW DETAILS</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
    <div className="absolute top-6 right-6 md:top-8 md:right-8 pointer-events-none">
      <span className="portfolio-number-overlay text-white/20 text-6xl md:text-8xl font-serif leading-none select-none group-hover:text-white/30 transition-all duration-700">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  </>
);

const Portfolio = () => {
  const project0Ref = useScaleReveal();
  const project1Ref = useScaleReveal();
  const project2Ref = useScaleReveal();
  const projectRefs = [project0Ref, project1Ref, project2Ref];

  const parallax0 = useImageParallax();
  const parallax1 = useImageParallax();
  const parallax2 = useImageParallax();
  const parallaxRefs = [parallax0, parallax1, parallax2];

  const projects = [
    {
      image: saunaBackyard,
      title: "BACKYARD RETREAT",
      location: "EDMONTON, AB",
      description: "A Signature 8×8 installed in a residential backyard — turnkey from delivery to first session in one day.",
      layout: "full" as const,
      linkTo: "/signature",
    },
    {
      image: saunaAcreage,
      title: "ACREAGE DESTINATION",
      location: "SHERWOOD PARK, AB",
      description: "Custom build on a rural lifestyle property. Designed for daily use with views across the acreage.",
      layout: "split" as const,
      linkTo: "/custom",
    },
    {
      image: saunaMountain,
      title: "MOUNTAIN CORRIDOR",
      location: "CANMORE, AB",
      description: "Winter-ready installation in the mountain corridor. Engineered for snow load, wind exposure, and elevation.",
      layout: "full" as const,
      linkTo: "/custom",
    }
  ];

  return (
    <section id="work" className="py-32 md:py-40 bg-muted relative grain-overlay section-bleed-top" aria-labelledby="portfolio-heading" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1200px' }}>
      <div
        className="absolute top-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, hsl(var(--secondary)) 0%, transparent 100%)' }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(20 10% 8% / 0.08) 100%)' }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <SectionHeader
              numeral="V"
              label="INSTALLED ACROSS ALBERTA"
              headingId="portfolio-heading"
              heading="Where They Land."
              subheading="Selected from our Alberta installations."
              badge={`${String(projects.length).padStart(2, '0')} Projects · 03 Regions`}
            />
          </div>
          
          <div className="space-y-24" role="list" aria-label="Selected installation projects">
            {projects.map((project, index) => (
              <div key={index} ref={projectRefs[index]} role="listitem">
                {project.layout === "full" ? (
                  <div className="group portfolio-card-lift">
                    <div
                      ref={parallaxRefs[index].containerRef}
                      className="relative overflow-hidden rounded-sm"
                    >
                      <img 
                        ref={parallaxRefs[index].imgRef}
                        src={project.image} 
                        alt={project.description}
                        width="1200"
                        height="800"
                        sizes="(min-width: 1280px) 1200px, 100vw"
                        className={`w-full object-cover transition-[transform,opacity,filter] duration-700 ${
                          index === 2 ? "h-[50vh]" : "h-[70vh]"
                        }`}
                        style={{ transform: 'scale(1.08)' }}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                      <PortfolioOverlays />
                      <PortfolioHoverInfo project={project} index={index} />
                    </div>
                    <div className="mt-8 grid md:grid-cols-3 gap-8">
                      <div
                        className="grain-texture pl-5 py-3 pr-4 transition-all duration-500 hover:bg-accent/[0.04] hover:pl-7 group/meta cursor-default rounded-sm shadow-contact border border-border/40 hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                        tabIndex={0}
                        style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.15, 0.4, 0.8][index]})` }}
                      >
                        <h3 className="text-2xl font-light text-architectural mb-2 transition-colors duration-500 group-hover/meta:text-cedar">{project.title}</h3>
                        <p className="text-minimal text-cedar/70 tracking-widest">{project.location}</p>
                      </div>
                      <div className="md:col-span-2 flex items-center">
                        <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="group grid md:grid-cols-5 gap-12 items-center portfolio-card-lift">
                    <div
                      ref={parallaxRefs[index].containerRef}
                      className="md:col-span-3 relative overflow-hidden rounded-sm"
                    >
                      <img 
                        ref={parallaxRefs[index].imgRef}
                        src={project.image} 
                        alt={project.description}
                        width="1200"
                        height="800"
                        sizes="(min-width: 768px) 60vw, 100vw"
                        className="w-full h-[50vh] object-cover transition-[transform,opacity,filter] duration-700"
                        style={{ transform: 'scale(1.08)' }}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                      <PortfolioOverlays />
                      <PortfolioHoverInfo project={project} index={index} />
                    </div>
                    <div
                      className="grain-texture md:col-span-2 space-y-6 pl-5 py-3 pr-4 rounded-sm transition-all duration-500 hover:bg-accent/[0.04] hover:pl-7 group/meta cursor-default shadow-contact border border-border/40 hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
                      tabIndex={0}
                      style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.15, 0.4, 0.8][index]})` }}
                    >
                      <h3 className="text-2xl font-light text-architectural transition-colors duration-500 group-hover/meta:text-cedar">{project.title}</h3>
                      <p className="text-minimal text-cedar/70 tracking-widest">{project.location}</p>
                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                )}

                {index < projects.length - 1 && (
                  <div className="mt-24 mx-auto flex items-center gap-3 justify-center">
                    {[0.15, 0.4, 0.8].map((opacity, di) => (
                      <div
                        key={di}
                        className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: `hsl(28 50% 52% / ${opacity})` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Portfolio closing signature */}
          <ScrollRevealMotion delay={0.2} className="mt-24 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-cedar/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
              <div className="w-12 h-px bg-cedar/20" />
            </div>
            <p className="text-lg italic font-serif text-foreground/40 tracking-wide">
              Every installation is a permanent addition to the landscape.
            </p>
          </ScrollRevealMotion>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
