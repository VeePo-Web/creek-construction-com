# Pass 31 — "Calm Like Fly4Me" Cleanup

Goal: strip the homepage and sub-pages down to Fly4Me-level calm. Fewer surfaces, fewer rules, fewer chips, more whitespace, perfectly tuned per breakpoint. Keep Creek's bronze/cream warmth and editorial typography.

## Principles enforced this pass
1. One idea per screen height. Generous negative space wins over decoration.
2. Maximum two hairlines visible at a time. No stacked dividers.
3. Conversion CTAs (phone, Quote, MENU, Floating Quote) stay; everything else may quiet down.
4. Mobile (390px) is the design target; scale up — not down.

---

## A. Homepage rhythm trim

Current: Hero → BrandStatement → Services → CrewMoment → Featured → Testimonials → MiniFaq → Closer (8 beats).
Target: Hero → BrandStatement → Services → Featured → CrewMoment → Testimonials → Closer (7 beats; MiniFaq moves to /about or /services to remove the second info-dense block before closer).

- Move `<MiniFaq />` off Index.tsx; mount on `/services` above its closer.
- Reorder so the single dense photo strip (Featured) sits between two quieter beats.

## B. Hero (`src/components/Hero.tsx`)

- Reduce to: kicker (small caps), 2-line serif headline, single sentence sub-copy, ONE primary CTA + one ghost link. Remove any badges/chips/stat row inside the hero frame.
- Headline tracking `-0.04em`, leading `1.02`, balance.
- Mobile: title clamps to `clamp(2.25rem, 9vw, 3.25rem)`; sub-copy `text-[15px] leading-[1.55]`.
- Image: full-bleed right column on `lg`, full-bleed top on mobile, `aspect-[4/5]` on mobile, `aspect-[5/6]` on desktop, `rounded-none`, subtle 6% cedar inner border only on desktop.
- Remove any hero scrim that fights the headline; keep only a 0→25% bottom gradient at 30% opacity for caption legibility.

## C. BrandStatement (`src/components/BrandStatement.tsx`)

- Pure type beat. Remove eyebrow column on mobile (stack), keep on `md+`.
- Statement: `text-pretty`, max 14 words. Tracking `-0.03em`. Color `text-foreground/85`.
- Padding: `py-28 md:py-40 lg:py-48` so it breathes between Hero and Services.

## D. Services rows (`src/components/Services.tsx`)

- Keep numbered 12-col rows from Pass 30, refine:
  - Row vertical padding: `py-8 md:py-10` (was 7/9) for Apple-like generosity.
  - Borders: only one bottom hairline per row, no top borders, no fading gradients on every row — use a single `divide-y` style at 0.10 cedar.
  - Number column: `tabular-nums text-cedar/55 text-[11px]` and right-align on mobile to free reading column.
  - Title hover: underline only (already), drop the right `↗` arrow on mobile (`hidden md:inline-block`).
  - Remove description on mobile if > 90 chars; show full on `md+`.
  - First row gets a top hairline; subsequent rows none — a continuous list, not stacked cards.

## E. FeaturedProjects (`src/components/FeaturedProjects.tsx`)

- Limit to 3 projects on homepage (was likely 4–6). "View all →" link below grid.
- Aspect: `aspect-[4/5]` mobile, `aspect-[3/4]` desktop. `rounded-none` already in.
- Caption block under image: project name (serif 18/20), city · year (mono uppercase 11px tracking 0.22em). One line each. No chips, no tags.

## F. CrewMoment

- Drop to a single full-bleed image with a 1-line italic caption underneath. No headline, no rule. It's a breath, not a section.
- Padding `py-20 md:py-28`.

## G. TestimonialStrip

- Show one quote at a time on mobile, 3 across on `lg`.
- Remove top rule (background change is enough). Quote marks as serif glyph at 56px, cedar/30, absolute top-left of each card; no border on cards.

## H. QuoteCloserCard

- Reduce to: eyebrow, 2-line serif headline, sub-copy, primary CTA, secondary phone link. Strip stat trio + trust chips (move to /contact page hero).
- Background: `bg-secondary`, single 1px cedar/15 top hairline, no card surface.

## I. Sub-pages consistency sweep

- `/services`: hero → numbered groups (same component grammar as homepage Services) → MiniFaq → CTA. Drop city chip cluster from page hero.
- `/work`: hero → asymmetric grid (Pass 30) → CTA. Remove StatTrio at top.
- `/about`: hero → BrandStatement-style mission → process steps (max 3, no shadow on hover, just background tint) → city chips moved here at the bottom — `rounded-[4px]`, single row scroll on mobile.
- `/contact`: hero → form + direct contact card side-by-side on `lg`, stacked on mobile. Form labels above inputs, 14px caps tracking 0.18em. Inputs `h-12`, `rounded-[4px]`, focus ring cedar/40.

## J. Navigation

- SectionRail: hide on mobile entirely (top chrome already crowded). Keep on `md+`.
- Header height locks `h-16` after scroll (already), but ensure padding-top of `<main>` matches via CSS var to prevent jump. Add `transition-[height] duration-300 ease-out`.
- MENU button: 44px square, `rounded-[6px]`, label `MENU` in 11px tracking 0.25em — no icon noise.

## K. FloatingQuoteCTA

- Hide on `/`, `/contact` and below 768px. On homepage the closer is the conversion anchor; mobile users get the sticky bottom bar from QuickNav. Avoids stacking two CTAs.
- Reveal threshold raised to `scrollY > window.innerHeight * 0.6` so it appears only after Hero leaves.

## L. Vertical rhythm tokens (`src/lib/spacing.ts`)

- Add `SECTION_PADDING.calm = "py-24 sm:py-28 md:py-36 lg:py-44"` for Hero/BrandStatement/Closer.
- Keep `default` for content sections.
- Add `CONTAINER_X = "px-5 sm:px-8 lg:px-12 xl:px-16"` and apply via `container-x` utility everywhere replacing ad-hoc `px-*`.

## M. Type scale tightening (`src/lib/typography.ts`)

- H1: `clamp(2.5rem, 6.5vw, 5.25rem)` tracking `-0.04em` leading `1.02`.
- H2: `clamp(2rem, 4.5vw, 3.5rem)` tracking `-0.035em`.
- Body: `text-[15.5px] md:text-base leading-[1.65] text-foreground/75`.
- Eyebrow: 11px caps, tracking `0.22em`, color `text-cedar/65`.
- Apply across SectionHeader, Hero, BrandStatement, page heroes.

## N. Color quietening (`src/index.css`)

- Reduce default cedar border opacity utility to 0.10 (from 0.18). Stronger 0.22 reserved for explicit emphasis.
- Body text default to `foreground/78`. Headlines `foreground/95`.

## O. Image cleanup

- Audit `/src/assets`: dedupe near-identical hero shots; pick 6 hero-grade photos (1 hero, 3 featured, 1 crew, 1 about). Reuse for /work gallery.
- Convert any decorative SVG dividers in components to nothing — rely on whitespace.

## P. Accessibility & polish

- Focus ring: single utility `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- All interactive targets ≥ 44px on mobile (audit chips, nav links).
- Reduced motion: respect `prefers-reduced-motion` in Hero Ken Burns and reveal animations.

## Q. Verification

Browser screenshots at 390 / 768 / 1024 / 1440 of `/`, `/services`, `/work`, `/about`, `/contact`. Check:
- No horizontal scroll, no stacked hairlines, CTAs never overlap.
- Section padding feels Apple-calm (not cramped).
- Floating CTA hidden where required.
- Hero loads under 2s; LCP image is the hero photo.

## Files to touch

`src/pages/Index.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`, `src/components/Hero.tsx`, `src/components/BrandStatement.tsx`, `src/components/Services.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/CrewMoment.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/MiniFaq.tsx`, `src/components/Navigation.tsx`, `src/components/navigation/*`, `src/components/FloatingQuoteCTA.tsx`, `src/lib/spacing.ts`, `src/lib/typography.ts`, `src/index.css`.
