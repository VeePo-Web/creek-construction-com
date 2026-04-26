import { useEffect, useRef, useState } from "react";

/**
 * useReveal — single shared IntersectionObserver scroll-reveal hook.
 *
 * Replaces the per-element framer-motion `<ScrollRevealMotion>` wrapper
 * (which spun up an IO instance + framer subscription per node, ~80×
 * across the homepage). One module-level observer, CSS-only animation,
 * zero JS animation loop.
 *
 * Usage:
 *   const { ref, cls } = useReveal({ delay: 200 });
 *   <div ref={ref} className={cn("…", cls)}>…</div>
 *
 * The class output drives the transition via Tailwind:
 *   - hidden: opacity-0 translate-y-3
 *   - shown:  opacity-100 translate-y-0
 *   - both:   transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
 *
 * Reduced-motion: starts visible, no observation, no transition cost.
 */

// One IO for the whole app. Using rootMargin -60px so elements fade in
// just before they reach the viewport (matches the prior framer config).
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getObserver() {
  if (sharedObserver || typeof window === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const cb = callbacks.get(entry.target);
          cb?.();
          sharedObserver!.unobserve(entry.target);
          callbacks.delete(entry.target);
        }
      }
    },
    { rootMargin: "-60px", threshold: 0 },
  );
  return sharedObserver;
}

interface UseRevealOptions {
  /** Optional delay in ms before the transition starts (CSS transition-delay). */
  delay?: number;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const { delay = 0 } = options;
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: skip the observer entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = getObserver();
    if (!observer) {
      setShown(true);
      return;
    }

    callbacks.set(el, () => setShown(true));
    observer.observe(el);

    return () => {
      callbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  const baseTransition =
    "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

  const visibility = shown
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  const cls = `${baseTransition} ${visibility}`;

  // Inline style for delay so each callsite can stagger without a class explosion.
  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return { ref, cls, style, shown };
}

export default useReveal;
