# Pass 24 — Editorial Polish & Conversion Surface Tightening

Focus on the next layer of detail: the closer card (every page ends here), the crew/testimonial rhythm, hero CTAs, and the small nicks left in chrome and tiles. Light-mode only, tokens-first.

## A. QuoteCloserCard (the universal terminal CTA)

1. **Heading scale ladder** — current `text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] 2xl:text-5xl` skips `xl`. Replace with token: `text-3xl sm:text-4xl md:text-[40px] lg:text-5xl xl:text-[56px]` and cap headline measure to `max-w-[22ch]` across all bp.
2. **Trust strip** — gap is too tight at 320px (icons collide with labels when wrapped). Bump `gap-x-4` → `gap-x-5 md:gap-x-6` and `gap-y-2.5`. Add `min-h-[20px]` to each chip to align baselines.
3. **Card padding** — `p-6 sm:p-8 md:p-10 lg:p-12` is right, but the cedar accent bar `before:w-[2px]` should be `w-[3px]` on all bp (currently desktop-only thicker).
4. **Trust-strip divider** — `border-evergreen-foreground/10` is a solid line under a soft gradient surface; replace with a fading hairline using `borderImage` matching the footer pattern (cedar 0 → 0.22 → 0).

## B. CrewMoment

5. **Image aspect** — currently `aspect-[5/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-portrait` flips between landscape/portrait at 375 → 640 → 768 → 1024 (jarring on resize). Lock to `aspect-[4/5]` from sm up; mobile stays `aspect-[5/4]` so it doesn't dominate the fold.
6. **Heading id collision risk** — `headingId="crew-heading"` is shared with anchor; verify Home + About don't both render it. Add a `data-section="crew"` and a unique id per page (Home: `crew-heading`, About: `about-crew-heading`).
7. **Stats row inside CrewMoment** — when `showStats`, the 3-up grid uses `gap-4` which collapses on 320px. Use `gap-6 md:gap-8`, and right-align numerals to a `tabular-nums w-fit` block.

## C. TestimonialStrip

8. **Quote hanging indent** — `textIndent: "-0.32em"` is correct visually but wraps incorrectly on 2nd line. Switch to `text-indent: -0.4em; padding-left: 0.4em;` so subsequent lines align flush.
9. **Card min-height** — `lg:min-h-[260px]` only fires at lg; quotes of varying length jitter at md. Add `md:min-h-[240px]` and `sm:min-h-[200px]`.
10. **Attribution row** — wrap on small screens currently produces an orphan city/service. Force the meta line to a new row at `<sm` via `flex-col sm:flex-row sm:items-baseline sm:justify-between`.

## D. Hero (homepage)

11. **CTA + tel link gap** — `gap-x-6 gap-y-3` collapses awkwardly at 360px (CTA full-width, then "or call" hugs left). Add `sm:items-center`, and bump the tel link to `text-white/90` with `tracking-[0.2em]` (matches hero subtitle).
12. **HeroProofBand padding** — `py-7 md:py-8 lg:py-10` is asymmetric. Token to `py-8 md:py-10` and add a `divide-x divide-cedar/10` between the three stat cells on `sm+`.

## E. Service tiles (homepage)

13. **`min-h-[280px] lg:min-h-[320px]`** — competes with `aspect-hero` image. Drop the min-height; the tile naturally sizes from its image + content. This eliminates extra whitespace under tiles with short captions.
14. **`hover:scale-[1.04]`** on image is too aggressive — drop to `1.025` to match FeaturedProjects' lead.
15. **Icon line-height** — `mb-3` after icon, `mb-2` after h3 is uneven. Use `mb-3` consistently between icon → title and title → blurb.

## F. Services page — Responsibility matrix

16. **Cards at `lg:grid-cols-2`** — at `md` (768) they stack full-width which is correct, but the WE/YOU bronze gradient bars become invisible because card width is too wide for the bar to read. Move accent from `border-left` to a top-left chip: `WE` and `YOU` mini-pills above the heading.
17. **List item rows** — `py-2.5 pl-3` + `border-left:2px` = visually noisy at scale. Replace with a 3-col grid: `[icon] [task] [note]`, divider only between rows (`border-b border-cedar/8`), no per-row left bar.

## G. About — Process steps

18. **Card border + per-row left bar + hover pl-bump** — three competing affordances. Drop the outer `border` and keep only the bronze left bar; remove `hover:pl-` shift (replace with `hover:bg-cedar/[0.04]` only — quieter).
19. **Numeral typography** — `text-[13px] tabular-nums mt-1.5 mr-1` looks weak. Promote to `font-serif text-base text-cedar/45 mt-0.5 w-8 shrink-0`.

## H. Contact

20. **Form heading "It takes about 30 seconds."** — duplicates the closer copy used elsewhere. Change to "Tell us a few details." (the headline already says "Tell us what you're building"); subhead becomes "Just your phone and name to start."
21. **Aside icon chips** — `w-9 h-9` cedar-tinted squares look like buttons. Reduce to `w-8 h-8`, `bg-transparent`, with cedar icon at full color (treat as wayfinding glyph, not button).

## I. Mobile-only fixes

22. **MobileSubNav active chip** — when active it changes color but no underline; add a `before:` pseudo-element bottom hairline `bg-cedar h-px w-4` for spatial cue.
23. **Hero CTA cluster on `< sm`** — stack vertically with the tel link visible (currently `hidden sm:inline-flex` hides it on mobile, leaving the hero with one solitary CTA). Show "or call NUMBER" below the CTA on mobile too, smaller.

## J. Global polish

24. **Section anchor offset** — when jumping to `#section-*`, the fixed chrome (h-16/h-[4.5rem]/h-20 + MobileSubNav 40px) overlaps the heading. Add `scroll-mt-20 md:scroll-mt-24 lg:scroll-mt-28` to all `id="section-*"` sections via a single utility class on `<main>` using `[&_section[id^="section-"]]:scroll-mt-*`.
25. **Page-level `<main>` background** — Index uses bare `min-h-screen overflow-x-clip` without `bg-background`; if Hero ever fails to render, the page shows browser default. Add `bg-background` everywhere for safety.
26. **Curly-quotes audit** — sweep all `.tsx` for straight `'` and `"` inside JSX text and replace with curly equivalents (the memory rule).

## K. Light QA loop

27. After edits, screenshot Home / Services / Work / About / Contact at 375 / 768 / 1366. Verify: closer card looks identical structure across pages, stat row alignment, hero CTA cluster on mobile, no horizontal scroll, anchor jumps land below chrome.

## Files to touch

`QuoteCloserCard.tsx`, `CrewMoment.tsx`, `TestimonialStrip.tsx`, `Hero.tsx`, `Services.tsx` (homepage component), `pages/Services.tsx`, `pages/About.tsx`, `pages/Contact.tsx`, `pages/Index.tsx`, `pages/Work.tsx`, `MobileSubNav.tsx`, `Footer.tsx` (consistency check), and a tailwind utility helper if needed for the section-anchor scroll-margin.

No schema, no business logic, no component deletions. All color via tokens, all spacing via `src/lib/spacing.ts` where a token exists.
