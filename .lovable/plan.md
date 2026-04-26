## Audit findings (what's actually broken right now)

I walked every page at three breakpoints and inspected the underlying source. The "very complicated" feeling the user is reacting to is real — and it traces to ~10 specific defects in the hero/nav system that compound visually. They are NOT random; they share two roots: **(a) the headline column overlaps the photographic triptych because the scrim doesn't span far enough, and (b) the breadcrumb is being rendered twice (once in chrome, once in hero).** Fixing those two roots removes ~70% of the chaos.

### A. Hero / page-hero.tsx defects (highest-impact, user sees these first)

1. **Duplicate breadcrumb on every sub-page.** `HeaderBreadcrumb` renders "Home / Services" in the chrome, and `EvergreenTypographic` *also* renders `<BreadcrumbTrail items={breadcrumb}>` inside the hero ("HOME · ABOUT" floating above the headline on /about and /contact). `EditorialSplit` (Home) renders its own breadcrumb too, but it's mis-cast — "Calgary · Edmonton · Alberta" is a tagline, not a breadcrumb, yet it renders inside the breadcrumb chip on the hero.
2. **Headline overlaps photo on /services and /about** (1366+ and 1536+). The headline column is `max-w-3xl`/`max-w-2xl` but the SCRIM.left gradient fades to transparent at 92% from the LEFT edge of the *section*, not from the END of the headline column. Because the headline starts inside the container (px-6) and runs to ~840px, it visually punches into the middle column of the triptych where the scrim is already at 22% opacity. Result: white serif headline collides with a white shed/cedar plank photo → unreadable.
3. **Home (/) shows a giant dark left half** because `EditorialSplit` uses `rhythm="asymmetric"` (40/30/30) AND `scrim="left"` AND a left-anchored headline column AND a floating provenance card on the right that further darkens. The 40% column gets ~82% black scrim baked over it, killing the photograph it's supposed to show.
4. **/work hero subtitle is illegible.** "Selected projects across Calgary, Edmonton..." renders as `text-evergreen-foreground/85` over a brown cedar wall photo with `SCRIM.bottom` (only kicks in at 38% from top). The subtitle sits ABOVE that scrim's effective range → dark-on-dark.
5. **Mobile (375px) text-photo collision.** `HeroTriptych` mobile branch stacks 3 slabs (40/30/30 vh) but the headline is positioned over slab A with `SCRIM.bottom` only — and slab A's photo is still bright at the top where "Calgary · Edmonton · Alberta" + "EXTERIOR CONSTRUCTION" eyebrow render. Both lines collide with the deck planks photo.
6. **/services and /work pad the eyebrow into the scrim's bright zone.** `pt-32` + `pb-20/24` + `flex items-end` push the BronzeRule eyebrow into the middle of the photograph where there's no scrim coverage.

### B. Navigation / wayfinding defects

7. **/contact has no section rail at all** — only one anchor in `page-sections.ts`. The header looks broken/empty between the brand and the CTA cluster — this is the source of the "feels half-built" sense on Contact.
8. **/services and /work (n=2) sub-bar is hidden < lg.** Tablets (768–1023px) show nothing — `SectionRail` returns the n=2 sub-bar wrapped in `hidden lg:flex`. So on iPad the user has no in-page nav at all on Services or Work.
9. **Eyebrow label "ON THIS PAGE →" reads like instruction copy, not navigation.** It also competes with "HOME / SERVICES" breadcrumb sitting right next to it. Two label rails next to each other = visual stutter (visible on the /services screenshot).
10. **"Areas" rail item on /about** is a single 5-letter word — feels orphaned next to "Story" and "Process". This is a copy issue, not a logic issue, but it's part of the "feels off" complaint.
11. **GlobalMenu has no "you are here" indication when opened from a sub-page** beyond a small `· current` badge — easy to miss.

### C. Mobile chrome defects

12. **Mobile "Quote" pill** is `text-[10px]` and lives between the phone icon and hamburger — at 375px the three controls + brand wordmark crowd the 16px-padded header. Brand wordmark wraps awkwardly behind the phone icon at 360px.

---

## Plan — Nav v3.1 + Hero Legibility Pass

Eight ordered, atomic edits. No new primitives required (HeroTriptych and HeaderBreadcrumb already exist — we just stop double-rendering and we tighten the scrims).

### 1. Kill duplicate breadcrumbs in hero variants
- In `src/components/ui/page-hero.tsx`, remove `<BreadcrumbTrail items={props.breadcrumb} onDark .../>` from `EvergreenTypographic` (line ~207) and `EditorialSplit` (line ~313). Keep the `breadcrumb` prop in the type for back-compat (used elsewhere) but stop rendering it.
- `HeaderBreadcrumb` becomes the single source of truth for sub-page wayfinding. `CinematicBleed` and `ServicePortrait` already omit it correctly — we're just bringing the other two variants in line.

### 2. Tighten SCRIM.left so the headline always lives in dark coverage
- In `src/lib/colors.ts`, change `SCRIM.left` to fade transparent at ~58% rather than 92%, AND add a new `SCRIM.leftWide` for the asymmetric Home variant that holds 70% black through the 50% mark:
  - `left`: `linear-gradient(90deg, hsl(150 30% 6% / 0.85) 0%, hsl(150 30% 6% / 0.72) 32%, hsl(150 30% 6% / 0.42) 50%, hsl(150 30% 6% / 0.15) 62%, transparent 78%)` — guarantees the `max-w-3xl` headline column (~768px) sits in ≥42% black on a 1440 viewport.
  - `leftWide`: `linear-gradient(90deg, hsl(150 30% 6% / 0.88) 0%, hsl(150 30% 6% / 0.78) 42%, hsl(150 30% 6% / 0.55) 56%, hsl(150 30% 6% / 0.18) 70%, transparent 86%)` — for `EditorialSplit` (Home), preserves photo legibility on the right column.
- In `HeroTriptych.tsx`, accept a new `"leftWide"` value in `ScrimDirection` and route it.

### 3. Fix /work hero subtitle contrast
- In `CinematicBleed`, raise the existing top scrim from `h-32` `0.55→0` to a calibrated **two-stop scrim** that covers the eyebrow + headline + subtitle band (top 0–55%): `linear-gradient(180deg, hsl(20 10% 6% / 0.72) 0%, hsl(20 10% 6% / 0.45) 28%, hsl(20 10% 6% / 0.20) 55%, transparent 75%)`.
- Switch `CinematicBleed` from `flex items-end` + `pb-16` to `flex items-end pb-20` and add an explicit `bg-gradient` band behind the headline block (`max-w-3xl`) so the subtitle/byline never falls outside the scrim.

### 4. Fix mobile (≤md) text-on-photo collision
- In `HeroTriptych.tsx` mobile branch, add a dedicated mobile scrim that covers slab A from top to ~70%: `linear-gradient(180deg, hsl(150 30% 6% / 0.78) 0%, hsl(150 30% 6% / 0.55) 35%, hsl(150 30% 6% / 0.20) 65%, transparent 85%)`.
- In `EvergreenTypographic` and `EditorialSplit`, reduce mobile `min-h-[72vh]` to `min-h-[68vh]` and compress headline `mt-6` to `mt-5` so the headline column fits inside slab A on iPhone XS (812px tall) without the subtitle pushing into slab B.
- On `< sm` (only column A renders), change `aspect` so the photo crops to 4:5 portrait — currently it stretches.

### 5. Add a section rail to /contact AND fix the n=2 tablet gap
- In `src/lib/page-sections.ts`, expand `/contact` to two anchors so the chrome rail appears: `[{ name: "Reach Us", anchor: "section-contact" }, { name: "FAQ", anchor: "section-contact-faq" }]`. Add a small `<section id="section-contact-faq">` to `Contact.tsx` (the "What to expect" / response-time block we already have can be retitled as the second anchor — no new content required).
- In `src/components/navigation/SectionRail.tsx`, change the n=2 branch from `hidden lg:flex` to `hidden md:flex` so iPads get a real wayfinding rail on /services and /work. The compact rail (already n≥3 only) does not collide because n=2 is the only branch we're widening.

### 6. Drop the redundant "ON THIS PAGE →" eyebrow when HeaderBreadcrumb is already showing
- In `SectionRail` n=2 branch, hide the "On this page" eyebrow + cedar dash when `pathname` is in `ROUTE_BREADCRUMB` (i.e., HeaderBreadcrumb is already labeling context). Keep the divider/labels themselves; just drop the redundant eyebrow text. Removes the visual stutter on /services and /work.

### 7. Rename "Areas" → "Service Areas" on /about
- One-line copy edit in `page-sections.ts`. Three two-word labels (Story / Process / Service Areas) read as a balanced editorial set.

### 8. Mobile chrome density fix
- In `Navigation.tsx` mobile branch, hide the "Quote" pill when viewport < 360px (only phone icon + hamburger remain; both lead to conversion). On 375–767px, increase the Quote pill min-width to 64px and add `mx-1` so the cluster has consistent rhythm.
- Make the brand eyebrow ("Exterior Construction · est. 2019") `hidden sm:block` to prevent the wordmark wrap on 360px Android devices (already partially done in `BrandMark` — verify and tighten).

### 9. GlobalMenu — explicit "current page" treatment
- In `GlobalMenu.tsx` primary route stack, the active route gets a left cedar bar (4px wide, full height of the row) + the route label switches to italic serif. The `· current` badge becomes redundant and is removed. Stronger cue, less micro-copy.

---

## Acceptance criteria (visual QA after implementation)

I will reload `/`, `/services`, `/work`, `/about`, `/contact` at **375px, 768px, 1366px, and 1536px** and confirm:
- No headline ever overlaps a bright photo region (SCRIM coverage holds ≥45% black under the entire headline column at every breakpoint).
- No page renders two breadcrumbs (one in chrome, one in hero).
- Every sub-page shows a usable section rail at md and up.
- /work subtitle "Selected projects across..." passes WCAG AA against the photo behind it.
- Mobile header at 375px fits brand + phone icon + Quote + hamburger without wrapping or overlap.
- GlobalMenu "current page" is unmistakable from across the room.

## Files that will change (no new files)
- `src/lib/colors.ts` — SCRIM.left tightened, SCRIM.leftWide added
- `src/components/ui/page-hero.tsx` — drop duplicate breadcrumbs in 2 variants, route leftWide on Home, raise top scrim on CinematicBleed
- `src/components/media/HeroTriptych.tsx` — accept "leftWide", add mobile scrim, fix < sm crop ratio
- `src/components/navigation/SectionRail.tsx` — n=2 visible at md+, drop redundant eyebrow when HeaderBreadcrumb owns context
- `src/components/navigation/GlobalMenu.tsx` — current-route cedar bar + italic
- `src/components/Navigation.tsx` + `src/components/navigation/BrandMark.tsx` — mobile chrome density
- `src/lib/page-sections.ts` — /contact gains a 2nd anchor, /about "Areas" → "Service Areas"
- `src/pages/Contact.tsx` — add the second `section-` id wrapper around existing content (no new content)

## Memory updates
- Update `mem://features/navigation-architecture.md` — n=2 rail is now md+ (not lg+); HeaderBreadcrumb is the single source of truth for sub-page wayfinding (page-hero variants no longer render their own breadcrumb).
- Update `mem://design/aesthetic-direction.md` Gate Policy — add "Hero scrim must hold ≥45% opacity under the full headline column at every breakpoint."

This plan addresses every visible defect from the audit without introducing new primitives or breaking the existing v3 contract.