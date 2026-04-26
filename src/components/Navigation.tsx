import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone } from "lucide-react";

import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import { CONTACT } from "@/config/contact";
import { cn } from "@/lib/utils";
import { BUTTON } from "@/lib/colors";

import BrandMark from "@/components/navigation/BrandMark";
import SectionRail from "@/components/navigation/SectionRail";
import SectionRailCompact from "@/components/navigation/SectionRailCompact";
import HeaderBreadcrumb from "@/components/navigation/HeaderBreadcrumb";
import MenuTrigger from "@/components/navigation/MenuTrigger";
import GlobalMenu from "@/components/navigation/GlobalMenu";
import MobileSubNav from "@/components/navigation/MobileSubNav";
import { getPageSections } from "@/lib/page-sections";
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

  const sections = getPageSections(location.pathname);
  const { isScrolled, isAtFooter } = useScrollChrome();

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
    "px-5 py-2.5 text-[10px] gap-2",
    BUTTON.primary.hover,
    BUTTON.primary.focus,
    BUTTON.primary.transition,
  );

  // Always-opaque chrome with a felt scroll threshold. Backdrop-blur kept
  // light (8px scrolled, 6px at rest) — visually equivalent past 6px on
  // most viewports and ~30% cheaper to render on mobile GPUs.
  const headerSurface = isScrolled
    ? "bg-background/95 backdrop-blur-[8px] border-b border-cedar/25 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
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
        {/* Top hairline — a tiny editorial cap that signals "brand frame". */}
        <span
          aria-hidden
          className="block h-px w-full bg-gradient-to-r from-transparent via-cedar/40 to-transparent"
        />

        <div className="container mx-auto px-3 sm:px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-4">
          {/* Left — brand */}
          <BrandMark className="shrink-0" />

          {/* Center — wayfinding. Three states, mutually exclusive at any breakpoint:
              - Desktop (lg+): centered editorial section rail (n>=3) OR n=2 sub-bar
              - Tablet (md to lg): SectionRailCompact with overflow into the menu
              - All breakpoints, sub-pages: HeaderBreadcrumb chip */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <HeaderBreadcrumb />
            <SectionRailCompact
              sections={sections}
              onOverflow={() => setMenuOpen(true)}
              faded={isAtFooter}
            />
            <SectionRail sections={sections} faded={isAtFooter} />
          </div>

          {/* Right cluster — never fades, never hides on mobile.
              Mobile: [📞] [Quote-pill] [☰]
              Tablet/Desktop: [phone link] [Quote CTA] [☰ MENU] */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {/* Mobile + tablet (< lg) phone icon button. A 44x44 cedar-bordered
                tap target — keeps "call us" one tap away without consuming
                the horizontal real estate that the full text link does. */}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className={cn(
                "lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-sm",
                "border border-cedar/20 hover:border-cedar/50 hover:bg-cedar/5",
                "text-cedar transition-colors duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
              )}
              aria-label={`Call ${CONTACT.phone}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>

            {/* Desktop-only (lg+) phone link with the number spelled out */}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground/75 hover:text-cedar transition-colors min-h-[44px] px-2"
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
              Request a Quote
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
          "md:h-20",
          getRouteBreadcrumb(location.pathname) ? "h-[6.5rem]" : "h-16",
        )}
      />

      {/* Tier 2 — fullscreen menu */}
      <GlobalMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} id={MENU_ID} />
    </>
  );
};

export default Navigation;
