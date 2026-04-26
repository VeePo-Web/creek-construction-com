/**
 * useActiveSection — track which in-page section is currently in view.
 *
 * Uses a single IntersectionObserver across all section anchors for the
 * current route. Returns the anchor of the topmost-visible section so
 * the SectionRail can mark it active.
 *
 * Tuned for Creek's 80px desktop / 64px mobile sticky header — the
 * rootMargin offsets compensate so a section is "active" the moment
 * its first line of content clears the header, not when its top-edge
 * pixel touches the viewport.
 */

import { useEffect, useState } from "react";
import type { PageSection } from "@/lib/page-sections";

export function useActiveSection(sections: PageSection[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sections.length === 0) {
      setActive(null);
      return;
    }

    const elements = sections
      .map((s) => document.getElementById(s.anchor))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      setActive(null);
      return;
    }

    // Headers are 80px desktop, 64px mobile. Pad slightly so the
    // active state changes once a section's heading clears the header.
    const headerOffset = window.innerWidth < 640 ? 80 : 96;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of all currently-intersecting sections, pick the one whose
        // top edge is highest in the viewport (i.e. closest to the
        // header). That feels right — the section the user is reading.
        let bestId: string | null = null;
        let bestTop = Infinity;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const top = entry.boundingClientRect.top;
          if (top < bestTop) {
            bestTop = top;
            bestId = entry.target.id;
          }
        }

        if (bestId) setActive(bestId);
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: `-${headerOffset}px 0px -55% 0px`,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // We rebuild when the registry shape changes (route swap).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s.anchor).join("|")]);

  return active;
}

export default useActiveSection;
