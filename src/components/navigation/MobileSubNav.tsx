import { useEffect, useRef } from "react";
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
 *   │ ← Services         CATALOGUE  ·  FAQ  …▸        │
 *   └─────────────────────────────────────────────────┘
 *
 * Right-side chip strip is horizontally scrollable with a fade-mask
 * affordance, scroll-snapping, and auto-centering of the active chip.
 *
 * Renders nothing on `/`, on routes without a breadcrumb, and at md+.
 */
const MobileSubNav = ({ faded = false }: MobileSubNavProps) => {
  const { pathname } = useLocation();
  const meta = getRouteBreadcrumb(pathname);
  const sections = getPageSections(pathname);
  const active = useActiveSection(sections);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Center the active chip in the scroll viewport whenever it changes.
  // Use direct scrollTo math (instead of scrollIntoView) so iOS Safari
  // never scrolls the document — only the inner chip strip.
  useEffect(() => {
    if (!active) return;
    const el = chipRefs.current[active];
    const parent = scrollerRef.current;
    if (!el || !parent) return;
    const id = window.requestAnimationFrame(() => {
      const targetLeft =
        el.offsetLeft - parent.clientWidth / 2 + el.clientWidth / 2;
      parent.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [active]);

  if (!meta) return null;

  // Right-edge fade mask — signals "swipe for more" without adding chrome.
  const fadeMask = "linear-gradient(to right, black calc(100% - 24px), transparent)";

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
            "group/back inline-flex items-center gap-1 -ml-1 px-2 h-9 rounded-sm shrink-0",
            "text-[10px] tracking-[0.22em] uppercase font-medium",
            "text-foreground/55 active:text-cedar transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          <span className="text-cedar">{meta.parent ?? meta.label}</span>
        </Link>

        {/* Right — section anchors. Horizontally scrollable with fade mask
            and snap so the user understands more is hidden off-screen. */}
        {sections.length >= 2 && (
          <div
            ref={scrollerRef}
            className="flex items-center gap-0 overflow-x-auto no-scrollbar pr-3 -mr-3 min-w-0"
            style={{
              scrollbarWidth: "none",
              scrollSnapType: "x proximity",
              maskImage: fadeMask,
              WebkitMaskImage: fadeMask,
            }}
          >
            {sections.map((section, i) => {
              const isActive = active === section.anchor;
              return (
                <span key={section.anchor} className="flex items-center shrink-0" style={{ scrollSnapAlign: "end" }}>
                  {i > 0 && (
                    <span aria-hidden className="mx-1 text-foreground/25 text-[9px]">
                      ·
                    </span>
                  )}
                  <a
                    ref={(node) => {
                      chipRefs.current[section.anchor] = node;
                    }}
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
