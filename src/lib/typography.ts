/**
 * Creek Construction — Typography Scale
 *
 * Source of truth for every type style on the site. Components import
 * the named role they need (HEADLINE.section, BODY.lead, etc.) instead
 * of hand-rolling Tailwind class strings.
 *
 * Philosophy: editorial restraint. Two families, balanced wraps,
 * curly quotes, never bold body text. The voice is confident, not
 * aggressive.
 *
 * Cross-references:
 * - Live preview:   /style-guide → "Typography"
 * - Custom classes: src/index.css (.text-display, .text-architectural)
 *
 * @example
 *   import { HEADLINE, BODY } from "@/lib/typography";
 *   <h2 className={HEADLINE.section}>Excellence in the work.</h2>
 *   <p className={BODY.lead}>Built to last Alberta winters.</p>
 */

// ─────────────────────────────────────────────────────────────────────
// FONT FAMILIES
// ─────────────────────────────────────────────────────────────────────

export const FONT_FAMILY = {
  /** DM Serif Display — the brand's signature voice. Headlines, quotes, stats. */
  serif: "font-serif",
  /** DM Sans — body, UI, labels. The everyday workhorse. */
  sans: "font-sans",
} as const;

export const FONT_WEIGHT = {
  /** Body & UI default. */
  regular: "font-normal",
  /** Subtle emphasis — labels, captions. Never use on body. */
  medium: "font-medium",
  /** Display weight for serif headlines. */
  display: "font-light",
} as const;

// ─────────────────────────────────────────────────────────────────────
// HEADLINES — DM Serif Display, fluid sizes, balanced wrap
// ─────────────────────────────────────────────────────────────────────

export const HEADLINE = {
  /**
   * Hero — the page-opening statement. One per page, in <h1>.
   * Uses .text-display from index.css (clamp-based fluid scale).
   */
  hero:
    "text-display text-foreground text-balance font-serif",

  /**
   * Display — section opener larger than `section`, e.g. About hero.
   */
  display:
    "font-serif text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.035em] text-balance",

  /**
   * Section — the standard <h2> for a homepage section.
   * Same scale as `display` here; reserved for semantic distinction.
   */
  section:
    "font-serif text-foreground text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.022em] text-balance",

  /**
   * Sub — within-section heading, <h3>. Quieter than section.
   */
  sub:
    "font-serif text-foreground text-2xl md:text-3xl leading-tight tracking-tight",

  /**
   * Card — title within a card or chip.
   */
  card:
    "font-serif text-foreground text-xl md:text-2xl leading-snug",
} as const;

// ─────────────────────────────────────────────────────────────────────
// EYEBROW — uppercase, letter-spaced label above a heading
// ─────────────────────────────────────────────────────────────────────

export const EYEBROW = {
  /** Default — neutral muted color. */
  default:
    "text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 font-medium",
  /** Bronze — used for active state or contextual emphasis. */
  accent:
    "text-[10px] tracking-[0.25em] uppercase text-cedar font-medium",
  /** On dark — when sitting on evergreen/footer. */
  onDark:
    "text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium",
} as const;

// ─────────────────────────────────────────────────────────────────────
// BODY — DM Sans, comfortable measure
// ─────────────────────────────────────────────────────────────────────

export const BODY = {
  /** Lead paragraph — sits directly under a section heading. */
  lead:
    "font-sans text-foreground/75 text-[15px] sm:text-base md:text-[17px] leading-[1.65] text-balance",

  /** Default body copy. */
  default:
    "font-sans text-muted-foreground text-base md:text-lg leading-relaxed",

  /** Small body for cards, captions. */
  small: "font-sans text-muted-foreground text-sm leading-relaxed",

  /** Caption — image credits, microcopy. */
  caption:
    "font-sans text-muted-foreground/60 text-xs leading-snug",
} as const;

// ─────────────────────────────────────────────────────────────────────
// QUOTE — italic serif, hanging punctuation
// ─────────────────────────────────────────────────────────────────────

export const QUOTE = {
  /** Pull-quote within an article or section. */
  pull:
    "font-serif italic text-foreground/55 text-xl md:text-2xl leading-snug text-balance",
  /** Testimonial body. */
  testimonial:
    "font-serif italic text-foreground/75 text-lg md:text-xl leading-relaxed",
  /** Attribution line under a quote. */
  attribution:
    "font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-4",
} as const;

// ─────────────────────────────────────────────────────────────────────
// STAT — large numerals, serif for gravitas
// ─────────────────────────────────────────────────────────────────────

export const STAT = {
  /** Hero stat — the floating "07+ years" card. */
  hero:
    "font-serif text-foreground text-4xl md:text-5xl leading-none tabular-nums",
  /** Inline stat — within a row of metrics. */
  inline:
    "font-serif text-foreground text-3xl md:text-4xl leading-none tabular-nums",
  /** Stat label — sits beneath the number. */
  label:
    "text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 mt-2",
} as const;

// ─────────────────────────────────────────────────────────────────────
// UI — buttons, form inputs, navigation
// ─────────────────────────────────────────────────────────────────────

export const UI = {
  /** Button label — uppercase, letter-spaced. */
  button:
    "text-[11px] tracking-[0.18em] uppercase font-medium",
  /** Form input text. */
  input: "text-sm md:text-base",
  /** Form field label. */
  label:
    "text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium",
  /** Inline navigation link. */
  navLink:
    "text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-cedar transition-colors",
} as const;

// ─────────────────────────────────────────────────────────────────────
// LAYOUT — line-height, letter-spacing, measure
// ─────────────────────────────────────────────────────────────────────

export const LINE_HEIGHT = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

export const LETTER_SPACING = {
  /** Body text — default. */
  normal: "tracking-normal",
  /** Headlines — slightly tighter. */
  tight: "tracking-tight",
  /** Eyebrows. */
  wide: "tracking-[0.18em]",
  /** Section labels. */
  wider: "tracking-[0.25em]",
} as const;

/** Maximum text width for comfortable reading (~65 characters). */
export const TEXT_WIDTH = {
  /** Pull-quote / hero subhead. */
  short: "max-w-md",
  /** Default measure. */
  default: "max-w-2xl",
  /** Long-form article body. */
  prose: "max-w-prose",
  /** Wide-but-bounded — landing intro. */
  wide: "max-w-3xl",
} as const;

// ─────────────────────────────────────────────────────────────────────
// RULES (documented, not enforced)
// ─────────────────────────────────────────────────────────────────────

export const TYPOGRAPHY_RULES = {
  do: [
    "Use HEADLINE.* for any <h1>–<h3>. Never compose your own font-size class string.",
    "Use BODY.lead for the paragraph immediately under a section heading.",
    "Use curly quotes (\u201C \u201D \u2018 \u2019) and em-dashes (\u2014). Never straight quotes or hyphens between words.",
    "Use text-balance on every headline (it's already in HEADLINE.*).",
    "Use tabular-nums on stats and dates so columns line up.",
  ],
  dont: [
    "Don't bold body text. Use font-medium at most. The brand voice is confident, not aggressive.",
    "Don't put a sans-serif font on a headline. Headlines are always DM Serif Display.",
    "Don't write font-bold or font-black anywhere. We don't ship those weights.",
    "Don't use uppercase on body copy — only on EYEBROW, UI.button, UI.label.",
    "Don't add line-height inline. Pick from LINE_HEIGHT.* if you need to override.",
  ],
} as const;
