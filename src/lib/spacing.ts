/**
 * Creek Construction — Spacing System
 *
 * Built on an 8px grid. All section padding, gaps, max-widths and
 * touch-target sizes live here. Components import named tokens
 * instead of hand-rolling `py-32 mb-12 gap-20` strings.
 *
 * Philosophy: "The Breathing Rule"
 * Every section ends with enough whitespace to let the content
 * exhale before the next section begins. Compressed sections feel
 * cheap. The default is generous.
 *
 * Cross-references:
 * - Tailwind grid:  default theme (4px increments)
 * - Live preview:   /style-guide → "Spacing"
 */

// ─────────────────────────────────────────────────────────────────────
// SECTION PADDING — vertical breathing room per section type
// ─────────────────────────────────────────────────────────────────────

export const SECTION_PADDING = {
  /** Standard homepage section (Hero, Services, About, etc.). */
  default: "py-16 sm:py-20 md:py-24 lg:py-28",
  /** Tight — proof bands, footer-adjacent sections. */
  tight: "py-12 sm:py-16 md:py-20",
  /** Slimmer — for trust strips and inline rows. */
  strip: "py-12 md:py-16",
  /** Hero — extra top breathing because of the nav. */
  hero: "pt-20 pb-24 md:pt-28 md:pb-32",
  /** Footer — generous top, restrained bottom. */
  footer: "pt-20 pb-12 md:pt-24",
} as const;

// ─────────────────────────────────────────────────────────────────────
// CONTAINER — horizontal page padding
// ─────────────────────────────────────────────────────────────────────

export const CONTAINER_PADDING = {
  /** Default container side padding. */
  default: "px-6 md:px-10",
  /** Narrow — for prose-heavy pages. */
  narrow: "px-6 md:px-8",
  /** Wide — for full-bleed grids. */
  wide: "px-4 md:px-6",
  /** Tight — page-level container, gives 320px viewports an extra 4px gutter. */
  tight: "px-5 sm:px-6",
  /** Snug — content sections needing comfort at md+. */
  snug: "px-5 sm:px-6 md:px-8",
} as const;

// ─────────────────────────────────────────────────────────────────────
// MAX WIDTH — content measure
// ─────────────────────────────────────────────────────────────────────

export const MAX_WIDTH = {
  /** Prose — long-form article body. */
  prose: "max-w-prose",
  /** Content — standard section measure. */
  content: "max-w-[68ch]",
  /** Wide — landing-page section grids. */
  wide: "max-w-6xl",
  /** Bleed — full viewport. */
  full: "max-w-none",
} as const;

// ─────────────────────────────────────────────────────────────────────
// CONTENT GAP — vertical rhythm between blocks
// ─────────────────────────────────────────────────────────────────────

export const CONTENT_GAP = {
  /** Tight — between related items (label → title). */
  tight: "mb-3 md:mb-4",
  /** Default — between paragraphs and standard blocks. */
  default: "mb-6 md:mb-8",
  /** Generous — between major content blocks within a section. */
  generous: "mb-12 md:mb-16",
  /** Section break — between major narrative beats inside a section. */
  sectionBreak: "mb-20 md:mb-24",
} as const;

// ─────────────────────────────────────────────────────────────────────
// GRID GAPS — between columns / cards
// ─────────────────────────────────────────────────────────────────────

export const GRID_GAP = {
  /** Tight — chip rows, inline tags. */
  tight: "gap-2 md:gap-3",
  /** Default — card grids. */
  default: "gap-6 md:gap-8",
  /** Generous — 2-column hero layouts. */
  generous: "gap-10 md:gap-14",
  /** Editorial — large 2-column sections. */
  editorial: "gap-8 md:gap-12 lg:gap-16",
} as const;

// ─────────────────────────────────────────────────────────────────────
// TOUCH TARGETS — WCAG 2.5.8 (44px minimum)
// ─────────────────────────────────────────────────────────────────────

export const TOUCH_TARGET = {
  /** Minimum for any interactive element. WCAG AA. */
  min: "min-h-[44px] min-w-[44px]",
  /** Comfortable — preferred for primary actions. */
  comfort: "min-h-[48px] min-w-[48px]",
  /** Large — primary CTAs. */
  large: "min-h-[56px] min-w-[56px]",
} as const;

// ─────────────────────────────────────────────────────────────────────
// MIN HEIGHT — section / card height floors
// ─────────────────────────────────────────────────────────────────────

export const MIN_HEIGHT = {
  /** Card — uniform height in a row. */
  card: "min-h-[200px]",
  /** Hero — full viewport hero. */
  hero: "min-h-[80vh]",
  /** Sub-page hero. */
  subHero: "min-h-[40vh]",
  /** Page — full viewport. */
  page: "min-h-screen",
} as const;

// ─────────────────────────────────────────────────────────────────────
// THE 8PX GRID
// Reference values for inline styles where a token doesn't exist.
// ─────────────────────────────────────────────────────────────────────

export const GRID_8PX = {
  /** 4px — only for icon-aligned spacing. */
  half: "0.25rem",
  /** 8px — base unit. */
  one: "0.5rem",
  /** 16px. */
  two: "1rem",
  /** 24px. */
  three: "1.5rem",
  /** 32px. */
  four: "2rem",
  /** 48px. */
  six: "3rem",
  /** 64px. */
  eight: "4rem",
  /** 96px. */
  twelve: "6rem",
  /** 128px — section padding default. */
  sixteen: "8rem",
} as const;

// ─────────────────────────────────────────────────────────────────────
// RULES
// ─────────────────────────────────────────────────────────────────────

export const SPACING_RULES = {
  do: [
    "Default to SECTION_PADDING.default for any new homepage section.",
    "Wrap section content in `container mx-auto` with CONTAINER_PADDING.default and a MAX_WIDTH.* cap.",
    "Use CONTENT_GAP.tight for label\u2192title, CONTENT_GAP.default for paragraphs, CONTENT_GAP.generous between blocks.",
    "Every interactive element MUST hit TOUCH_TARGET.min on mobile.",
  ],
  dont: [
    "Don't use raw Tailwind values for new components (mb-9, py-25). Pick from a token.",
    "Don't make a section less than SECTION_PADDING.default vertical padding without a reason \u2014 compressed sections feel cheap.",
    "Don't nest containers inside containers. Pick one max-width per section.",
    "Don't use mt-* for vertical rhythm. We use mb-* (top-down). One direction = consistent stacking.",
  ],
} as const;
