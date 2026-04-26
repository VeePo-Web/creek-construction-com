import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  /** Display label. */
  label: string;
  /** Route to navigate to. Omit to render as the current page. */
  to?: string;
}

interface BreadcrumbTrailProps {
  items: BreadcrumbItem[];
  /** Use light-on-dark variant for evergreen / cinematic hero contexts. */
  onDark?: boolean;
  className?: string;
}

/**
 * BreadcrumbTrail — the canonical breadcrumb used in every sub-page hero.
 *
 *   Home  ·  Services
 *
 * Replaces three different hand-rolled implementations (SubPageHero,
 * Services/Work/About/Contact pages, NarrativeBreadcrumb). 44px min
 * touch targets baked in for WCAG.
 */
const BreadcrumbTrail = ({ items, onDark = false, className }: BreadcrumbTrailProps) => {
  const linkClass = onDark
    ? "text-evergreen-foreground/40 hover:text-cedar"
    : "text-muted-foreground/60 hover:text-cedar";
  const sepClass = onDark ? "text-evergreen-foreground/20" : "text-muted-foreground/30";
  const currentClass = "text-cedar/80";
  const baseLink =
    "text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 min-h-[44px] flex items-center";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 flex-wrap", className)}
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 && <span className={sepClass} aria-hidden>·</span>}
          {item.to ? (
            <Link to={item.to} className={cn(baseLink, linkClass)}>
              {item.label}
            </Link>
          ) : (
            <span className={cn(baseLink, currentClass)} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default BreadcrumbTrail;
