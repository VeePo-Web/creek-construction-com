import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { BUTTON } from "@/lib/colors";

interface CedarCTAProps {
  /** Either pass `to` for a route link, OR omit it to open the quote modal. */
  to?: string;
  /** Service IDs to preselect when opening the modal. */
  preselectServices?: string[];
  children: string;
  variant?: "primary" | "secondary";
  className?: string;
  /**
   * Optional side-effect to run *before* the modal opens (e.g. closing
   * a menu). Runs synchronously; modal opens immediately after.
   */
  onActivate?: () => void;
}

/**
 * Primary site CTA. By default opens the global QuoteModal.
 * Pass `to` to render a normal route Link instead.
 *
 * Composes BUTTON.primary (base · hover · focus · transition) from the
 * design tokens. The thermal shimmer comes from the .cta-thermal utility
 * in src/index.css.
 */
const CedarCTA = ({ to, preselectServices, children, variant = "primary", className, onActivate }: CedarCTAProps) => {
  const { openModal } = useQuoteModal();

  const secondaryClass = cn(
    "text-minimal text-cedar hover:text-cedar-hover transition-all duration-500 group/link inline-flex items-center gap-2 min-h-[44px] py-2 px-1 rounded-sm",
    "hover:bg-cedar/[0.04] hover:px-3",
    "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    className,
  );

  // Primary: tokenized BUTTON.primary + thermal shimmer + scale-on-press.
  // px-10 py-5 overrides BUTTON.primary's px-8 py-4 for the larger hero CTA scale.
  const primaryClass = cn(
    BUTTON.primary.base,
    "px-10 py-5",
    "cta-thermal",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
    BUTTON.primary.disabled,
    "active:scale-[0.98] cursor-pointer border-none group/cta",
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
      onClick={() => {
        onActivate?.();
        openModal(preselectServices);
      }}
      className={className_}
    >
      {inner}
    </button>
  );
};

export default CedarCTA;
