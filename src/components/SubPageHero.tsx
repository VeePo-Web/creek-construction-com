import { Link } from "react-router-dom";
import { useHeroParallax } from "@/hooks/useHeroParallax";

interface SubPageHeroProps {
  image: string;
  imageAlt: string;
  breadcrumbLabel: string;
  numeral?: string;
  sectionLabel: string;
  title: string;
  subtitle: string;
  description?: string;
  /** Extra content below description (e.g. badge row) */
  children?: React.ReactNode;
  /** Hero height — default "70vh" */
  height?: string;
  /** Minimum height — default "500px" */
  minHeight?: string;
  /** Skip-to-content target id */
  skipToId?: string;
}

/**
 * SubPageHero — cinematic full-bleed hero for sub-pages.
 * Includes parallax image, gradient overlays, breadcrumb,
 * clip-path title reveal, and editorial provenance line.
 */
const SubPageHero = ({
  image,
  imageAlt,
  breadcrumbLabel,
  numeral = "I",
  sectionLabel,
  title,
  subtitle,
  description,
  children,
  height = "70vh",
  minHeight = "500px",
  skipToId,
}: SubPageHeroProps) => {
  const heroImgRef = useHeroParallax();

  return (
    <>
      {skipToId && (
        <a
          href={`#${skipToId}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
        >
          Skip to content
        </a>
      )}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ height, minHeight, contain: 'layout style paint' }}
      >
        <img
          ref={heroImgRef}
          src={image}
          alt={imageAlt}
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover hero-image-entrance"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
          style={{ transform: "scale(1.12)" }}
        />
        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(20 10% 8% / 0.3) 0%, hsl(20 10% 8% / 0.12) 38%, hsl(20 10% 8% / 0.55) 72%, hsl(20 10% 8% / 0.85) 100%)",
          }}
        />
        {/* Radial edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, hsl(20 10% 8% / 0.2) 100%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 flex-wrap">
              <Link
                to="/"
                className="text-[10px] tracking-[0.2em] text-white/40 uppercase hover:text-cedar transition-colors duration-300 min-h-[44px] flex items-center"
              >
                Home
              </Link>
              <span className="text-white/20">·</span>
              <span
                className="text-[10px] tracking-[0.2em] text-cedar/80 uppercase min-h-[44px] flex items-center"
                aria-current="page"
              >
                {breadcrumbLabel}
              </span>
            </nav>

            {/* Editorial provenance line */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] tracking-[0.2em] text-cedar/60 font-light tabular-nums">
                {numeral}
              </span>
              <div className="w-8 h-px bg-cedar/40" />
              <span className="text-minimal text-cedar">{sectionLabel}</span>
            </div>

            {/* Clip-path title reveal */}
            <h1
              className="text-headline text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              <span
                className="block"
                style={{
                  clipPath: "inset(100% 0 0 0)",
                  animation:
                    "clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
                }}
              >
                {title}
              </span>
            </h1>

            <p
              className="text-lg text-white/60 italic font-serif mb-4 max-w-xl opacity-0"
              style={{ animation: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' }}
            >
              {subtitle}
            </p>

            {description && (
              <p
                className="text-white/40 max-w-2xl text-sm leading-relaxed opacity-0"
                style={{ animation: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards' }}
              >
                {description}
              </p>
            )}

            <div className="opacity-0" style={{ animation: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards' }}>
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SubPageHero;
