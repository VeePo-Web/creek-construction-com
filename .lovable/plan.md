## Homepage hero — minimal black/white architect refinement

A focused, hero-only refinement on the homepage. The rest of the site keeps its cream + bronze editorial palette. The hero adopts an architectural-monograph composition: one quiet photograph, hairline rules, a small uppercase eyebrow, and an oversized lighter serif headline with generous whitespace.

### What changes

1. New variant `architect-bleed` in `src/components/ui/page-hero.tsx`
   - Single full-bleed photograph as the hero plate (uses the same approved `query` that the homepage already feeds).
   - Photograph desaturated and slightly darkened by a near-black scrim — gives a true black/white architect feel without rewriting tokens.
   - 12-column type layer overlaid:
     - Top-left: tiny uppercase sans eyebrow (`EXTERIOR CONSTRUCTION · CALGARY · EDMONTON`) on a single hairline rule. White ink, 0.18em tracking, 11px.
     - Center-left: oversized DM Serif Display headline, weight 400, letter-spacing −0.01em, line-height 0.95, sized `clamp(56px, 8vw, 132px)`. Two lines max. The italic tail (“Pride in every detail.”) renders in white at 70% opacity, italic, on its own line — no underline, no color accent.
     - Bottom-left: a single hairline divider, then the subtitle in white at 80% (max-width 46ch, 16px DM Sans, 1.55 leading).
     - Bottom row: primary CTA reskinned for the hero only (white outline button, 1px border, uppercase 12px label, 56px tall, hover fills white/8%). Secondary "or call …" link sits to its right in the same restrained sans.
   - Bottom-right corner: small caption rail — `service · location · year` in 11px uppercase sans, separated by interpuncts, with a 1px hairline above. Replaces the floating provenance card on the homepage.
   - Stats trio is removed from inside the hero. It moves to a new lean strip immediately below the hero (3 stats, hairline-divided, on the cream page background) so the hero stays uncluttered.
   - Trust chips are removed from inside the hero. They move below the new stats strip, presented as a single hairline rule of three items in the existing site palette — no visual change to those components, only relocation.

2. `src/components/Hero.tsx`
   - Switch `<PageHero variant="editorial-split">` to `<PageHero variant="architect-bleed">`.
   - Pass the existing `query`, `sectionLabel`, `title`, `italic`, `subtitle`.
   - Pass `caption={{ service, location, year }}` derived from the matched media item (same logic the cinematic-bleed variant already uses).
   - Stop passing `provenance`, `triptychQueries`, `TrustChips`, and `StatTrio` as hero children. Instead render two new sibling sections in `src/pages/Index.tsx` directly under `<Hero />`:
     - `<HeroStatsStrip />` — hairline-bordered three-up stats on cream.
     - `<HeroTrustStrip />` — three trust chips on a single rule on cream.
   - These two strips reuse `StatTrio` and `TrustChips` unchanged; only their wrapper is new and lives inside `Hero.tsx` as small local components to avoid scattering files.

3. Hero-only B/W token scoping
   - No edits to `src/lib/colors.ts` or any global token file.
   - All B/W treatment lives inside the new variant block in `page-hero.tsx`, expressed as inline `style` values and Tailwind utilities scoped to that variant. The cedar/cream tokens are not touched, so the rest of the site is unaffected.
   - The `KineticHeadline` component is reused with `onDark` and a new optional `weight="light"` prop (or, if simpler, the variant renders its own headline directly with the same staggered reveal animation already used elsewhere — picked during implementation based on which keeps the kinetic reveal intact with the least risk).

4. Motion & accessibility
   - Keep the existing Ken Burns drift on the photograph (already implemented via `useHeroParallax`).
   - Keep the existing clip-path text reveal cadence (eyebrow → headline → subtitle → CTA → caption).
   - Honor `prefers-reduced-motion`: drop drift and reveal, fade in only.
   - Maintain WCAG AA: scrim opacity tuned so white ink reaches 4.5:1 over the darkest expected photo region; verified against the current homepage hero photo set.
   - CTA stays ≥44px tall (mobile WCAG target) — already covered by the 56px hero CTA height.

5. Memory updates
   - Add a new memory `mem://design/architect-hero` documenting: hero-only B/W treatment, scoped to homepage `architect-bleed` variant, tokens untouched, headline weight/tracking specifics, and that Stats + Trust were lifted out of the hero into sibling strips.
   - Update `mem://index.md` Memories section to reference it. Core rules unchanged.

### What does not change

- Color tokens, typography tokens, spacing tokens, motion tokens, brand identity tokens.
- /style-guide page.
- Navigation chrome, GlobalMenu, conversion CTAs (phone, Quote, MENU).
- Every other page's hero (`evergreen-typographic`, `cinematic-bleed`, `service-portrait` variants are untouched).
- Cream + bronze remain the sitewide palette.

### File touch list

- `src/components/ui/page-hero.tsx` — add `ArchitectBleed` variant + types + dispatch case.
- `src/components/Hero.tsx` — switch variant, drop in-hero stats/trust, render two new sibling strips.
- `src/components/ui/kinetic-headline.tsx` — optional `weight` prop if reuse path is chosen.
- `mem://design/architect-hero` — new memory file.
- `mem://index.md` — append reference.

### Composition (ASCII)

```text
┌──────────────────────────────────────────────────────────────┐
│ ── EXTERIOR CONSTRUCTION · CALGARY · EDMONTON                │
│                                                              │
│                                                              │
│   Excellence in                                              │
│   the Work.                                                  │
│   Pride in every detail.                                     │
│                                                              │
│   ──                                                         │
│   Decks, fencing, sheds, painting and siding — built to      │
│   last across Alberta.                                       │
│                                                              │
│   [ REQUEST A QUOTE ]   or call (xxx) xxx-xxxx               │
│                                                              │
│                                ── DECKS · CALGARY · 2025     │
└──────────────────────────────────────────────────────────────┘
   ── 7+ years on tools   ── 200+ projects   ── 48h quote
   ── WCB covered   ── Fully insured   ── Locally owned
```
