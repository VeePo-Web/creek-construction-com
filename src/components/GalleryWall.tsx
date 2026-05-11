import { useMemo } from "react";
import type { GalleryImage } from "@/config/gallery";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";

interface GalleryWallProps {
  /** Optional override for the image set. */
  images?: GalleryImage[];
  /** How many images load eagerly (above the fold). */
  priorityCount?: number;
}

/**
 * GalleryWall — captionless editorial masonry of real photographs.
 *
 * 100% cloud-driven from the approved media library. No AI imagery,
 * no captions, no overlays.
 */
const GalleryWall = ({ images, priorityCount = 6 }: GalleryWallProps) => {
  const { items } = useApprovedMedia({
    kind: "image",
    min_quality: "reference",
    limit: 200,
  });

  const merged = useMemo<GalleryImage[]>(() => {
    if (images && images.length) {
      return images;
    }
    return items
      .filter((m) => !m.is_video)
      .map((m) => ({ src: m.url, alt: m.alt }));
  }, [images, items]);

  if (merged.length === 0) return null;

  return (
    <div
      className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
      role="list"
      aria-label="Project photography"
    >
      {merged.map((img, i) => (
        <figure
          key={`${img.src}-${i}`}
          role="listitem"
          className="mb-4 md:mb-6 break-inside-avoid overflow-hidden bg-secondary"
        >
          <img
            src={img.src}
            alt={img.alt}
            loading={i < priorityCount ? "eager" : "lazy"}
            decoding={i < priorityCount ? "sync" : "async"}
            fetchPriority={i < priorityCount ? "high" : "auto"}
            className="block w-full h-auto"
          />
        </figure>
      ))}
    </div>
  );
};

export default GalleryWall;
