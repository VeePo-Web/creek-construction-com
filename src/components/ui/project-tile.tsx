import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { bronzeStep, BACKDROP } from "@/lib/colors";
import { FOCUS } from "@/lib/motion";

export interface ProjectTileItem {
  title: string;
  location: string;
  description?: string;
  /** Icon used as the placeholder when no photo is supplied. */
  icon?: LucideIcon;
  /** Optional photo. When present, replaces the icon plate. */
  image?: { src: string; alt: string; width?: number; height?: number };
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
 * placeholder grid. Photo-led when an image is supplied, evergreen plate
 * with icon when not.
 *
 * Replaces two duplicate hand-rolled card implementations.
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
            "relative rounded-sm overflow-hidden transition-all duration-700 group-hover:shadow-elevated",
            aspectClass,
          )}
          style={item.image ? undefined : { background: BACKDROP.evergreenPlate }}
        >
          {item.image ? (
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
          ) : (
            <>
              <div className="absolute inset-0 grain-overlay opacity-50 pointer-events-none" />
              {Icon && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    className="h-16 w-16 text-cedar/30 group-hover:text-cedar/55 transition-all duration-700 group-hover:scale-110"
                    aria-hidden
                    strokeWidth={1.4}
                  />
                </div>
              )}
            </>
          )}

          {/* Bronze accent line — sweeps across on hover. */}
          <div
            className="absolute top-0 left-0 h-px transition-all duration-700 group-hover:w-full z-10"
            style={{
              width: "30%",
              background: "linear-gradient(90deg, hsl(var(--cedar)), transparent)",
            }}
          />

          {/* Index numeral — top-right, embossed feel. */}
          <div className="absolute top-5 right-5 pointer-events-none z-10">
            <span className="text-white/25 text-4xl md:text-5xl font-serif leading-none select-none group-hover:text-white/55 transition-all duration-700 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-cedar/90 mb-1.5">
              {item.location}
            </p>
            <h3 className="font-serif text-lg md:text-xl text-white">{item.title}</h3>
          </div>
        </div>

        {item.description && (
          <div
            className="mt-4 pl-5 py-3 pr-4 transition-all duration-500 group-hover:bg-cedar/[0.04] group-hover:pl-7 rounded-sm shadow-contact border border-border/40 group-hover:shadow-elevated"
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
