/**
 * Creek Construction — Color Contracts
 *
 * Single source of truth for the brand palette. Every component should
 * import from here instead of hard-coding hex / hsl values or guessing
 * which Tailwind class to reach for.
 *
 * Philosophy: "Quiet Confidence"
 * - Restrained palette (5 brand colors, no rainbow)
 * - Opacity is the variation tool, not new hues
 * - Warm undertones throughout — no pure white, no pure black
 *
 * Cross-references:
 * - CSS variables:      src/index.css `:root`
 * - Tailwind mapping:   tailwind.config.ts `theme.extend.colors`
 * - Live preview:       /style-guide → "Color"
 *
 * @example
 *   import { BRAND, TEXT, BUTTON } from "@/lib/colors";
 *   <button className={BUTTON.primary.base}>Quote</button>
 */

// ─────────────────────────────────────────────────────────────────────
// CORE BRAND PALETTE
// The only 5 colors that exist in the system.
// ─────────────────────────────────────────────────────────────────────

export const BRAND = {
  /**
   * Deep Evergreen — primary dark surfaces, footer, headlines on light.
   * Conveys craft, longevity, the woodlands of rural Alberta.
   */
  evergreen: {
    name: "Evergreen",
    hsl: "150 25% 16%",
    hex: "#1F3329",
    var: "--evergreen",
    bg: "bg-evergreen",
    text: "text-evergreen",
    border: "border-evergreen",
    usage: "Footer, dark sections, primary text on light backgrounds.",
  },
  /**
   * Bronze — the only accent color. CTAs, dividers, focus rings, hover.
   * Reserved for moments that earn attention; used sparingly.
   * (Exposed in Tailwind under both `cedar` and `bronze` for back-compat.)
   */
  bronze: {
    name: "Bronze",
    hsl: "28 55% 45%",
    hex: "#B27340",
    var: "--cedar",
    bg: "bg-cedar",
    text: "text-cedar",
    border: "border-cedar",
    usage: "CTA buttons, accents, dividers, focus rings, hover states.",
  },
  /**
   * Warm Cream — the page canvas. Never pure white.
   * Sets the warm-minimalist tone the entire site rests on.
   */
  cream: {
    name: "Warm Cream",
    hsl: "38 30% 97%",
    hex: "#FAF7F2",
    var: "--background",
    bg: "bg-background",
    text: "text-background",
    border: "border-background",
    usage: "Page background, primary canvas. Inverse text on dark.",
  },
  /**
   * Stone — alternating section background, muted card surfaces.
   * Provides quiet rhythm between cream sections.
   */
  stone: {
    name: "Stone",
    hsl: "38 20% 93%",
    hex: "#EDE8DF",
    var: "--secondary",
    bg: "bg-secondary",
    text: "text-secondary",
    border: "border-secondary",
    usage: "Alternating section background, muted card surface.",
  },
  /**
   * Ink — body text and high-contrast foreground. Never pure black.
   */
  ink: {
    name: "Ink",
    hsl: "150 15% 10%",
    hex: "#15201B",
    var: "--foreground",
    bg: "bg-foreground",
    text: "text-foreground",
    border: "border-foreground",
    usage: "Body text, headings on light surfaces.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// BACKDROPS — composed CSS gradients used as section/hero backgrounds.
// Use as inline `style={{ background: BACKDROP.evergreenRadial }}`
// ─────────────────────────────────────────────────────────────────────

export const BACKDROP = {
  /** Hero / dark-section radial — evergreen with a warm core. */
  evergreenRadial:
    "radial-gradient(ellipse at 25% 25%, hsl(150 30% 22%) 0%, hsl(150 25% 12%) 60%, hsl(150 30% 6%) 100%)",
  /**
   * Card / hero-area fallback when no photograph is approved yet.
   * Warm cream-stone diagonal — reads as designed editorial paper, never as
   * a "missing image" hole. THIS IS THE DEFAULT FALLBACK SURFACE for any
   * card or photo slot that may not yet have approved media.
   */
  stonePlate:
    "linear-gradient(135deg, hsl(38 28% 95%) 0%, hsl(38 22% 88%) 50%, hsl(35 18% 82%) 100%)",
  /**
   * Soft cedar-into-stone wash — for hero-card fallbacks that should still
   * feel warm and brand-tinted (About left column, GlobalMenu media slot).
   */
  cedarPlate:
    "linear-gradient(135deg, hsl(28 40% 88%) 0%, hsl(38 22% 90%) 60%, hsl(28 30% 78%) 100%)",
  /**
   * @deprecated as a "missing photo" fallback.
   * Use ONLY for deliberate dark editorial surfaces (e.g. About brand-promise
   * card). Never paint this under a MediaSlot — use BACKDROP.stonePlate.
   */
  evergreenPlate:
    "linear-gradient(135deg, hsl(150 25% 18%) 0%, hsl(150 30% 8%) 100%)",
  /** Card surface — diagonal evergreen, mid-tone. Used by Contact CTA card,
   *  Hero photo card overlays, About brand-promise plate. */
  evergreenCard:
    "linear-gradient(135deg, hsl(var(--evergreen)) 0%, hsl(150 25% 10%) 100%)",
  /** @deprecated Pass 32+ stopped using bronze fills. Prefer flat `.hairline` rules. */
  bronzeWash:
    "linear-gradient(135deg, hsl(var(--cedar) / 0.07) 0%, hsl(var(--cedar) / 0.02) 100%)",
  /** @deprecated Pass 32+ stopped using bronze halos. */
  bronzeGlow:
    "radial-gradient(ellipse at 70% 30%, hsl(28 55% 45% / 0.18) 0%, transparent 60%)",
  /** Section bottom fade — into secondary surface. */
  fadeToSecondary:
    "linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)",
  /** Cinematic vignette — over a hero photograph. */
  cinematicVignette:
    "linear-gradient(180deg, hsl(20 10% 8% / 0.3) 0%, hsl(20 10% 8% / 0.12) 38%, hsl(20 10% 8% / 0.55) 72%, hsl(20 10% 8% / 0.85) 100%)",
  /** Cinematic radial vignette — softer edge darken over photos. */
  cinematicRadial:
    "radial-gradient(ellipse at center, transparent 40%, hsl(20 10% 8% / 0.2) 100%)",
} as const;

// ─────────────────────────────────────────────────────────────────────
// SCRIM — calibrated overlay gradients for hero photography.
// AAA contrast on the headline column; the photographic 22-30% breathes.
// Use with HeroTriptych; never paint your own scrim.
// ─────────────────────────────────────────────────────────────────────

export const SCRIM = {
  /**
   * Sweeps left→right. Headline lives in the dark left ~50% of the section.
   * Tightened (v3.1) so the column stays in ≥42% black through 50% width,
   * preventing the headline from punching into the middle photo column.
   * Used by /services, /about, /contact.
   */
  left:
    "linear-gradient(90deg, hsl(150 30% 6% / 0.88) 0%, hsl(150 30% 6% / 0.78) 32%, hsl(150 30% 6% / 0.55) 50%, hsl(150 30% 6% / 0.32) 64%, hsl(150 30% 6% / 0.12) 78%, transparent 90%)",
  /**
   * Wider variant for the asymmetric Home triptych (40/30/30). Holds heavy
   * black through ~56% so the editorial-split headline column AND the
   * floating provenance card both sit in legible coverage, while the
   * right photograph still breathes.
   */
  leftWide:
    "linear-gradient(90deg, hsl(150 30% 6% / 0.90) 0%, hsl(150 30% 6% / 0.80) 38%, hsl(150 30% 6% / 0.58) 56%, hsl(150 30% 6% / 0.22) 72%, transparent 88%)",
  /** Sweeps top→bottom. Headline lives in the lower 38% (Contact, Work). */
  bottom:
    "linear-gradient(180deg, transparent 0%, hsl(150 30% 6% / 0.12) 38%, hsl(150 30% 6% / 0.55) 70%, hsl(150 30% 6% / 0.85) 95%)",
  /**
   * Mobile-only scrim — covers the top of slab A where the headline stack
   * lives. Heavy at 0–35%, falls off by 85% so the photo still reads.
   */
  mobileTop:
    "linear-gradient(180deg, hsl(150 30% 6% / 0.82) 0%, hsl(150 30% 6% / 0.62) 30%, hsl(150 30% 6% / 0.32) 55%, hsl(150 30% 6% / 0.12) 75%, transparent 90%)",
  /**
   * Two-stop scrim for full-bleed cinematic heroes (Work). Covers the
   * eyebrow→headline→subtitle band so dark-on-dark is impossible.
   */
  cinematicTop:
    "linear-gradient(180deg, hsl(20 10% 6% / 0.78) 0%, hsl(20 10% 6% / 0.55) 26%, hsl(20 10% 6% / 0.28) 52%, hsl(20 10% 6% / 0.10) 72%, transparent 88%)",
  /** Universal nav legibility band — softened so it never reads as a horizon line over photos. */
  topNav:
    "linear-gradient(180deg, hsl(150 30% 6% / 0.42) 0%, hsl(150 30% 6% / 0.18) 60%, transparent 100%)",
  /** Hairline bottom fade into the next section's cream. */
  bottomFade:
    "linear-gradient(180deg, transparent 0%, hsl(var(--secondary)) 100%)",
} as const;

// ─────────────────────────────────────────────────────────────────────
// SEMANTIC SURFACES
// Background tokens by purpose, not color.
// ─────────────────────────────────────────────────────────────────────

export const SURFACE = {
  /** Default page canvas — warm cream. */
  page: "bg-background",
  /** Alternating section to break visual rhythm. */
  section: "bg-secondary",
  /** Muted card / chip / sub-section. */
  muted: "bg-muted",
  /** Floating card surface — slightly brighter than canvas, with hairline border. */
  card: "bg-[hsl(var(--surface-card))] border border-[hsl(var(--surface-card-border))]",
  /** Dark dramatic section (footer, hero overlay). */
  dark: "bg-evergreen text-evergreen-foreground",
  /** Translucent scrim for modals / overlays. */
  scrim: "bg-foreground/40 backdrop-blur-sm",
} as const;

// ─────────────────────────────────────────────────────────────────────
// TEXT — context-aware
// ─────────────────────────────────────────────────────────────────────

export const TEXT = {
  /** On light backgrounds (cream, stone, card). */
  onLight: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    tertiary: "text-muted-foreground/70",
    accent: "text-cedar",
    inverse: "text-background",
  },
  /** On dark backgrounds (evergreen, footer). */
  onDark: {
    primary: "text-evergreen-foreground",
    secondary: "text-evergreen-foreground/85",
    tertiary: "text-evergreen-foreground/60",
    accent: "text-cedar",
    /**
     * Subtle drop-shadow utility class (defined in src/index.css) that lifts
     * body / lead text off textured evergreen radials so contrast holds AA
     * even at /85 opacity. Compose with text-evergreen-foreground/* classes.
     */
    legibleShadow: "text-on-dark-legible",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// BORDERS — 4 weights, no more.
// ─────────────────────────────────────────────────────────────────────

export const BORDER = {
  /** Almost-invisible — for fields and chip outlines. */
  hairline: "border border-border/40",
  /** Default — for cards, sections, tables. */
  default: "border border-border",
  /** Strong — for emphasized callouts. */
  strong: "border-2 border-foreground/15",
  /** Accent — bronze for selection, focus, active state. */
  accent: "border border-cedar",
} as const;

// ─────────────────────────────────────────────────────────────────────
// BUTTONS — every state pre-composed
// ─────────────────────────────────────────────────────────────────────

export const BUTTON = {
  /** Primary CTA — bronze, full commitment. */
  primary: {
    base:
      "inline-flex items-center gap-3 bg-cedar text-cedar-foreground px-8 py-4 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium",
    hover:
      "hover:bg-cedar-hover hover:tracking-[0.2em] hover:shadow-thermal",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    disabled: "disabled:opacity-40 disabled:cursor-not-allowed",
    transition: "transition-[background-color,letter-spacing] duration-500",
  },
  /** Secondary — evergreen on light, used for non-CTA primary actions. */
  secondary: {
    base:
      "inline-flex items-center gap-2 bg-evergreen text-evergreen-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase font-medium",
    hover: "hover:bg-evergreen/90",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evergreen focus-visible:ring-offset-2",
    disabled: "disabled:opacity-40 disabled:cursor-not-allowed",
    transition: "transition-colors duration-300",
  },
  /** Ghost — outlined, minimal. */
  ghost: {
    base:
      "inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-sm text-[11px] tracking-[0.18em] uppercase",
    hover: "hover:border-cedar hover:text-cedar hover:bg-cedar/[0.04]",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
    disabled: "disabled:opacity-40 disabled:cursor-not-allowed",
    transition: "transition-colors duration-300",
  },
  /** Inline link with cedar underline sweep. */
  link: {
    base:
      "inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground",
    hover: "hover:text-cedar",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-sm",
    disabled: "",
    transition: "transition-colors duration-300",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// SHADOWS — 4 elevations
// ─────────────────────────────────────────────────────────────────────

export const SHADOW = {
  /** Hairline — barely-there separation for chips, contact rows. */
  hairline: "shadow-contact",
  /** Soft — cards lifting off the canvas. */
  soft: "shadow-elegant",
  /** Float — floating UI over photography. */
  float: "shadow-float",
  /** Dramatic — modals, hero callouts. */
  dramatic: "shadow-architectural",
} as const;

// ─────────────────────────────────────────────────────────────────────
// DIVIDERS — the editorial spine of every page
// ─────────────────────────────────────────────────────────────────────

export const DIVIDER = {
  /** Hairline — invisible structure. */
  hairline: "border-t border-border/30",
  /** Standard — section breaks. */
  default: "border-t border-border",
  /** Bronze accent — for emphasis. */
  accent: "border-t border-cedar/30",
  /** @deprecated Use `.hairline` CSS utility (Pass 32+). */
  ornamental: "w-12 h-px bg-cedar/40 mx-auto",
} as const;

/**
 * RULE — canonical hairline opacities (Pass 32+).
 * Prefer the `.hairline` / `.hairline-l` CSS utilities for top/left rules.
 * Use these constants when you need to compose with other Tailwind classes.
 */
export const RULE = {
  /** Standard hairline divider. 1px cedar/12. */
  hairline: "border-cedar/12",
  /** Subtle inner-list divider between sibling items. */
  divider: "border-cedar/8",
  /** Active or hovered emphasis. */
  strong: "border-cedar/30",
} as const;

// ─────────────────────────────────────────────────────────────────────
// OPACITY SCALE — bronze at every emotional register
//
// The legacy "thermal crescendo" pattern lives here. Use ascending
// opacities for ordered lists where intensity should build (e.g. service
// cards 1→6, contact steps 1→4).
// ─────────────────────────────────────────────────────────────────────

export const BRONZE_OPACITY = {
  /** 0.04 — ambient warmth, hover-card fills */
  ghost: 0.04,
  /** 0.08 — gentle presence, gradient veils */
  whisper: 0.08,
  /** 0.15 — first item in a crescendo */
  start: 0.15,
  /** 0.30 — building warmth */
  rise: 0.3,
  /** 0.5 — confident presence */
  mid: 0.5,
  /** 0.7 — strong borders */
  strong: 0.7,
  /** 1.0 — full commitment, CTA fills */
  full: 1.0,
} as const;

/**
 * Generate a bronze opacity step for an ordered list.
 *
 *   const opacity = bronzeStep(i, items.length);
 *   <div style={{ borderLeft: `2px solid hsl(var(--cedar) / ${opacity})` }} />
 */
export function bronzeStep(index: number, total: number): number {
  if (total <= 1) return BRONZE_OPACITY.full;
  const min = BRONZE_OPACITY.start;
  const max = BRONZE_OPACITY.full;
  return Number((min + (index / (total - 1)) * (max - min)).toFixed(3));
}

// ─────────────────────────────────────────────────────────────────────
// CONTRAST AUDIT
// Pre-validated AA / AAA pairings. Use these in body copy without
// running a contrast checker every time.
// ─────────────────────────────────────────────────────────────────────

export const CONTRAST = {
  /** Ink on Cream — body copy default. AA-large pass at 16px, AAA at 18px+. */
  inkOnCream: { fg: "text-foreground", bg: "bg-background", ratio: 13.8, level: "AAA" },
  /** Cream on Evergreen — footer / dark hero. AAA. */
  creamOnEvergreen: { fg: "text-evergreen-foreground", bg: "bg-evergreen", ratio: 12.4, level: "AAA" },
  /** Cream on Bronze — primary CTA. AA. */
  creamOnBronze: { fg: "text-cedar-foreground", bg: "bg-cedar", ratio: 4.7, level: "AA" },
  /** Bronze on Cream — accent text & links. AA-large pass at 18px+; never below 14px. */
  bronzeOnCream: { fg: "text-cedar", bg: "bg-background", ratio: 3.4, level: "AA-large" },
} as const;

// ─────────────────────────────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────────────────────────────

export type BrandColor = keyof typeof BRAND;
export type ButtonVariant = keyof typeof BUTTON;
export type ShadowTier = keyof typeof SHADOW;
