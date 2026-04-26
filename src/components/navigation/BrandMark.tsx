import { Link } from "react-router-dom";
import logo from "@/assets/creek-logo-nav-sm.png";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Use light treatment when sitting over dark surfaces. */
  onDark?: boolean;
  /** Hide the wordmark stack on very small screens (saves the 64px row). */
  compact?: boolean;
  className?: string;
}

/**
 * BrandMark — the canonical Creek logo + locale stack used in the header.
 *
 * Always wraps the logo in a real <Link to="/"> with a 44px touch target.
 * Keeps the wordmark stack hidden on `<sm` so the mobile header never
 * crowds the hamburger.
 */
const BrandMark = ({ onDark = false, compact = false, className }: BrandMarkProps) => {
  const titleClass = onDark
    ? "text-evergreen-foreground"
    : "text-evergreen";
  const localeClass = onDark
    ? "text-evergreen-foreground/60"
    : "text-muted-foreground";

  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3 min-h-[44px]", className)}
      aria-label="Creek Construction — home"
    >
      <img
        src={logo}
        alt=""
        width={44}
        height={44}
        className="h-9 w-9 md:h-11 md:w-11 object-contain"
      />
      {!compact && (
        <div className="hidden sm:block">
          <p className={cn("font-serif text-base md:text-lg leading-none", titleClass)}>
            Creek Construction
          </p>
          <p className={cn("text-[10px] tracking-[0.2em] uppercase mt-1", localeClass)}>
            Calgary · Edmonton
          </p>
        </div>
      )}
    </Link>
  );
};

export default BrandMark;
