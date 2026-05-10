# Pass 39 — Composite Primitive Eyebrow Sweep (cards + chips + stats)

Pass 38 closed sub-page eyebrows. The remaining bespoke `text-[10px] tracking-[0.18em|0.20em|0.22em|0.25em] uppercase` strings now live inside the **composite primitives** every page reuses — `ServiceTile`, `FeaturedProjects`, `StatTrio`, `TrustChip`, `CrewMoment`. Each primitive currently picks a slightly different opacity and tracking, which means the same card can render with two-or-three subtly different eyebrows on the same screen (homepage Services tile = 0.20em, FeaturedProjects "View project" = 0.18em, TrustStrip rule = 0.22em, StatTrio heading = 0.25em). Aligning these to the single `.eyebrow` token finishes the editorial-grammar lockup.

Out of scope (intentionally, same as Pass 38): QuoteModal/QuoteFormInline labels, GlobalMenu chrome, PageHero on-photo strings, Navigation nav-pills (the nav lockup is its own typography case — handled in Pass 41).

## Principles continued
- One `.eyebrow` stamp on cream/secondary surfaces. Opacity tweaks via `opacity-{40|55|70}` modifiers, never new tracking values.
- Card-scale headings stay in `HEADLINE.card`. Section-scale headings stay in `HEADLINE.section`. Tile counters use `eyebrow tabular-nums opacity-40`.
- Hover lives in the marker (cedar bar, glyph translate, or counter opacity bump) — never in the body type color flip.
- All `rounded-[6px]` on cream surfaces collapse to `rounded-[2px]`.

---

## A. ServiceTile — homepage 6-up service cards (`src/components/ui/service-tile.tsx`)

Three bespoke eyebrow strings, all slightly different:
- L73 (compact counter): `text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 tabular-nums` → `eyebrow tabular-nums opacity-40`.
- L88 (default counter): `text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 tabular-nums` → `eyebrow tabular-nums opacity-50`.
- L101 (default "Quote this →" cue): `text-[10px] tracking-[0.18em] uppercase text-cedar/70 group-hover:text-cedar transition-colors duration-500 mt-4` → `eyebrow mt-4 transition-opacity duration-500 opacity-80 group-hover:opacity-100`.

Also drop the title color flip:
- L70 and L92–L96 — remove `group-hover:text-cedar transition-colors duration-500` from the `<h3>`. The cedar left-bar (already on the row at L60–L62) is the canonical hover signal. Card title stays `HEADLINE.card`.

Icon hover stays cedar — that's the card-scale equivalent of the bar.

## B. FeaturedProjects — homepage project cards (`src/components/FeaturedProjects.tsx`)

- L94–L98 title: `font-serif ${headingSize} text-foreground mt-2 leading-tight group-hover:text-cedar transition-colors duration-300` — keep the size token but drop the `group-hover:text-cedar transition-colors duration-300` flip (consistent with §A).
- L106–L112 "View project →": `text-[10px] tracking-[0.18em] uppercase text-cedar/70 group-hover:text-cedar transition-colors duration-300` → `eyebrow opacity-80 group-hover:opacity-100 transition-opacity duration-300`. Keep the arrow translate as the kinetic cue.

## C. StatTrio — used on homepage + sub-pages (`src/components/ui/stat-trio.tsx`)

- L61 inline label: `text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70 mt-2 leading-tight` → `eyebrow opacity-70 mt-2`.
- L72 wrapper: `rounded-[6px]` → `rounded-[2px]`.
- L83–L90 card heading: bespoke `text-[10px] tracking-[0.25em] uppercase mb-3 font-medium` with `onDark` color branching. Replace with:
  ```tsx
  <h3 className={cn("eyebrow mb-3", onDark && "text-cedar/80")}>
  ```
  (On dark backgrounds the cedar/80 override stays — `.eyebrow` defaults to cedar/65 which is fine on cream.)

## D. TrustChip — used on Hero + funnel (`src/components/ui/trust-chip.tsx`)

- L44–L51 chip variant label: `text-[10px] tracking-[0.18em] uppercase font-light` → `eyebrow font-normal` then keep the `onDark ? "text-evergreen-foreground/70" : "text-muted-foreground"` color override (chip variant intentionally reads quieter than cedar default — pass `text-muted-foreground` to override the cedar tone on cream).
- L73 rule variant label: `text-[10px] tracking-[0.22em] uppercase font-light` → `eyebrow font-normal` with the same `textColor` override.

The `font-light` → `font-normal` change is a micro-bump: 11px uppercase tracked type at weight 300 hairlines on subpixel grids; weight 400 (the `.eyebrow` default 500 dropped one notch) renders crisply at every DPR. Verified against the homepage hero TrustStrip — currently slightly smudgy at 1.25× DPR (the user's current viewport).

## E. CrewMoment inline stats (`src/components/CrewMoment.tsx` L88)

`text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 mt-2 leading-tight` → `eyebrow opacity-70 mt-2`.

This makes CrewMoment's mini stat trio match the StatTrio inline variant from §C exactly.

## F. FloatingQuoteCTA label (`src/components/FloatingQuoteCTA.tsx` L54)

`text-[11px] md:text-xs tracking-[0.18em] uppercase font-medium` → `eyebrow md:text-xs`. (The md-bump stays; the desktop chip is allowed one step larger because it floats over photography and needs to read at glance.)

## G. Verification
1. Homepage `/` — hover any service tile: cedar left-bar slides in, title color stays foreground, "Quote this" eyebrow brightens.
2. Homepage `/` — FeaturedProjects card hover: title stays foreground, "View project" eyebrow brightens, arrow translates.
3. Homepage `/` — StatTrio card variant: 2px corners (was 6px), heading reads identically to every other eyebrow on the page.
4. Homepage hero TrustStrip — chips render crisp (no font-light hairlining) at 1.25× DPR.
5. CrewMoment mini stats render identical eyebrow to StatTrio inline.
6. FloatingQuoteCTA chip eyebrow matches the rest of the site's tracking (was 0.18em, now 0.22em from `.eyebrow`).
7. 390 / 768 / 928 (current) / 1440 sweep on `/` — no overflow, no layout drift.

## Files to touch
`src/components/ui/service-tile.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/ui/stat-trio.tsx`, `src/components/ui/trust-chip.tsx`, `src/components/CrewMoment.tsx`, `src/components/FloatingQuoteCTA.tsx`.
