/**
 * useHeroPreload — inject a `<link rel="preload" as="image">` into <head>
 * for the LCP candidate of the current page.
 *
 * Why: the hero <img> is created during React render. By the time
 * the browser sees the URL, the network is already busy with HTML, JS, fonts.
 * Preloading via `<head>` link lets the discovery happen before hydration.
 *
 * Usage:
 *   const { item } = useFirstApprovedMedia({ shot_type:'hero', min_quality:'hero' });
 *   useHeroPreload(item?.url, "(min-width: 1024px) 50vw, 100vw");
 *
 * The hook is no-op SSR-safe and removes its tag on unmount so SPA navs
 * don't accumulate stale preload hints.
 */

import { useEffect } from "react";

export function useHeroPreload(
  url: string | null | undefined,
  imagesizes?: string,
  imagesrcset?: string,
) {
  useEffect(() => {
    if (!url || typeof document === "undefined") return;

    // Idempotent: if a preload for this URL already exists, do nothing.
    const existing = document.head.querySelector<HTMLLinkElement>(
      `link[rel="preload"][as="image"][href="${url}"]`,
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.fetchPriority = "high";
    if (imagesizes) link.setAttribute("imagesizes", imagesizes);
    if (imagesrcset) link.setAttribute("imagesrcset", imagesrcset);
    document.head.appendChild(link);

    return () => {
      // Only remove if we still own it (StrictMode double-effect safe).
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
    };
  }, [url, imagesizes, imagesrcset]);
}

export default useHeroPreload;
