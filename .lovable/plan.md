# Pass 35 — Apple-grade Calm: Buttons, Hero CTAs, and Last-Mile Chrome

Pass 33–34 quieted layouts and shared atomics. The remaining "loudness" is concentrated in **interactive primitives** that still ship pre-Pass-32 chrome: the primary CTA itself (shimmer + tracking shift + thermal glow), the Contact direct-line aside (3px bordered card), ProjectTile's hover shadow, NavigationMinimal's seam shadow, FloatingQuoteCTA's drop shadow, the Quote form submit's glow shadow, and a few residual gradient fallbacks. Pass 35 finishes the calibration so every interaction reads as Fly4Me/Apple — confident, flat, decisive.

## Principles (carried)
1. **No glow shadows** on bronze surfaces. A hover shadow on a brand-color button reads as marketing, not craft.
2. **No tracking-shift on hover** for buttons. Tracking shifts create a micro-jump that's the opposite of Apple's solid-mass press feedback.
3. **No shimmer animation** on the primary CTA. The CTA earns attention through color and placement, not motion.
4. **One CTA shape** site-wide: 2px radius (`rounded-[2px]`), filled bronze, white tracked label, arrow that translates 4px on hover. That's it.

---

## A. CedarCTA — the canonical button (`src/components/CedarCTA.tsx` + `src/lib/colors.ts`)

### A1. Primary variant
- Drop `cta-thermal` utility entirely.
- Drop the hover tracking-shift (`hover:tracking-[0.2em]`).
- Drop `hover:shadow-thermal`.
- Replace `rounded-sm` with `rounded-[2px]` so corners match the Hero ghost CTA.
- Update `BUTTON.primary` token to:
  ```
  base:       inline-flex items-center gap-3 bg-cedar text-cedar-foreground
              px-8 py-4 rounded-[2px] text-[11px] tracking-[0.22em]
              uppercase font-medium
  hover:      hover:bg-cedar-hover
  focus:      focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-cedar focus-visible:ring-offset-2
  transition: transition-colors duration-300
  ```
- Arrow stays — `ArrowRight` translates `+4px` on hover (already wired).
- The entire `.cta-thermal` rule + `cta-shimmer-sweep` keyframe in `index.css` get deleted (lines 327–351, 517–528). Nothing else consumes them.

### A2. Secondary variant
- Replace the gradient underline `from-cedar to-cedar/60` with a flat `bg-cedar` 1px line — no gradient on a 4px-tall element, the gradient is invisible and adds noise.
- Drop `hover:bg-cedar/[0.04]` and `hover:px-3` (reads as a button reflowing on hover; Apple links don't move). Keep only the line-grow micro-interaction.

## B. QuoteFormInline submit + success buttons (`src/components/quote/QuoteFormInline.tsx`)
- Both buttons (L214 success "Call us now", L424 form submit) carry a bespoke glow shadow `shadow-[0_1px_2px_hsl(var(--cedar)/0.20),0_8px_24px_-8px_hsl(var(--cedar)/0.30)]`. Strip both. They were the source of the "marketing button" feel inside the otherwise flat form plate.
- Update both to `rounded-[2px]`, `tracking-[0.22em]`, `transition-colors duration-300`. Match A1 grammar.

## C. FloatingQuoteCTA chip (`src/components/FloatingQuoteCTA.tsx`)
- L55 `shadow-[0_8px_30px_rgba(0,0,0,0.18)]` → reduce to a 1px hairline + minimal lift: `shadow-[0_2px_8px_-2px_rgba(0,0,0,0.10)]`. The chip needs *some* elevation to lift over photographs in the Featured section; we keep that but at 1/3 the intensity. Verify the chip still reads against light secondary backgrounds.

## D. NavigationMinimal seam (`src/components/navigation/NavigationMinimal.tsx`)
- L23: drop `shadow-[0_1px_0_0_rgba(0,0,0,0.04)]` — it was added before we standardized to `border-cedar/12`. The hairline alone is enough.

## E. ProjectTile (`src/components/ui/project-tile.tsx`)
- L123: drop the `transition-shadow … group-hover:shadow-[0_8px_24px_-12px_hsl(var(--cedar)/0.18)]` and `border border-border/40`. ProjectTiles in FeaturedProjects already render edge-to-edge; the shadow created a phantom border on cream backgrounds.
- L126: replace `BACKDROP.stonePlate` no-photo fallback with the same `bg-secondary` + serif numeral pattern we just deployed in FeaturedProjects (Pass 34) so the two callsites match.

## F. Contact direct-line aside (`src/pages/Contact.tsx`)
- L68–118: the aside still ships a Pass-30 card chrome (`rounded-[6px] border border-cedar/15 border-l-[3px] border-l-cedar`). Replace with the new flat treatment to mirror the form panel:
  - Outer wrapper: `mt-8 hairline-l border-l-[2px] !border-l-cedar bg-secondary/40 rounded-[2px]`.
  - Inner row dividers (L87, L104): `border-t border-cedar/10` → `border-t border-cedar/12` (token consistency).
  - Hover `hover:bg-cedar/[0.03]` stays — it's the active-row affordance.

## G. Contact form panel (`src/pages/Contact.tsx` L122)
- The right column wraps `QuoteFormInline` in `bg-secondary/40 rounded-[6px] p-6 md:p-8`. Now that QuoteFormInline brings its *own* `bg-secondary/40` shell (Pass 34), the wrapper double-paints the surface. Drop the wrapper's `bg-secondary/40` and `p-6 md:p-8`; keep only the SectionHeader spacing wrapper. Form's internal padding handles the rest. Avoids the "card-in-card" look on lg+.

## H. QuoteCloserCard (`src/components/QuoteCloserCard.tsx`)
- L29: `before:w-[3px]` → `before:w-[2px]` to match the universal 2px left-bar grammar (Services, About steps, ServiceTile hover).
- The CedarCTA inside this card sits on evergreen — once Pass 35-A flattens the button, verify its `bg-cedar` still reads against `bg-evergreen`. (It will — both are tested colors.)

## I. Hero ghost CTA (`src/components/Hero.tsx`)
- L32: ghost call link uses `border-white/25 hover:border-white`. Bump *idle* to `border-white/30` (matches the BronzeCTA's perceived weight on the photographic hero) and add `hover:bg-white/[0.06]` for a Fly4Me-style soft fill on hover. Keeps the radius at `rounded-[2px]` (already correct).

## J. StatTrio card variant (`src/components/ui/stat-trio.tsx`)
- L73 `card` variant still ships `grain-texture shadow-contact border border-border/40`. Even if not used on the homepage today, the variant exists in the public API. Refactor to: `py-3 pl-5 hover:pl-7 hover:bg-accent/[0.04] border-l border-cedar/12 hover:border-cedar/40`. Removes grain + shadow; preserves the indent-on-hover micro-interaction.

## K. Footer mobile dividers (`src/components/Footer.tsx`)
- L46, L72: the `-mx-5 sm:-mx-6` negative-bleed dividers can clip if the parent ever gets `overflow-x-hidden` (it does — `overflow-x-clip` on `<main>`). Switch to non-bleeding: `border-t border-evergreen-foreground/10` with no negative margin. Visual: an inset divider with the same column gutter — cleaner Apple footer rhythm.

## L. CSS cleanup (`src/index.css`)
- Remove `.cta-thermal` definitions (L327–351).
- Remove `@keyframes cta-shimmer-sweep` (L517–528).
- Remove the `prefers-reduced-motion` opt-out for `.cta-thermal::before` (L597 region).
- Net: ~35 lines lighter, one fewer reflow trigger on every CTA hover.

## M. Token doc updates (`src/lib/colors.ts`)
- `BUTTON.primary` rewritten as in A1 (canonical).
- Add `BUTTON.ghost` token for the Hero on-photo treatment so it can be reused on PageHero variants:
  ```
  ghost: {
    base: inline-flex items-center justify-center gap-2 min-h-[44px]
          px-5 rounded-[2px] border border-white/30 text-[11px]
          tracking-[0.22em] uppercase text-white/85
    hover: hover:border-white hover:bg-white/[0.06] hover:text-white
    transition: transition-colors duration-300
  }
  ```
- Mark `SHADOW.thermal` as `@deprecated` (Pass 35 stopped using cedar glow on buttons; preserved only because it's referenced in legacy comments).

## N. Style-guide refresh (`src/pages/StyleGuide.tsx`)
- Update the "Buttons" beat to render the new flat primary, secondary, and ghost variants side-by-side with annotations.
- Add a "Pass 35 — flat CTAs" note in the Components section explaining: no shimmer, no tracking-shift, no glow.

## O. Verification (do not skip)
1. `/` at 390 / 768 / 1280 / 1440: confirm hero CTA + ghost call CTA align on baseline, both at 2px radius, no shimmer when hovering primary.
2. `/contact` at 390 / 768 / 1024 / 1280: direct-line aside reads as flat plate with single 2px cedar bar; right column no longer has card-in-card padding doubling.
3. `/services` at 390 / 768 / 1280: WE/YOU HANDLE columns + numbered service rows: every interaction primitive matches the new grammar.
4. `/`: hover the FloatingQuoteCTA chip — confirm shadow is felt, not seen.
5. DevTools: search rendered DOM for `cta-thermal`, `shadow-thermal`, `grain-texture`. Expect 0 hits across `/`, `/services`, `/about`, `/contact`, `/work`.
6. Lighthouse on `/contact` (most-changed) — confirm no CLS regression from the form-wrapper unwrap.
7. Reduced-motion snapshot at `/` — primary CTA must not shimmer (confirms .cta-thermal is fully gone).

## Files to touch
`src/components/CedarCTA.tsx`, `src/components/quote/QuoteFormInline.tsx`, `src/components/FloatingQuoteCTA.tsx`, `src/components/navigation/NavigationMinimal.tsx`, `src/components/ui/project-tile.tsx`, `src/pages/Contact.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/Hero.tsx`, `src/components/ui/stat-trio.tsx`, `src/components/Footer.tsx`, `src/index.css`, `src/lib/colors.ts`, `src/pages/StyleGuide.tsx`.
