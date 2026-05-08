# Pass 18 — Mobile Hero Composition & Overflow Audit

Walked the live preview at 390×844. Pass 17 fixed the section seams; Pass 18 fixes what the eye actually lands on first: the mobile hero is bottom-anchored with ~200px of dead black space above the eyebrow, the architect photograph bleeds 1–2px past the right edge, and the provenance caption ("SHEDS · A CALGARY DRIVEWAY") renders as an orphan line *below* the hero scrim instead of as part of the composition. Plus the small page-level items deferred from Pass 17.

Scope: presentational only. No schema, no data, no business logic.

## A. Hero composition (architect-bleed, mobile-first)

1. **Vertical dead space.** At 390×844 the hero reserves `min-h-[88vh]` (~743px) but the text block sits flush to the bottom — the eyebrow is at ~y=175, leaving ~140px of pure black above it under the nav. Reduce reserved height on mobile to `min-h-[78vh] md:min-h-[88vh] lg:min-h-screen` and shift the text block up: change the inner flex container from `justify-between` (which pins content to top + bottom) to `justify-end` with `pt-24` so the photo dominates the upper two-thirds and copy occupies the bottom third intentionally. (At md+ the original `min-h-screen` editorial composition stays.)
2. **Eyebrow rule indent.** The hairline rule before "EXTERIOR CONSTRUCTION" sits at the container left edge (`px-5`). On mobile the rule visually disconnects from the text. Add `ml-0` and shorten the rule to `w-8` (currently `w-10`) so it reads as a tighter editorial mark.
3. **Headline line-height.** "Excellence / in / the Work." breaks across three lines on mobile due to small viewport + large clamp. Tighten `line-height` on the kinetic headline at the smallest breakpoint to `leading-[0.95]` (currently inherits `1.05`-ish from the variant). Allow the three lines to feel like one tight stack rather than three independent lines.
4. **Subtitle width.** "Decks, fencing, sheds, painting and siding — built to last across Alberta." wraps "Alberta." onto its own line. Add `max-w-[28ch]` so it breaks earlier and avoids the orphan word.
5. **Phone CTA "or call …" row** — currently `hidden sm:inline-flex`, so on mobile only the QUOTE button is shown (correct). But at sm (640px) it appears on the same row as QUOTE, where the clamp layout has the button at full-width-ish. Verify it doesn't wrap awkwardly; if it does, switch to `hidden md:inline-flex`.

## B. Provenance caption ("SHEDS · A CALGARY DRIVEWAY")

6. **Caption orphan.** The caption currently renders after the hero `<section>` closes, sitting alone on the body background above the HeroProofBand stat row. Move the caption *inside* the hero `<section>`, anchored bottom-right at `absolute bottom-4 right-5 md:bottom-6 md:right-8` over the photo with white/70 text and a `mix-blend-difference` hairline. This is the architect-bleed standard — the caption belongs to the photograph, not the page.
7. **Caption copy** — rename the eyebrow on the caption from `SHEDS · A CALGARY DRIVEWAY` to `Sheds · A Calgary driveway` (the eyebrow uppercase class will handle case if applied; the stored string should be sentence case for consistency with Pass 17 fix #29).

## C. Horizontal overflow audit (390px)

8. **Hero image overflow.** The architect-bleed `<img>` uses `absolute inset-0 w-full h-full object-cover` which is correct, but the parent `<section>` may inherit a body width including a scroll-bar reservation. Add `overflow-x-clip` to `<main>` on every page (Index, Services, Work, About, Contact) — the cheap, robust fix that prevents any single child from creating a horizontal scrollbar regardless of cause.
9. **Container `px-5 sm:px-6 md:px-10` consistency.** Spot-check that no section uses raw `container` without our padding token. Running `grep` and patching any orphans (most likely candidates: `QuickNav`, `MidPageQuotePrompt`, admin shells — read-only audit, only patch public pages).

## D. Featured projects mobile polish

10. **Asymmetric layout collapse.** At <768px, the asymmetric `lead + 2 stacked + 3 row` structure collapses to a single column — but the `mb-10 md:mb-14` between the two rows is inherited at mobile, leaving a gap between project 3 and project 4 that's noticeably bigger than the gap between project 1 and project 2 (which uses the inner `gap-6`). Make the row gap mobile-uniform: `mb-0 md:mb-14` on row 1 and rely on the row 2 grid's natural gap.
11. **Project tile metadata row.** "01" + "CALGARY · DECKS" + "2024" — at 390px the location string truncates with `truncate` but the cut-off position is non-deterministic across services. Switch to `truncate min-w-0` and reduce the year column to `tabular-nums whitespace-nowrap` so the year is always visible and the location string takes the available width.

## E. Closer card mobile

12. **Trust strip wrap.** "WCB COVERED · FULLY INSURED · 24-HOUR REPLY · NO OBLIGATION" wraps to two rows on mobile (visible in screenshot). Currently `gap-x-5 gap-y-2.5`. Make it `gap-x-4 gap-y-2 md:gap-x-5 md:gap-y-2.5` and reduce the per-chip icon size from `h-2.5 w-2.5` to `h-2 w-2` on mobile so the chips fit two on a line cleanly.
13. **Card border-left thickness.** `border-left: 3px solid hsl(var(--cedar))` on a 28px serif headline reads heavy at mobile. Reduce to `2px` on mobile, keep `3px` at md+. Apply via `style` swap inside an `if (window.innerWidth)` guard isn't ideal — instead use a `before:` pseudo-element sized via Tailwind: `before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] md:before:w-[3px] before:bg-cedar`.

## F. Cross-page micro-fixes

14. **/services hero subtitle height.** "Built outside. Built to last." renders correctly. Verify `service-portrait` variant doesn't reserve excess space beneath the headline before the catalogue (Pass 16 reduced top padding; verify bottom padding now too).
15. **/about story stat trio** — Pass 17 deferred the StatTrio refactor. Refactor the three custom stat blocks into `<StatTrio variant="inline" items={STATS_TRIO} />` for consistency with the rest of the site. (StatTrio.inline already renders `text-2xl md:text-[1.75rem]` — close enough to current.)
16. **/contact "—the form" eyebrow alignment.** The `THE FORM` SectionHeader on the right column doesn't align baseline-to-baseline with `DIRECT LINE` on the left at lg+. Add a fixed eyebrow wrapper height: `min-h-[1.5rem]` on both SectionHeader containers so the labels share a horizontal line.

## G. Smart-quote sweep (delivered now)

17. **Sweep `'` → `’`** in `src/data/projects.ts`, `src/config/testimonials.ts`, `src/config/faqs.ts`, `src/config/services.ts`, `src/config/process.ts`, `src/config/trust-signals.ts`, plus `src/pages/About.tsx`, `src/pages/Services.tsx` body strings. Pass 17 verified configs are clean; this pass extends to inline copy in pages and any component with hand-typed prose (Hero, CrewMoment, MiniFaq).

## Files touched

`src/components/ui/page-hero.tsx` (architect-bleed mobile geometry, provenance card placement), `src/components/Hero.tsx` (subtitle max-w, eyebrow rule), `src/components/FeaturedProjects.tsx` (asymmetric row gap, tile meta row), `src/components/QuoteCloserCard.tsx` (trust chip gap, border-left pseudo), `src/pages/Index.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/About.tsx` (StatTrio refactor), `src/pages/Contact.tsx` (eyebrow alignment), curly-quote sweep across copy.

No new files. No deletions. No schema. No business logic.
