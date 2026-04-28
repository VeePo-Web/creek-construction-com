import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, ShieldCheck, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import { useQuoteModal } from "@/components/quote/QuoteModalProvider";
import CedarCTA from "@/components/CedarCTA";
import BronzeRule from "@/components/ui/bronze-rule";
import { useApprovedMedia } from "@/hooks/useApprovedMedia";
import { BACKDROP } from "@/lib/colors";
import type { MediaQuery } from "@/lib/api/public-media";

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

// Service areas grouped by metro so users can recognize themselves.
// Order inside each group reflects how a local would scan a map.
const SERVICE_AREAS = [
  {
    metro: "Calgary Metro",
    homeBase: "Calgary",
    cities: ["Calgary", "Airdrie", "Cochrane", "Okotoks", "Chestermere"],
  },
  {
    metro: "Edmonton Metro",
    homeBase: undefined as string | undefined,
    cities: ["Edmonton", "Sherwood Park", "St. Albert", "Spruce Grove", "Leduc"],
  },
];

/**
 * GlobalMenu — Tier 2 of the nav system.
 *
 * Two-column editorial panel:
 *   ┌─ left ─────────────────┬─ right ────────────────┐
 *   │ Primary routes (serif) │ Editorial hero photo   │
 *   │ ─── bronze rule ────── │ Service areas grouped  │
 *   │ Services as chips      │  by metro              │
 *   └────────────────────────┴────────────────────────┘
 *   ┌──────────────────────────────────────────────────┐
 *   │ Trust strip │ phone │ Request a Quote            │
 *   └──────────────────────────────────────────────────┘
 *
 * Accessibility:
 *   - role="dialog" + aria-modal=true, aria-labelledby on the heading
 *   - Esc + backdrop close; body scroll locked while open
 *   - Focus moves to the close button on open
 *   - Active route gets aria-current="page" and a visible "current" pill
 *   - reduced-motion: stagger collapses to instant via global override
 */
const GlobalMenu = ({ isOpen, onClose, id = "global-menu" }: GlobalMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { openModal } = useQuoteModal();
  const location = useLocation();

  // Editorial gallery in the right column — pull a small set of approved
  // photographs and crossfade among them while the menu is open. Falls back
  // to a stone editorial plate (NEVER green) when nothing matches.
  const heroQuery = useMemo<MediaQuery>(
    () => ({
      shot_type: ["hero", "elevation", "wide", "detail"],
      min_quality: "reference",
      kind: "image",
      limit: 6,
    }),
    [],
  );
  const heroGallery = useApprovedMedia(heroQuery);
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Crossfade through the gallery every 4s while the menu is open. Honor
  // prefers-reduced-motion: if reduced, pick a single shot per session.
  useEffect(() => {
    if (!isOpen || heroGallery.items.length <= 1) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setGalleryIdx(Math.floor(Math.random() * heroGallery.items.length));
      return;
    }
    const id = window.setInterval(
      () => setGalleryIdx((i) => (i + 1) % heroGallery.items.length),
      4000,
    );
    return () => window.clearInterval(id);
  }, [isOpen, heroGallery.items.length]);

  const heroPhoto = { item: heroGallery.items[galleryIdx] ?? heroGallery.items[0] ?? null };

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
    window.setTimeout(() => openModal([serviceId]), 150);
  };

  const heroProvenance = (() => {
    const p = heroPhoto.item;
    if (!p) return null;
    const loc = p.alt?.split(" in ")[1]?.split(",")[0]?.trim();
    const parts = [p.service, loc].filter(Boolean);
    return parts.length ? parts.join(" · ") : null;
  })();

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-heading`}
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
        className={cn("absolute inset-0 bg-background flex flex-col animate-fade-in")}
        style={{ animationDuration: "300ms" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar — close + accessible heading */}
        <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              "relative inline-flex items-center gap-2 h-12 px-3 rounded-sm border border-cedar/25",
              "hover:bg-cedar/10 hover:border-cedar/50 transition-colors duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
            )}
          >
            <span aria-hidden className="relative w-4 h-4 block">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-foreground -translate-y-1/2 rotate-45" />
              <span className="absolute left-0 right-0 top-1/2 h-px bg-foreground -translate-y-1/2 -rotate-45" />
            </span>
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/75">
              Close
            </span>
          </button>
        </div>

        <h2 id={`${id}-heading`} className="sr-only">
          Site menu
        </h2>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* ─── LEFT COLUMN ─────────────────────────────────── */}
            <nav aria-label="Primary" className="lg:col-span-7">
              <ul className="space-y-1.5 md:space-y-2 mb-8 md:mb-10">
                {PRIMARY_ROUTES.map((r, i) => {
                  const isCurrent = location.pathname === r.path;
                  return (
                    <li
                      key={r.path}
                      className="hero-provenance-enter"
                      style={{ ["--kinetic-delay" as never]: delay(i) }}
                    >
                      <Link
                        to={r.path}
                        onClick={onClose}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "group/route inline-flex items-baseline gap-4 transition-colors duration-300",
                          isCurrent
                            ? "text-cedar"
                            : "text-foreground hover:text-cedar",
                        )}
                      >
                        <span
                          className={cn(
                            "font-serif leading-[1.05] tracking-tight",
                            "text-[2.25rem] md:text-5xl lg:text-[3.75rem]",
                          )}
                        >
                          {r.name}
                        </span>
                        {isCurrent && (
                          <span
                            aria-hidden
                            className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium translate-y-[-0.2em]"
                          >
                            · current
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Bronze rule — spans the column it lives in (not orphaned). */}
              <BronzeRule width="long" className="mb-8 w-full" />

              {/* Services as chips — visually distinct from the primary stack
                  so there is no "which one do I tap?" confusion. */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(PRIMARY_ROUTES.length + 1) }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium mb-4">
                  Quote a service
                </p>
                <ul className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => handleService(s.id)}
                        className={cn(
                          "inline-flex items-center min-h-[44px] px-4 py-2 rounded-full",
                          "border border-cedar/25 text-sm text-foreground/80",
                          "hover:border-cedar/60 hover:text-cedar hover:bg-cedar/5",
                          "transition-[color,background-color,border-color] duration-300",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
                        )}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Tap a service to start a quote pre-filled for it.
                </p>
              </div>
            </nav>

            {/* ─── RIGHT COLUMN ────────────────────────────────── */}
            <aside aria-label="Where we work" className="lg:col-span-5 space-y-8">
              {/* Editorial hero photo */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(2) }}
              >
                <div
                  className="relative rounded-[8px] overflow-hidden shadow-float"
                  style={{
                    border: "1px solid hsl(var(--cedar) / 0.18)",
                    aspectRatio: "4 / 3",
                  }}
                >
                  {heroPhoto.item ? (
                    heroGallery.items.map((p, i) => (
                      <img
                        key={p.storage_path}
                        src={p.url}
                        alt={i === galleryIdx ? p.alt : ""}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover hero-kenburns transition-opacity duration-[1200ms] ease-out",
                          i === galleryIdx ? "opacity-100" : "opacity-0",
                        )}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        aria-hidden={i === galleryIdx ? undefined : true}
                      />
                    ))
                  ) : (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ background: BACKDROP.cedarPlate }}
                    >
                      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />
                      <div
                        className="absolute top-6 left-6 h-px"
                        style={{
                          width: "80px",
                          background: "linear-gradient(90deg, hsl(var(--cedar) / 0.7), transparent)",
                        }}
                      />
                      <p className="absolute bottom-6 left-6 right-6 text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium">
                        Field photography updates each season — request a quote and we’ll send our latest project deck.
                      </p>
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(0deg, hsl(150 30% 6% / 0.55) 0%, transparent 100%)",
                    }}
                  />
                </div>
                {heroProvenance && (
                  <p className="mt-3 text-[10px] tracking-[0.22em] uppercase text-cedar/70 font-medium">
                    {heroProvenance}
                  </p>
                )}
              </div>

              {/* Service areas — grouped by metro */}
              <div
                className="hero-provenance-enter"
                style={{ ["--kinetic-delay" as never]: delay(4) }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium mb-4">
                  Where we build
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {SERVICE_AREAS.map((group) => (
                    <div key={group.metro}>
                      <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 font-medium mb-2.5">
                        {group.metro}
                      </p>
                      <ul className="space-y-1">
                        {group.cities.map((city) => {
                          const isHomeBase = city === group.homeBase;
                          return (
                            <li
                              key={city}
                              className={cn(
                                "text-sm leading-relaxed flex items-baseline gap-2",
                                isHomeBase ? "text-cedar font-medium" : "text-foreground/80",
                              )}
                            >
                              <span>{city}</span>
                              {isHomeBase && (
                                <span className="text-[9px] tracking-[0.22em] uppercase text-cedar/70 font-medium">
                                  Home base
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email — kept as a quiet third option below cities */}
              <a
                href={`mailto:${CONTACT.email}`}
                onClick={onClose}
                className={cn(
                  "inline-flex items-center gap-2 text-sm text-foreground/75",
                  "hover:text-cedar transition-colors duration-300 min-h-[44px] break-all",
                  "hero-provenance-enter",
                )}
                style={{ ["--kinetic-delay" as never]: delay(6) }}
              >
                <Mail className="h-3.5 w-3.5 text-cedar" aria-hidden />
                {CONTACT.email}
              </a>
            </aside>
          </div>
        </div>

        {/* Bottom CTA bar — trust · phone · Quote */}
        <div
          className="flex-shrink-0 border-t border-cedar/20 bg-background/95"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-5 pb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-cedar shrink-0" aria-hidden />
                <span>WCB covered · Fully insured · Locally owned</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                {/* Real tappable phone link with affordance — not caption text */}
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  onClick={onClose}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-sm",
                    "border border-cedar/25 hover:border-cedar/55 hover:bg-cedar/5",
                    "text-sm text-foreground/85 hover:text-cedar transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
                  )}
                  aria-label={`Call ${CONTACT.phone}`}
                >
                  <Phone className="h-3.5 w-3.5 text-cedar" aria-hidden />
                  <span className="tracking-[0.06em]">{CONTACT.phone}</span>
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
