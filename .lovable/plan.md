
# Pass 14 — Section-by-Section Viewport Audit

Goal: the same FlexServices-grade calm as their site — strong baseline grid, generous whitespace, only one visual idea per section, identical behavior from 360 → 1920px. This pass is almost entirely subtractive and rhythmic.

Below is a per-section audit with the exact changes. No new components, no business-logic edits.

---

## 1. Global rhythm (one source of truth)

`src/lib/spacing.ts`
- `SECTION_PADDING.default` → `py-16 sm:py-20 md:py-24 lg:py-28` (currently jumps `py-20 → py-28`; the missing 360–640px step crowds mobile).
- Add `SECTION_PADDING.tight` (`py-12 sm:py-16 md:py-20`) for proof bands & footer-adjacent sections.
- `MAX_WIDTH.content` capped at `max-w-[68ch]`; `MAX_WIDTH.wide` capped at `max-w-6xl` (current ultrawide overflow makes the homepage feel oceanic at 1920).
- `GRID_GAP.default` → `gap-6 md:gap-8`; `GRID_GAP.editorial` → `gap-8 md:gap-12 lg:gap-16` (smooth tablet step).

`src/lib/typography.ts`
- `HEADLINE.section` add `text-balance tracking-[-0.022em]`.
- `HEADLINE.display` add `text-balance tracking-[-0.035em]`.
- `BODY.lead` set to `text-[15px] sm:text-base md:text-[17px] leading-[1.65] text-foreground/75` (currently a hair too dark on cream).

These three edits cascade across every page — most of the audit is just letting them propagate.

---

## 2. Navigation (`src/components/Navigation.tsx`)

- Header height ladder: `h-14 sm:h-16 md:h-18 lg:h-20` (currently 16/20 → too tall on 360/375 phones, eats hero).
- Drop the secondary tablet phone icon button (lines 122–133). Phone is already in GlobalMenu + footer + closer. Removing it gives the Quote pill + MENU room to breathe between 640–1024px.
- Spacer (lines 191–197) updated to match new heights: `h-14 sm:h-16 md:h-18 lg:h-20`, with `+40px` on sub-pages.
- Top hairline gradient (line 91–94): drop opacity from `/25` to `/15` — currently reads as a hard line on cream.
- `desktopCta` reduce to `px-4 py-2` so it stops out-weighing the section rail at md.

---

## 3. Hero (`src/components/Hero.tsx`)

- Remove the `italic="Pride in every detail."` line — it reads as a tagline-on-a-tagline. The `subtitle` already does the job. (Aligns with FlexServices, which never doubles a hero phrase.)
- `HeroProofBand`: change wrapper to `py-6 md:py-8` (currently 8/10) and swap `border-b border-cedar/15` → `border-y border-cedar/12` so it visually clamps the hero instead of just sitting under it.
- "or call …" mobile link: change from inline-after-CTA to `block sm:inline-flex` so on 360px it stacks under the CTA instead of wrapping mid-phone-number.

---

## 4. Homepage Services tile grid (`src/components/Services.tsx`)

- Grid: `sm:grid-cols-2 lg:grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Five items leave one orphan on `lg`; reorder visually by promoting the orphan to span 2 only at `lg+`: add `[&>*:nth-child(5)]:lg:col-span-1 [&>*:nth-child(5)]:xl:col-start-2` so the last tile centers on xl/ultrawide. (FlexServices' classic "no orphan tile" rule.)
- Tile `min-h-[340px]` → `min-h-[300px] md:min-h-[340px]`.
- Drop `shadow-contact` from tiles (single shadow per page rule — closer keeps it). Replace with `border border-border/50` only.
- Body copy on tile: clamp to 2 lines with `line-clamp-2` to keep tile heights identical even when copy varies.

---

## 5. CrewMoment (homepage variant)

- 2-col grid stacks at `md`. Force `md:grid-cols-[5fr_7fr]` so the photo doesn't dominate at exactly 768–1023px.
- Image aspect: switch `aspect-portrait` to `aspect-[4/5] md:aspect-portrait` — portrait at small widths is too tall on iPhone Pro Max and shoves the heading off-screen.

---

## 6. FeaturedProjects (`src/components/FeaturedProjects.tsx`)

- Audit only — verify the "asymmetric editorial" 7/5 split collapses to single column at `<md` with `gap-y-6`. If the existing component uses `lg:grid-cols-12` with col-span-7/5, change breakpoint to `md:grid-cols-12` so tablets (820 / iPad) get the editorial layout instead of the stacked one.
- Remove the per-project `shadow-elevated` if present; rely on cedar hairline border alone.

---

## 7. TestimonialStrip

- Card padding `p-6 md:p-9` → `p-6 md:p-7 lg:p-8` (current `p-9` is too generous against the smaller body text and floats the quote).
- Big curly quote glyph: `text-4xl md:text-5xl` → `text-3xl md:text-4xl`. Tighten `mb-3` → `mb-2`.
- `min-h` on cards: add `min-h-[260px]` so 1-line vs 3-line quotes don't stair-step the row.
- Footer line of card: switch `flex items-baseline justify-between` to `flex flex-wrap items-baseline justify-between gap-2` — at 360px the city · service overflows.

---

## 8. MiniFaq

- Container `max-w-3xl` → `max-w-2xl` (FlexServices keeps FAQ narrower than body for scanability).
- Phone fallback row: drop the `border-t` divider and the centered label; replace with a single quiet line (`text-xs text-muted-foreground/70`) right-aligned. Removes the boxy "second CTA" feel.
- Switch FAQ accordion icon to `+` / `−` (was a chevron) inside `FaqAccordion.tsx`.

---

## 9. QuoteCloserCard

- Padding ladder `p-7 md:p-12` → `p-6 sm:p-8 md:p-10 lg:p-12`.
- Heading sizes `text-3xl md:text-4xl lg:text-5xl` → `text-[28px] sm:text-3xl md:text-4xl lg:text-[44px]` and add `tracking-[-0.02em]`.
- Body: `max-w-prose` → `max-w-[52ch]` (cleaner measure on the dark plate).
- Trust strip: switch wrap behavior to `gap-x-4 gap-y-2`, drop icons to `h-2.5 w-2.5`, label tracking from `0.2em` → `0.18em`. At 360px the current strip wraps to 4 lines.
- Remove `grain-texture` from the card on mobile (`md:grain-texture`) — the noise PNG looks heavy on small screens against the dark plate.

---

## 10. Footer

- Three-column flex collapses awkwardly at `md` (768–820px): brand + nav + contact all on one row but the email + phone wrap. Set `md:flex-row` → `lg:flex-row` so the footer is single-stack until lg.
- Add a hairline above the brand row at `lg+`: `lg:border-t lg:border-evergreen-foreground/10 lg:pt-8`.
- Phone + email cluster: stack on `<sm` (`flex-col sm:flex-row`), gap `gap-2 sm:gap-5`.
- © line text: bump from `text-evergreen-foreground/45` → `/55` for AA on the dark green.

---

## 11. About page

- Story section: paragraphs are 80ch wide on ultrawide. Wrap them in `max-w-[62ch]`.
- Stat trio (lines 67–82): on 360px `text-2xl` + `text-[10px]` label causes the third stat ("Quote reply") to wrap. Either shorten label to "Reply time" or set `text-[9px] sm:text-[10px]`. Choose: shorten label to `Reply time` in `src/config/stats.ts`.
- Process steps (lines 97–113): drop `shadow-contact` and `grain-texture` (too busy stacked). Keep cedar left border + hover.
- Areas chips: switch wrap container from `flex flex-wrap` to a `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2` so chips form a clean grid instead of ragged rows.
- Remove `eyebrow="Up next"` from the trailing closer — it's the second eyebrow within 600px.

---

## 12. Services page

- Drop the redundant `italic="Fifteen services. One crew."` from PageHero. The `sectionLabel` + `subtitle` already say the same thing.
- Catalogue groups: header `text-2xl md:text-3xl` → `text-xl md:text-2xl` (the page already has 5 of these — currently they compete with the H1).
- Item rows hover state: drop the `-mx-3 px-3` negative-margin trick; instead change to `px-2 hover:px-3` for the same inset feel without breaking the column edge.
- Responsibility matrix (lines 142–196):
  - Cards `p-10 md:p-12` → `p-7 sm:p-8 md:p-10`.
  - Drop `shadow-elevated` from the WE HANDLE card; both cards should be visually equal weight (FlexServices' "no winner column" rule). Replace with `bg-cedar/[0.03]` to keep it readable.
  - At `lg+` the gap is currently `gap-0` so cards touch. Set `lg:gap-px lg:bg-border/40` or keep a real `lg:gap-4`. Choose: `lg:gap-4`.
- Remove `MidPageQuotePrompt` if it's still referenced — the page already ends in MiniFaq → QuoteCloserCard.

---

## 13. Work page

- PageHero: drop the `italic="Alberta-built. Crew-owned."` (third tagline overlap). Keep sectionLabel + title + subtitle only.
- "Sister studios" footnote: tighten — drop the leading `w-8 h-px` rule, keep just the text. At 360px the rule + label wraps awkwardly.
- Featured project header (lines 94–104): wrap behavior is `flex-col items-start gap-2 lg:flex-row`. At md (768px) the title is large but the meta line sits below. Change to `md:flex-row md:items-baseline md:justify-between` so tablets get the editorial side-by-side.
- Placeholder grid: `grid sm:grid-cols-2 gap-6 md:gap-8` is fine; add `lg:grid-cols-3` so ultrawide doesn't show enormous tiles. Then last orphan: `[&>*:nth-child(5)]:lg:col-start-2` to center.
- Remove `MidPageQuotePrompt` block (lines 144–146). The closer already exists; mid-page form duplicates the conversion path.
- "More projects added each month." italic line — push margin from `mt-12` to `mt-10` and drop italic; keep a quiet uppercase tracking-wide note instead.

---

## 14. Contact page

- Section padding override: this page is single-screen-conversion. Change wrapper to `pt-10 sm:pt-14 md:pt-20 pb-20 md:pb-28` (currently uses `SECTION_PADDING.default` which adds 28 top, pushing the H1 below the fold on iPhone SE).
- Headline strip: H1 sizes `text-4xl md:text-5xl lg:text-6xl` → `text-[32px] sm:text-4xl md:text-5xl lg:text-[56px]` with `tracking-[-0.025em]`. The `lg:text-6xl` (60px) is too big for a form page.
- 2-col grid `lg:grid-cols-[5fr_7fr]` — on `md` (820px iPad) it currently stacks. Move breakpoint to `md:grid-cols-[5fr_7fr]` so iPads get the side-by-side. Add `gap-10 md:gap-12 lg:gap-16`.
- Direct contact card icons (40x40) — reduce to `w-9 h-9` and icon `h-3.5 w-3.5`. Currently visually heavier than the form labels next to them.
- Service Areas line: "Including Calgary, Edmonton, Sherwood Park, St. Albert + more" — at 360px wraps to 3 lines. Slice to `.slice(0, 3)` and append `+ more towns`.

---

## 15. PageHero polish (cuts across all sub-pages)

`src/components/ui/page-hero.tsx` (audit-only, single targeted edit):
- Subtitle line: clamp width with `max-w-[44ch]` to avoid 90-char lines on ultrawide.
- Breadcrumb chip: drop background fill at `<sm` (text-only); the chip-on-image at 360px competes with the headline.

---

## 16. Token cleanup

- Remove all remaining `shadow-elevated` references except inside `QuoteCloserCard` (decisive elevation). Ripgrep targets: Services responsibility matrix, About process cards, FeaturedProjects.
- Border opacity normalization — only four allowed: `border-border/40` (default cards), `border-border/60` (interactive surfaces), `border-cedar/15` (hairlines), `border-cedar/30` (hover/accent). Replace any `/20`, `/50`, `/65`, etc., that the audit finds.

---

## Files touched (estimate)

`src/lib/spacing.ts`, `src/lib/typography.ts`, `src/components/Navigation.tsx`, `src/components/Hero.tsx`, `src/components/Services.tsx`, `src/components/CrewMoment.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/MiniFaq.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/Footer.tsx`, `src/components/ui/page-hero.tsx`, `src/components/ui/faq-accordion.tsx`, `src/pages/About.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/Contact.tsx`, `src/config/stats.ts`.

No new components, no schema changes, no logic changes — purely presentational/layout.
