import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CedarCTAProps {
  to: string;
  children: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * CedarCTA — the brand's primary call-to-action button.
 * Primary: solid cedar background with thermal glow on hover.
 * Secondary: text-only cedar link with expanding line.
 */
const CedarCTA = ({ to, children, variant = "primary", className }: CedarCTAProps) => {
  if (variant === "secondary") {
    return (
      <Link
        to={to}
        className={cn(
          "text-minimal text-cedar hover:text-cedar-hover transition-all duration-500 group/link flex items-center gap-2 min-h-[44px] py-2 px-1 rounded-sm",
          "hover:bg-cedar/[0.04] hover:px-3",
          "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
          className,
        )}
      >
        <span>{children}</span>
        <span className="inline-block w-4 h-px bg-gradient-to-r from-cedar to-cedar/60 group-hover/link:w-10 transition-all duration-500 shadow-[0_0_4px_hsl(28_50%_52%/0.2)]" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "cta-thermal inline-flex items-center gap-3 text-minimal bg-cedar text-cedar-foreground px-10 py-5 rounded-sm",
        "hover:bg-cedar-hover hover:tracking-[0.18em] transition-all duration-500",
        "shadow-[inset_0_1px_0_hsl(28_60%_62%/0.35),0_2px_8px_hsl(28_50%_52%/0.15)]",
        "hover:shadow-[inset_0_1px_0_hsl(28_60%_65%/0.4),0_0_28px_hsl(28_50%_52%/0.35),0_6px_20px_hsl(28_50%_52%/0.2)]",
        "active:scale-[0.98] active:shadow-[inset_0_2px_4px_hsl(28_40%_40%/0.2),0_0_12px_hsl(28_50%_52%/0.2)]",
        "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        "group/cta",
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight className="h-3.5 w-3.5 group-hover/cta:translate-x-1" aria-hidden="true" style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
    </Link>
  );
};

export default CedarCTA;
