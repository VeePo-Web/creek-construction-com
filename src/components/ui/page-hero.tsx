import { useMemo, useState, useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BACKDROP, SCRIM, TEXT } from "@/lib/colors";
import BreadcrumbTrail, { type BreadcrumbItem } from "@/components/ui/breadcrumb-trail";
import BronzeRule from "@/components/ui/bronze-rule";
import KineticHeadline, { type KineticSize } from "@/components/ui/kinetic-headline";
import HeroProvenanceCard from "@/components/ui/hero-provenance-card";
import MediaSlot from "@/components/media/MediaSlot";
import HeroTriptych from "@/components/media/HeroTriptych";
import { useApprovedMedia, useFirstApprovedMedia } from "@/hooks/useApprovedMedia";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { useHeroPreload } from "@/hooks/useHeroPreload";
import { MEDIA_SIZES } from "@/lib/media-sizes";
import type { MediaQuery } from "@/lib/api/public-media";

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export type PageHeroVariant =
  | "evergreen-typographic"
  | "editorial-split"
  | "architect-bleed"
  | "cinematic-bleed"
  | "service-portrait"
  // Back-compat aliases — still consumed across the codebase:
  | "evergreen"
  | "cinematic";

interface BaseProps {
  breadcrumb: BreadcrumbItem[];
  numeral?: string;
  sectionLabel: string;
  /** Title — string (one line) OR an array of lines for KineticHeadline. */
  title: string | string[];
  /** Italic punctuation tail rendered in cedar with hairline underline draw. */
  italic?: string;
  /** Plain prose subtitle below the headline. */
  subtitle?: string;
  /** Tertiary copy below the subtitle. */
  description?: string;
  /** Extra interactive content (CTA, badges) under the description. */
  children?: ReactNode;
  skipToId?: string;
  className?: string;
}

interface EvergreenTypographicProps extends BaseProps {
  variant?: "evergreen-typographic" | "evergreen";
  /** Optional ambient field clip query (rendered top-right at low opacity). */
  ambientClipQuery?: MediaQuery;
  /**
   * Three queries that compose the photographic triptych behind the headline.
   * When omitted, the variant draws stone-plate fallbacks (still no green).
   */
  triptychQueries?: [MediaQuery, MediaQuery, MediaQuery];
}

interface EditorialSplitProps extends BaseProps {
  variant: "editorial-split";
  /** Photo query for the floating provenance card on the right. */
  query: MediaQuery;
  /**
   * Three queries for the photographic triptych BACKDROP. Defaults to a
   * narrative built around the `query` if omitted.
   */
  triptychQueries?: [MediaQuery, MediaQuery, MediaQuery];
  /** Optional provenance card content. */
  provenance?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    location?: string;
    year?: number;
    service?: string;
    children?: ReactNode;
  };
}

interface CinematicBleedProps extends BaseProps {
  variant: "cinematic-bleed";
  /** Image query (always required as fallback / poster). */
  query: MediaQuery;
  /** Optional video query — when matched, renders a muted loop. */
  videoQuery?: MediaQuery;
  /** Provenance caption rail along the bottom edge. */
  caption?: { service?: string; location?: string; year?: number };
  height?: string;
  minHeight?: string;
}

interface ArchitectBleedProps extends BaseProps {
  variant: "architect-bleed";
  /** Single full-bleed photograph that anchors the hero. */
  query: MediaQuery;
  /** Bottom-right caption rail. Falls back to derived values from media. */
  caption?: { service?: string; location?: string; year?: number };
  /** Primary CTA label (renders a white-outline button that opens QuoteModal via children-replacement when omitted). */
  ctaLabel?: string;
  /** Optional href for a phone link rendered next to the CTA. */
  phoneLabel?: string;
  phoneHref?: string;
}

interface ServicePortraitProps extends BaseProps {
  variant: "service-portrait";
  /** 2–3 service queries that compose the triptych behind the headline. */
  queries: MediaQuery[];
}

interface CinematicLegacyProps extends BaseProps {
  /** Legacy: pre-rewrite cinematic with a static image. */
  variant: "cinematic";
  image: string;
  imageAlt: string;
  height?: string;
  minHeight?: string;
}

type PageHeroProps =
  | EvergreenTypographicProps
  | EditorialSplitProps
  | ArchitectBleedProps
  | CinematicBleedProps
  | ServicePortraitProps
  | CinematicLegacyProps;

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function toLines(title: string | string[]): string[] {
  return Array.isArray(title) ? title : [title];
}

function SkipLink({ skipToId }: { skipToId?: string }) {
  if (!skipToId) return null;
  return (
    <a
      href={`#${skipToId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Variant: evergreen-typographic
// Type-led hero with a 3-column photographic triptych backdrop and a
// left-anchored scrim guaranteeing AAA contrast on the headline.
// Used on /about, /contact, /services (when no portrait queries supplied).
// ─────────────────────────────────────────────────────────────────────

const DEFAULT_TRIPTYCH: [MediaQuery, MediaQuery, MediaQuery] = [
  { shot_type: ["hero", "elevation"], min_quality: "reference", kind: "image" },
  { shot_type: ["detail", "process"], min_quality: "reference", kind: "image" },
  { shot_type: ["wide", "interior"], min_quality: "reference", kind: "image" },
];

const EvergreenTypographic = (props: EvergreenTypographicProps) => {
  const lines = toLines(props.title);
  const ambient = useFirstApprovedMedia(
    props.ambientClipQuery ?? { kind: "video", min_quality: "portfolio" },
  );
  const showAmbient = Boolean(props.ambientClipQuery && ambient.item?.is_video);

  const queries = props.triptychQueries ?? DEFAULT_TRIPTYCH;

  return (
    <section
      className={cn(
        "relative overflow-hidden text-evergreen-foreground py-24 md:py-32 min-h-[68vh] md:min-h-[78vh] flex items-center",
        props.className,
      )}
      aria-label={lines.join(" ")}
    >
      {/* Photographic triptych backdrop — replaces the old green plate */}
      <HeroTriptych
        queries={queries}
        rhythm="equal"
        scrim="left"
        priority
        fallbackCaptions={[
          "Photographing this season",
          "On the boards",
          "Across Alberta",
        ]}
      />

      {/* Spine — left vertical bronze hairline */}
      <div
        aria-hidden
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-px bg-cedar/30 z-[5]"
        style={{ height: "calc(100% - 8rem)" }}
      />

      {/* Ambient field clip (small, decorative) */}
      {showAmbient && ambient.item && (
        <div
          aria-hidden
          className="hidden lg:block absolute top-10 right-10 w-[260px] aspect-[4/3] rounded-[8px] overflow-hidden z-[6]"
          style={{
            border: "1px solid hsl(var(--cedar) / 0.25)",
            opacity: 0.4,
          }}
        >
          <video
            src={ambient.item.url}
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-2xl">
          {/* Breadcrumb intentionally omitted — HeaderBreadcrumb in the chrome
              owns sub-page wayfinding (v3.1). The `breadcrumb` prop is still
              accepted for back-compat but no longer renders here. */}

          <BronzeRule
            numeral={props.numeral}
            label={props.sectionLabel}
            variant="onDark"
            className="mb-6 hero-rule-draw"
          />

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="display"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-5 md:mt-6 text-lg italic font-serif max-w-xl",
                "text-evergreen-foreground/95",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.subtitle}
            </p>
          )}

          {props.description && (
            <p
              className={cn(
                "mt-4 max-w-2xl text-sm leading-relaxed",
                "text-evergreen-foreground/80",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.description}
            </p>
          )}

          {props.children && <div className="mt-8 hero-provenance-enter" style={{ ["--kinetic-delay" as never]: "1100ms" }}>{props.children}</div>}
        </div>
      </div>
    </section>
  );
};


// ─────────────────────────────────────────────────────────────────────
// Variant: editorial-split
// Two-column homepage hero. Type left, photograph right with floating
// provenance card overlapping the bottom-left corner.
// ─────────────────────────────────────────────────────────────────────

const EditorialSplit = (props: EditorialSplitProps) => {
  const lines = toLines(props.title);
  const { item, loading } = useFirstApprovedMedia(props.query);

  // Default backdrop triptych built from the focal `query` so we always get
  // a coherent narrative when no explicit triptychQueries are supplied.
  const defaultTriptych = useMemo<[MediaQuery, MediaQuery, MediaQuery]>(() => [
    { ...props.query, shot_type: ["hero", "elevation"] },
    { shot_type: ["detail", "process"], min_quality: "reference", kind: "image" },
    { shot_type: ["wide", "interior", "elevation"], min_quality: "reference", kind: "image" },
  ], [props.query]);

  const triptychQueries = props.triptychQueries ?? defaultTriptych;

  // Preload the floating provenance image (LCP after the triptych A column).
  useHeroPreload(item?.url, MEDIA_SIZES.PORTRAIT_HALF);

  const hasMedia = !loading && Boolean(item);

  // Headline uses the larger display size when paired with a photo.
  return (
    <section
      id="section-hero"
      className={cn(
        "relative min-h-[78vh] md:min-h-screen flex items-center overflow-hidden text-evergreen-foreground",
        props.className,
      )}
      aria-label={lines.join(" ")}
    >
      {/* Photographic triptych backdrop — replaces the old solid evergreen.
          leftWide scrim holds heavier black through 56% so the headline column
          AND the floating provenance card both stay legible. */}
      <HeroTriptych
        queries={triptychQueries}
        rhythm="asymmetric"
        scrim="leftWide"
        priority
        fallbackCaptions={[
          "Decks · Calgary",
          "Cedar · detail",
          "Across Alberta",
        ]}
      />

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 py-20 md:py-28 lg:py-32">
        <div
          className={
            hasMedia
              ? "grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              : "max-w-5xl"
          }
        >
          {/* ─── Left column ─── */}
          <div className={hasMedia ? "lg:col-span-7 max-w-2xl" : ""}>
            {/* Breadcrumb intentionally omitted — HeaderBreadcrumb in the chrome
                owns wayfinding (v3.1). On Home there's no sub-page context, so
                the eyebrow comes from BronzeRule's sectionLabel only. */}

            <BronzeRule
              numeral={props.numeral}
              label={props.sectionLabel}
              variant="onDark"
              className="mb-6 hero-rule-draw"
            />

            <KineticHeadline
              lines={lines}
              italic={props.italic}
              size={hasMedia ? "cinematic" : "display"}
              onDark
            />

            {props.subtitle && (
              <p
                className={cn(
                  "mt-5 md:mt-6 text-lg md:text-xl text-evergreen-foreground/90",
                  TEXT.onDark.legibleShadow,
                  hasMedia ? "max-w-xl" : "max-w-2xl",
                )}
              >
                {props.subtitle}
              </p>
            )}

            {props.children && (
              <div
                className="mt-10 hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: "1300ms" }}
              >
                {props.children}
              </div>
            )}
          </div>

          {/* ─── Right column — photo card + floating provenance ─── */}
          {hasMedia && (
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <div
                  className="relative rounded-[8px] overflow-hidden shadow-float"
                  style={{ border: "1px solid hsl(var(--cedar) / 0.15)" }}
                >
                  <MediaSlot
                    query={props.query}
                    priority
                    sizes={MEDIA_SIZES.PORTRAIT_HALF}
                    wrapperClassName="aspect-editorial w-full"
                    fallback={null}
                  />

                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(0deg, hsl(150 30% 6% / 0.55) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {props.provenance && (
                  <div className="mt-6 lg:mt-0 lg:absolute lg:left-[-24px] lg:bottom-[-32px] lg:max-w-[340px]">
                    <HeroProvenanceCard
                      eyebrow={props.provenance.eyebrow}
                      heading={props.provenance.heading}
                      body={props.provenance.body}
                      location={props.provenance.location ?? item?.alt?.split(" in ")[1]?.split(",")[0]}
                      year={props.provenance.year}
                      service={props.provenance.service ?? item?.service ?? undefined}
                      delayMs={1500}
                    >
                      {props.provenance.children}
                    </HeroProvenanceCard>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Variant: cinematic-bleed
// Full-bleed photo (or muted-loop video). Used on /work.
// ─────────────────────────────────────────────────────────────────────

const CinematicBleed = (props: CinematicBleedProps) => {
  const lines = toLines(props.title);
  const heroImgRef = useHeroParallax();

  const photo = useFirstApprovedMedia(props.query);
  const video = useFirstApprovedMedia(
    props.videoQuery ?? { kind: "video", min_quality: "portfolio" },
  );
  const useVideo = Boolean(props.videoQuery && video.item?.is_video);

  // Preload the LCP photograph (always — even when video plays, the poster
  // is the photo and it is what the user sees first).
  useHeroPreload(photo.item?.url, MEDIA_SIZES.HERO_FULL);

  const captionLine = useMemo(() => {
    if (!props.caption) return null;
    const { service, location, year } = props.caption;
    return [service, location, year ? String(year) : null].filter(Boolean).join(" · ");
  }, [props.caption]);

  return (
    <section
      className={cn("relative overflow-hidden flex items-end", props.className)}
      style={{
        height: props.height ?? "82vh",
        minHeight: props.minHeight ?? "620px",
        contain: "layout style paint",
      }}
      aria-label={lines.join(" ")}
    >
      {/* Background — video preferred, photo fallback */}
      {useVideo && video.item ? (
        <video
          src={video.item.url}
          muted
          autoPlay
          loop
          playsInline
          poster={photo.item?.url}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
      ) : photo.item ? (
        <img
          ref={heroImgRef}
          src={photo.item.url}
          alt={photo.item.alt}
          width={photo.item.width ?? 1920}
          height={photo.item.height ?? 1080}
          className="absolute inset-0 w-full h-full object-cover hero-kenburns"
          loading="eager"
          {...({ fetchpriority: "high" } as Record<string, string>)}
          decoding="sync"
          sizes={MEDIA_SIZES.HERO_FULL}
        />
      ) : (
        // Editorial fallback — warm stone, never green
        <div className="absolute inset-0 overflow-hidden" style={{ background: BACKDROP.stonePlate }}>
          <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
          <div
            className="absolute top-8 left-8 h-px"
            style={{
              width: "120px",
              background: "linear-gradient(90deg, hsl(var(--cedar) / 0.6), transparent)",
            }}
          />
          <p className="absolute bottom-8 left-8 right-8 text-[10px] tracking-[0.28em] uppercase text-cedar/70 font-medium">
            Photographing this season · Alberta
          </p>
        </div>
      )}

      {/* Cinematic vignette stack */}
      <div className="absolute inset-0" style={{ background: BACKDROP.cinematicVignette }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none" style={{ background: BACKDROP.cinematicRadial }} aria-hidden />
      {/* Bottom-anchored scrim — content lives at the bottom (flex items-end),
          so the heavy black needs to live there too. Covers the eyebrow →
          headline → subtitle → provenance band in ≥45% black. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[68%] pointer-events-none"
        style={{ background: SCRIM.bottom }}
        aria-hidden
      />

      {/* Content */}
      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pb-14 md:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          {/* Breadcrumb intentionally omitted — HeaderBreadcrumb in the
              chrome owns sub-page wayfinding so the hero photo stays clean. */}

          <BronzeRule
            numeral={props.numeral}
            label={props.sectionLabel}
            variant="onDark"
            className="mb-6 hero-rule-draw"
          />

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="cinematic"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-6 text-lg md:text-xl italic font-serif max-w-xl",
                "text-evergreen-foreground/90",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.subtitle}
            </p>
          )}

          {props.children && (
            <div
              className="mt-8 hero-provenance-enter"
              style={{ ["--kinetic-delay" as never]: "1500ms" }}
            >
              {props.children}
            </div>
          )}

          {captionLine && (
            <div
              className="mt-10 pt-6 border-t border-evergreen-foreground/15 hero-provenance-enter"
              style={{ ["--kinetic-delay" as never]: "1700ms" }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-evergreen-foreground/60 tabular-nums">
                {captionLine}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Variant: service-portrait
// 2–3 service photographs composed as a backdrop triptych behind the
// headline. Used on /services.
// ─────────────────────────────────────────────────────────────────────

const ServicePortrait = (props: ServicePortraitProps) => {
  const lines = toLines(props.title);

  // Coerce the queries[] tuple into HeroTriptych's [a,b,c] shape; if the
  // caller supplied fewer than 3, pad with a sensible default.
  const triptychQueries = useMemo<[MediaQuery, MediaQuery, MediaQuery]>(() => [
    props.queries[0] ?? { shot_type: ["hero", "elevation"], min_quality: "reference", kind: "image" },
    props.queries[1] ?? { shot_type: ["detail", "process"], min_quality: "reference", kind: "image" },
    props.queries[2] ?? { shot_type: ["wide", "interior"], min_quality: "reference", kind: "image" },
  ], [props.queries]);

  return (
    <section
      className={cn(
        "relative overflow-hidden text-evergreen-foreground",
        "min-h-[78vh] md:min-h-[82vh] flex items-end",
        props.className,
      )}
      aria-label={lines.join(" ")}
    >
      <HeroTriptych
        queries={triptychQueries}
        rhythm="equal"
        scrim="left"
        priority
        fallbackCaptions={[
          "Decks · Calgary",
          "Sheds · Edmonton",
          "Fences · Alberta",
        ]}
      />

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pb-20 md:pb-24 pt-24 md:pt-28 lg:pt-32">
        <div className="max-w-3xl">
          {/* Breadcrumb intentionally omitted — see CinematicBleed for the
              same rationale. HeaderBreadcrumb owns sub-page wayfinding. */}

          <BronzeRule
            numeral={props.numeral}
            label={props.sectionLabel}
            variant="onDark"
            className="mb-6 hero-rule-draw"
          />

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="cinematic"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-6 text-lg italic font-serif max-w-xl text-evergreen-foreground/90",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.subtitle}
            </p>
          )}

          {props.description && (
            <p
              className={cn(
                "mt-4 max-w-2xl text-sm leading-relaxed text-evergreen-foreground/70",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.description}
            </p>
          )}

          {props.children && (
            <div className="mt-8 hero-provenance-enter" style={{ ["--kinetic-delay" as never]: "1500ms" }}>
              {props.children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Variant: cinematic (legacy — static image prop)
// Preserved for back-compat with any old consumer.
// ─────────────────────────────────────────────────────────────────────

const CinematicLegacy = (props: CinematicLegacyProps) => {
  const lines = toLines(props.title);
  const heroImgRef = useHeroParallax();

  return (
    <section
      className={cn("relative overflow-hidden flex items-end", props.className)}
      style={{
        height: props.height ?? "70vh",
        minHeight: props.minHeight ?? "500px",
        contain: "layout style paint",
      }}
      aria-label={lines.join(" ")}
    >
      <img
        ref={heroImgRef}
        src={props.image}
        alt={props.imageAlt}
        width="1920"
        height="1080"
        className="absolute inset-0 w-full h-full object-cover hero-image-entrance"
        loading="eager"
        {...({ fetchpriority: "high" } as Record<string, string>)}
        decoding="sync"
        sizes="100vw"
        style={{ transform: "scale(1.12)" }}
      />
      <div className="absolute inset-0" style={{ background: BACKDROP.cinematicVignette }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none" style={{ background: BACKDROP.cinematicRadial }} aria-hidden />

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pb-16">
        <div className="max-w-3xl">
          <BreadcrumbTrail items={props.breadcrumb} onDark className="mb-6" />
          <BronzeRule
            numeral={props.numeral ?? "I"}
            label={props.sectionLabel}
            variant="onDark"
            className="mb-4"
          />
          <KineticHeadline lines={lines} italic={props.italic} size="cinematic" onDark />
          {props.subtitle && (
            <p
              className={cn(
                "mt-4 text-lg italic font-serif max-w-xl text-evergreen-foreground/85",
                TEXT.onDark.legibleShadow,
              )}
            >
              {props.subtitle}
            </p>
          )}
          {props.children && <div className="mt-8">{props.children}</div>}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Variant: architect-bleed
// Hero-only minimal black/white architect treatment. Single full-bleed
// photograph with a near-black scrim + slight desaturation, oversized
// light serif headline, hairline rules, white-outline CTA.
// Scoped to the homepage. Does not touch global tokens.
// ─────────────────────────────────────────────────────────────────────

const ArchitectBleed = (props: ArchitectBleedProps) => {
  const lines = toLines(props.title);
  const heroImgRef = useHeroParallax();
  const { item } = useFirstApprovedMedia(props.query);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const localImgRef = useRef<HTMLImageElement | null>(null);

  // Reset load state if the source changes; mark loaded immediately if cached.
  useEffect(() => {
    setPhotoLoaded(false);
    const node = localImgRef.current;
    if (node?.complete && node.naturalWidth > 0) {
      setPhotoLoaded(true);
    }
  }, [item?.url]);

  useHeroPreload(item?.url, MEDIA_SIZES.HERO_FULL);

  const captionLine = useMemo(() => {
    const c = props.caption ?? {};
    const fallbackLocation = item?.alt?.split(" in ")[1]?.split(",")[0];
    const service = c.service ?? item?.service ?? undefined;
    const location = c.location ?? fallbackLocation;
    const year = c.year ?? undefined;
    return [service, location, year ? String(year) : null]
      .filter(Boolean)
      .join(" · ");
  }, [props.caption, item]);

  return (
    <section
      id="section-hero"
      className={cn(
        "relative overflow-hidden flex flex-col justify-between",
        "min-h-[78vh] sm:min-h-[84vh] md:min-h-screen",
        props.className,
      )}
      style={{ backgroundColor: "hsl(0 0% 4%)", contain: "layout style paint" }}
      aria-label={lines.join(" ")}
    >
      {/* Background photograph — LQIP-backed progressive layer.
          The section reserves min-h-[88vh] so layout never shifts; the LQIP
          paints instantly (data URI in HTML) so the user never sees a black
          flash before the full image decodes. */}
      {item ? (
        <>
          {/* LQIP backdrop — blurred + grayscale to match the hero treatment */}
          {item.lqip && (
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${item.lqip.startsWith("data:") ? item.lqip : `data:image/jpeg;base64,${item.lqip}`})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(100%) blur(18px) brightness(0.82)",
                transform: "scale(1.04)",
                opacity: photoLoaded ? 0 : 1,
              }}
            />
          )}
          {/* When no LQIP exists, paint a soft warm-grey wash so the box isn't stark black */}
          {!item.lqip && !photoLoaded && (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: "hsl(0 0% 10%)" }}
            />
          )}
          <img
            ref={(node) => {
              localImgRef.current = node;
              if (typeof heroImgRef === "function") {
                (heroImgRef as (el: HTMLImageElement | null) => void)(node);
              } else if (heroImgRef) {
                (heroImgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
              }
            }}
            src={item.url}
            alt={item.alt}
            width={item.width ?? 1920}
            height={item.height ?? 1080}
            className="absolute inset-0 w-full h-full object-cover hero-kenburns transition-opacity duration-[900ms]"
            loading="eager"
            {...({ fetchpriority: "high" } as Record<string, string>)}
            decoding="sync"
            sizes={MEDIA_SIZES.HERO_FULL}
            onLoad={() => setPhotoLoaded(true)}
            style={{
              filter: "grayscale(100%) contrast(1.04) brightness(0.86)",
              opacity: photoLoaded ? 1 : 0,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: "hsl(0 0% 8%)" }} aria-hidden />
      )}

      {/* Architect scrim stack: bottom-weighted black + faint left wash for type legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 0% / 0.42) 0%, hsl(0 0% 0% / 0.18) 38%, hsl(0 0% 0% / 0.62) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(0 0% 0% / 0.38) 0%, hsl(0 0% 0% / 0.10) 46%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Top: hairline + uppercase eyebrow ── */}
      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pt-20 sm:pt-24 md:pt-32">
        <div
          className="flex items-center gap-4 hero-provenance-enter"
          style={{ ["--kinetic-delay" as never]: "200ms" }}
        >
          <span
            aria-hidden
            className="block h-px w-10 md:w-16"
            style={{ backgroundColor: "hsl(0 0% 100% / 0.55)" }}
          />
          <span
            className="text-[10px] md:text-[11px] uppercase tabular-nums"
            style={{
              color: "hsl(0 0% 100% / 0.82)",
              letterSpacing: "0.22em",
              fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)",
            }}
          >
            {props.sectionLabel}
          </span>
        </div>
      </div>

      {/* ── Middle: oversized light serif headline ── */}
      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 flex-1 flex items-center">
        <div className="max-w-[14ch] sm:max-w-[18ch] md:max-w-[20ch]">
          <h1
            aria-label={[...lines, props.italic].filter(Boolean).join(" ")}
            className="font-serif"
            style={{
              color: "hsl(0 0% 100%)",
              fontWeight: 400,
              // Floor lowered so the longest word ("Excellence" at ~10 chars in
              // DM Serif Display) fits a 360–414px viewport without clipping.
              fontSize: "clamp(2.125rem, 8.5vw, 8.25rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.012em",
              hyphens: "manual",
              wordBreak: "keep-all",
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="kinetic-line block"
                style={
                  {
                    "--kinetic-delay": `${380 + i * 160}ms`,
                  } as React.CSSProperties
                }
              >
                {line}
              </span>
            ))}
            {props.italic && (
              <span
                aria-hidden="true"
                className="kinetic-line block font-serif italic"
                style={
                  {
                    color: "hsl(0 0% 100% / 0.72)",
                    fontWeight: 400,
                    fontSize: "0.46em",
                    marginTop: "0.6em",
                    letterSpacing: "0.005em",
                    "--kinetic-delay": `${380 + lines.length * 160 + 220}ms`,
                  } as React.CSSProperties
                }
              >
                {props.italic}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* ── Bottom: hairline, subtitle, CTA row, caption rail ── */}
      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pb-14 md:pb-20 lg:pb-24">
        <div className="grid md:grid-cols-12 gap-y-10 gap-x-10 lg:gap-x-12 items-end">
          <div className="md:col-span-8 lg:col-span-7">
            <span
              aria-hidden
              className="block h-px w-12 mb-6 hero-provenance-enter"
              style={{
                backgroundColor: "hsl(0 0% 100% / 0.45)",
                ["--kinetic-delay" as never]: "1100ms",
              }}
            />
            {props.subtitle && (
              <p
                className="hero-provenance-enter"
                style={{
                  color: "hsl(0 0% 100% / 0.82)",
                  maxWidth: "46ch",
                  fontSize: "clamp(0.95rem, 1.05vw, 1.125rem)",
                  lineHeight: 1.55,
                  ["--kinetic-delay" as never]: "1200ms",
                  fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)",
                }}
              >
                {props.subtitle}
              </p>
            )}

            {props.children && (
              <div
                className="mt-9 hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: "1400ms" }}
              >
                {props.children}
              </div>
            )}
          </div>

          {captionLine && (
            <div className="md:col-span-4 lg:col-span-5 md:text-right">
              <div
                className="inline-flex items-center gap-3 hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: "1600ms" }}
              >
                <span
                  aria-hidden
                  className="block h-px w-8"
                  style={{ backgroundColor: "hsl(0 0% 100% / 0.45)" }}
                />
                <span
                  className="text-[10px] md:text-[11px] uppercase tabular-nums"
                  style={{
                    color: "hsl(0 0% 100% / 0.7)",
                    letterSpacing: "0.22em",
                    fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)",
                  }}
                >
                  {captionLine}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Dispatcher

const PageHero = (props: PageHeroProps) => {
  return (
    <>
      <SkipLink skipToId={props.skipToId} />
      {(() => {
        switch (props.variant) {
          case "editorial-split":
            return <EditorialSplit {...(props as EditorialSplitProps)} />;
          case "architect-bleed":
            return <ArchitectBleed {...(props as ArchitectBleedProps)} />;
          case "cinematic-bleed":
            return <CinematicBleed {...(props as CinematicBleedProps)} />;
          case "service-portrait":
            return <ServicePortrait {...(props as ServicePortraitProps)} />;
          case "cinematic":
            return <CinematicLegacy {...(props as CinematicLegacyProps)} />;
          case "evergreen":
          case "evergreen-typographic":
          case undefined:
          default:
            return (
              <EvergreenTypographic {...(props as EvergreenTypographicProps)} />
            );
        }
      })()}
    </>
  );
};

export default PageHero;
