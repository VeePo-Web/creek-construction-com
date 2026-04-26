import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

/**
 * MobileQuoteFAB — sticky cedar pill on `<sm` viewports.
 *
 * The conversion problem this solves: on long mobile pages the user
 * scrolls past the hero CTA and has no way to start a quote without
 * scrolling all the way to Contact. This pins the action to the
 * bottom-right at all times.
 *
 * Visibility rules:
 *   - Only renders below `sm` (640px) — desktop has the always-visible
 *     Quote button in the nav chrome.
 *   - Hidden until the user has scrolled past 600px (no double-CTA
 *     above the fold while the hero CTA is in view).
 *   - Hidden when the QuoteModal is open (we don't need a CTA to open
 *     a thing that's already open).
 *   - Hidden when the user is inside `#section-contact` (the page's
 *     own primary CTA is already visible).
 *   - Respects `prefers-reduced-motion` for the slide-up entrance.
 */
const MobileQuoteFAB = () => {
  const { open, openModal } = useQuoteModal();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [inContact, setInContact] = useState(false);

  // Scroll threshold — 600px is roughly past the hero CTA on a mobile
  // viewport. Throttled via requestAnimationFrame so we don't pay a
  // listener cost per scroll event.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolledPast(window.scrollY > 600);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Watch for `#section-contact` entering the viewport — when it does,
  // hide the FAB so we don't double-stack CTAs.
  useEffect(() => {
    const target = document.getElementById("section-contact");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setInContact(entry.isIntersecting),
      { rootMargin: "0px 0px -30% 0px" },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const visible = scrolledPast && !open && !inContact;

  return (
    <button
      type="button"
      onClick={() => openModal()}
      aria-label="Request a quote"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={[
        // Position: bottom-right, respects iOS home indicator
        "sm:hidden fixed right-4 z-40",
        "inline-flex items-center gap-2 px-5 py-3.5 rounded-full",
        "bg-cedar text-cedar-foreground",
        "text-[11px] tracking-[0.18em] uppercase font-medium",
        "shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        "border border-cedar-hover/30",
        "active:scale-[0.97]",
        "transition-[opacity,transform] duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      Request a Quote
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
};

export default MobileQuoteFAB;
