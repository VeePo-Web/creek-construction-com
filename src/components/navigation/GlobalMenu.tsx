import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Phone, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import CedarCTA from "@/components/CedarCTA";
import BronzeRule from "@/components/ui/bronze-rule";

interface GlobalMenuProps {
  /** Controlled open state. */
  isOpen: boolean;
  /** Closes the menu — called on Esc, backdrop click, or any link click. */
  onClose: () => void;
  /** id matched against the trigger's `aria-controls`. */
  id?: string;
}

const PRIMARY_ROUTES = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Our Work", path: "/work" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const COMPANY_LINKS = [
  { name: "Our Work", path: "/work" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

/**
 * GlobalMenu — fullscreen site navigation panel (Tier 2 of the nav system).
 *
 * Composition (top → bottom):
 *   1. Close button (top-right, 48x48 touch target)
 *   2. Primary route stack — oversized DM Serif links
 *   3. Hairline cedar divider
 *   4. Three editorial columns: Services / Service Areas / Company
 *   5. Trust badge + primary CTA + tel link
 *
 * Accessibility:
 *   - role="dialog" + aria-modal=true
 *   - focus is sent to first focusable element on open
 *   - Esc closes; click on backdrop closes
 *   - body scroll-locked while open via overflow:hidden on <html>
 *   - reduced-motion: stagger collapses to instant via global override
 */
const GlobalMenu = ({ isOpen, onClose, id = "global-menu" }: GlobalMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { openModal } = useQuoteModal();

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Body scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isOpen]);

  // Move focus into the panel on open
  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  // Stagger delay helper — keeps timing consistent with the rest of the system.
  const delay = (i: number) => `${100 + i * 30}ms`;

  const handleService = (serviceId: string) => {
    onClose();
    // Slight delay so the panel finishes its close animation first.
    window.setTimeout(() => openModal([serviceId]), 150);
  };

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[100]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "absolute inset-0 bg-background flex flex-col",
          "animate-fade-in",
        )}
        style={{ animationDuration: "300ms" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              "relative w-12 h-12 flex items-center justify-center rounded-sm",
              "hover:bg-cedar/10 transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
            )}
          >
            <span aria-hidden className="relative w-5 h-5 block">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-foreground -translate-y-1/2 rotate-45" />
              <span className="absolute left-0 right-0 top-1/2 h-px bg-foreground -translate-y-1/2 -rotate-45" />
            </span>
          </button>
        </div>

        {/* Content */}
        <nav
          aria-label="Site navigation"
          className="flex-1 overflow-y-auto pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-24"
        >
          {/* Primary routes — oversized serif stack */}
          <div className="max-w-7xl mx-auto">
            <ul className="space-y-2 md:space-y-3 mb-10 md:mb-14">
              {PRIMARY_ROUTES.map((r, i) => (
                <li
                  key={r.path}
                  className="hero-provenance-enter"
                  style={{ ["--kinetic-delay" as never]: delay(i) }}
                >
                  <Link
                    to={r.path}
                    onClick={onClose}
                    className={cn(
                      "inline-block font-serif text-foreground hover:text-cedar transition-colors duration-300",
                      "text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight",
                    )}
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>

            <BronzeRule width="long" className="mb-10" />

            {/* Three editorial columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
              {/* Services — opens QuoteModal pre-filtered */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(PRIMARY_ROUTES.length + 1) }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium mb-4">
                  Services
                </p>
                <ul className="space-y-2.5">
                  {SERVICES.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => handleService(s.id)}
                        className={cn(
                          "text-left text-foreground/80 hover:text-cedar transition-colors duration-300",
                          "text-sm md:text-base min-h-[44px] flex items-center",
                          "focus-visible:outline-none focus-visible:text-cedar",
                        )}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Areas */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(PRIMARY_ROUTES.length + 3) }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium mb-4">
                  Service Areas
                </p>
                <ul className="space-y-2.5">
                  {CONTACT.cities.map((city, i) => (
                    <li
                      key={city}
                      className="text-sm md:text-base text-foreground/80 min-h-[36px] flex items-center"
                    >
                      <span>{city}</span>
                      {i === 0 && (
                        <span className="ml-2 text-[10px] tracking-[0.18em] uppercase text-cedar/70">
                          · Home base
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(PRIMARY_ROUTES.length + 5) }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium mb-4">
                  Company
                </p>
                <ul className="space-y-2.5">
                  {COMPANY_LINKS.map((c) => (
                    <li key={c.path}>
                      <Link
                        to={c.path}
                        onClick={onClose}
                        className="text-sm md:text-base text-foreground/80 hover:text-cedar transition-colors duration-300 min-h-[44px] flex items-center"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      onClick={onClose}
                      className="text-sm md:text-base text-foreground/80 hover:text-cedar transition-colors duration-300 min-h-[44px] flex items-center break-all"
                    >
                      {CONTACT.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom CTA bar */}
        <div
          className="flex-shrink-0 border-t border-border/40 bg-background/95"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-cedar" aria-hidden />
                <span>WCB covered · Fully insured · Locally owned</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground/80 hover:text-cedar transition-colors min-h-[44px]"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden /> {CONTACT.phone}
                </a>
                <CedarCTA onActivate={onClose}>Request a Quote</CedarCTA>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMenu;
