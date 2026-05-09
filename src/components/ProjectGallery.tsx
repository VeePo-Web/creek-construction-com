import ProgressiveImage from "@/components/ProgressiveImage";
import type { Project } from "@/data/projects";

interface ProjectGalleryProps {
  project: Project;
  /** When true, the very first image gets eager/high-priority loading. Use only above the fold. */
  priority?: boolean;
}

/**
 * Editorial photo gallery for a single project.
 *
 * Layout adapts to photo count:
 *  - 1 photo  → full-bleed editorial frame
 *  - 2 photos → asymmetric 60/40 (stacked on mobile)
 *  - 3 photos → one dominant + two supporting
 *  - 4+       → masonry-lite via CSS columns, native aspect preserved
 *
 * Gaps + radii match the FeaturedProjects/EditorialPicture system so both
 * grids feel like a single editorial sheet.
 */
const ProjectGallery = ({ project, priority = false }: ProjectGalleryProps) => {
  const { photos } = project;
  const count = photos.length;

  if (count === 0) return null;

  // Single photo — full-bleed
  if (count === 1) {
    const p = photos[0];
    return (
      <figure className="w-full" style={{ contain: "layout style" }}>
        <div
          className="relative w-full overflow-hidden rounded-none max-h-[72svh] md:max-h-[80vh]"
          style={{ aspectRatio: `${p.width} / ${p.height}` }}
        >
          <ProgressiveImage
            src={p.src}
            alt={p.alt}
            className="w-full h-full"
            priority={priority}
            sizes="(min-width: 1024px) 80vw, 100vw"
            cedarHover={false}
          />
        </div>
      </figure>
    );
  }

  // Two photos — asymmetric 60/40
  if (count === 2) {
    const [a, b] = photos;
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 w-full"
        style={{ contain: "layout style" }}
      >
        <figure className="md:col-span-3 relative overflow-hidden rounded-none" style={{ aspectRatio: `${a.width} / ${a.height}` }}>
          <ProgressiveImage
            src={a.src}
            alt={a.alt}
            className="w-full h-full"
            priority={priority}
            sizes="(min-width: 768px) 60vw, 100vw"
            cedarHover={false}
          />
        </figure>
        <figure className="md:col-span-2 relative overflow-hidden rounded-none" style={{ aspectRatio: `${b.width} / ${b.height}` }}>
          <ProgressiveImage
            src={b.src}
            alt={b.alt}
            className="w-full h-full"
            sizes="(min-width: 768px) 40vw, 100vw"
            cedarHover={false}
          />
        </figure>
      </div>
    );
  }

  // Three photos — one dominant + two supporting (stacked right column)
  if (count === 3) {
    const [a, b, c] = photos;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full" style={{ contain: "layout style" }}>
        <figure className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-none" style={{ aspectRatio: `${a.width} / ${a.height}` }}>
          <ProgressiveImage src={a.src} alt={a.alt} className="w-full h-full" priority={priority} sizes="(min-width: 768px) 66vw, 100vw" cedarHover={false} />
        </figure>
        <figure className="relative overflow-hidden rounded-none" style={{ aspectRatio: `${b.width} / ${b.height}` }}>
          <ProgressiveImage src={b.src} alt={b.alt} className="w-full h-full" sizes="(min-width: 768px) 33vw, 100vw" cedarHover={false} />
        </figure>
        <figure className="relative overflow-hidden rounded-none" style={{ aspectRatio: `${c.width} / ${c.height}` }}>
          <ProgressiveImage src={c.src} alt={c.alt} className="w-full h-full" sizes="(min-width: 768px) 33vw, 100vw" cedarHover={false} />
        </figure>
      </div>
    );
  }

  // 4+ — masonry-lite, native aspect preserved
  return (
    <div
      className="w-full columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 [&>figure]:mb-6 md:[&>figure]:mb-8 [&>figure]:break-inside-avoid"
      style={{ contain: "layout style" }}
    >
      {photos.map((p, i) => (
        <figure key={`${project.slug}-${i}`} className="relative overflow-hidden rounded-none">
          <ProgressiveImage
            src={p.src}
            alt={p.alt}
            className="w-full h-auto"
            priority={priority && i === 0}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            cedarHover={false}
          />
        </figure>
      ))}
    </div>
  );
};

export default ProjectGallery;
