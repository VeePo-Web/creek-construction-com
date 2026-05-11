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
        className="h-9 w-9 md:h-11 md:w-11 object-contain transition-transform duration-500 group-hover/brand:scale-[1.03]"
      />
      {/* Wordmark stack — hidden in the cramped md→lg band so the section
          rail and right cluster have room to breathe. The logo medallion
          alone carries the brand at tablet sizes. Wordmark returns at lg. */}
      <div className="block md:hidden lg:block">
        <p
          className={cn(
            "font-serif leading-none whitespace-nowrap",
            "text-[15px] sm:text-base lg:text-lg",
            titleClass,
          )}
        >
          Creek Construction
        </p>
      </div>
    </Link>
  );
};

export default BrandMark;
