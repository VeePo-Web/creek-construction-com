import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { getRouteBreadcrumb } from "@/lib/route-meta";
import { getPageSections } from "@/lib/page-sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToAnchor } from "@/components/navigation/SectionRail";

interface MobileSubNavProps {
  /** When true, dim to 0 (used when the footer enters view). */
  faded?: boolean;
}

/**
 * MobileSubNav — the < md wayfinding row that pins below the main chrome
 * on every sub-page. Closes the gap left by `HeaderBreadcrumb` and
 * `SectionRail` (both `md+` only).
 *
 *   ┌─────────────────────────────────────────────────┐
 *   │ ← Services         CATALOGUE  ·  FAQ            │
 *   └─────────────────────────────────────────────────┘
 *
 * Renders nothing on `/`, on routes without a breadcrumb, and at md+.
 * Section anchors live on the right; the back chip on the left always
 * points at the parent route from `route-meta.ts`.
 */
const MobileSubNav = ({ faded = false }: MobileSubNavProps) => {
  const { pathname } = useLocation();
  const meta = getRouteBreadcrumb(pathname);
  const sections = getPageSections(pathname);
  const active = useActiveSection(sections);

  if (!meta) return null;

  return (
    <nav
      aria-label="Sub-page wayfinding"
      aria-hidden={faded ? true : undefined}
      className={cn(
        "md:hidden fixed top-16 inset-x-0 z-40",
        "border-b border-cedar/15 bg-background/96 backdrop-blur-[10px]",
        "transition-opacity duration-500",
        faded ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      <div className="px-3 h-10 flex items-center justify-between gap-3">
        {/* Left — back chip to the parent route */}
        <Link
          to={meta.parentPath}
          className={cn(
            "group/back inline-flex items-center gap-1 -ml-1 px-2 h-9 rounded-sm",
            "text-[10px] tracking-[0.22em] uppercase font-medium",
            "text-foreground/55 active:text-cedar transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          <span className="text-cedar">{meta.label}</span>
        </Link>

        {/* Right — section anchors. Horizontally scrollable so they never
            wrap or collide with the back chip on narrow phones. */}
        {sections.length >= 2 && (
          <div
            className="flex items-center gap-0 overflow-x-auto no-scrollbar -mr-1"
            style={{ scrollbarWidth: "none" }}
          >
            {sections.map((section, i) => {
              const isActive = active === section.anchor;
              return (
                <span key={section.anchor} className="flex items-center shrink-0">
                  {i > 0 && (
                    <span aria-hidden className="mx-1 text-foreground/25 text-[9px]">
                      ·
                    </span>
                  )}
                  <a
                    href={`#${section.anchor}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToAnchor(section.anchor);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "px-2 h-9 inline-flex items-center text-[10px] tracking-[0.2em] uppercase font-medium",
                      "transition-colors duration-200 whitespace-nowrap",
                      isActive ? "text-cedar" : "text-foreground/55 active:text-cedar",
                    )}
                  >
                    {section.name}
                  </a>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileSubNav;
