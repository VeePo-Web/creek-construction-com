import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import EditorialPicture from "./EditorialPicture";
import AmbientVideoBleed from "./AmbientVideoBleed";
import {
  useFirstApprovedMedia,
  useApprovedMedia,
} from "@/hooks/useApprovedMedia";
import type { MediaQuery, ApprovedMedia } from "@/lib/api/public-media";
import { BACKDROP } from "@/lib/colors";
import { cn } from "@/lib/utils";

/**
 * Editorial fallback variant. The site contract: NEVER paint a flat green
 * plate when a photograph is missing. Every fallback should read as a
 * deliberate, warm, designed surface.
 *
 *   stone     — default. Warm cream/stone diagonal. Use for cards.
 *   cedar     — soft bronze-into-stone wash. Use for hero / brand surfaces.
 *   evergreen — DEPRECATED for fallbacks; only for deliberate dark cards.
 */
export type MediaFallbackVariant = "stone" | "cedar" | "evergreen";

interface SharedProps {
  /** Selector for what kind of media to pull. */
  query: MediaQuery;
  /**
   * Rendered when no approved media matches.
   * Optional: when omitted, MediaSlot renders the editorial plate defined by
   * `fallbackVariant` (default "stone") with optional icon and caption.
   */
  fallback?: ReactNode;
  /** Editorial plate variant for the auto-fallback. Default "stone". */
  fallbackVariant?: MediaFallbackVariant;
  /** Lucide icon centered on the auto-fallback. */
  fallbackIcon?: LucideIcon;
  /** 10px tracked uppercase caption laid over the auto-fallback. */
  fallbackCaption?: string;
  /** Set true ONLY for an above-the-fold LCP image. One per page. */
  priority?: boolean;
  /** Responsive sizes hint. */
  sizes?: string;
  className?: string;
  wrapperClassName?: string;
  cedarHover?: boolean;
}

interface SinglePictureProps extends SharedProps {
  variant?: "picture";
}

interface SingleBleedProps extends SharedProps {
  variant: "bleed";
  height?: string;
  aspectRatio?: string;
  opacity?: number;
}

type MediaSlotProps = SinglePictureProps | SingleBleedProps;

const PLATE_BG: Record<MediaFallbackVariant, string> = {
  stone: BACKDROP.stonePlate,
  cedar: BACKDROP.cedarPlate,
  evergreen: BACKDROP.evergreenPlate,
};

const PLATE_ICON_COLOR: Record<MediaFallbackVariant, string> = {
  stone: "text-cedar/35",
  cedar: "text-cedar/55",
  evergreen: "text-cedar/40",
};

const PLATE_CAPTION_COLOR: Record<MediaFallbackVariant, string> = {
  stone: "text-cedar/65",
  cedar: "text-cedar/75",
  evergreen: "text-cedar/70",
};

/**
 * Editorial auto-fallback. Renders a warm plate (stone/cedar) with optional
 * icon and caption — consistent across every photo position site-wide.
 *
 * Exported so HeroTriptych and any other media primitive can render the
 * exact same warm-stone fallback. Don't reinvent the green plate.
 */
export function EditorialFallback({
  variant = "stone",
  icon: Icon,
  caption,
}: {
  variant?: MediaFallbackVariant;
  icon?: LucideIcon;
  caption?: string;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: PLATE_BG[variant] }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
      {/* Hairline cedar accent — top left */}
      <div
        className="absolute top-0 left-0 h-px"
        style={{
          width: "30%",
          background: "linear-gradient(90deg, hsl(var(--cedar) / 0.5), transparent)",
        }}
      />
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={cn(
              "h-16 w-16 transition-all duration-700",
              PLATE_ICON_COLOR[variant],
            )}
            strokeWidth={1.4}
            aria-hidden
          />
        </div>
      )}
      {caption && (
        <p
          className={cn(
            "absolute bottom-5 left-5 right-5 text-[10px] tracking-[0.25em] uppercase font-medium",
            PLATE_CAPTION_COLOR[variant],
          )}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

/**
 * MediaSlot — the orchestrator pages use to request media.
 *
 *   <MediaSlot
 *     query={{ service: 'decks', shot_type: 'hero', min_quality: 'reference' }}
 *     fallbackVariant="stone"
 *     fallbackIcon={Hammer}
 *     fallbackCaption="New decks, photographed soon"
 *   />
 *
 * Pages NEVER import images directly. They describe what they want and
 * the system pulls from approved cloud media. If nothing matches, an
 * editorial plate renders — so the page is always beautiful, never green.
 */
const MediaSlot = (props: MediaSlotProps) => {
  const { item, loading } = useFirstApprovedMedia(props.query);

  const renderFallback = () => {
    if (props.fallback !== undefined) return <>{props.fallback}</>;
    return (
      <EditorialFallback
        variant={props.fallbackVariant ?? "stone"}
        icon={props.fallbackIcon}
        caption={props.fallbackCaption}
      />
    );
  };

  // Server hasn't responded yet — render the fallback to avoid flash
  if (loading) return renderFallback();
  if (!item) return renderFallback();

  if (props.variant === "bleed") {
    if (!item.is_video) {
      // We requested a bleed but got an image — render as a photo bleed
      return (
        <EditorialPicture
          src={item.url}
          alt={item.alt}
          width={item.width ?? 1920}
          height={item.height ?? 800}
          lqip={item.lqip}
          priority={props.priority}
          sizes={props.sizes}
          wrapperClassName={props.wrapperClassName}
          className={props.className}
        />
      );
    }
    return (
      <AmbientVideoBleed
        src={item.url}
        height={props.height}
        aspectRatio={props.aspectRatio}
        opacity={props.opacity}
        className={props.className}
        ariaLabel={item.alt}
      />
    );
  }

  // Default variant — picture
  return (
    <EditorialPicture
      src={item.url}
      alt={item.alt}
      width={item.width ?? 1600}
      height={item.height ?? 1067}
      lqip={item.lqip}
      priority={props.priority}
      sizes={props.sizes}
      wrapperClassName={props.wrapperClassName}
      className={props.className}
      cedarHover={props.cedarHover}
    />
  );
};

export default MediaSlot;

/**
 * Convenience: render N media items pulled by query, falling back to a
 * placeholder array if not enough are approved.
 *
 * Example: <MediaStrip query={{service:'decks'}} count={3} fallback={...} />
 */
interface MediaStripProps {
  query: MediaQuery;
  count: number;
  /** Render function for each item. */
  renderItem: (item: ApprovedMedia, i: number) => ReactNode;
  /** Render function when fewer than `count` items are available. */
  fallback: () => ReactNode;
}

export const MediaStrip = ({
  query,
  count,
  renderItem,
  fallback,
}: MediaStripProps) => {
  const { items, loading } = useApprovedMedia({ ...query, limit: count });
  if (loading || items.length < count) return <>{fallback()}</>;
  return <>{items.slice(0, count).map((item, i) => renderItem(item, i))}</>;
};
