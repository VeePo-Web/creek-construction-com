/**
 * Per-route section nav registry.
 *
 * Source of truth for which in-page anchors render in the header's
 * SectionRail. Adding a route here makes the rail appear; removing
 * a route makes the header collapse to brand mark + CTA + hamburger.
 *
 * Naming contract:
 *   - Anchors MUST be prefixed `section-` so the global
 *     `[id^="section-"] { scroll-margin-top: … }` rule in index.css
 *     gives them the correct sticky-header offset.
 *   - Names are short — one or two words. The rail collapses gracefully
 *     under 1024px; long labels would wrap.
 *   - Pages with fewer than two sections return an empty array; the
 *     rail then renders nothing (no half-built UI).
 *   - n == 2 is a *first-class* layout: SectionRail switches to a
 *     left-anchored "ON THIS PAGE → A | B" sub-bar, not the centered
 *     editorial rail. Don't add 2-anchor pages expecting the centered
 *     treatment — design specifies they read differently on purpose.
 *   - n >= 3 renders the centered editorial rail (≥ lg) and the
 *     md-tier compact rail (md → lg) with overflow into GlobalMenu.
 *
 * Cross-references:
 *   - Consumed by:    src/hooks/useActiveSection.ts
 *   - Rendered by:    src/components/navigation/SectionRail.tsx
 *   - Offset CSS:     src/index.css `[id^="section-"]`
 */

export interface PageSection {
  /** Short label shown in the rail (1–2 words). */
  name: string;
  /** DOM id on the destination <section>. Must start with `section-`. */
  anchor: string;
}

const PAGE_SECTIONS: Record<string, PageSection[]> = {
  "/": [
    { name: "Services", anchor: "section-services" },
    { name: "About", anchor: "section-about" },
    { name: "Reviews", anchor: "section-testimonials" },
    { name: "Work", anchor: "section-featured" },
    { name: "Contact", anchor: "section-contact" },
  ],
  "/services": [
    { name: "Catalogue", anchor: "section-catalogue" },
    { name: "FAQ", anchor: "section-faq" },
  ],
  "/work": [
    { name: "Featured", anchor: "section-featured" },
    { name: "Gallery", anchor: "section-gallery" },
  ],
  "/about": [
    { name: "Story", anchor: "section-story" },
    { name: "Process", anchor: "section-process" },
    { name: "Areas", anchor: "section-areas" },
  ],
  "/contact": [
    { name: "Reach Us", anchor: "section-contact" },
  ],
};

export function getPageSections(pathname: string): PageSection[] {
  return PAGE_SECTIONS[pathname] ?? [];
}

/** All routes that have a section rail — useful for tests & docs. */
export const ROUTES_WITH_SECTIONS = Object.keys(PAGE_SECTIONS);
