import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { PageSection } from "@/lib/page-sections";

/** Routes where HeaderBreadcrumb is already labeling context — skip the
 *  redundant "On this page" eyebrow on the n=2 sub-bar (v3.1). */
const ROUTES_WITH_HEADER_BREADCRUMB = new Set(["/services", "/work", "/about", "/contact"]);

interface SectionRailProps {
  sections: PageSection[];
  /** When true, the rail dims to 0 (used as the footer enters view). */
  faded?: boolean;
  className?: string;
}

/**
 * Smooth-scroll to a `section-*` anchor with the right header offset.
 * Updates the URL hash without a jump so deep links are shareable.
 */
export function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor);
  if (!el) return;
  const offset = window.innerWidth < 640 ? 64 : 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  if (history.replaceState) {
    history.replaceState(null, "", `#${anchor}`);
  }
}

/**
 * SectionRail — the per-page anchor rail in the center of the header.
 *
 * Two visual modes, chosen by anchor count:
 *   - n >= 3 → centered editorial rail (hidden < lg)
 *   - n == 2 → "ON THIS PAGE → A | B" sub-bar (left-anchored, lighter)
 *   - n <= 1 → renders nothing
 *
 * On the < lg / >= md range, see SectionRailCompact for the tablet
 * fallback that pairs with this component in Navigation.tsx.
 *
 * Active state is a full-width cedar underline that scales in from the
 * left — clearer than a hairline, still editorial.
 */
const SectionRail = ({ sections, faded = false, className }: SectionRailProps) => {
  const active = useActiveSection(sections);
  const { pathname } = useLocation();
  const breadcrumbOwnsContext = ROUTES_WITH_HEADER_BREADCRUMB.has(pathname);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      scrollToAnchor(anchor);
    },
    [],
  );

  if (sections.length < 2) return null;

  // ── n == 2 — left-anchored sub-bar ─────────────────────────────────
  if (sections.length === 2) {
    return (
      <nav
        aria-label="Page sections"
        aria-hidden={faded ? true : undefined}
        className={cn(
          "hidden lg:flex items-center gap-3 transition-opacity duration-500",
          faded ? "opacity-0 pointer-events-none" : "opacity-100",
          className,
        )}
      >
        {!breadcrumbOwnsContext && (
          <>
            <span
              className="text-[10px] tracking-[0.22em] uppercase text-cedar/55 font-medium select-none"
              aria-hidden
            >
              On this page
            </span>
            <span aria-hidden className="block w-6 h-px bg-cedar/30" />
          </>
        )}
        <div className="flex items-center">
          {sections.map((section, i) => {
            const isActive = active === section.anchor;
            return (
              <span key={section.anchor} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mx-1.5 text-foreground/25 text-[10px]"
                  >
                    /
                  </span>
                )}
                <a
                  href={`#${section.anchor}`}
                  onClick={(e) => handleClick(e, section.anchor)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative px-2 py-2.5 text-[10px] tracking-[0.22em] uppercase font-medium",
                    "transition-colors duration-300 min-h-[44px] flex items-center group",
                    isActive ? "text-cedar" : "text-foreground/65 hover:text-cedar",
                  )}
                >
                  <span>{section.name}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute bottom-1.5 left-2 right-2 h-px bg-cedar origin-left",
                      "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </span>
            );
          })}
        </div>
      </nav>
    );
  }

  // ── n >= 3 — centered editorial rail ───────────────────────────────
  return (
    <nav
      aria-label="Page sections"
      aria-hidden={faded ? true : undefined}
      className={cn(
        "hidden lg:flex items-center gap-1 transition-opacity duration-500",
        faded ? "opacity-0 pointer-events-none" : "opacity-100",
        className,
      )}
    >
      {sections.map((section) => {
        const isActive = active === section.anchor;
        return (
          <a
            key={section.anchor}
            href={`#${section.anchor}`}
            onClick={(e) => handleClick(e, section.anchor)}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "relative px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase font-medium",
              "transition-colors duration-300 min-h-[44px] flex items-center group",
              isActive ? "text-cedar" : "text-cedar/65 hover:text-cedar",
            )}
          >
            <span>{section.name}</span>
            <span
              aria-hidden
              className={cn(
                "absolute bottom-1.5 left-4 right-4 h-px bg-cedar origin-left",
                "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
};

export default SectionRail;
