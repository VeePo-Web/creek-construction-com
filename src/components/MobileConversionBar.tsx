import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { CONTACT } from "@/config/contact";

/**
 * MobileConversionBar — bottom-fixed dual CTA on `<sm` viewports.
 *
 * Replaces the Quote-only FAB. Phone-preferring leads (~40% of contractor
 * conversions) now have a one-tap path to the line without scrolling.
 *
 * Layout:
 *   [ Get my free quote → ]   [ Call ]
 *      flex-1, cedar pill         auto, cream pill, tel link
 *
 * Visibility rules (unchanged from the FAB):
 *   - Hidden until 600px scroll.
 *   - Hidden when QuoteModal is open.
 *   - Hidden when within 1200px of footer.
 *   - Hidden when any in-view [data-quote-cta] is present.
 *   - Page-level hide via App.tsx route gate (e.g. /contact).
 */
const MobileConversionBar = () => {
  const { open, openModal } = useQuoteModal();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolledPast(y > 600);
        const docEnd = document.documentElement.scrollHeight;
        setNearBottom(y + window.innerHeight > docEnd - 1200);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
      document.querySelectorAll("[data-quote-cta]").forEach((el) => {
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

  const visible = scrolledPast && !open && !ctaInView && !nearBottom;

  return (
    <div
      role="region"
      aria-label="Quick contact"
      aria-hidden={!visible}
      className={[
        "sm:hidden fixed inset-x-0 z-40",
        "bg-background/95 backdrop-blur-[8px] border-t border-cedar/25 shadow-[0_-8px_24px_rgba(0,0,0,0.10)]",
        "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      style={{
        bottom: 0,
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingTop: "0.5rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
      }}
    >
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => openModal()}
          aria-label="Get my free quote"
          tabIndex={visible ? 0 : -1}
          className={[
            "flex-1 inline-flex items-center justify-center gap-2 rounded-sm",
            "bg-cedar text-cedar-foreground",
            "px-4 py-3 min-h-[48px]",
            "text-[11px] tracking-[0.18em] uppercase font-medium",
            "border border-cedar-hover/30 active:scale-[0.98]",
            "transition-transform duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
          ].join(" ")}
        >
          Get my free quote
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
        <a
          href={`tel:${CONTACT.phoneTel}`}
          aria-label={`Call ${CONTACT.phone}`}
          tabIndex={visible ? 0 : -1}
          className={[
            "inline-flex flex-col items-center justify-center gap-0.5 rounded-sm",
            "bg-background text-foreground",
            "px-4 min-h-[48px]",
            "border border-cedar/40 hover:border-cedar/70",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium text-cedar">
            <Phone className="h-3.5 w-3.5" aria-hidden /> Call
          </span>
          <span className="text-[9px] tracking-[0.1em] text-muted-foreground/80">
            {CONTACT.phone}
          </span>
        </a>
      </div>
    </div>
  );
};

export default MobileConversionBar;
