import { Link } from "react-router-dom";
import logo from "@/assets/creek-logo-nav-sm.png";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Use light treatment when sitting over dark surfaces. */
  onDark?: boolean;
  className?: string;
}

/**
 * BrandMark — the canonical Creek logo + eyebrow stack used in the header.
 *
 * Always wraps the logo in a real <Link to="/"> with a 44px touch target.
 * The wordmark is *always* visible (even on mobile) — the brand name is
 * non-negotiable. The italic eyebrow says what the company *is* rather
 * than where it works (cities live in the GlobalMenu instead, so we
 * don't duplicate the hero eyebrow).
 */
const BrandMark = ({ onDark = false, className }: BrandMarkProps) => {
  const titleClass = onDark
    ? "text-evergreen-foreground"
    : "text-evergreen";

  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 sm:gap-3 min-h-[44px] group/brand",
        className,
      )}
      aria-label="Creek Construction — home"
    >
      <img
        src={logo}
        alt=""
        width={44}
        height={44}
        className="h-9 w-9 md:h-11 md:w-11 object-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/brand:scale-[1.03]"
      />
      {/* Wordmark — always visible. Section rail removed so there is no
          competing center element at any breakpoint. */}
      <div className="block">
        <p
          className={cn(
            "font-serif leading-none whitespace-nowrap transition-colors duration-300",
            "text-[15px] sm:text-base md:text-[15px] lg:text-lg",
            titleClass,
            "group-hover/brand:text-cedar",
          )}
        >
          Creek Construction
        </p>
      </div>
    </Link>
  );
};

export default BrandMark;
