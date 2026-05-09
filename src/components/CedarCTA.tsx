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
  /** CTA label. Defaults to the canonical site phrase. */
  children?: string;
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
const CedarCTA = ({
  to,
  preselectServices,
  children = "Get my free quote",
  variant = "primary",
  className,
  onActivate,
}: CedarCTAProps) => {
  const { openModal } = useQuoteModal();

  const secondaryClass = cn(
    "text-minimal text-cedar hover:text-cedar-hover transition-colors duration-300 group/link inline-flex items-center gap-3 min-h-[44px] py-2 px-1 rounded-sm",
    "focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    className,
  );

  // Primary: Pass 35 — flat bronze, no shimmer, no tracking-shift, no glow.
  const primaryClass = cn(
    BUTTON.primary.base,
    "px-8 py-4 sm:px-10 sm:py-5",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
    BUTTON.primary.disabled,
    "active:scale-[0.98] cursor-pointer border-none group/cta",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    className,
  );

  const className_ = variant === "secondary" ? secondaryClass : primaryClass;

  const inner = (
    <>
      <span>{children}</span>
      {variant === "secondary" ? (
        <span className="inline-block w-4 h-px bg-gradient-to-r from-cedar to-cedar/60 group-hover/link:w-8 transition-[width] duration-500" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5 group-hover/cta:translate-x-1 transition-transform duration-500" aria-hidden="true" />
      )}
    </>
  );

  // [data-quote-cta] is a sentinel observed by MobileQuoteFAB so the floating
  // pill hides whenever any in-page primary CTA is on screen. Only the primary
  // variant is treated as a funnel anchor — the secondary "learn more" arrow
  // link should not suppress the FAB.
  const dataAttr = variant === "primary" ? { "data-quote-cta": "true" as const } : {};

  if (to) {
    return (
      <Link to={to} className={className_} {...dataAttr}>
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
      {...dataAttr}
    >
      {inner}
    </button>
  );
};

export default CedarCTA;
