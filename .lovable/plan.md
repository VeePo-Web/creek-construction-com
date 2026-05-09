# Pass 30 — Fly4Me transposition: editorial restraint, numbered rows, Apple-grade interaction primitives

Pass 29 finished cleaning the sub-page hairlines and atom radii. Walking the Fly4Me reference end-to-end exposes the *next* leap: Fly4Me's discipline isn't about color (Creek already has the right warm palette) — it's about **rhythm, restraint, and a tiny vocabulary of interaction primitives** repeated everywhere. Pass 30 transposes those primitives into Creek without losing the bronze/cream warmth the user explicitly said to keep.

The principle: **import Fly4Me's grammar, keep Creek's voice.**

---

## A. Interaction primitives — three CSS utilities, used everywhere

Fly4Me has exactly **two** interaction signatures across the entire site: `link-underline` (gradient-grow underline, no layout shift) and `link-arrow` (↗ that translates `+3px,-3px` on group hover). They're cheap, GPU-only, and *used everywhere*. Creek currently re-rolls hover effects per component (after:bottom-0 underlines, group-hover:translate-x, hover:text-cedar). One vocabulary, applied consistently, looks orders of magnitude more polished.

**Add to `src/index.css` `@layer utilities`:**

```css
.link-underline {
  background-image: linear-gradient(hsl(var(--cedar)), hsl(var(--cedar)));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition: background-size 420ms cubic-bezier(0.22,1,0.36,1), color 240ms;
  padding-bottom: 2px;
}
.link-underline:hover, .link-underline:focus-visible, .link-underline.is-active {
  background-size: 100% 1px;
}

.link-arrow {
  display: inline-block;
  transition: transform 320ms cubic-bezier(0.22,1,0.36,1);
}
.group:hover .link-arrow,
.group:focus-visible .link-arrow {
  transform: translate(3px, -3px);
}

.container-x {
  @apply px-5 sm:px-6 md:px-10 lg:px-16;
}
```

`container-x` replaces every ad-hoc `px-5 sm:px-6` Creek pads with — single source for horizontal rhythm. (Keep Creek's `container mx-auto max-w-[1440px]` on the *outer* wrapper; `container-x` is just the padding utility.)

## B. Editorial section header — 12-col newspaper grid (the highest-impact change)

Fly4Me's signature: every section opens with the same 12-col header layout —

```text
[ eyebrow · col-span-3 ]   [ MASSIVE HEADLINE · col-span-6 ]   [ ↗ All projects · col-span-3, right-aligned ]
```

Creek's `SectionHeader` is currently a centered/left-stack composition. Add a new `variant="editorial-grid"` to `src/components/SectionHeader.tsx` that renders this 3/6/3 layout with an optional trailing `link` slot. Roll it out on **homepage Services, FeaturedProjects, CrewMoment, TestimonialStrip, MiniFaq** — five sections, one rhythm. This is the single most "Apple-grade" change in the pass.

Headline weight: keep DM Serif Display (Creek's voice) but tighten tracking from current `tracking-[-0.02em]` to **`tracking-[-0.035em]`** (Fly4Me uses -0.04em). Cap line-height at `leading-[1.02]` for the giant beats. Use `text-balance`.

## C. Homepage Services → numbered editorial rows (replaces tile grid)

The current homepage Services section (`src/components/Services.tsx`) is a 3-up tile grid with hero photos per group. It works, but it competes visually with the 4-up Featured Projects below it — two photo grids in a row dilute focus.

**Convert to a Fly4Me-style numbered row list:**

```text
─────────────────────────────────────────────────────
01    Decks, Pergolas & Patios          Cedar, composite, two-tier — built to outlast the lot.
─────────────────────────────────────────────────────
02    Fencing & Gates                   Privacy slats, side gates, custom millwork.
─────────────────────────────────────────────────────
… 03 / 04 / 05
```

12-col grid: `01` (col-span-1, eyebrow tracking) · Title (col-span-5, serif text-2xl/3xl) · Description (col-span-6, muted body). Hover: row tints `bg-cedar/[0.04]`, title gets `link-underline`, trailing `↗` arrow appears on the right. Every row is a quote-modal trigger. **No images** — the reduction is the point. The photo gravity stays with FeaturedProjects below.

Result: homepage rhythm becomes Hero (photo) → Services (typographic) → CrewMoment (photo) → FeaturedProjects (photo) → Testimonials (typographic) → MiniFaq (typographic) → Closer. **Alternating photo/typography beats** = the Fly4Me cadence.

## D. FeaturedProjects — asymmetric staggered grid

Fly4Me's project gallery uses staggered 12-col placements (`md:col-span-7` → `md:col-span-5 md:col-start-8 md:mt-24` → `md:col-span-6 md:col-start-2`). Creates a hand-laid editorial feel vs. the regular 3-up grid Creek currently ships.

For the **Work page** Featured section, apply the same LAYOUTS array. Homepage FeaturedProjects can stay regular (less is more on home), but the `/work` page deserves the asymmetry. Image aspect: switch from current to `aspect-[4/5]` (Fly4Me ratio) — tall portraits feel more editorial than landscapes for residential builds.

## E. Floating "Get a quote ↗" anchor (persistent conversion)

Fly4Me's bottom-right `Start a project ↗` button is the highest-converting element on the site — present on every page, hover-lifts, never moves. Creek's QuickNav popover serves a similar role but is heavier (5 routes + quote action). Add a **dedicated single-purpose floating CTA** as a sibling to QuickNav (or merge — see decision point below):

```tsx
<button className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 bg-foreground text-background px-5 py-3 md:px-6 md:py-3.5 text-xs md:text-sm font-medium shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity">
  Get a quote ↗
</button>
```

Creek variant: use **`bg-evergreen text-evergreen-foreground`** (warmer than pure black) with a `border-l-[3px] border-cedar` accent bar to keep the brand language. Hidden on `/contact` (already at the funnel terminus).

**Decision needed (see questions): keep QuickNav + add the floating CTA, or replace QuickNav with the single-purpose CTA?**

## F. Header scroll-condense

Fly4Me header animates `h-20 → h-16` once `scrollY > 24`. Creek's chrome is already always-opaque (per memory rule) — keep that — but add the **height condense** for the same Apple "settling" feel. Touch `src/components/Navigation.tsx` only; no opacity/blur changes.

## G. Mobile menu — fewer, bigger, staggered

Fly4Me's mobile menu replaces dense links with `text-3xl font-medium` stacked items animated in with a 70ms stagger. Creek's GlobalMenu already uses big type but the mobile sub-bar/SectionRail can compete on small screens. **Audit: at 390px width, ensure only ONE of (SectionRail, GlobalMenu) is visible at a time, never both stacked.** If both render, hide the rail under sm.

## H. Section padding rhythm

Fly4Me uses `py-24 md:py-40` for content sections, `py-32 md:py-48` for marquee beats (BrandStatement, CTA). Creek's `SECTION_PADDING.default` is currently smaller. **Bump `src/lib/spacing.ts` `default` to `py-24 md:py-32 lg:py-40`** — gives every section the breathing room Fly4Me uses to project confidence. Keep `compact` and `footer` variants unchanged.

## I. Brand statement insertion (homepage)

Fly4Me's BrandStatement is a single oversize pull quote between FeaturedWork and Services. Creek doesn't have an equivalent — the closest is the sub-headline under the hero. **Add a new `<BrandStatement />` section between Hero and Services** on the homepage, same 3/9 grid:

```text
[ EST. 2019 · ALBERTA ]   How we work shows up in the work itself. We don't subcontract the build, we don't surprise on price, and we'd rather do fewer projects exceptionally well.
```

Existing copy lives in About — promote a single sentence to the homepage at editorial scale.

## J. Squared-corners discipline (selective)

Fly4Me uses `--radius: 0` globally. Creek's 6px radius is a brand decision — **don't change tokens**. But Fly4Me's project tiles + image wrappers are deliberately squared because rounded corners on photographs read "stock". **Set image wrappers to `rounded-none`** in: FeaturedProjects, ProjectGallery, HomeProjectRecapStrip, CrewMoment photo. Keep cards/buttons at 6px. **Photographs are square. UI is rounded.** A simple, defensible rule.

## K. Decision points (need user input)

Two decisions affect scope materially. See `ask_questions` block below.

## L. Files to touch

- `src/index.css` — add `link-underline`, `link-arrow`, `container-x` utilities
- `src/lib/spacing.ts` — bump `SECTION_PADDING.default`
- `src/components/SectionHeader.tsx` — add `variant="editorial-grid"`
- `src/components/Services.tsx` — convert to numbered rows, drop tile photos
- `src/components/FeaturedProjects.tsx` — image wrappers `rounded-none`
- `src/components/CrewMoment.tsx`, `src/components/media/HomeProjectRecapStrip.tsx` — image wrappers `rounded-none`
- `src/components/ProjectGallery.tsx` — `rounded-none`
- `src/components/Hero.tsx` — tighten headline tracking to `-0.035em`
- `src/components/Navigation.tsx` — scroll-condense height
- `src/components/BrandStatement.tsx` — new component
- `src/pages/Index.tsx` — insert BrandStatement
- `src/pages/Work.tsx` — apply asymmetric LAYOUTS to projects grid
- `src/components/FloatingQuoteCTA.tsx` — new component (pending decision)
- `src/App.tsx` or `src/components/Navigation.tsx` — mount FloatingQuoteCTA

## M. Verification

Screenshots at **390 / 768 / 1366** of `/`, `/work`, `/services`, `/about`, `/contact` after the pass. Specifically check:
1. Numbered service rows wrap correctly on 390 (number stays inline with title, description drops below)
2. Floating CTA doesn't overlap QuickNav on 390
3. Editorial-grid section header collapses sanely under md (eyebrow → heading → arrow stack vertically)
4. Squared image wrappers don't break the QuoteCloserCard rounded-[6px] hierarchy
5. New `py-32` rhythm doesn't push above-the-fold content too far on 390
