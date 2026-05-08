# Pass 23 — Section-by-Section Viewport Cleanup

Goal: Walk every page on every breakpoint (320, 375, 414, 768, 1024, 1366, 1920) and lock down spacing, alignment, wrapping, and minimalism. Cut visual noise. Match the FlexServices.Org standard: confident whitespace, single focal point per band, predictable rhythm.

## A. Global Chrome (Navigation + Footer)

1. **Navigation.tsx** — Audit horizontal padding (`px-4 sm:px-6 lg:px-10`) so the logo never collides with the right cluster between 360–414px. Reduce CTA cluster gap on `sm` from `gap-3` → `gap-2`. Ensure phone link is hidden < 768 (icon-only fallback).
2. **MobileSubNav.tsx** — Confirm the chip rail has `pl-4 pr-6` so the last chip never clips behind the gradient mask; mask width currently 24px — bump to 32px.
3. **Footer.tsx** — On 320–375px, stack columns `gap-y-10` (currently 8); align all column headers to identical baseline; convert "©" line to single line with `flex-wrap` and `gap-x-2`.

## B. Home (`Index.tsx`)

4. **Hero / HeroTriptych** — On `< md`, force single-column stack, drop triptych entirely, swap to single editorial image with the full headline below (no overlay text on small). Verify `min-h-[88svh]` not `100vh` to avoid iOS chrome jump.
5. **TrustStrip** — At 1024 the 4-up grid breaks to 2×2 awkwardly; lock `grid-cols-2 md:grid-cols-4` and add `divide-x divide-cedar/15` between cells (remove on `<md`).
6. **FeaturedProjects** — Standardize tile aspect to `4/5` on mobile, `3/4` on tablet, `4/5` on desktop. Caption `mt-4` consistent. Remove any `hover:scale` > 1.02.
7. **HomeProjectRecapStrip** — Tighten gap from `gap-6` → `gap-4 md:gap-6`; cap to 3 items on mobile (currently shows 5 squeezed).
8. **MiniFaq** — Reduce question size on mobile from `text-xl` → `text-lg`; increase row padding `py-5 md:py-6`.
9. **CedarCTA** — Center-align on mobile, left-align ≥ md; constrain copy `max-w-[52ch]`.

## C. Services (`Services.tsx`)

10. **PageHero (service-portrait variant)** — Confirm subtitle wraps to 2 lines max at 375px (`max-w-[36ch]` on mobile).
11. **"Full Menu" intro band** — Left-align eyebrow + headline + lede in a single 8-col container; remove decorative center rule on mobile.
12. **Catalogue list** — Convert from 2-col grid to single column < lg. Numerals `tabular-nums` in DM Serif Display, right-aligned in a `w-12` gutter. Row divider `border-t border-cedar/12`, `py-6 md:py-8`.
13. **Service tiles** — Equal-height via `grid-rows-[auto_1fr_auto]`; CTA pinned to bottom.

## D. Work (`Work.tsx`)

14. **Cinematic hero** — Verify the new softer scrim still passes contrast on the brightest frame; if not, add a localized bottom-left vignette only.
15. **ProjectGallery** — Lock lead tile `aspect-[4/5]`, supports `aspect-square`, gap `gap-3 md:gap-5 lg:gap-6`. Remove any masonry behavior < md (single column).
16. **TestimonialStrip** — Replace straight quotes with curly; pull quote `text-2xl md:text-3xl`, attribution `text-sm tracking-[0.18em] uppercase mt-6`.

## E. About (`About.tsx`)

17. Prose container `max-w-[62ch]`; paragraph spacing `space-y-6`; drop caps removed on `< md`.
18. Crew portraits: 2-up on mobile, 3-up on tablet+, all `aspect-[4/5]`, `gap-4 md:gap-6`.
19. Closing italic block: center-align, `max-w-[44ch] mx-auto`, `text-balance`.

## F. Contact (`Contact.tsx`)

20. Form: labels `text-sm tracking-[0.14em] uppercase text-evergreen/70`; inputs `h-12`, focus ring `ring-cedar/40 ring-offset-2`.
21. On `< md`, stack form full-width; right rail (phone + hours) moves below form with `mt-12`.
22. Phone block: number `text-3xl md:text-4xl font-serif tabular-nums`, caption `mt-2 text-sm text-evergreen/60`.

## G. Shared Primitives

23. **SectionHeader** — Standardize: eyebrow (BronzeRule), `mt-4` headline `text-3xl md:text-5xl lg:text-6xl`, lede `mt-5 max-w-[52ch]`. Audit all callers for overrides; remove ad-hoc spacing.
24. **CedarCTA** — Two visual variants only (solid / ghost); kill any one-off button styling found in pages.
25. **PageHero** — Hard-cap eyebrow letter-spacing `tracking-[0.22em]`, headline `text-balance`, subtitle `text-pretty`.

## H. Tokens & Rhythm

26. Define section vertical rhythm tokens in `src/lib/spacing.ts`: `section.y = "py-16 md:py-24 lg:py-32"`. Replace bespoke `py-*` across all page sections.
27. Container width: standardize on `max-w-7xl mx-auto px-5 sm:px-8 lg:px-12`.

## I. QA Loop

28. After edits, screenshot every route at 375 / 768 / 1366. Verify: no horizontal scroll, no clipped text, consistent gutters, single H1 per route, all CTAs ≥ 44px tap target.

## Files to touch

`Navigation.tsx`, `MobileSubNav.tsx`, `Footer.tsx`, `Hero.tsx`, `HeroTriptych.tsx`, `TrustStrip.tsx` (in media), `FeaturedProjects.tsx`, `HomeProjectRecapStrip.tsx`, `MiniFaq.tsx`, `CedarCTA.tsx`, `SectionHeader.tsx`, `Services.tsx`, `Work.tsx`, `About.tsx`, `Contact.tsx`, `Index.tsx`, `page-hero.tsx`, `service-tile.tsx`, `project-tile.tsx`, `ProjectGallery.tsx`, `TestimonialStrip.tsx`, `src/lib/spacing.ts`.

No schema, no business logic, light-mode only, all tokens via `src/lib/*` and semantic Tailwind classes.
