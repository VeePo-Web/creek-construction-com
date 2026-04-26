/**
 * useScrollChrome — scroll-aware header state.
 *
 * Returns:
 *   - `isScrolled`  → true after the user has scrolled past `threshold` px.
 *                     The header uses this to swap from transparent to
 *                     `bg-background/85 backdrop-blur` with a hairline border.
 *   - `isAtFooter`  → true when the page footer has scrolled into view.
 *                     The section rail and phone link fade out so the
 *                     footer's own conversion moment can breathe.
 *
 * Performance: one rAF-throttled scroll listener + one IntersectionObserver.
 * No per-frame React re-renders (state only changes on threshold crossings).
 */

import { useEffect, useState } from "react";

interface ScrollChromeOptions {
  /** px scrolled before `isScrolled` flips to true. Default 32. */
  threshold?: number;
  /** id of the footer element to observe. Default "site-footer". */
  footerId?: string;
}

export function useScrollChrome(options: ScrollChromeOptions = {}) {
  const { threshold = 32, footerId = "site-footer" } = options;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);

  // Throttled scroll listener using rAF — no setState every frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;

    const measure = () => {
      const next = window.scrollY > threshold;
      setIsScrolled((prev) => (prev === next ? prev : next));
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  // Footer visibility — IO so we don't pay for scroll math we don't need.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(footerId);
    if (!el) {
      setIsAtFooter(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // "At footer" once 30% of the footer is visible — gives the
        // chrome time to fade before the user reaches the conversion CTA.
        setIsAtFooter(entry.intersectionRatio > 0.3);
      },
      { root: null, threshold: [0, 0.3, 0.6, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [footerId]);

  return { isScrolled, isAtFooter };
}

export default useScrollChrome;
