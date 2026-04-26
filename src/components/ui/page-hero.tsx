import { useHeroParallax } from "@/hooks/useHeroParallax";
import { cn } from "@/lib/utils";
import { BACKDROP, TEXT } from "@/lib/colors";
import { HEADLINE } from "@/lib/typography";
import BreadcrumbTrail, { type BreadcrumbItem } from "@/components/ui/breadcrumb-trail";
import BronzeRule from "@/components/ui/bronze-rule";

interface PageHeroBaseProps {
  /** Breadcrumb items shown above the headline. Last item is the current page. */
  breadcrumb: BreadcrumbItem[];
  /** Roman numeral or short tag rendered before the eyebrow rule. */
  numeral?: string;
  /** Eyebrow label rendered after the rule (uppercase). */
  sectionLabel: string;
  /** The h1 of the page. */
  title: string;
  /** Italic serif sub-line beneath the title. */
  subtitle?: string;
  /** Optional additional supporting copy. */
  description?: string;
  /** Extra interactive content (CTA, badges) below the description. */
  children?: React.ReactNode;
  /** Skip-to-content target id (rendered as the focusable a11y skip link). */
  skipToId?: string;
  className?: string;
}

interface EvergreenVariant extends PageHeroBaseProps {
  variant?: "evergreen";
  image?: never;
  imageAlt?: never;
  height?: never;
  minHeight?: never;
}

interface CinematicVariant extends PageHeroBaseProps {
  variant: "cinematic";
  /** Hero photograph (eager, fetchpriority high). */
  image: string;
  imageAlt: string;
  /** Hero height — default 70vh. */
  height?: string;
  /** Minimum height — default 500px. */
  minHeight?: string;
}

type PageHeroProps = EvergreenVariant | CinematicVariant;

/**
 * PageHero — the canonical sub-page opener.
 *
 * Two variants:
 *   - "evergreen" (default): tokenized evergreen radial backdrop, no photo.
 *     Replaces 4 hand-rolled hero blocks across Services / Work / About /
 *     Contact pages. Pure typography composition.
 *   - "cinematic": full-bleed parallax photograph + cinematic vignette.
 *     Replaces SubPageHero. Used for image-led pages (currently /work).
 *
 * Both variants compose the same primitives: BreadcrumbTrail, BronzeRule,
 * HEADLINE.display, BACKDROP.* — so the visual rhythm is consistent across
 * the entire site.
 */
const PageHero = (props: PageHeroProps) => {
  const isCinematic = props.variant === "cinematic";
  const heroImgRef = useHeroParallax();

  const headlineSize = "clamp(2.5rem, 5vw, 4rem)";

  return (
    <>
      {props.skipToId && (
        <a
          href={`#${props.skipToId}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
        >
          Skip to content
        </a>
      )}

      <section
        className={cn(
          "relative overflow-hidden",
          isCinematic
            ? "flex items-end"
            : "bg-evergreen text-evergreen-foreground py-24 md:py-32",
          props.className,
        )}
        style={
          isCinematic
            ? {
                height: props.height ?? "70vh",
                minHeight: props.minHeight ?? "500px",
                contain: "layout style paint",
              }
            : undefined
        }
        aria-label={props.title}
      >
        {/* Background layers */}
        {isCinematic ? (
          <>
            <img
              ref={heroImgRef}
              src={props.image}
              alt={props.imageAlt}
              width="1920"
              height="1080"
              className="absolute inset-0 w-full h-full object-cover hero-image-entrance"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              sizes="100vw"
              style={{ transform: "scale(1.12)" }}
            />
            <div className="absolute inset-0" style={{ background: BACKDROP.cinematicVignette }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: BACKDROP.cinematicRadial }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 opacity-90" style={{ background: BACKDROP.evergreenRadial }} />
            <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
          </>
        )}

        {/* Content */}
        <div
          className={cn(
            "container mx-auto px-6 relative z-10",
            isCinematic && "pb-16",
          )}
        >
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail items={props.breadcrumb} onDark className="mb-6" />

            <BronzeRule
              numeral={props.numeral ?? "I"}
              label={props.sectionLabel}
              variant="onDark"
              className="mb-4"
            />

            <h1
              className={cn(HEADLINE.display, "text-evergreen-foreground mb-4")}
              style={{ fontSize: headlineSize }}
            >
              <span className={cn(isCinematic && "block reveal-clip")}>
                {props.title}
              </span>
            </h1>

            {props.subtitle && (
              <p
                className={cn(
                  "text-lg italic font-serif max-w-xl mb-4",
                  "text-evergreen-foreground/85",
                  TEXT.onDark.legibleShadow,
                )}
              >
                {props.subtitle}
              </p>
            )}

            {props.description && (
              <p
                className={cn(
                  "max-w-2xl text-sm leading-relaxed",
                  "text-evergreen-foreground/70",
                  TEXT.onDark.legibleShadow,
                )}
              >
                {props.description}
              </p>
            )}

            {props.children && <div className="mt-8">{props.children}</div>}
          </div>
        </div>
      </section>
    </>
  );
};

export default PageHero;
