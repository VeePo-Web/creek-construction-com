import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import BronzeRule from "@/components/ui/bronze-rule";

interface HeroProvenanceCardProps {
  /** Short uppercase eyebrow above the heading. e.g. "BUILT ON THE WORK" */
  eyebrow?: string;
  /** Primary heading inside the card. */
  heading?: string;
  /** Optional supporting copy under the heading. */
  body?: string;
  /** Optional location · year line rendered tab-num. */
  location?: string;
  year?: number;
  /** Optional service label (decks · fencing · sheds). */
  service?: string;
  /** Render arbitrary children (e.g. StatTrio) instead of the default body. */
  children?: ReactNode;
  /** Glassmorphic vs. solid surface. Default glass. */
  surface?: "glass" | "solid";
  /** Reduce horizontal padding for compact contexts. */
  compact?: boolean;
  /** Render with the entrance animation. Default true. */
  animate?: boolean;
  /** Stagger this card behind a hero choreography (in ms). */
  delayMs?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * HeroProvenanceCard — the floating "receipt" that anchors every hero.
 *
 * Sits over the bottom-left corner of cinematic photographs. Glassmorphic
 * by default. Can render an eyebrow, heading, body, a location/year/service
 * meta line, or arbitrary children (StatTrio, CTA stack).
 *
 * Discipline:
 *   - Never overlaps the headline.
 *   - Always wraps below `lg` so mobile gets full width.
 *   - Animates in via .hero-provenance-enter (CSS, reduced-motion safe).
 */
const HeroProvenanceCard = ({
  eyebrow,
  heading,
  body,
  location,
  year,
  service,
  children,
  surface = "glass",
  compact = false,
  animate = true,
  delayMs = 1300,
  className,
  ariaLabel,
}: HeroProvenanceCardProps) => {
  const meta = [service, location, year ? String(year) : null]
    .filter(Boolean)
    .join(" · ");

  const surfaceStyle =
    surface === "glass"
      ? {
          background: "hsl(var(--surface-card) / 0.96)",
          border: "1px solid hsl(var(--surface-card-border))",
          backdropFilter: "blur(14px) saturate(1.15)",
          WebkitBackdropFilter: "blur(14px) saturate(1.15)",
        }
      : {
          background: "hsl(var(--surface-card))",
          border: "1px solid hsl(var(--surface-card-border))",
        };

  return (
    <aside
      aria-label={ariaLabel ?? heading ?? "Project details"}
      className={cn(
        "rounded-[10px] shadow-float",
        compact ? "px-5 py-4" : "px-6 py-5 md:px-7 md:py-6",
        animate ? "hero-provenance-enter" : undefined,
        className,
      )}
      style={
        {
          ...surfaceStyle,
          "--kinetic-delay": `${delayMs}ms`,
        } as React.CSSProperties
      }
    >
      {(eyebrow || meta) && (
        <BronzeRule
          label={eyebrow ?? meta}
          variant="accent"
          width="short"
          className="mb-3"
        />
      )}

      {heading && (
        <p className="font-serif text-foreground text-lg md:text-xl leading-snug mb-2 text-balance">
          {heading}
        </p>
      )}

      {body && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {body}
        </p>
      )}

      {eyebrow && meta && (
        <p className="mt-3 text-[10px] tracking-[0.22em] uppercase text-muted-foreground/65 tabular-nums">
          {meta}
        </p>
      )}

      {children && <div className={cn(heading || body ? "mt-4" : "")}>{children}</div>}
    </aside>
  );
};

export default HeroProvenanceCard;
