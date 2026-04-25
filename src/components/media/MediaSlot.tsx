import type { ReactNode } from "react";
import EditorialPicture from "./EditorialPicture";
import AmbientVideoBleed from "./AmbientVideoBleed";
import {
  useFirstApprovedMedia,
  useApprovedMedia,
} from "@/hooks/useApprovedMedia";
import type { MediaQuery, ApprovedMedia } from "@/lib/api/public-media";

interface SharedProps {
  /** Selector for what kind of media to pull. */
  query: MediaQuery;
  /** Rendered when no approved media matches — keeps the section beautiful. */
  fallback: ReactNode;
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

/**
 * MediaSlot — the orchestrator pages use to request media.
 *
 *   <MediaSlot
 *     query={{ service: 'decks', shot_type: 'hero', min_quality: 'hero' }}
 *     fallback={<EvergreenGradient />}
 *   />
 *
 * Pages NEVER import images directly. They describe what they want and
 * the system pulls from approved cloud media. If nothing matches, the
 * fallback renders — so the page is always beautiful.
 */
const MediaSlot = (props: MediaSlotProps) => {
  const { item, loading } = useFirstApprovedMedia(props.query);

  // Server hasn't responded yet — render the fallback to avoid flash
  if (loading) return <>{props.fallback}</>;
  if (!item) return <>{props.fallback}</>;

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
