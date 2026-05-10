import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustChipItem {
  icon: LucideIcon;
  label: string;
}

interface TrustChipsProps {
  items: TrustChipItem[];
  /** "rule" — comma-separated editorial row (default).
   *  "badge" — boxed chips for forms / dense UI. */
  variant?: "rule" | "badge";
  /** Force on-dark color variants (evergreen surfaces). */
  onDark?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * TrustChips — the canonical signal row used in the hero & sub-page heroes.
 *
 * Default `rule` variant renders as a single comma-separated micro-line with
 * thin vertical hairlines between items — the Aesop / Fantasy treatment.
 * The `badge` variant retains the boxed-pill look for form contexts.
 */
const TrustChips = ({
  items,
  variant = "rule",
  onDark = false,
  className,
  ariaLabel = "Trust signals",
}: TrustChipsProps) => {
  if (variant === "badge") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)} role="list" aria-label={ariaLabel}>
        {items.map(({ icon: Icon, label }) => (
          <span
            key={label}
            role="listitem"
            className="inline-flex items-center gap-2 px-3 py-1.5"
          >
            <Icon className="h-3 w-3 text-cedar/80" aria-hidden strokeWidth={1.6} />
            <span
              className={cn(
                "eyebrow font-normal",
                onDark ? "text-evergreen-foreground/70" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </span>
        ))}
      </div>
    );
  }

  // rule (default)
  const textColor = onDark ? "text-evergreen-foreground/65" : "text-muted-foreground";
  const dividerColor = onDark ? "bg-evergreen-foreground/15" : "bg-border";
  const iconColor = "text-cedar/80";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map(({ icon: Icon, label }, i) => (
        <span key={label} role="listitem" className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className={cn("hidden sm:inline-block w-px h-3", dividerColor)} />}
          <Icon className={cn("h-3 w-3 shrink-0", iconColor)} aria-hidden strokeWidth={1.6} />
          <span className={cn("eyebrow font-normal", textColor)}>
            {label}
          </span>
        </span>
      ))}
    </div>
  );
};

export default TrustChips;
