import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { cn } from "@/lib/utils";

/**
 * FloatingQuoteCTA — persistent bottom-right conversion anchor.
 *
 * Pass 30 — Fly4Me transposition. Single-purpose, never moves, never
 * fades. Creek voice: warm evergreen surface with a cedar accent bar
 * on the left edge to keep the brand language. Hidden on /contact
 * (already at the funnel terminus) and during the first 100px of scroll
 * so the hero gets a clean first impression.
 */
const FloatingQuoteCTA = () => {
  const { openModal } = useQuoteModal();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        setShow(window.scrollY > 120);
        pending = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (pathname === "/contact") return null;

  return (
    <button
      type="button"
      onClick={() => openModal()}
      aria-label="Get a free quote"
      className={cn(
        "fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40",
        "group inline-flex items-center gap-2.5",
        "bg-evergreen text-evergreen-foreground",
        "border-l-[3px] border-cedar",
        "pl-4 pr-5 py-3 md:pl-5 md:pr-6 md:py-3.5",
        "text-[11px] md:text-xs tracking-[0.18em] uppercase font-medium",
        "shadow-[0_8px_30px_rgba(0,0,0,0.18)]",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.24)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        "min-h-[44px]",
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      Get a quote
      <span aria-hidden className="link-arrow text-cedar">↗</span>
    </button>
  );
};

export default FloatingQuoteCTA;
