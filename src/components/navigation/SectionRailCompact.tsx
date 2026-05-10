import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToAnchor } from "./SectionRail";
import type { PageSection } from "@/lib/page-sections";

interface SectionRailCompactProps {
  sections: PageSection[];
  /** Open the GlobalMenu (used by the "More" affordance when n > maxVisible). */
  onOverflow?: () => void;
  faded?: boolean;
  className?: string;
}

/**
 * SectionRailCompact — the md-tier section rail (768–1023px).
 *
 * Bridges the gap left by SectionRail (which is hidden < lg). Renders
 * up to 3 anchors as tight text-only links; if the page has more, the
 * remainder hides behind a "More →" button that opens the GlobalMenu.
 *
 * Hidden on mobile (< md) and on desktop (>= lg) — sits exclusively in
 * the tablet band.
 */
const SectionRailCompact = ({
  sections,
  onOverflow,
  faded = false,
  className,
}: SectionRailCompactProps) => {
  const active = useActiveSection(sections);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      scrollToAnchor(anchor);
    },
    [],
  );

  if (sections.length < 2) return null;

  const MAX_VISIBLE = 3;
  const visible = sections.slice(0, MAX_VISIBLE);
  const overflow = sections.length - visible.length;

  return (
    <nav
      aria-label="Page sections (compact)"
      aria-hidden={faded ? true : undefined}
      className={cn(
        "hidden md:flex lg:hidden items-center gap-0.5 transition-opacity duration-500",
        faded ? "opacity-0 pointer-events-none" : "opacity-100",
        className,
      )}
    >
      {visible.map((section) => {
        const isActive = active === section.anchor;
        return (
          <a
            key={section.anchor}
            href={`#${section.anchor}`}
            onClick={(e) => handleClick(e, section.anchor)}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "relative px-2.5 py-2 text-[10px] tracking-[0.22em] uppercase font-medium",
              "transition-colors duration-300 min-h-[44px] flex items-center",
              isActive ? "text-cedar" : "text-cedar/65 hover:text-cedar",
            )}
          >
            {section.name}
            {isActive && (
              <span
                aria-hidden
                className="absolute bottom-1 left-2.5 right-2.5 h-px bg-cedar"
              />
            )}
          </a>
        );
      })}

      {overflow > 0 && (
        <button
          type="button"
          onClick={onOverflow}
          className={cn(
            "px-2.5 py-2 text-[10px] tracking-[0.22em] uppercase font-medium",
            "text-foreground/55 hover:text-cedar transition-colors duration-300",
            "min-h-[44px] flex items-center gap-1.5",
            "focus-visible:outline-none focus-visible:text-cedar",
          )}
          aria-label={`Show ${overflow} more page sections`}
        >
          +{overflow} <span aria-hidden>→</span>
        </button>
      )}
    </nav>
  );
};

export default SectionRailCompact;
