import { useState } from "react";
import { useLocation } from "react-router-dom";


import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { CONTACT } from "@/config/contact";
import { cn } from "@/lib/utils";
import { BUTTON } from "@/lib/colors";

import BrandMark from "@/components/navigation/BrandMark";
import HeaderBreadcrumb from "@/components/navigation/HeaderBreadcrumb";
import MenuTrigger from "@/components/navigation/MenuTrigger";
import GlobalMenu from "@/components/navigation/GlobalMenu";
import { getRouteBreadcrumb } from "@/lib/route-meta";
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
 *   [BrandMark]  ·  [SectionRail | HeaderBreadcrumb]  ·  [phone] [Quote] [☰ MENU]
 *
 * Chrome philosophy: always-opaque cream surface with a real cedar edge.
 * Above the fold, the surface is a touch lighter; once the user scrolls
 * past 32px the bottom border deepens and a 1px shadow appears, so the
 * threshold is *felt* without a color flash.
 *
 * Footer fade: only the section rail dims as the footer enters view.
 * The phone, Quote CTA, and MENU stay at full opacity all the way down
 * — they are conversion surfaces and must never look disabled.
 *
 * The hamburger is always visible (mobile, tablet, desktop) — opens
 * GlobalMenu (Tier 2). On md+ it carries a "MENU" label so its role
 * is unmistakable.
 */
const Navigation = ({ transparent: _transparent }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useQuoteModal();
  const location = useLocation();

  const { isScrolled } = useScrollChrome();

  // Compact mobile Quote pill — distinct from the full desktop CTA.
  const mobileCta = cn(
    BUTTON.primary.base,
    "px-3 py-2 text-[10px] gap-1.5 leading-none",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
  );

  // Full desktop Quote CTA.
  const desktopCta = cn(
    BUTTON.primary.base,
    "px-4 py-2.5 text-[11px] gap-2",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
  );

  // Always-opaque chrome with a felt scroll threshold. Backdrop-blur kept
  // light (8px scrolled, 6px at rest) — visually equivalent past 6px on
  // most viewports and ~30% cheaper to render on mobile GPUs.
  const headerSurface = isScrolled
    ? "bg-background/95 backdrop-blur-[8px] border-b border-cedar/12"
    : "bg-background/92 backdrop-blur-[6px] border-b border-cedar/12";

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
        {/* Top hairline — only when scrolled, to avoid double-line at rest */}
        {isScrolled && (
          <span
            aria-hidden
            className="block h-px w-full bg-gradient-to-r from-transparent via-cedar/15 to-transparent"
          />
        )}

        <div className="container mx-auto max-w-[1440px] px-4 sm:px-5 md:px-8 h-14 sm:h-16 md:h-[4.5rem] lg:h-20 flex items-center justify-between gap-2 md:gap-4">
          {/* Left — brand */}
          <BrandMark className="shrink-0" />

          {/* Center — single quiet sub-page breadcrumb chip; no per-page rail */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <HeaderBreadcrumb />
          </div>

          {/* Right cluster — never fades, never hides on mobile.
              Mobile: [📞] [Quote-pill] [☰]
              Tablet/Desktop: [phone link] [Quote CTA] [☰ MENU] */}
          <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
            {/* Tablet phone icon removed — phone lives in GlobalMenu, footer, and closer */}

            {/* Desktop-only (lg+) phone link with the number spelled out */}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="hidden lg:inline-flex items-center gap-2 cta-label text-foreground/75 hover:text-cedar transition-colors min-h-[44px] px-2 tabular-nums"
              aria-label={`Call ${CONTACT.phone}`}
            >
              <span aria-hidden className="block w-1 h-1 rounded-full bg-cedar/60" />
              {CONTACT.phone}
            </a>

            {/* Mobile compact Quote pill — restores the in-chrome conversion
                CTA that v2 hid below the sm: breakpoint. */}
            <button
              type="button"
              onClick={() => openModal()}
              className={cn(mobileCta, "sm:hidden")}
            >
              Quote
            </button>

            {/* Tablet/desktop full Quote CTA */}
            <button
              type="button"
              onClick={() => openModal()}
              className={cn(desktopCta, "hidden sm:inline-flex")}
            >
              Free quote
            </button>

            {/* Desktop (lg+) menu trigger — pill with "MENU" label */}
            <MenuTrigger
              isOpen={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              controlsId={MENU_ID}
              withLabel
              className="hidden lg:flex"
            />
            {/* Mobile + tablet (< lg) menu trigger — square 48x48, no label.
                Below lg the chrome simply doesn't have room for a label
                without colliding with the section rail. */}
            <MenuTrigger
              isOpen={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              controlsId={MENU_ID}
              className="lg:hidden"
            />
          </div>
        </div>
      </header>

      {/* Mobile sub-page wayfinding bar — pins under the chrome on every
          sub-page (< md only). Renders nothing on `/`. */}
      <MobileSubNav faded={isAtFooter} />

      {/* Spacer — header is fixed, so reserve the same height in the document
          flow. On mobile sub-pages we add another 40px for MobileSubNav. */}
      <div
        aria-hidden
        className={cn(
          "bg-background",
          "sm:h-16 md:h-[4.5rem] lg:h-20",
          getRouteBreadcrumb(location.pathname) ? "h-[6rem]" : "h-14",
        )}
      />

      {/* Tier 2 — fullscreen menu */}
      <GlobalMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} id={MENU_ID} />
    </>
  );
};

export default Navigation;
