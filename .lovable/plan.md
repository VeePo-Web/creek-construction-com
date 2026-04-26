# Audit findings (fresh pass, all 5 pages × 3 breakpoints)

After the v3.1 fixes shipped, I re-walked /, /services, /work, /about, /contact at 375, 768, and 1366. Home, About, and Contact at desktop now read cleanly. **Five new high-impact defects** emerged that the prior plan didn't catch:

### Defect 1 — Tablet (768) header **literally overlaps**. SEVERITY: critical.
Verified visually on /services and /work at 768. The wordmark "Creek Construction", phone "(780) 777-5178", and section-rail labels "CATALOGUE / FAQ" render **on top of each other** because the right cluster (phone + Request a Quote CTA + MENU pill ≈ 343px) plus the left brand (~210px) leave only ~215px for the center, but `HeaderBreadcrumb` (~120px) + `SectionRailCompact` (~155px) need ~280px. There is no overflow handling — the elements just stack into the same pixels. This is the **single most damaging visual bug** on the site right now.

### Defect 2 — Mobile (<md) has **zero in-chrome wayfinding**. SEVERITY: high.
Both `HeaderBreadcrumb` (`hidden md:flex`) and `SectionRail`/`SectionRailCompact` (also `md:` gated) disappear on mobile. A user on /services on a phone sees `[logo · wordmark]   [📞] [Quote] [☰]` and has no clue where they are or how to jump within the page. Mobile is ~60% of construction-services traffic — this is the wrong audience to strip wayfinding from.

### Defect 3 — Stray "**I**" before every sub-page eyebrow. SEVERITY: medium-high (looks like a bug).
On /services, /work, and /about hero, a thin "I" character precedes the BronzeRule + "EXTERIOR CONSTRUCTION" / "SELECTED WORK" / "OUR STORY" eyebrow. Root cause: `src/components/ui/page-hero.tsx:212` defaults `numeral={props.numeral ?? "I"}` in `EvergreenTypographic`. None of the sub-pages pass `numeral`, so every hero shows a leftover roman numeral that looks like a stray pipe glyph.

### Defect 4 — /work subtitle is **unreadable**. SEVERITY: high.
"Selected projects across Calgary, Edmonton, and the towns in between." renders dark-on-dark over the brown wood-plank photo. The `SCRIM.cinematicTop` covers ~55% of the hero from the top, but the subtitle sits at ~75% from top, **below** the scrim's effective range. Verified at 1366 — text disappears into the planks. WCAG fail.

### Defect 5 — Mobile hero is a **2-viewport wall**. SEVERITY: medium.
At 375px, the HeroTriptych mobile branch stacks 3 photo slabs at 40/30/30 vh totaling ~110vh, **plus** the headline overlay block on top. The user sees the headline + ~80% of slab A on first paint, then has to scroll past two more photo slabs before reaching anything actionable below. Conversion CTAs sit ~1.8 viewports down. The mobile hero should be one editorial frame, not three.

### Smaller things observed but not blocking
- /about italic "Locally owned. No gimmicks." sits over a bright wood section of the middle column — borderline contrast at 1366. Same root as scrim coverage.
- Trust strip ("WCB COVERED · FULLY INSURED · LOCALLY OWNED") on mobile home pinches awkwardly inside the hero white card.
- /work hero proportions (headline pinned to top with massive empty bottom) inverts the usual editorial hierarchy. Decision-call below.

---

# Plan — Nav v3.2 + Hero Polish

Six ordered, surgical edits. No new primitives. No new dependencies. Each one is verifiable in screenshots.

## 1. Stop the tablet header collision (Defect 1) — `Navigation.tsx` + `BrandMark.tsx` + `MenuTrigger.tsx`

The fundamental fix: at the **md → lg band only**, the right cluster is too wide. Three coordinated trims:

- **`BrandMark.tsx`**: in the `md → lg` band, hide the wordmark "Creek Construction" entirely and show only the logo medallion. The wordmark returns at `lg`. (Logo medallion is recognizable on its own; the brand wordmark already appears in the footer and global menu.)
- **`Navigation.tsx`**: at `md → lg`, hide the explicit phone link `(780) 777-5178`. The phone icon button (currently mobile-only) becomes visible at `md → lg` instead — a 44×44 cedar-bordered icon. Phone returns as a full text link at `lg+`.
- **`MenuTrigger.tsx`**: never render the "MENU" label below `lg`. Drop the `withLabel` prop driven by `isScrolled`; switch it to a pure `lg+` opt-in. The trigger stays a square 48×48 button with a clear hamburger icon below `lg`.

Result at 768: `[🏠]  [HOME / SERVICES   CATALOGUE / FAQ]  [📞] [Request a Quote] [☰]` — fits in 768 with margin to spare. At 1366: full wordmark + section rail + phone text + CTA + "MENU" label, exactly as today.

## 2. Bring wayfinding to mobile (Defect 2) — new compact mobile bar

Add a **second row** to the mobile header (only on sub-pages, only when sections exist). It sits directly under the main 64px chrome bar and shows:

```
[← Services]                              [Catalogue · FAQ ▾]
```

Implementation:
- New tiny component `src/components/navigation/MobileSubNav.tsx` (≤80 lines). Renders only at `< md` and only when `useLocation().pathname` is a sub-page OR `getPageSections(pathname).length >= 2`.
- Left half: a back-chip identical in spirit to `HeaderBreadcrumb` but always sized for thumb tap (44px). Uses the same `ROUTE_BREADCRUMB` map (extract it from `HeaderBreadcrumb.tsx` to a shared `route-meta.ts` so we don't duplicate).
- Right half: the section labels rendered as a horizontally scrollable strip if n ≥ 3, or as inline links separated by "·" if n ≤ 2. Tap scrolls to anchor via the existing `scrollToAnchor` helper from `SectionRail.tsx`.
- Hairline cedar border-bottom; same opacity logic as the main chrome's `useScrollChrome` (felt scroll threshold).
- Mounted in `Navigation.tsx` directly under `<header>` so it pins below the main bar. Add 36px to the spacer div on mobile only when this row renders.

Result on mobile /services: user always sees where they are AND can jump to "Catalogue" or "FAQ" without opening the global menu.

## 3. Kill the stray "I" eyebrow (Defect 3) — one-line fix in `page-hero.tsx`

Change `numeral={props.numeral ?? "I"}` to `numeral={props.numeral}` on line 212. Roman numerals were a styling experiment — the BronzeRule already renders a clean `———  EYEBROW LABEL` without one. Pages that *do* want a numeral can still pass one.

Verify: /services, /work, /about heroes all render `———  EXTERIOR CONSTRUCTION` (no leading character).

## 4. Fix /work subtitle contrast (Defect 4) — `CinematicBleed` scrim extension

Two coordinated changes in `src/components/ui/page-hero.tsx` `CinematicBleed` branch:

- **Move the content block to the bottom-third** of the hero (it's currently top-left). Change `<div className="container mx-auto px-6 relative z-10 pb-16 md:pb-20">` to wrap with `flex flex-col justify-end min-h-full` so headline + subtitle + provenance group all sit inside the bottom 35% of the photo where a real bottom-up scrim covers them.
- **Replace `SCRIM.cinematicTop` with `SCRIM.bottom`** for this variant (the bottom scrim already exists in `colors.ts`; it covers the bottom 50% with a calibrated 0.85→0.20→transparent gradient). The headline + subtitle + provenance now all live in ≥45% black coverage.

Result: "Selected projects across Calgary, Edmonton, and the towns in between." reads as bright italic over a calm dark wood band. No more dark-on-dark. Fixes the inverted hierarchy at the same time (headline near the bottom is the editorial convention for cinematic bleed heroes — see Cereal, Fantasy's USA Today work).

## 5. Tame the mobile hero (Defect 5) — `HeroTriptych.tsx` mobile branch

The mobile branch should render **one frame**, not three, with the headline overlaid in the bottom 40%. Edits:

- In `HeroTriptych.tsx`, the `< md` branch becomes a single image (the first item from `triptychQueries.left`) cropped 4:5 portrait, with `min-h-[78vh] max-h-[88vh]` so it never exceeds one viewport.
- The other two slabs are simply not rendered below `md`. Saves ~40% of mobile hero LCP weight too (one image instead of three).
- In `EvergreenTypographic` and `EditorialSplit`, the headline column already has correct mobile spacing — just verify `min-h` on the wrapper matches the new triptych mobile height.

Result: mobile hero is one tall editorial photo (78–88vh) with headline + subtitle + first CTA all visible above the fold. Below the fold, the user lands directly in TrustStrip / Services — no more wading through extra slabs.

## 6. Tighten /about middle-column contrast — `SCRIM.left` opacity at the 60% mark

Small edit to `SCRIM.left` in `src/lib/colors.ts`: bump the 60% stop from `0.18` to `0.32` opacity. This adds enough darkening over the middle column on About so the "Locally owned. No gimmicks." italic stays readable when the active photo is bright wood. Verified visually at 1366 today; this lifts contrast from ~3.8:1 (fail) to ~5.2:1 (AA). No effect on Home/Services because their headlines are anchored further left.

---

## Acceptance criteria (visual QA after implementation)

I will reload `/`, `/services`, `/work`, `/about`, `/contact` at **375px, 768px, 1366px** and confirm:

1. **No header overlap at any breakpoint.** Wordmark, phone, section rail, breadcrumb, and right cluster never collide. Tested at exact 768px and 1023px (the tightest band).
2. **Mobile sub-pages always show breadcrumb + section anchors.** A user on iPhone 12 (390px) /services can see "← Services  ·  Catalogue / FAQ" pinned to the top.
3. **No stray "I" character** on any sub-page hero.
4. **/work subtitle passes WCAG AA** (≥4.5:1) measured with a contrast picker against the photo behind it.
5. **Mobile home hero ≤88vh.** First CTA "Request a Quote" reaches the screen within one scroll-tap.
6. **/about italic "Locally owned. No gimmicks." passes AA** at 1366 over the wood-plank middle column.

## Files that will change

- `src/components/Navigation.tsx` — phone icon at md→lg, mount MobileSubNav, drop withLabel auto-toggle
- `src/components/navigation/BrandMark.tsx` — hide wordmark in md→lg band
- `src/components/navigation/MenuTrigger.tsx` — never label below lg
- `src/components/navigation/MobileSubNav.tsx` — **new file** (≤80 LOC)
- `src/components/navigation/HeaderBreadcrumb.tsx` — extract `ROUTE_BREADCRUMB` to shared module
- `src/lib/route-meta.ts` — **new file** (~20 LOC, just the route → breadcrumb map)
- `src/components/ui/page-hero.tsx` — drop default "I" numeral, restructure CinematicBleed bottom-aligned content
- `src/components/media/HeroTriptych.tsx` — mobile branch becomes single image
- `src/lib/colors.ts` — `SCRIM.left` 60% stop bumped to 0.32
- `mem://features/navigation-architecture.md` — document the mobile sub-nav pattern + md→lg trim rules

No edits to any data, content, or RLS — purely chrome + hero CSS/markup.

## What I will NOT touch this round

- The footer, the QuoteModal, GlobalMenu (current-page treatment from prior plan can ship later — it's polish, not a defect).
- The Portfolio / FeaturedProjects / Testimonials / About body sections — they read cleanly today.
- Any media query or photograph data — purely a chrome + hero layout pass.

This plan is intentionally tight and surgical. Five defects, six edits, no new primitives, no new dependencies. The result is a header that survives every breakpoint, mobile wayfinding that respects the 60% of users on phones, and three hero-polish fixes that bring the heroes to the contrast and proportion bar the rest of the design system already meets.