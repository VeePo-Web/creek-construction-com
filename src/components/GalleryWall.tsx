import { useMemo } from "react";
import { GALLERY, type GalleryImage } from "@/config/gallery";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";

interface GalleryWallProps {
  /** Override the default image set. */
  images?: GalleryImage[];
  /** How many images load eagerly (above the fold). */
  priorityCount?: number;
}

/**
 * GalleryWall — captionless editorial masonry of images.
 *
 * Renders the curated GALLERY plus every approved real photograph in
 * the cloud media library. Real photos only — no AI imagery.
 */
const GalleryWall = ({ images = GALLERY, priorityCount = 4 }: GalleryWallProps) => {
  const { items } = useApprovedMedia({
    kind: "image",
    min_quality: "reference",
    limit: 60,
  });

  const merged = useMemo<GalleryImage[]>(() => {
    const fromCloud: GalleryImage[] = items
      .filter((m) => !m.is_video)
      .map((m) => ({ src: m.url, alt: m.alt }));
    return [...images, ...fromCloud];
  }, [images, items]);

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
