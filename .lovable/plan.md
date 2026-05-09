# Pass 29 — Services catalogue uplift, About process polish, Contact/NavMinimal harmony, atom radius sweep

Pass 28 fixed the QuickNav route bug, lifted the homepage Service tiles, and finished the section-seam hairline harmony on Hero/Crew/MiniFaq. Walking the **sub-pages** in parallel (Services, About, Work, Contact) at 390 / 768 / 1366 surfaces the remaining "stock" beats: most of the radius and hairline language was tightened on the homepage but the deeper pages still ship the older `rounded-sm` + flat `cedar/12` borders. Pass 29 brings the sub-page surfaces up to the homepage's editorial standard, then sweeps the remaining atoms.

## A. `/services` catalogue (`src/pages/Services.tsx`) — the commercial page deserves the most polish

The "Everything we build" section renders 5 groups × ~3 items as flat rows. It works, but the visual language is one generation behind the homepage tiles.

1. **Group heading divider** (line 83) — flat `border-b` with inline `borderBottomColor`. Replace with fading `borderImage`:
   ```
   borderImage: linear-gradient(90deg, hsl(var(--cedar) / ${opacity}) 0%, hsl(var(--cedar) / ${opacity * 0.4}) 100%) 1
   ```
   Asymmetric fade (left-strong → right-weak) reads as "the heading anchors the row" rather than a flat underline. Group heading itself: add `tabular-nums` index prefix `01·` `02·` etc. in cedar/40, matching the FeaturedProjects index treatment.
2. **Service item button** (line 100) — `rounded-sm` → `rounded-[4px]`. Border-b `border-cedar/12` flat → fading `borderImage` at 0.18 opacity (subtler since they stack densely).
3. **Hover affordance** — currently `hover:bg-cedar/[0.03]` + `group-hover:text-cedar` on title. Add a quiet trailing `→` arrow that fades in: `<span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-cedar/60">→</span>`. Editorial restraint — the arrow is the verb.
4. **Spacer row hairline** (line 114) — `border-b border-cedar/12` flat → matching fading borderImage so all hairlines speak the same dialect.
5. **Number prefix per item** — wrap title with a tabular `02·` style index using cedar/35 to give the 15-item catalogue a numbered editorial spine. Optional but elegant — gate behind a comment for easy revert.
6. **Mobile body padding** — `py-4 md:py-5` is good; add `px-4 sm:px-5` (currently `px-3 -mx-3`) so the hover bg and rounded corners breathe a touch on touch.

## B. `/services` responsibility matrix — sub-row radius sweep

7. **Item rows** (lines 156, 181) — `rounded-sm` → `rounded-[4px]` (inside `rounded-[6px]` parent cards, maintain the 6 → 4 hierarchy from Pass 27).
8. **"WE HANDLE / YOU HANDLE" headers** — `text-minimal text-cedar` is good. Add a `BronzeRule width="short"` to the right of the `XX ITEMS` count for visual symmetry with the eyebrow language used elsewhere.

## C. `/about` process steps + cities chip-grid + stat divider

9. **Process step cards** (line 105) — `rounded-sm` → `rounded-[6px]`, add `transition-shadow` and `hover:shadow-[0_1px_2px_hsl(var(--cedar)/0.08)]` for the same lift treatment used on homepage Service tiles. Consistency between sister "stepped list" surfaces.
10. **Step numeral** (line 108) — `font-serif text-base text-cedar/45 tabular-nums` is cramped against the `text-lg` heading. Promote to `text-lg` and to `text-cedar/55` for a slightly stronger anchor — still quiet, but no longer apologetic.
11. **Stat trio top border** (line 69) — `border-t border-cedar/15` (flat) → fading borderImage matching the CrewMoment + MiniFaq pattern shipped in Pass 28. **Removes the last flat hairline on About.**
12. **City chips** (line 132) — `border rounded-sm` → `rounded-[4px]`, and the inline style overrides `borderColor` per chip via bronzeStep — that creates a visually noisy gradient grid. Quiet it down: cap opacity at 0.22 (currently 0.32 max), and add `hover:shadow-[0_1px_2px_hsl(var(--cedar)/0.08)]` on the chip for tactile lift instead of color jump.
13. **Cities trailing italic note** (line 142) — already fading borderImage. Good. Bump `tracking` on label-style content nowhere needed.

## D. `/work` project header refinement

14. **Per-project metadata row** (line 88) — `text-[10px] tracking-[0.2em] uppercase text-cedar/80` works but the whole header sits flat on the page. Add a `BronzeRule width="short" variant="accent"` before the metadata to anchor each project header into the editorial system, matching FeaturedProjects' index-rule pattern.
15. **Project header layout** — `md:flex-row md:items-baseline md:justify-between` puts metadata far right of an `text-3xl md:text-4xl` headline. Add `md:gap-8` (was `md:gap-6`) so they don't crowd at md.

## E. `/contact` micro-tightening

16. **Direct-line label tracking** (lines 86, 110, 131) — `tracking-[0.2em]` → `tracking-[0.22em]` to match the canonical eyebrow tracking used in Footer + BronzeRule.
17. **Centered "FREE QUOTE" eyebrow** (line 49) — single BronzeRule looks tiny floating alone above a 64px headline. Wrap with **two mirrored rules** (left and right of the label) for centered editorial symmetry:
    ```
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-10 bg-cedar/30" />
      <span className={EYEBROW.accent}>FREE QUOTE</span>
      <span className="h-px w-10 bg-cedar/30" />
    </div>
    ```
   Replaces the asymmetric one-sided rule that currently floats off-center visually.
18. **Direct contact card border-left** (line 75) — currently `2px solid` cedar via inline style. Promote to `3px` to match the `border-l-[3px]` standard set in Pass 27 for QuoteFormInline + MidPageQuotePrompt — these are sister "card-with-cedar-bar" surfaces and should match.

## F. `NavigationMinimal` (`src/components/navigation/NavigationMinimal.tsx`) — Contact page chrome

19. **Header bottom border** (line 23) — `border-b border-cedar/25` flat → fading borderImage at 0.22, matching the QuickNav shell border applied in Pass 28.
20. **Phone capsule radius** (line 38) — `rounded-sm` → `rounded-[6px]` matching the standardized Pass 27 card radius. Mobile touch target unchanged.
21. **Sub-eyebrow tracking** (line 49) — `tracking-[0.2em]` → `tracking-[0.22em]`. Same canon as Item 16.

## G. Atom radius sweep — finish the system

22. **StatTrio card variant** (`src/components/ui/stat-trio.tsx` line 72) — `rounded-sm` → `rounded-[6px]`. Used on About card layout. Brings the atom in line with FeaturedProjects/Services tiles.
23. **TrustChips badge variant** (`src/components/ui/trust-chip.tsx` line 42) — `rounded-sm` → `rounded-[4px]`. Used inside cards (forms, page-hero) where the parent is `rounded-[6px]`, maintains 6→4 hierarchy.
24. **MenuTrigger** (`src/components/navigation/MenuTrigger.tsx` line 47) — `rounded-sm` → `rounded-[6px]`. Last user-facing chrome atom on the old radius.

## H. Verification & QA

25. After edits, viewport screenshots at **390 / 768 / 1366** of:
    - `/services` (catalogue group + responsibility matrix)
    - `/about` (process steps + city chips + stat trio top hairline)
    - `/contact` (centered eyebrow, NavigationMinimal seam)
    - `/work` (project header rule)
26. **`rg "rounded-sm" src/{pages,components} | rg -v admin | rg -v StyleGuide`** — confirm only intentional `rounded-sm` instances remain (currently zero non-admin/non-styleguide hits will be the goal after this pass).

## Files to touch

- `src/pages/Services.tsx` (catalogue uplift, responsibility radius sweep)
- `src/pages/About.tsx` (process steps, stat hairline, city chips)
- `src/pages/Work.tsx` (project header BronzeRule)
- `src/pages/Contact.tsx` (eyebrow symmetry, label tracking, border-l promotion)
- `src/components/navigation/NavigationMinimal.tsx` (fading hairline, capsule radius, label tracking)
- `src/components/ui/stat-trio.tsx` (atom radius)
- `src/components/ui/trust-chip.tsx` (atom radius)
- `src/components/navigation/MenuTrigger.tsx` (atom radius)

No schema, no business logic, no copy changes (other than potentially numbered prefixes in catalogue which are presentational), light-mode only, tokens-first, no behavior change. Pure editorial polish.
