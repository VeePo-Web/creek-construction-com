# Pass 15 — Section-by-Section Viewport Audit

Goal: bring every public page to FlexServices-grade calm. Reduce visual noise, normalize rhythm tokens at every breakpoint (sm 375 / md 768 / lg 1024 / xl 1440), and remove the small inconsistencies that keep the site from feeling truly minimal. Presentational only — no schema, no data, no new components.

## Audit findings (what I found that's still off)

1. Hero phone link sits as a separate `<a>` next to the CTA on `sm` and looks like a second button. Should be a quiet inline link, hidden on mobile (already in nav pill).
2. Homepage `Services` tiles use `min-h-[300px] md:min-h-[340px]` — too tall on small mobile, creates a tower of identical cards. Lower to a content-driven height.
3. `[&>*:nth-child(5)]:lg:col-start-2` orphan-fix is duplicated in both Services tile grid AND Work placeholder grid — works, but causes a half-empty row on `sm` (2-col) where item 5 is alone. Needs an explicit centered/full-width treatment per breakpoint.
4. About process cards use `pl-6 py-5` on a `flex items-start gap-5` — on 360px viewports the numeral + heading + body wraps awkwardly because of the 2px left border. Tighten gap and padding on mobile.
5. About city chips: 2-col on mobile produces orphans on lists with odd counts. Switch to 3-col on `sm` and 4-col on `md` so trailing rows look intentional.
6. Services page catalogue: group titles sit on a 1px cedar rule, but items use `border-b border-border/40` — two different border colors stack visually. Unify to `border-cedar/15`.
7. Services responsibility matrix: at `md` (768) it stacks but the eyebrow row "WE HANDLE / 06 ITEMS" wraps because of the matrix card padding + the `tabular-nums` count. Reduce eyebrow weight at `md`.
8. Work page: PageHero `cinematic-bleed` carries a `Sister studios` line below CTA — adds copy density to a page that should breathe. Move into Footer or drop.
9. Work page placeholder grid `[&>*:nth-child(5)]:lg:col-start-2` only fires at `lg`; on `md` (2-col) the 5th tile sits alone left-aligned. Add `md:[&>*:nth-child(5)]:col-span-2 md:[&>*:nth-child(5)]:max-w-[50%] md:[&>*:nth-child(5)]:mx-auto` or simpler: drop the count to 4 at `md`.
10. Contact page: form column uses `md:grid-cols-[5fr_7fr]` — at exactly `md` (768) the left aside is ~280px and the phone number can wrap. Promote the split to `lg:` and stack on `md`.
11. Contact info card still references `shadow-contact` (Pass 14 removed `shadow-elevated` everywhere except QuoteCloser — this one slipped). Drop it.
12. Footer 3-column row at `lg` is `lg:flex-row lg:items-center lg:justify-between gap-6` — at exactly 1024 the phone+email cluster wraps under the nav. Tighten gap or push to `xl:`.
13. CrewMoment uses `md:grid-cols-[5fr_7fr]` with `aspect-[4/5] md:aspect-portrait` — at 768 the photo column is ~290px and the portrait crop chops the subject. Stack on `md`, split only at `lg`.
14. TestimonialStrip cards `min-h-[260px]` causes uneven whitespace when one quote is short — let height be content-driven on `sm`, only enforce min-h on `md+`.
15. MiniFaq phone fallback is right-aligned (`text-right`) while the eyebrow + heading are left-aligned. Inconsistent. Center-align it under a centered narrow column, or left-align to match.
16. QuoteCloserCard heading scales `text-[28px] sm:text-3xl md:text-4xl lg:text-[44px]` — on a 320px viewport "Send us your project details." breaks at "your" awkwardly. Add `text-balance` (already on, but `max-w-[18ch]` will fix the wrap).
17. Section padding on `Hero` proof band: `py-6 md:py-8` is correct, but on `lg` the StatTrio row ends up too thin against the 28-line headline above. Bump to `py-8 lg:py-10`.
18. Navigation: `desktopCta` and `mobileCta` text is `text-[10px]` — on `md` (where the desktop CTA first shows) this reads tiny next to the 11px phone link planned for `lg`. Promote desktopCta to `text-[11px]` and add `tracking-[0.18em]` to match the phone link.
19. Navigation hairline `bg-gradient-to-r from-transparent via-cedar/15 to-transparent` plus the bottom `border-cedar/12` creates two faint lines. Drop the top hairline at rest, keep only when scrolled.
20. SectionHeader `text-subhead text-foreground/60 italic font-serif mb-8` — italic serif subhead is used inconsistently (some pages pass `subheading`, others not). Audit each call and remove subheadings that just restate the heading (Services catalogue, About process, Work gallery already use it well; About story and Services contract have none — leave them).
21. Global: every page wraps `<div className="container mx-auto px-6">` then a second `<div className="max-w-* mx-auto">`. This is fine but `px-6` on a 320px viewport leaves 13px gutters. Switch container to `px-5 sm:px-6` site-wide.
22. SkipToContent target on the Services page is `section-catalogue` — correct. On Work it conditionally points to `section-featured` OR `section-gallery`. Good. On Index it targets `section-services`. Good. No change.

## Implementation plan

### A. Tokens (single-touch surgical changes)
- `src/lib/spacing.ts`:
  - Add `CONTAINER_PADDING.tight = "px-5 sm:px-6"` and `CONTAINER_PADDING.snug = "px-5 sm:px-6 md:px-8"` (we keep `default` for hero pages).
  - No other token shape changes.

### B. Navigation (`src/components/Navigation.tsx`)
- Remove the always-on top hairline `<span>`. Render it only when `isScrolled`.
- Promote `desktopCta` text to `text-[11px] tracking-[0.18em]`, padding to `px-4 py-2.5`.
- Reduce `gap-1 md:gap-2` to `gap-1.5 md:gap-2.5` so phone, CTA, MENU don't crowd at `lg` exactly.

### C. Hero (`src/components/Hero.tsx`)
- Hide the inline `or call …` link below `sm` (mobile already has Quote pill + nav phone in menu): add `hidden sm:inline-flex`.
- Change wrapper to `flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-3` (remove `flex-wrap` since two items only).
- Bump `HeroProofBand` padding to `py-7 md:py-8 lg:py-10`.

### D. Homepage Services (`src/components/Services.tsx`)
- Drop tile `min-h-[300px] md:min-h-[340px]` → `min-h-[280px] lg:min-h-[320px]`.
- Replace orphan rule with `[&>*:nth-child(5)]:sm:col-span-2 [&>*:nth-child(5)]:sm:max-w-[calc(50%-1rem)] [&>*:nth-child(5)]:sm:mx-auto lg:[&>*:nth-child(5)]:col-span-1 lg:[&>*:nth-child(5)]:max-w-none lg:[&>*:nth-child(5)]:col-start-2 lg:[&>*:nth-child(5)]:mx-0` so the 5th tile is centered at `sm` (2-col), then col-2 at `lg` (3-col).
- Tile inner padding: `p-6` → `p-5 md:p-6` so headline doesn't crowd the icon on small tiles.

### E. CrewMoment (`src/components/CrewMoment.tsx`)
- Switch grid to `lg:grid-cols-[5fr_7fr]` (was `md:`). Stack on `md`.
- Image `aspect-[4/5] md:aspect-[3/4] lg:aspect-portrait` for tighter framing at each breakpoint.

### F. FeaturedProjects (`src/components/FeaturedProjects.tsx`)
- The 60/40 row uses `md:grid-cols-5` which is fine — but stack rows mb is `mb-8 md:mb-10`. Increase to `mb-10 md:mb-14` for breathing room.
- Card `mt-5` after the photo on lead/stack/row — unify to `mt-6` so meta line sits clearly off the photo edge.

### G. TestimonialStrip
- `min-h-[260px]` → `md:min-h-[260px]` (no min-h on `sm`).
- Card padding `p-6 md:p-7 lg:p-8` → `p-6 lg:p-8` (drop the middle step).

### H. MiniFaq
- Phone fallback row → left-align (`text-left`) and add a hairline above (`mt-8 pt-6 border-t border-cedar/12`).

### I. QuoteCloserCard
- Add `max-w-[20ch] md:max-w-[28ch] lg:max-w-[34ch]` to the heading so the `text-balance` actually has something to balance against on small viewports. (Heading currently lets one orphan word fall to a third line on 320px.)
- Trust strip `gap-x-4` → `gap-x-5 gap-y-2.5` for cleaner wrap on `sm`.

### J. Footer
- Push 3-column flex from `lg:` to `xl:` so 1024 stacks.
- Reduce gap from `gap-6` to `gap-5` and add `lg:gap-8` so 1280 still has air.
- Phone+email cluster: change `sm:flex-row sm:items-center gap-2 sm:gap-5` → `sm:flex-row sm:items-center sm:gap-6`.

### K. About page
- Process cards: `pl-6 py-5 gap-5` → `pl-4 sm:pl-6 py-4 sm:py-5 gap-4 sm:gap-5` for mobile breathing.
- City chips grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` → `grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`. Smaller chips, tighter gaps.
- Stat row: `gap-4 sm:gap-6` → `gap-6 md:gap-10` (stats want air, not chip-density).

### L. Services page
- Replace catalogue item row border `border-border/40` with `border-cedar/12` to harmonize with the group header rule.
- Eyebrow row in matrix cards: at `md` (where the matrix is still single-col), shrink to `text-[10px]` and let the count chip drop to second line cleanly via `flex-wrap`.
- Remove the 5-words tagline `Fifteen services. One crew. All built to outlast Alberta winters.` — already implied by sectionLabel + headline. Pure subtractive.

### M. Work page
- Remove the `Sister studios · B&P Saunas · Hickory & Rose` line under the hero CTA. Sister-studio info belongs in /about or footer.
- Placeholder grid: drop `lg:col-start-2` rule, instead change grid to `sm:grid-cols-2 lg:grid-cols-3` and append a 6th invisible spacer ONLY at `lg` via `lg:[&>*:last-child]:hidden` if 5 items — cleaner than nth-child math. (Already 5 items, so visually balanced.) Actually simplest: switch placeholder row to a 2x3 grid at `lg` by reducing to 4 visible categories OR center the orphan with `lg:[&>*:nth-child(4)]:col-start-1 lg:[&>*:nth-child(5)]:col-start-2`. We'll keep current orphan-fix but ALSO add `md:[&>*:nth-child(5)]:hidden lg:[&>*:nth-child(5)]:block` so the tile is hidden at exactly the awkward 2-col `md` breakpoint.

### N. Contact page
- Promote the 5/7 split from `md:` to `lg:` (`grid lg:grid-cols-[5fr_7fr]`); on `md` it stacks.
- Remove `shadow-contact` from the info card (token cleanup carry-over).
- Headline `text-[32px] sm:text-4xl md:text-5xl lg:text-[56px]` — drop the `md` step: `text-[32px] sm:text-4xl lg:text-[56px]` (avoid intermediate jump).
- Reduce headline strip `mb-12 md:mb-16` to `mb-10 md:mb-14` so form sits closer to the ask.

### O. SectionHeader sweep
- No code change. Just confirm: every call with `subheading=` either adds value or is removed in the page edits above. Already trimmed: Services hero, Services catalogue. Leaving Process / FAQ / Featured wherever the subhead earns its line.

### P. Container padding sweep
- Replace `px-6` with `px-5 sm:px-6` in every page-level `<div className="container mx-auto …">`. Files: Index sections (Hero/Services/CrewMoment/FeaturedProjects/TestimonialStrip/MiniFaq/QuoteCloser), About (3 sections), Services (2 sections), Work (2 sections), Contact (1 section), Footer (1).

## Files touched
`src/lib/spacing.ts`, `src/components/Navigation.tsx`, `Hero.tsx`, `Services.tsx`, `CrewMoment.tsx`, `FeaturedProjects.tsx`, `TestimonialStrip.tsx`, `MiniFaq.tsx`, `QuoteCloserCard.tsx`, `Footer.tsx`, `src/pages/About.tsx`, `Services.tsx`, `Work.tsx`, `Contact.tsx`.

No new files. No deletions. No schema or data changes. Pure presentational tightening, viewport-aware, FlexServices-grade.
