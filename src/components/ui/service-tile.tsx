import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOCUS } from "@/lib/motion";
import { HEADLINE } from "@/lib/typography";

export interface ServiceTileItem {
  /** Stable id (used for modal pre-selection). */
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ServiceTileProps {
  item: ServiceTileItem;
  /** 0-indexed position in the row, drives the bronze gradient. */
  index: number;
  /** Total tiles in the row, drives the bronze gradient. */
  total: number;
  /** Click handler — typically `() => openModal([item.id])`. */
  onClick: () => void;
  /** Layout variant. */
  variant?: "row" | "compact";
  className?: string;
}

/**
 * ServiceTile — the canonical service card used on the homepage Services
 * section AND the /services list page. One implementation, two callsites.
 *
 * Composes bronzeStep() for the left-border crescendo and HEADLINE.card
 * for the title. Hover: lift + warm cedar tint + tracking shift.
 */
const ServiceTile = ({
  item,
  index,
  total,
  onClick,
  variant = "row",
  className,
}: ServiceTileProps) => {
  const Icon = item.icon;
  const isCompact = variant === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      role="listitem"
      aria-label={`Request a quote for ${item.title}`}
      className={cn(
        "group relative w-full text-left transition-[background-color] duration-300",
        "hover:bg-cedar/[0.025]",
        FOCUS.ring,
        isCompact ? "flex items-start gap-5 p-6" : "flex flex-col items-stretch p-6",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]"
      />
      {isCompact ? (
        <>
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <Icon className="h-5 w-5 text-cedar" aria-hidden strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3 className={HEADLINE.card}>
                {item.title}
              </h3>
              <span className="eyebrow tabular-nums opacity-40">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <Icon
              className="h-5 w-5 text-cedar/70 transition-colors duration-500 group-hover:text-cedar"
              aria-hidden
              strokeWidth={1.5}
            />
            <span className="eyebrow tabular-nums opacity-50">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className={cn(HEADLINE.card, "mb-2")}>
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
          <span className="eyebrow mt-4 transition-opacity duration-500 opacity-80 group-hover:opacity-100">
            Quote this →
          </span>
        </>
      )}
    </button>
  );
};

export default ServiceTile;
