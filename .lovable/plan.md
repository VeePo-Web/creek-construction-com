# Pass 45 — Section-header rhythm: one H2, one eyebrow

The homepage currently runs **four different H2 typographic scales** across Hero → BrandStatement → Services → FeaturedProjects → CrewMoment → TestimonialStrip → QuoteCloserCard. Pass 44 unified the caption tier (`.eyebrow-base`) and the CTA tier (`.cta-label`); Pass 45 finishes the trio by codifying **one canonical section-heading scale** and migrating every literal to it. This is the single highest-leverage rhythm fix left on Home.

## Audit — current scales on Home

| Section | Token used | Scale (sm / md / lg) | Tracking |
|---|---|---|---|
| Services | literal | 36 / 48 / 60px | -0.035em |
| QuoteCloserCard | literal | 30 / 36 / 48px | -0.022em |
| BrandStatement | literal `clamp(26→46px)` | fluid | -0.030em |
| CrewMoment, FeaturedProjects, TestimonialStrip | `HEADLINE.section` | 30 / 36 / 48px | -0.022em |
| Sub-page heroes (About, Services-page) | `HEADLINE.display` | 36 / 48 / 60px | -0.035em |

Two tokens, two literal scales, fluid clamp — every section reads at a different size.

## A. Reconcile `HEADLINE.section` and `HEADLINE.display` into one

Edit `src/lib/typography.ts` lines 54–65:

- `HEADLINE.display` keeps its current value (36/48/60, -0.035em) — this becomes the canonical "any homepage / sub-page section H2".
- `HEADLINE.section` is **redefined to equal `HEADLINE.display`** (same string), with an updated comment that says it now exists only for semantic readability ("use `.display` for visual primacy, `.section` when you want the reader to know it's a section H2"). Same computed CSS — zero risk to any consumer.
- Update the lying comment on line 62 ("Same scale as `display` here") — make it true.

Result: every consumer of `HEADLINE.section` (CrewMoment, TestimonialStrip, FeaturedProjects, SectionHeader, Work.tsx, kinetic-headline `compact`) **automatically jumps from 30/36/48 → 36/48/60**. This is the desired Apple-grade lift.

## B. Migrate the three literal H2s to `HEADLINE.section`

| File | Line | Action |
|---|---|---|
| `src/components/Services.tsx` | 30–37 | Replace `font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.02] tracking-[-0.035em] text-balance` → `${HEADLINE.section} leading-[1.02]` (keep tighter leading override; everything else is in the token) |
| `src/components/QuoteCloserCard.tsx` | 32 | Replace `font-serif text-evergreen-foreground text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.022em] text-balance` → `${HEADLINE.section.replace("text-foreground", "text-evergreen-foreground")} leading-[1.1]` — or simpler: split out a tiny inline override `${HEADLINE.section}` and add `text-evergreen-foreground` after to override the foreground class via Tailwind's later-wins ordering. |
| `src/components/BrandStatement.tsx` | 27 | Replace `font-serif text-[clamp(...)] text-foreground leading-[1.1] tracking-[-0.03em] text-balance` → `${HEADLINE.section} leading-[1.1]` |

For (B-2) the cleanest pattern is `cn(HEADLINE.section, "text-evergreen-foreground leading-[1.1]")` so the override wins (cn dedupes; Tailwind's later utility wins for `text-*` color). Add `import { cn } from "@/lib/utils"` if absent.

## C. Migrate the Services-row numerals to the caption tier

`src/components/Services.tsx` line 60 currently:
```
text-[11px] uppercase tracking-[0.22em] text-cedar/55 tabular-nums text-right md:text-left
```
→
```
eyebrow-base text-cedar/55 tabular-nums text-right md:text-left
```
Drops the row-numeral from the CTA tier (11px) into the calmer caption tier (10px), letting the H3 service title carry the eye. Aligns Services row rhythm with FeaturedProjects metadata captions.

## D. Delete the deprecated `EYEBROW` constant block

`src/lib/typography.ts` lines 80–97. Audit confirms zero consumers in `src/components` and `src/pages` outside `StyleGuide.tsx` and `bronze-rule.tsx`.

- `bronze-rule.tsx` — read it; if it references `EYEBROW.*`, migrate to literal eyebrow class strings (`eyebrow-base`/`eyebrow`) before removing the export.
- `StyleGuide.tsx` — keep one demo cell that shows the new `.eyebrow` / `.eyebrow-base` / `.cta-label` triplet. Remove old `EYEBROW.default/accent/onDark` rows.

After migration, delete the entire `EYEBROW` export. One source of truth lives in `index.css`.

## E. Tiny semantic fix in BrandStatement

`<p className="hairline" aria-hidden />` × 2 (lines 25, 34) → `<hr className="hairline border-0" aria-hidden />` × 2. Empty `<p>` is a screen-reader hiccup and an HTML lint signal; `<hr>` is the right element for a thematic break. The `.hairline` utility already paints the top border, so we zero the default `<hr>` border via `border-0` and let the utility's `border-top` win. Visual output is identical.

## F. Verification

1. `rg "text-3xl md:text-4xl lg:text-5xl|text-4xl sm:text-5xl md:text-6xl" src/components src/pages | grep -v StyleGuide` → **zero matches**.
2. `rg "EYEBROW\." src/components src/pages | grep -v StyleGuide` → **zero matches**.
3. `rg "text-\[11px\] uppercase tracking-\[0\.22em\]" src/components` → **zero matches**.
4. Visual sweep at 390 / 768 / 1024 / 1440:
   - All five homepage H2s (BrandStatement, Services, FeaturedProjects, CrewMoment, TestimonialStrip, QuoteCloserCard) render at the same scale and tracking.
   - QuoteCloserCard heading remains evergreen-foreground (white-on-green) — confirm via inspector.
   - Services row "01 / 02 / 03 …" numerals shrink to 10px, stay cedar/55, alignment unchanged.
   - BrandStatement: no double line break around the hairlines.
5. Lighthouse a11y: ≥ previous score (we're removing two empty-`<p>` warnings).

## G. Out of scope

- Sub-page heroes (`PageHero` variants) — they already use `KineticHeadline` with their own clamp; not on the section-H2 ladder.
- Footer headings — visually distinct tier (DM Sans uppercase), unrelated.
- `bronze-rule.tsx` *internal* literal classes — only migrate the `EYEBROW.*` reference (if any), leave the rest.
- `STATS_TRIO` numerals in CrewMoment — already on a deliberate display tier (`text-2xl md:text-[1.75rem]`), unchanged.

## Files touched

1. `src/lib/typography.ts` (reconcile + delete `EYEBROW`)
2. `src/components/Services.tsx` (H2 + row numerals)
3. `src/components/QuoteCloserCard.tsx` (H2)
4. `src/components/BrandStatement.tsx` (H2 + `<hr>` semantics)
5. `src/components/ui/bronze-rule.tsx` (only if it consumes `EYEBROW.*`)
6. `src/pages/StyleGuide.tsx` (drop deprecated demo rows, keep one new triplet)
