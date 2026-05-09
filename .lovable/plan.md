# Pass 33 — Homepage Polish + Token Sweep

Goal: Bring the homepage rhythm to the same Apple/Fly4Me calm the sub-pages now achieve, then sweep Pass 32's `.eyebrow` + `.hairline` atomics through every component that still hand-rolls cedar borders or uppercase tracking. Tighten one rhythm break (BrandStatement → Services) that currently feels stacked rather than composed.

## Principles
1. The homepage proves the brand silently — no decorative scrim, no extra hairlines, no mixed eyebrow widths.
2. Every cedar hairline on the page is either `.hairline` (1px cedar/12) or absent. No `border-image` gradients on standard section seams.
3. Every uppercase micro-label is `.eyebrow`. One scale, one color, one weight.
4. Two adjacent sections must never share a background color without a single `.hairline` between them.

---

## A. Hero (`src/components/Hero.tsx`)

- Subtitle current `Decks, fencing, sheds, painting and siding — built to last across Alberta.` reads as a pricing list. Replace with a single Fly4Me-grade benefit sentence: `Outdoor work for Alberta homes — done by the same crew you meet.`
- Move "or call (780)…" from a comma-separated row into a true ghost button that mirrors CedarCTA height (44px), with `border border-cedar/15 hover:border-cedar` and a leading `Phone` icon. Eliminates the floating bare text-link feel.
- Eyebrow swap: `Exterior Construction` → `Calgary · Edmonton · Alberta` (already present as breadcrumb — drop redundancy by removing breadcrumb prop and elevating it to the eyebrow). One label, one location.

## B. BrandStatement (`src/components/BrandStatement.tsx`)

- Change layout from 3/9 split to centered single-column on md+ matching Fly4Me's "philosophy as wall text" pattern. Eyebrow on top center (`.eyebrow`), single statement below, max-w `46ch`, type clamp `(1.625rem, 3.6vw, 2.875rem)` (smaller than now — currently competes with Hero H1).
- Replace the current sentence with three discrete sentences typeset as one paragraph, each separated by a thin cedar middle-dot `·` rather than periods+space — feels Apple-typeset.
- Wrap with a `.hairline` top + bottom so it reads as a quoted plate, not a section.

## C. Services homepage rows (`src/components/Services.tsx`)

- The header's 3-column grid duplicates the eyebrow pattern that's already in BrandStatement. Drop the trailing "Start a quote ↗" — it competes with the per-row CTA. Replace with an end-of-list footnote row: thin hairline + 1-line sentence "Don't see what you need? Ask anyway → " linking to /contact.
- Rows: tighten py to `py-7 md:py-9` (currently 8/10). Move the `↗` arrow left of the description on lg+ so it lives at the title baseline; on md it stays right.
- Make the divider strategy uniform — `.hairline` between rows; remove the existing `border-t border-cedar/15` top rule on the `<ul>`. The first row's top edge is the hairline.
- Per-row hover: drop `bg-cedar/[0.035]`, switch to a left-edge cedar bar that animates from `0 → 2px width` on hover (Apple-style index marker). Keeps row height stable.

## D. FeaturedProjects (`src/components/FeaturedProjects.tsx`)

- Audit & enforce: max 3 projects on homepage (already done in Pass 31?). Verify the prop limit is in place; if not, add a `limit?: number` default to 3.
- Drop any per-card cedar border or shadow; pure photo + caption with `.eyebrow` metadata line. Caption rhythm: project name (font-serif), middle-dot, location, middle-dot, year — all in one row.
- Section header uses the new centered `align="center"` SectionHeader.

## E. CrewMoment (`src/components/CrewMoment.tsx`)

- Strip the `borderImage` topRule path — replace with `.hairline` class when `topRule` is true.
- Remove the optional `showStats` block here (proof lives in the closer/about). Keep the prop signature deprecated but no-op so existing call sites don't break; clean up `STATS_TRIO` import if unused.
- Image aspect: `aspect-[4/5]` mobile, `aspect-[3/4]` desktop (currently 5/4 on mobile which feels squat).
- Caption under image: small italic 1-liner (`On the boards · Calgary NW`) using `.eyebrow` for the trailing service area.

## F. TestimonialStrip (`src/components/TestimonialStrip.tsx`)

- Cards drop the `border border-cedar/10` and oversize curly quote. Replace with a clean editorial layout: short serif quote, then a single `.hairline` separator, then `firstName · city · service` in `.eyebrow`. No card chrome. Three columns float on whitespace alone — the Fly4Me move.
- Remove the `topRule` borderImage; use `.hairline` instead.
- Add a `bg-secondary` band only when `background="secondary"` — already done; just confirm the inner has `py-2` reduction so the whitespace isn't doubled with the cards' own padding.

## G. QuoteCloserCard (`src/components/QuoteCloserCard.tsx`)

- Replace `BACKDROP.evergreenCard` linear gradient with flat `bg-evergreen` — matches the calm flat Footer landing immediately below.
- Drop `md:grain-texture` — adds noise that fights the editorial calm.
- Eyebrow uses `.eyebrow` (currently hand-rolled `[10px] tracking-[0.25em]`).
- Add a single trailing micro-line under the CedarCTA: `Free · No obligation · 24-hour reply` separated by middle dots, in `.eyebrow` `text-evergreen-foreground/55`. Replaces the trust signals that were stripped in Pass 31 — but as one calm line, not chips.

## H. Spacing token consolidation (`src/lib/spacing.ts`)

- `SECTION_PADDING.default` and `SECTION_PADDING.calm` should be consolidated. Audit usage:
  - `default` → general sections
  - `calm` → BrandStatement, Hero, intro plates
- Add `SECTION_PADDING.tight` for stacked-rhythm sections like the catalogue rows on /services where 32px above + 24px below feels right and the current `default` is too generous.

## I. Typography sweep (`src/lib/typography.ts`)

- `EYEBROW.default/accent/onDark` are still hand-rolled into many components. Confirm everything routes through these constants OR the new `.eyebrow` CSS class. Pick one canonical eyebrow; deprecate the other in JSDoc with a `@deprecated use .eyebrow class` note.
- `BODY.lead` is currently `text-[15px] sm:text-base md:text-[17px] leading-[1.65]`. Drop md upper to `text-base` for mobile-first calm; oversized lead text feels marketing, not editorial.

## J. Color token sweep (`src/lib/colors.ts`)

- Add a new `RULE` export documenting the canonical hairline opacities used since Pass 32:
  - `RULE.hairline = "border-cedar/12"`
  - `RULE.divider = "border-cedar/8"` (between siblings inside a list)
  - `RULE.strong = "border-cedar/30"` (active state)
- Mark `BACKDROP.bronzeWash`, `BACKDROP.bronzeGlow`, and `DIVIDER.ornamental` as `@deprecated` — Pass 31/32 stopped using them. Don't delete; future audit pass.

## K. /style-guide live preview

- Add a dedicated "Atomics" section showing the new `.eyebrow` + `.hairline` utilities side-by-side with a code snippet, so future passes can sanity-check tokens at a glance.

## L. Verification

- Browser screenshots at 390 / 768 / 1280 / 1440 of `/` (homepage). Verify:
  - Hero ghost call button aligns with primary CTA (44px, same baseline)
  - BrandStatement now reads as a quoted plate (hairline above and below)
  - Services rows: equal py rhythm, no double-eyebrow at section top, footnote row present
  - Testimonials feel like floating editorial quotes, not cards
  - Closer card flat evergreen, single trust micro-line under CTA
  - No back-to-back identical bg colors without a `.hairline` between them
- DevTools Lighthouse pass on `/` — no new layout shift from hover-only border animation.

## Files to touch

`src/components/Hero.tsx`, `src/components/BrandStatement.tsx`, `src/components/Services.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/CrewMoment.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/QuoteCloserCard.tsx`, `src/lib/spacing.ts`, `src/lib/typography.ts`, `src/lib/colors.ts`, `src/pages/StyleGuide.tsx` (or wherever the live atomics list lives).
