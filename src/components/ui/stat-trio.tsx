import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import { bronzeStep } from "@/lib/colors";
import { useRef } from "react";

export interface StatItem {
  /** Numeric value. Use 0 for static labels. */
  value: number;
  /** Decorative prefix shown before the count-up (e.g. "$"). */
  prefix?: string;
  /** Decorative suffix (e.g. "+", "h", "%"). */
  suffix?: string;
  /** Short descriptor under the number. */
  label: string;
  /** Optional uppercase eyebrow above the number (e.g. "SERVING"). */
  heading?: string;
  /** Optional one-line caption beneath label. */
  note?: string;
  /** Skip the count-up and render the number as static text. */
  static?: boolean;
}

interface StatTrioProps {
  items: StatItem[];
  /** Layout & color variant. */
  variant?: "card" | "inline" | "footer";
  className?: string;
  ariaLabel?: string;
}

const StatRow = ({
  item,
  index,
  total,
  variant,
}: {
  item: StatItem;
  index: number;
  total: number;
  variant: "card" | "inline" | "footer";
}) => {
  const fallbackRef = useRef<HTMLParagraphElement>(null);
  const display = `${item.prefix ?? ""}${item.value}${item.suffix ?? ""}`;
  const { ref, display: liveDisplay } = useCountUp({
    end: item.value,
    prefix: item.prefix,
    suffix: item.suffix,
    duration: 1.8,
    decimals: 0,
  });

  const onDark = variant === "footer";
  const opacity = bronzeStep(index, total);

  if (variant === "inline") {
    return (
      <div className="text-left">
        <p className="font-serif text-2xl md:text-[1.75rem] text-foreground leading-none tabular-nums">
          {display}
        </p>
        <p className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 mt-2 leading-tight">
          {item.label}
        </p>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      className={cn(
        "group/stat cursor-default rounded-sm transition-all duration-500 focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        variant === "card" && "py-3 pl-5 hover:pl-7 hover:bg-accent/[0.04] border border-border/40 grain-texture shadow-contact hover:shadow-elevated",
        variant === "footer" && "py-2",
      )}
      style={
        variant === "card"
          ? { borderLeft: `2px solid hsl(var(--cedar) / ${opacity})` }
          : undefined
      }
    >
      {item.heading && (
        <h3
          className={cn(
            "text-[10px] tracking-[0.25em] uppercase mb-3 font-medium",
            onDark ? "text-cedar/80" : "text-muted-foreground",
          )}
        >
          {item.heading}
        </h3>
      )}
      <p
        ref={item.static ? fallbackRef : (ref as React.RefObject<HTMLParagraphElement>)}
        className={cn(
          "font-serif text-3xl md:text-4xl leading-none tabular-nums transition-colors duration-500",
          onDark ? "text-evergreen-foreground" : "text-foreground group-hover/stat:text-cedar",
        )}
      >
        {item.static ? display : liveDisplay}
      </p>
      <p className={cn("mt-1 text-sm", onDark ? "text-evergreen-foreground/60" : "text-muted-foreground")}>
        {item.label}
      </p>
      {item.note && (
        <p
          className={cn(
            "text-xs mt-1 transition-colors duration-500",
            onDark ? "text-evergreen-foreground/40" : "text-muted-foreground/70 group-hover/stat:text-cedar/50",
          )}
        >
          {item.note}
        </p>
      )}
    </div>
  );
};

/**
 * StatTrio — the canonical 3-up stat row.
 *
 * Variants:
 *   - "card"   → bronze-step border-left, hover lift (About section)
 *   - "inline" → compact serif numbers, used inside floating hero card
 *   - "footer" → on-dark, evergreen-foreground colors (Footer)
 *
 * Replaces three different hand-rolled implementations across the site.
 */
const StatTrio = ({ items, variant = "inline", className, ariaLabel }: StatTrioProps) => {
  return (
    <div
      className={cn(
        "grid",
        variant === "inline" ? "grid-cols-3 gap-4" : "grid-cols-1 sm:grid-cols-3 gap-4",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      {items.map((item, i) => (
        <StatRow key={item.label} item={item} index={i} total={items.length} variant={variant} />
      ))}
    </div>
  );
};

export default StatTrio;
