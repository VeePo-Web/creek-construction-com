/**
 * Sizes-attribute presets — semantic names for responsive image hints.
 *
 * Pages must NEVER hand-write sizes strings. Pull from here so every slot
 * across the site requests the right resolution from the CDN.
 *
 * Naming convention: <CONTEXT>_<COLUMNS>
 *   FULL = 100vw
 *   HALF = 50vw at desktop
 *   THIRD = 33vw at desktop
 *   QUARTER = 25vw at desktop
 *   CHIP = small (under 200px), e.g. service icons & process step thumbnails
 *
 * These match the slot map in MEDIA_PLAYBOOK.md.
 */

export const MEDIA_SIZES = {
  /** Full-bleed hero photo / divider — spans full viewport */
  HERO_FULL: "100vw",
  /** Wide editorial bleed (e.g. between sections) — also full viewport */
  BLEED_FULL: "100vw",
  /** Two-column layout (about, services side-by-side) */
  HALF: "(min-width: 768px) 50vw, 100vw",
  /** Three-column card grid (portfolio, recap strip) */
  THIRD: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  /** Four-up project recap strip */
  QUARTER:
    "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw",
  /** Portrait photo in a 2-col block (services side image) */
  PORTRAIT_HALF: "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw",
  /** 60/40 asymmetric — primary side */
  ASYM_PRIMARY: "(min-width: 768px) 60vw, 100vw",
  /** 60/40 asymmetric — secondary side */
  ASYM_SECONDARY: "(min-width: 768px) 40vw, 100vw",
  /** Small chip — service-card photo, process step thumbnail (≤200px) */
  CHIP: "(min-width: 768px) 200px, 33vw",
  /** Tiny thumbnail — admin grids etc. */
  THUMB: "120px",
} as const;

export type SizesPreset = keyof typeof MEDIA_SIZES;
