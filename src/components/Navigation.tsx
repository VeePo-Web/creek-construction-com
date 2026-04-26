import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone } from "lucide-react";

import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { CONTACT } from "@/config/contact";
import { cn } from "@/lib/utils";
import { BUTTON } from "@/lib/colors";

import BrandMark from "@/components/navigation/BrandMark";
import SectionRail from "@/components/navigation/SectionRail";
import MenuTrigger from "@/components/navigation/MenuTrigger";
import GlobalMenu from "@/components/navigation/GlobalMenu";
import { getPageSections } from "@/lib/page-sections";
import { useScrollChrome } from "@/hooks/useScrollChrome";

interface NavigationProps {
  /** Currently unused — kept for API compatibility with legacy pages. */
  transparent?: boolean;
  is404?: boolean;
}

const MENU_ID = "global-menu";

/**
 * Navigation — Creek's two-tier site header.
 *
 *   [BrandMark]  ·  [SectionRail (per-page anchors)]  ·  [Phone] [Quote] [☰]
 *
 * The header is a thin shell; the heavy lifting lives in:
 *   - src/components/navigation/BrandMark.tsx     (logo + locale)
 *   - src/components/navigation/SectionRail.tsx   (per-page section anchors)
 *   - src/components/navigation/MenuTrigger.tsx   (animated hamburger)
 *   - src/components/navigation/GlobalMenu.tsx    (fullscreen Tier-2 menu)
 *   - src/lib/page-sections.ts                    (route → sections registry)
 *   - src/hooks/useActiveSection.ts               (IO-driven active state)
 *   - src/hooks/useScrollChrome.ts                (scroll/footer chrome state)
 *
 * Behaviour:
 *   - Above the fold: transparent header with subtle hairline.
 *   - After scrolling 32px: blurred cream surface with stronger border.
 *   - When the footer enters view: section rail + tel link fade out so the
 *     footer's own conversion moment can breathe.
 *   - The hamburger is always visible (desktop + mobile) — opens GlobalMenu.
 */
const Navigation = ({ transparent: _transparent }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useQuoteModal();
  const location = useLocation();

  const sections = getPageSections(location.pathname);
  const { isScrolled, isAtFooter } = useScrollChrome();

  const navCta = cn(
    BUTTON.primary.base,
    "px-5 py-2.5 text-[10px] gap-2",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
  );

  const headerSurface = isScrolled
    ? "bg-background/90 backdrop-blur border-b border-border/50 shadow-sm"
    : "bg-background/0 border-b border-transparent";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          headerSurface,
        )}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Left — brand */}
          <BrandMark />

          {/* Center — per-page section rail */}
          <SectionRail sections={sections} faded={isAtFooter} className="mx-auto" />

          {/* Right cluster */}
          <div
            className={cn(
              "flex items-center gap-1 md:gap-2 transition-opacity duration-500",
              isAtFooter ? "opacity-40" : "opacity-100",
            )}
          >
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-cedar transition-colors min-h-[44px] px-2"
              aria-label={`Call ${CONTACT.phone}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden /> {CONTACT.phone}
            </a>
            <button
              type="button"
              onClick={() => openModal()}
              className={cn(navCta, "hidden sm:inline-flex")}
            >
              Request a Quote
            </button>
            <MenuTrigger
              isOpen={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              controlsId={MENU_ID}
            />
          </div>
        </div>
      </header>

      {/* Spacer — header is fixed, so reserve the same height in the document
          flow. Keeps every page's first paint identical regardless of scroll. */}
      <div aria-hidden className="h-16 md:h-20" />

      {/* Tier 2 — fullscreen menu */}
      <GlobalMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} id={MENU_ID} />
    </>
  );
};

export default Navigation;
