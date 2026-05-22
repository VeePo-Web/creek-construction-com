import { useMemo, useState, useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BACKDROP, SCRIM, TEXT } from "@/lib/colors";
import BronzeRule from "@/components/ui/bronze-rule";

// Inline breadcrumb type — kept for back-compat on existing call sites.
// The breadcrumb is no longer rendered anywhere; prop is accepted and ignored.
export type BreadcrumbItem = { label: string; to?: string };
import KineticHeadline, { type KineticSize } from "@/components/ui/kinetic-headline";

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
  /** @deprecated removed in clutter sweep — kept optional for back-compat. */
  breadcrumb?: BreadcrumbItem[];
  numeral?: string;
  /** @deprecated removed in clutter sweep — kept optional for back-compat. */
  sectionLabel?: string;
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
  /** Single full-bleed photograph that anchors the hero (queried from media library). */
  query: MediaQuery;
  /** Optional static image override — when set, bypasses the media query and uses this asset directly. */
  imageSrc?: string;
  imageAlt?: string;
  /** When true (default), renders the image in full color. Set false to keep the legacy B&W treatment. */
  inColor?: boolean;
  /**
   * Optional ambient video loop. The photo still loads first as the LCP;
   * once the video can play it fades in silently over it.
   * Drop your file into /public/videos/ then pass e.g. "/videos/hero-ambient.mp4"
   * Respects prefers-reduced-motion — video stays paused when reduced motion is on.
   */
  videoSrc?: string;
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
        "relative overflow-hidden text-evergreen-foreground min-h-[100svh] flex items-end",
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
      />

      {/* Spine — left vertical bronze hairline */}
      <div
        aria-hidden
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-px bg-cedar/30 z-[8]"
        style={{ height: "calc(100% - 8rem)" }}
      />

      {/* Ambient field clip (small, decorative) */}
      {showAmbient && ambient.item && (
        <div
          aria-hidden
          className="hidden lg:block absolute top-10 right-10 w-[260px] aspect-[4/3] rounded-[8px] overflow-hidden z-[9]"
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

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10 pt-28 md:pt-36 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-2xl">
          {/* sectionLabel/eyebrow chip removed (Pass 52) — H1 carries the page. */}

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="display"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-6 max-w-[44ch] text-base md:text-lg leading-snug md:leading-relaxed",
                "not-italic md:italic font-sans md:font-serif text-balance",
                "text-white/95 md:text-evergreen-foreground/90",
                TEXT.onDark.legibleShadow,
              )}
              style={{ textShadow: "0 1px 6px hsl(0 0% 0% / 0.55)" }}
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
        "relative min-h-[100svh] flex items-center overflow-hidden text-evergreen-foreground",
        props.className,
      )}
      aria-label={lines.join(" ")}
    >
      <HeroTriptych
        queries={triptychQueries}
        rhythm="asymmetric"
        scrim="leftWide"
        priority
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
            {/* sectionLabel/eyebrow chip removed (Pass 52) — H1 carries the page. */}


            <KineticHeadline
              lines={lines}
              italic={props.italic}
              size={hasMedia ? "cinematic" : "display"}
              onDark
            />

            {props.subtitle && (
              <p
                className={cn(
                  "mt-6 text-base md:text-lg max-w-[48ch] text-balance text-evergreen-foreground/90",
                  TEXT.onDark.legibleShadow,
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

                {/* HeroProvenanceCard removed (Pass 52). */}
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

  // captionLine removed (Pass 52).

  return (
    <section
      className={cn(
        "relative overflow-hidden flex items-end min-h-[100svh]",
        props.className,
      )}
      style={{
        ...(props.height ? { height: props.height } : null),
        ...(props.minHeight ? { minHeight: props.minHeight } : null),
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
        </div>
      )}

      {/* Cinematic vignette stack */}
      <div className="absolute inset-0" style={{ background: BACKDROP.cinematicVignette }} aria-hidden />
      <div className="absolute inset-0 pointer-events-none" style={{ background: BACKDROP.cinematicRadial }} aria-hidden />
      {/* Top scrim removed — SCRIM.topNav from the chrome already covers
          fixed-header legibility without darkening the upper sky. */}
      {/* Bottom-anchored scrim — heavier so subtitle reads on bright photos. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[78%] md:h-[72%] pointer-events-none"
        style={{ background: SCRIM.bottom }}
        aria-hidden
      />

      {/* Content */}
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10 relative z-10 pt-28 md:pt-36 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-3xl">
          {/* sectionLabel/eyebrow chip removed (Pass 52). */}

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="cinematic"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-6 max-w-[44ch] text-base md:text-xl leading-relaxed md:leading-normal",
                "not-italic md:italic font-sans md:font-serif text-balance",
                "text-white/95 md:text-evergreen-foreground/90",
                TEXT.onDark.legibleShadow,
              )}
              style={{ textShadow: "0 1px 6px hsl(0 0% 0% / 0.55)" }}
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

          {/* Bottom caption rail removed (Pass 52). */}
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
        "min-h-[100svh] flex items-end",
        props.className,
      )}
      aria-label={lines.join(" ")}
    >
      <HeroTriptych
        queries={triptychQueries}
        rhythm="equal"
        scrim="bottom"
        priority
      />

      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10 relative z-10 pt-28 md:pt-36 pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-3xl">
          {/* sectionLabel/eyebrow chip removed (Pass 52). */}

          <KineticHeadline
            lines={lines}
            italic={props.italic}
            size="cinematic"
            onDark
          />

          {props.subtitle && (
            <p
              className={cn(
                "mt-6 max-w-[44ch] text-base md:text-lg leading-snug md:leading-relaxed",
                "not-italic md:italic font-sans md:font-serif text-balance",
                "text-white/95 md:text-evergreen-foreground/90",
                TEXT.onDark.legibleShadow,
              )}
              style={{ textShadow: "0 1px 6px hsl(0 0% 0% / 0.55)" }}
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
  const [videoReady, setVideoReady] = useState(false);
  const localImgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause ambient video when reduced-motion preference is active.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pause = () => { videoRef.current?.pause(); };
    if (mq.matches) pause();
    mq.addEventListener("change", pause);
    return () => mq.removeEventListener("change", pause);
  }, []);

  // Static override wins over the media-library query when supplied.
  const hasStatic = Boolean(props.imageSrc);
  const inColor = props.inColor !== false; // default: color (Pass 44)
  const photoFilter = inColor
    ? "contrast(1.02) saturate(1.02) brightness(0.94)"
    : "grayscale(100%) contrast(1.04) brightness(0.86)";
  const lqipFilter = inColor
    ? "blur(18px) brightness(0.92)"
    : "grayscale(100%) blur(18px) brightness(0.82)";

  const imgSrc = props.imageSrc ?? item?.url;
  const imgAlt = props.imageAlt ?? item?.alt ?? "";
  const imgLqip = hasStatic ? null : item?.lqip;

  // Reset load state if the source changes; mark loaded immediately if cached.
  useEffect(() => {
    setPhotoLoaded(false);
    const node = localImgRef.current;
    if (node?.complete && node.naturalWidth > 0) {
      setPhotoLoaded(true);
    }
  }, [imgSrc]);

  useHeroPreload(imgSrc, MEDIA_SIZES.HERO_FULL);

  // captionLine removed (Pass 52) — no auto-derived "service · location" chip.

  return (
    <section
      id="section-hero"
      className={cn(
        "relative overflow-hidden flex flex-col justify-between",
        "min-h-[100svh]",
        props.className,
      )}
      style={{ backgroundColor: inColor ? "hsl(28 16% 10%)" : "hsl(0 0% 4%)", contain: "layout style paint" }}
      aria-label="Homepage hero"
    >
      {/* Background photograph — LQIP-backed progressive layer. */}
      {imgSrc ? (
        <>
          {imgLqip && (
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${imgLqip.startsWith("data:") ? imgLqip : `data:image/jpeg;base64,${imgLqip}`})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: lqipFilter,
                transform: "scale(1.04)",
                opacity: photoLoaded ? 0 : 1,
              }}
            />
          )}
          {/* When no LQIP exists, paint a soft warm wash so the box isn't stark black */}
          {!imgLqip && !photoLoaded && (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: inColor ? "hsl(28 16% 14%)" : "hsl(0 0% 10%)" }}
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
            src={imgSrc}
            alt={imgAlt}
            width={item?.width ?? 1920}
            height={item?.height ?? 1080}
            className="absolute inset-0 w-full h-full object-cover hero-kenburns transition-opacity duration-[900ms]"
            loading="eager"
            {...({ fetchpriority: "high" } as Record<string, string>)}
            decoding="sync"
            sizes={MEDIA_SIZES.HERO_FULL}
            onLoad={() => setPhotoLoaded(true)}
            style={{
              filter: photoFilter,
              opacity: photoLoaded ? 1 : 0,
            }}
          />

          {/* Ambient video loop — fades in over the photo once it can play.
              Photo remains the LCP; video is a visual enhancement only. */}
          {props.videoSrc && (
            <video
              ref={videoRef}
              src={props.videoSrc}
              poster={imgSrc}
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms]"
              style={{ filter: photoFilter, opacity: videoReady ? 1 : 0 }}
              onCanPlay={() => setVideoReady(true)}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: inColor ? "hsl(28 16% 14%)" : "hsl(0 0% 8%)" }} aria-hidden />
      )}

      {/* Scrim stack tuned for color: lighter overall, bottom-weighted for type legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: inColor
            ? "linear-gradient(180deg, hsl(0 0% 0% / 0.32) 0%, hsl(0 0% 0% / 0.08) 40%, hsl(0 0% 0% / 0.58) 100%)"
            : "linear-gradient(180deg, hsl(0 0% 0% / 0.42) 0%, hsl(0 0% 0% / 0.18) 38%, hsl(0 0% 0% / 0.62) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: inColor
            ? "linear-gradient(90deg, hsl(0 0% 0% / 0.50) 0%, hsl(0 0% 0% / 0.18) 42%, transparent 68%)"
            : "linear-gradient(90deg, hsl(0 0% 0% / 0.38) 0%, hsl(0 0% 0% / 0.10) 46%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Top eyebrow row removed (Pass 52) — chrome owns wayfinding, H1 carries the page. */}

      {/* ── Middle: oversized light serif headline ── */}
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10 relative z-10 flex-1 flex items-center justify-start">
        {/*
          NOTE: max-w in `ch` resolves against the parent's body font (~16px),
          NOT the heading's ~108px serif. So `max-w-[20ch]` was clipping
          "Excellence" at md/lg/xl. We constrain in `ch` only on mobile (where
          the heading is ~34px and ch≈body), and use viewport-relative caps
          everywhere else as a safety net.
        */}
        <div className="max-w-[90vw] sm:max-w-none sm:w-auto md:max-w-[80vw] lg:max-w-[68vw] xl:max-w-[60vw]">
          <h1
            aria-label={[...lines, props.italic].filter(Boolean).join(" ")}
            className="font-serif"
            style={{
              color: "hsl(0 0% 100%)",
              fontWeight: 400,
              // Tightened top of clamp from 8.25rem→7.25rem so "Excellence"
              // reliably fits the column at lg/xl with breathing room.
              fontSize: "clamp(2rem, 7.6vw, 7.25rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.012em",
              hyphens: "manual",
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
      <div className="container mx-auto max-w-[1440px] px-5 sm:px-6 md:px-10 relative z-10 pb-14 md:pb-20 lg:pb-24">
        <div className="grid md:grid-cols-12 gap-y-10 md:gap-y-12 gap-x-10 lg:gap-x-12 items-end">
          <div className="md:col-span-7 lg:col-span-7">
            <span
              aria-hidden
              className="block h-px w-12 mb-6 hero-provenance-enter"
              style={{
                backgroundColor: "hsl(0 0% 100% / 0.45)",
                ["--kinetic-delay" as never]: "700ms",
              }}
            />
            {props.subtitle && (
              <p
                className="hero-provenance-enter max-w-[28ch] sm:max-w-[42ch] md:max-w-[46ch] text-white/80"
                style={{
                  fontSize: "clamp(0.95rem, 1.05vw, 1.125rem)",
                  lineHeight: 1.55,
                  ["--kinetic-delay" as never]: "800ms",
                  fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)",
                }}
              >
                {props.subtitle}
              </p>
            )}

            {props.children && (
              <div
                className="mt-8 hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: "900ms" }}
              >
                {props.children}
              </div>
            )}
          </div>

          {/* Bottom-right captionLine rail removed (Pass 52). */}
        </div>
      </div>

      {/* Scroll indicator — subtle animated chevron, bottom-center */}
      <div
        aria-hidden
        className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: 0.4 }}
      >
        <span
          className="block text-[9px] tracking-[0.22em] uppercase text-white"
          style={{ fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)" }}
        >
          Scroll
        </span>
        <svg
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
          className="animate-bounce"
          style={{ animationDuration: "1.8s" }}
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
