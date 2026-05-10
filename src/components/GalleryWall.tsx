import { GALLERY, type GalleryImage } from "@/config/gallery";

interface GalleryWallProps {
  /** Override the default image set. */
  images?: GalleryImage[];
  /** How many images load eagerly (above the fold). */
  priorityCount?: number;
}

/**
 * GalleryWall — captionless editorial masonry of images.
 *
 * No titles, no descriptions, no overlays, no click handlers —
 * the photographs carry the entire message. Uses CSS columns for a
 * true masonry layout that reflows naturally across breakpoints.
 */
const GalleryWall = ({ images = GALLERY, priorityCount = 4 }: GalleryWallProps) => {
  return (
    <div
      className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
      role="list"
      aria-label="Project photography"
    >
      {images.map((img, i) => (
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
