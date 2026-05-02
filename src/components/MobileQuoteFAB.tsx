import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";

/**
 * MobileQuoteFAB — sticky cedar pill on `<sm` viewports.
 *
 * The conversion problem this solves: on long mobile pages the user
 * scrolls past the hero CTA and has no way to start a quote without
 * scrolling all the way to the page closer. This pins the action to
 * the bottom-right at all times.
 *
 * Visibility rules:
 *   - Only renders below `sm` (640px) — desktop has the always-visible
 *     Quote button in the nav chrome.
 *   - Hidden until the user has scrolled past 600px.
 *   - Hidden when the QuoteModal is open.
 *   - Hidden when ANY in-page primary CTA marked with [data-quote-cta]
 *     is visible — this avoids stacking the FAB on top of the page's
 *     own primary CTA. The set of CTAs is observed live, so newly-
 *     mounted CTAs (e.g. a lazy-loaded closer) are picked up.
 */
const MobileQuoteFAB = () => {
  const { open, openModal } = useQuoteModal();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  // Scroll threshold — 600px is roughly past the hero CTA on a mobile
  // viewport. rAF-throttled.
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

  // Observe every [data-quote-cta] anchor on the page. When at least one
  // is on screen, hide the FAB. A MutationObserver keeps the set in sync
  // as React mounts/unmounts CTAs (modal trigger, lazy-loaded sections).
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setCtaInView(visible.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    const observed = new WeakSet<Element>();
    const sync = () => {
      const targets = document.querySelectorAll("[data-quote-cta]");
      targets.forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };
    sync();

    const mo = new MutationObserver(() => sync());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  const visible = scrolledPast && !open && !ctaInView;

  return (
    <button
      type="button"
      onClick={() => openModal()}
      aria-label="Get my free quote"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={[
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
      Get my free quote
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
};

export default MobileQuoteFAB;
