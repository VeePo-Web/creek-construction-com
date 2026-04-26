import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { PageSection } from "@/lib/page-sections";

interface SectionRailProps {
  sections: PageSection[];
  /** When true, the rail dims to 0 (used as the footer enters view). */
  faded?: boolean;
  className?: string;
}

/**
 * SectionRail — the per-page anchor rail in the center of the header.
 *
 * Reads from a registry passed by the parent (no global lookup), so it
 * stays pure and easy to test. Uses smooth-scroll with a 96px offset to
 * land each section's heading clear of the sticky header.
 *
 * Active state is a full-width cedar underline that scales in from the
 * left — clearer than the previous 24px hairline, still editorial.
 */
const SectionRail = ({ sections, faded = false, className }: SectionRailProps) => {
  const active = useActiveSection(sections);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      const el = document.getElementById(anchor);
      if (!el) return;
      const offset = window.innerWidth < 640 ? 64 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      // Update the URL hash without a jump (shareable deep links).
      if (history.replaceState) {
        history.replaceState(null, "", `#${anchor}`);
      }
    },
    [],
  );

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Page sections"
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
              "relative px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase",
              "transition-colors duration-300 min-h-[44px] flex items-center group",
              isActive ? "text-cedar" : "text-foreground/65 hover:text-cedar",
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
