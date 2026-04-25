import { useEffect, useRef } from "react";

/**
 * Combines Ken Burns idle drift with scroll-based parallax for sub-page heroes.
 * Returns a ref to attach to the hero <img> element.
 */
export function useHeroParallax() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const img = imgRef.current;
    if (!img) return;

    if (prefersReducedMotion) {
      img.style.transform = "scale(1.12)";
      return;
    }

    // Apply Ken Burns drift animation for idle cinematic depth
    img.style.animation = "hero-drift 20s ease-in-out infinite";
    img.style.willChange = "transform";

    let ticking = false;
    let driftSuppressed = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Once scrolling begins, suppress drift and switch to parallax
          if (scrollY > 10 && !driftSuppressed) {
            driftSuppressed = true;
            img.style.animation = "none";
          }

          // Re-enable drift at top of page
          if (scrollY <= 10 && driftSuppressed) {
            driftSuppressed = false;
            img.style.animation = "hero-drift 20s ease-in-out infinite";
          }

          if (driftSuppressed) {
            const offset = Math.min(scrollY * 0.25, 150);
            img.style.transform = `translateY(${offset}px) scale(1.12)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (img) img.style.willChange = "auto";
    };
  }, []);

  return imgRef;
}
