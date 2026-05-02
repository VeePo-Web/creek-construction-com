/**
 * Creek Construction — Motion System
 *
 * Easing, duration, and animation contracts. Every animation in the
 * codebase pulls from this file so reduced-motion can be honored at
 * the source.
 *
 * Philosophy: "Breathing easing"
 * Motion should feel organic and unhurried — never spring-bouncy,
 * never linear. The default curve decelerates like an exhale.
 *
 * Cross-references:
 * - Live preview:    /style-guide → "Motion"
 * - Tailwind config: tailwind.config.ts `transitionTimingFunction.smooth`
 * - Global CSS:      src/index.css `@media (prefers-reduced-motion)`
 *
 * @example
 *   import { EASING, DURATION, HOVER } from "@/lib/motion";
 *   <Card className={HOVER.cardLift} style={{ transition: `all ${DURATION.normal} ${EASING.smooth}` }} />
 */

// ─────────────────────────────────────────────────────────────────────
// EASING CURVES
// ─────────────────────────────────────────────────────────────────────

export const EASING = {
  /**
   * Smooth — the brand's default. Decelerating, organic, unhurried.
   * Use for nearly everything: hovers, fades, transforms.
   */
  smooth: "cubic-bezier(0.16, 1, 0.3, 1)",

  /**
   * Linear — for progress fills, scroll-linked motion.
   */
  linear: "linear",

  /**
   * Spring — gentle bounce, used sparingly for delightful moments.
   * (Avoid on production CTAs — feels playful, not premium.)
   */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",

  /**
   * Ease-out — fast start, slow end. For exits & reveals.
   */
  out: "cubic-bezier(0, 0, 0.2, 1)",
} as const;

// ─────────────────────────────────────────────────────────────────────
// DURATION
// ─────────────────────────────────────────────────────────────────────

export const DURATION = {
  /** 150ms — micro-feedback (button press, focus ring). */
  fast: "150ms",
  /** 300ms — standard hover, color shift. */
  normal: "300ms",
  /** 500ms — card lift, background warmth, title color change. */
  slow: "500ms",
  /** 700ms — image zoom, overlay slide. */
  cinematic: "700ms",
  /** 1000ms+ — entrance reveals, hero parallax. */
  entrance: "1000ms",
} as const;

// ─────────────────────────────────────────────────────────────────────
// HOVER PATTERNS — pre-composed Tailwind class strings
// ─────────────────────────────────────────────────────────────────────

export const HOVER = {
  /** Card lifts subtly; warm cedar background fades in. */
  cardLift:
    "transition-[transform,background-color,border-color] duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-cedar/[0.04] hover:border-cedar/30",

  /** Link gets cedar color + underline sweep. */
  linkUnderline:
    "transition-colors duration-300 ease-smooth hover:text-cedar relative",

  /** Image scales to 1.05 with cedar overlay slide. */
  imageZoom:
    "transition-transform duration-700 ease-smooth group-hover:scale-105",

  /** Tile selection — bronze border + warmth tint. */
  tileSelect:
    "transition-[border-color,background-color] duration-300 ease-smooth hover:border-cedar/50 hover:bg-cedar/[0.02]",

  /** Chip — gentle background warmth on hover. */
  chip:
    "transition-[background-color,border-color] duration-500 ease-smooth hover:bg-cedar/[0.04] hover:border-cedar/40",
} as const;

// ─────────────────────────────────────────────────────────────────────
// FOCUS — visible ring system (keyboard accessibility)
// ─────────────────────────────────────────────────────────────────────

export const FOCUS = {
  /** Default — bronze ring on light surfaces. */
  ring:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2",
  /** Inset — for inputs (no offset). */
  ringInset:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/30 focus-visible:border-cedar",
  /** On dark — bronze ring with dark offset. */
  ringOnDark:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen",
} as const;

// ─────────────────────────────────────────────────────────────────────
// SCROLL REVEAL — entrance animation system
// ─────────────────────────────────────────────────────────────────────

export const SCROLL_REVEAL = {
  /** Fade up — default block entrance. */
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
  /** Fade — no transform, just opacity. */
  fade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  /** Scale in — for images. */
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

/** Stagger delay between children in a revealed list. */
export const DELAY_SEQUENCE = {
  /** 80ms — between dense list items. */
  dense: 0.08,
  /** 120ms — standard list items. */
  default: 0.12,
  /** 200ms — major narrative beats (label → title → body → CTA). */
  generous: 0.2,
} as const;

// ─────────────────────────────────────────────────────────────────────
// REDUCED MOTION
// Honored at the source. ScrollRevealMotion already short-circuits
// when (prefers-reduced-motion: reduce) matches. These class strings
// give component authors a way to opt into the same discipline.
// ─────────────────────────────────────────────────────────────────────

export const REDUCED_MOTION = {
  /** Disable all transforms when reduced-motion is set. */
  noTransform:
    "motion-reduce:translate-y-0 motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:rotate-0",
  /** Keep color transitions, drop motion. */
  colorsOnly:
    "motion-reduce:transition-colors motion-reduce:transform-none",
  /** Disable everything. */
  off: "motion-reduce:transition-none motion-reduce:animate-none",
} as const;

// ─────────────────────────────────────────────────────────────────────
// KEYFRAMES — registered globally in tailwind.config.ts
// (Listed here for /style-guide rendering only.)
// ─────────────────────────────────────────────────────────────────────

export const KEYFRAME = {
  fadeInUp: "animate-fade-in-up",
  scaleIn: "animate-scale-in",
  accordionDown: "animate-accordion-down",
  accordionUp: "animate-accordion-up",
} as const;

// ─────────────────────────────────────────────────────────────────────
// RULES
// ─────────────────────────────────────────────────────────────────────

export const MOTION_RULES = {
  do: [
    "Default to EASING.smooth and DURATION.normal (300ms) unless you have a reason.",
    "Wrap any non-essential animation behind motion-reduce: classes from REDUCED_MOTION.",
    "Use SCROLL_REVEAL.fadeUp via <ScrollRevealMotion>; don't roll your own IntersectionObserver.",
    "Cap stagger delays at DELAY_SEQUENCE.generous (200ms) \u2014 longer feels broken.",
  ],
  dont: [
    "Don't use spring easing on production CTAs \u2014 it reads as playful, not premium.",
    "Don't animate width / height \u2014 animate transform / opacity (cheaper, smoother).",
    "Don't loop infinite animations on body content. Brief moments only.",
    "Don't exceed DURATION.entrance (1s). If it feels like the page is loading, it's too slow.",
  ],
} as const;
