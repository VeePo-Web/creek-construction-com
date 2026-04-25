import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      const children = el.querySelectorAll("[data-reveal-child]");
      children.forEach((child) => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.opacity = "1";
        htmlChild.style.transform = "none";
      });
      return;
    }

    // Set initial hidden state
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)";

    // Stagger children with optional per-element delay override
    const children = el.querySelectorAll("[data-reveal-child]");
    children.forEach((child, i) => {
      const htmlChild = child as HTMLElement;
      const customDelay = htmlChild.getAttribute("data-reveal-delay");
      const delay = customDelay ? parseFloat(customDelay) : i * 0.1;
      htmlChild.style.opacity = "0";
      htmlChild.style.transform = "translateY(30px)";
      htmlChild.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          children.forEach((child) => {
            const htmlChild = child as HTMLElement;
            htmlChild.style.opacity = "1";
            htmlChild.style.transform = "translateY(0)";
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
