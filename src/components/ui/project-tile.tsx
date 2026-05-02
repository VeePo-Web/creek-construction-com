import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { bronzeStep, BACKDROP } from "@/lib/colors";
import { FOCUS } from "@/lib/motion";
import { useFirstApprovedMedia } from "@/hooks/useApprovedMedia";
import type { ServiceCategory } from "@/lib/api/public-media";

export interface ProjectTileItem {
  title: string;
  location: string;
  description?: string;
  /** Icon used as the placeholder when no photo is supplied. */
  icon?: LucideIcon;
  /** Optional photo. When present, replaces all auto-resolution. */
  image?: { src: string; alt: string; width?: number; height?: number };
  /**
   * When supplied (and `image` is not), the tile auto-resolves a photograph
   * from the cloud library matching this service category. Falls back to a
   * stone editorial plate + icon when nothing matches.
   */
  service?: ServiceCategory;
}

interface ProjectTileProps {
  item: ProjectTileItem;
  index: number;
  total: number;
  /** Click handler — typically `() => openModal([service])`. */
  onClick: () => void;
  /** Aspect ratio of the visual plate. */
  aspect?: "editorial" | "portrait";
  className?: string;
}

/**
 * ProjectTile — the canonical project card used by Portfolio and the /work
 * placeholder grid.
 *
 * Resolution order for the visual plate:
 *   1. `item.image`       — explicit photo prop (highest priority)
 *   2. `item.service`     — auto-fetched first approved photo for that service
 *   3. stone editorial plate + icon — never green, always intentional
 */
const ProjectTile = ({
  item,
  index,
  total,
  onClick,
  aspect = "editorial",
  className,
}: ProjectTileProps) => {
  const Icon = item.icon;
  const opacity = bronzeStep(index, total);
  const aspectClass = aspect === "editorial" ? "aspect-[4/5]" : "aspect-portrait";

  // Auto-resolve a photo from the library when no explicit image is provided.
  const auto = useFirstApprovedMedia(
    !item.image && item.service
      ? { service: item.service, kind: "image", min_quality: "reference" }
      : {},
  );
  const autoPhoto = !item.image && item.service ? auto.item : null;

  const renderVisual = () => {
    if (item.image) {
      return (
        <img
          src={item.image.src}
          alt={item.image.alt}
          width={item.image.width ?? 1200}
          height={item.image.height ?? 1500}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
      );
    }
    if (autoPhoto) {
      return (
        <img
          src={autoPhoto.url}
          alt={autoPhoto.alt}
          width={autoPhoto.width ?? 1200}
          height={autoPhoto.height ?? 1500}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
      );
    }
    // Stone editorial fallback — never green.
    return (
      <>
        <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
        {Icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              className="h-16 w-16 text-cedar/40 group-hover:text-cedar/70 transition-[color,transform] duration-700 group-hover:scale-110"
              aria-hidden
              strokeWidth={1.4}
            />
          </div>
        )}
      </>
    );
  };

  // Background only matters when no image renders on top.
  const hasPhoto = Boolean(item.image || autoPhoto);

  return (
    <article role="listitem" className={cn("group", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn("block w-full text-left rounded-sm", FOCUS.ring)}
        aria-label={`Request a quote like ${item.title}`}
      >
        <div
          className={cn(
            "relative rounded-sm overflow-hidden transition-shadow duration-700 group-hover:shadow-elevated border border-border/40",
            aspectClass,
          )}
          style={hasPhoto ? undefined : { background: BACKDROP.stonePlate }}
        >
          {renderVisual()}

          {/* Bronze accent line — sweeps across on hover. */}
          <div
            className="absolute top-0 left-0 h-px transition-[width] duration-700 group-hover:w-full z-10"
            style={{
              width: "30%",
              background: "linear-gradient(90deg, hsl(var(--cedar)), transparent)",
            }}
          />

          {/* Index numeral — top-right, embossed feel. */}
          <div className="absolute top-5 right-5 pointer-events-none z-10">
            <span
              className={cn(
                "text-4xl md:text-5xl font-serif leading-none select-none transition-colors duration-700 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]",
                hasPhoto
                  ? "text-white/25 group-hover:text-white/55"
                  : "text-cedar/30 group-hover:text-cedar/60",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Caption */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-5 z-10",
              hasPhoto
                ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                : "bg-gradient-to-t from-cedar/[0.08] to-transparent",
            )}
          >
            <p
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase mb-1.5",
                hasPhoto ? "text-cedar/90" : "text-cedar/80",
              )}
            >
              {item.location}
            </p>
            <h3
              className={cn(
                "font-serif text-lg md:text-xl",
                hasPhoto ? "text-white" : "text-foreground",
              )}
            >
              {item.title}
            </h3>
          </div>
        </div>

        {item.description && (
          <div
            className="mt-4 pl-5 py-3 pr-4 transition-[background-color,padding-left,border-color] duration-500 group-hover:bg-cedar/[0.04] group-hover:pl-7 group-hover:border-cedar/30 rounded-sm shadow-contact border border-border/40"
            style={{ borderLeft: `2px solid hsl(var(--cedar) / ${opacity})` }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        )}
      </button>
    </article>
  );
};

export default ProjectTile;
