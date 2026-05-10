# Pass 46 — Container rhythm: one canonical page-container

Pass 45 unified the H2 ladder. Now the sections themselves drift horizontally: at every breakpoint, different sections begin at different x-coordinates, so the eye sees a "wobble" scrolling Home top to bottom. The fix is one utility, one migration sweep.

## Audit — what's on the page today

Container patterns currently in use across the codebase (top occurrences):

| Pattern | Count | Effective max-width @ 1440px viewport |
|---|---|---|
| `container mx-auto px-5 sm:px-6` | 11 | **1280px** (Tailwind default `container`, no md/lg gutter expansion) |
| `container mx-auto max-w-[1440px] px-5 sm:px-6` | 2 | 1440px, narrow gutters |
| `container mx-auto max-w-[1440px] container-x` | 2 | 1440px, full progressive gutters (20→24→40→64) |
| `container mx-auto px-6` | 2 | 1280px, 24px flat gutter |
| Hand-rolled chrome variants (`max-w-7xl`, `px-6 md:px-10`, etc.) | ~6 | various |

Concrete consequence on Home at 1440px:
- Services H2 starts ~64px from edge.
- CrewMoment H2 starts ~24px from edge AND its column caps 160px earlier (1280 vs 1440).
- TestimonialStrip same as CrewMoment.
- FeaturedProjects starts at 24px but caps at 1440.

Three different start-x and two different end-x in one scroll — the exact drift Fly4Me / Apple eliminate.

## A. New utility — `.container-page`

Add to `src/index.css` directly under `.container-x` (line ~196):

```css
.container-page {
  @apply mx-auto w-full max-w-[1440px] px-5 sm:px-6 md:px-10 lg:px-16;
}
```

This is the **single canonical page container**. Drops `container` (the Tailwind plugin) entirely — we manage max-width and gutters ourselves so every section is identical.

Keep `.container-x` for legacy sub-uses (e.g. provenance card overlays inside heroes) but mark deprecated in a comment.

## B. Migration sweep — Home + shared section components

Replace the wrapper `<div>` opening in each file. Drop redundant `container mx-auto max-w-[1440px]` chains.

| File | Line | Before | After |
|---|---|---|---|
| `src/components/Services.tsx` | 24 | `container mx-auto max-w-[1440px] container-x` | `container-page` |
| `src/components/BrandStatement.tsx` | 19 | `container mx-auto max-w-[1440px] container-x` | `container-page` |
| `src/components/FeaturedProjects.tsx` | 157 | `container mx-auto max-w-[1440px] px-5 sm:px-6` | `container-page` |
| `src/components/QuoteCloserCard.tsx` | 56 | `container mx-auto max-w-[1440px] px-5 sm:px-6` | `container-page` |
| `src/components/CrewMoment.tsx` | 113 | `container mx-auto px-5 sm:px-6` | `container-page` |
| `src/components/TestimonialStrip.tsx` | 91 | `container mx-auto px-5 sm:px-6` | `container-page` |
| `src/components/MiniFaq.tsx` | (wrapper) | `container mx-auto px-5 sm:px-6` | `container-page` |
| `src/components/media/FieldClipsStrip.tsx` | (wrapper) | `container mx-auto px-5 sm:px-6` | `container-page` |
| `src/pages/About.tsx` | three section wrappers | `container mx-auto px-5 sm:px-6` (or similar) | `container-page` |
| `src/pages/Services.tsx` | section wrappers | same | `container-page` |
| `src/pages/Work.tsx` | section wrappers | same | `container-page` |

(Exact line numbers will be verified at edit time; pattern is mechanical.)

## C. Out of scope (deliberate)

- **PageHero variants** (architect-bleed, evergreen-typographic, editorial-split, cinematic-bleed) — these intentionally use `px-5 sm:px-6 md:px-10` *without* `lg:px-16` and *with* their own vertical paddings (`pt-28 md:pt-36`). Heroes are full-bleed by design; their inner type column lives independently of the body section grid. Leaving them untouched preserves the cinematic edge-of-bleed look.
- **Footer** — uses `max-w-7xl` (1280px) deliberately so legal microcopy doesn't stretch to 1440px on ultrawide monitors. Editorial precedent (NYT, Stripe). Stays.
- **Top nav chrome** (`Navigation.tsx`, `SectionRail.tsx`, etc.) — chrome max-width is `max-w-7xl` for the same reason: nav items shouldn't fly to the edges of a 1440px screen. Stays.
- **QuoteModal inner column** — modal manages its own width. Stays.
- **`MAX_WIDTH.wide` (`max-w-6xl`) inside section-content `<div>`s** — these are *content* width caps inside an already-padded container. Different concern, untouched.

## D. Verification

1. `rg "container mx-auto max-w-\[1440px\]" src/components src/pages | grep -v PageHero | grep -v page-hero` → **zero matches**.
2. `rg "container mx-auto px-5 sm:px-6\"" src/components src/pages | grep -v page-hero | grep -v "Navigation\|SectionRail\|MobileSubNav\|HeaderBreadcrumb\|GlobalMenu"` → **zero matches**.
3. `rg "container-page" src/components src/pages` → **~10–12 matches** (one per migrated section).
4. Visual sweep at 360 / 414 / 768 / 1024 / 1280 / 1440 / 1920:
   - Lay a vertical guide at the left edge of the Hero type column (set by hero's own `px-5 sm:px-6 md:px-10`). At lg+ the *body* sections (BrandStatement, Services, FeaturedProjects, CrewMoment, TestimonialStrip, QuoteCloserCard) will start one step further inset (`lg:px-16` = 64px) than the hero (`md:px-10` = 40px) — this is the intentional editorial inset that signals "you've left the hero, you're in the magazine".
   - Within the body group, every section starts at the SAME x at every breakpoint. Scroll Home — the eye should track a single vertical rule.
   - Right edge: every body section now caps at 1440 - 64 = 1376px content width on lg+. Previously CrewMoment/Testimonial capped at 1280 - 24 = 1256px. The 120px gain is real and welcome.
5. No horizontal scrollbar on 360px (the smallest supported viewport) — `px-5` = 20px each side leaves 320px content, fine.

## E. Documentation update

Add a one-line memory note (in this pass's edit, not a separate write) inside `src/lib/spacing.ts` near the SECTION_PADDING block:

```
// CONTAINER UTILITY: every body section uses `.container-page` from index.css.
// Hero variants and chrome use bespoke containers — see PageHero / Navigation.
```

## Files touched

1. `src/index.css` (add `.container-page`)
2. `src/lib/spacing.ts` (one-line doc note)
3. `src/components/Services.tsx`
4. `src/components/BrandStatement.tsx`
5. `src/components/FeaturedProjects.tsx`
6. `src/components/QuoteCloserCard.tsx`
7. `src/components/CrewMoment.tsx`
8. `src/components/TestimonialStrip.tsx`
9. `src/components/MiniFaq.tsx`
10. `src/components/media/FieldClipsStrip.tsx`
11. `src/pages/About.tsx`
12. `src/pages/Services.tsx`
13. `src/pages/Work.tsx`
