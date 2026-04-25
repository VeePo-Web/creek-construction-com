import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

interface CedarCTAProps {
  /** Either pass `to` for a route link, OR omit it to open the quote modal. */
  to?: string;
  /** Service IDs to preselect when opening the modal. */
  preselectServices?: string[];
  children: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Primary site CTA. By default opens the global QuoteModal.
 * Pass `to` to render a normal route Link instead.
 */
const CedarCTA = ({ to, preselectServices, children, variant = "primary", className }: CedarCTAProps) => {
  const { openModal } = useQuoteModal();

  const secondaryClass = cn(
    "text-minimal text-cedar hover:text-cedar-hover transition-all duration-500 group/link inline-flex items-center gap-2 min-h-[44px] py-2 px-1 rounded-sm",
    "hover:bg-cedar/[0.04] hover:px-3",
    "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    className,
  );

  const primaryClass = cn(
    "cta-thermal inline-flex items-center gap-3 text-minimal bg-cedar text-cedar-foreground px-10 py-5 rounded-sm",
    "hover:bg-cedar-hover hover:tracking-[0.18em] transition-all duration-500",
    "shadow-[inset_0_1px_0_hsl(28_60%_62%/0.35),0_2px_8px_hsl(28_50%_52%/0.15)]",
    "hover:shadow-[inset_0_1px_0_hsl(28_60%_65%/0.4),0_0_28px_hsl(28_50%_52%/0.35),0_6px_20px_hsl(28_50%_52%/0.2)]",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    "group/cta border-none cursor-pointer",
    className,
  );

  const className_ = variant === "secondary" ? secondaryClass : primaryClass;

  const inner = (
    <>
      <span>{children}</span>
      {variant === "secondary" ? (
        <span className="inline-block w-4 h-px bg-gradient-to-r from-cedar to-cedar/60 group-hover/link:w-10 transition-all duration-500" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5 group-hover/cta:translate-x-1 transition-transform duration-500" aria-hidden="true" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className_}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openModal(preselectServices)}
      className={className_}
    >
      {inner}
    </button>
  );
};

export default CedarCTA;
