# Pass 52 — Fantasy.co simplification: zero clutter, one section per viewport

A two-axis cleanup. Axis 1 strips every chip, eyebrow-with-location, metadata caption, redundant rail, and dead nav link. Axis 2 reshapes every section to fit a single viewport on mobile, tablet, and desktop using a shared `min-h-[100svh]` discipline so the experience reads as a deck of full-screen plates.

---

## Axis 1 — Clutter inventory & removal

Every item below has been confirmed by code search. Each row is removed in this pass.

### A. Auto-derived "service · location" caption rail (the user's example)

The homepage hero is the `architect-bleed` PageHero variant. It does NOT receive a `caption` prop, but it derives one anyway from `item.service` + parsed `item.alt` and renders a bottom caption rail (`page-hero.tsx` 776–785, 993–1015). When MediaSlot returns a "sheds in Edmonton" photo, "**Sheds · Edmonton**" appears at the bottom-right of the hero. **Remove entirely.**

- Delete the `caption` prop from `ArchitectBleedProps`, the `useMemo captionLine`, and the bottom-right rail JSX (lines ~993–1016).
- Sweep the same `caption` mechanism out of `EvergreenTypographic` (lines ~446–450, 563–571) — the only other variant that exposes it. No live page passes `caption=`, so this is dead surface area inviting accidental re-introduction.

### B. Triptych column captions ("Decks · Calgary", "Sheds · Edmonton", "Cedar · detail", "Across Alberta", "On the boards", "Fences · Alberta")

`HeroTriptych` accepts `fallbackCaptions` and renders them in `EditorialFallback` when an image is missing (`MediaSlot.tsx` 122–131). Today every PageHero variant passes a 3-tuple of these. They show only when an image fails to load — but that fallback state has been visible during dev/cold-cache more than once. Remove the captions from the fallback so a missing image is just warm stone with the cedar hairline; no text. Keep the icon and plate.

- `EditorialFallback`: drop the `caption` prop and its JSX. Keep `variant`, `icon`.
- `TriptychColumn`: drop `caption` from the props and the call to `EditorialFallback`.
- `HeroTriptych`: drop `fallbackCaptions` from `HeroTriptychProps` and its 3 child calls.
- All 4 PageHero variants: drop the `fallbackCaptions={[…]}` arg.

### C. PageHero "sectionLabel" eyebrow chips on Hero variants

The home hero shows `CALGARY · EDMONTON · ALBERTA` as a top-left eyebrow above the headline (architect-bleed line 891). On `/about` it's "OUR STORY", on `/services` "EXTERIOR CONSTRUCTION". These are redundant labels — the H1 already says it. Fantasy.co ships pure headline + supporting line, no eyebrow chip.

- `Hero.tsx`: remove `sectionLabel` and `breadcrumb` props (the breadcrumb prop is also unused inside architect-bleed but kept for API consistency — drop it from the call).
- `architect-bleed` variant: remove the top hairline+sectionLabel block (lines 873–894). The hero becomes: photograph → headline → subtitle → CTA. Nothing else.
- Same treatment on `/about` and `/services` PageHero — the H1 carries the page; no eyebrow needed above it. Delete the `BronzeRule + sectionLabel` row inside `EvergreenTypographic` and `ServicePortrait`.

### D. Header section rail (STORY · PROCESS · SERVICE AREAS, CATALOGUE · CONTRACT · FAQ, etc.)

The fixed header renders a per-route SectionRail with 3+ in-page anchors (visible at 1280px in screenshots: "HOME / ABOUT  STORY  PROCESS  SERVICE AREAS"). On Fantasy.co, the chrome is brand + menu only. The rail is fragmenting attention and adding 5–7 extra interactive elements per page.

- `src/lib/page-sections.ts`: replace every entry with `[]`. SectionRail's empty-array branch already renders nothing, so the chrome collapses to brand + phone + Quote + MENU.
- After verifying the rail is empty everywhere, delete `SectionRail.tsx`, `SectionRailCompact.tsx`, `MobileSubNav.tsx`, and the imports/calls in `Navigation.tsx`. Keep `HeaderBreadcrumb` (small "HOME / ABOUT" chip on sub-pages) for now — it's a single quiet wayfinding crumb, not a rail.
- `useActiveSection` hook: delete (no longer consumed).

### E. Dead anchor entries

Even if we keep the rail mechanism (we don't), the home registry references `section-quote`, `section-featured`, `section-faq`, `section-testimonials` — IDs that don't exist on `Index.tsx`. With the rail deleted this becomes moot, but the registry file gets emptied to enforce it.

### F. Caption labels under inline media

- `CrewMoment.tsx` line 59: `On the boards · Alberta` under the photo. **Delete.**
- `HomeGalleryStrip.tsx` lines 65–76: the bottom hairline strip with `More photographs in the gallery` + `See the full gallery` link is a duplicate CTA — the entire image grid is already a Link to `/work`. **Delete the hairline row.**
- `FieldClipsStrip.tsx` line 61: `${count} Clips · Calgary & Edmonton` badge on hero clips. **Delete.** (FieldClipsStrip is currently unmounted, but cleanup keeps it from re-introducing clutter if mounted later.)
- About `section-areas`: the `Not on the list? Ask anyway — we'll let you know if we can travel.` italic helper line under the city tag grid. **Delete.** (The grid is self-explanatory.)
- Services `section-contract`: the right-aligned `${n} ITEMS` counter chips inside both columns. **Delete.** (Decorative metadata, not informative.)
- Services `section-catalogue`: the trailing "Don't see what you need? Ask anyway." link row at the bottom of the homepage Services list. **Delete.**

### G. Floating + duplicated CTAs

- `FloatingQuoteCTA` is mounted globally in `App.tsx` and shows on every page except `/` and `/contact`. `/about`, `/services`, `/work` already have CedarCTA in the hero, in QuoteCloserCard at the bottom, and the FREE QUOTE button in the chrome. Three instances of the same CTA per page is clutter. **Remove the `<FloatingQuoteCTA />` mount** from `App.tsx` and delete the file.
- `Navigation.tsx`: keep `Quote` (FREE QUOTE) and phone link in the desktop header, but consolidate. The mobile QuickNav bar already covers mobile.

### H. Subtitle + description double-up

PageHero variants accept both `subtitle` and `description`. No live page passes `description`. Drop the prop from the type and its render branches across all variants — pure dead surface that whispers "add a third line of text here".

### I. Provenance card pathway

`HeroProvenanceCard` and the `provenance` prop on PageHero (lines 69–82) are unused on every live page but still render a card overlay if anyone passes `provenance={…}`. Drop the prop, the import, and delete `src/components/ui/hero-provenance-card.tsx`.

---

## Axis 2 — One section, one viewport

### Discipline

Every full-width section component clamps to **`min-h-[100svh]` and `flex flex-col justify-center`** so its inner content is centered in a viewport-tall plate. Hero and Footer keep their special heights. The change is centralized via a new spacing token so we don't sprinkle `min-h-[100svh]` across 20 files.

```ts
// src/lib/spacing.ts (additions)
export const SECTION_HEIGHT = {
  /** Default — every editorial plate is one full small-viewport tall. */
  fullScreen: "min-h-[100svh]",
  /** Reduced for media-only bleeds so they read as breaks, not plates. */
  bleed:      "min-h-[68svh] md:min-h-[78svh]",
} as const;

export const SECTION_LAYOUT = {
  /** Apply with SECTION_HEIGHT.fullScreen for centered single-screen sections. */
  centered:   "flex flex-col justify-center",
} as const;
```

Why `svh` not `vh`: small-viewport-height excludes mobile browser chrome (Safari URL bar), preventing the "section is 90vh until you scroll and it grows" jump.

### Per-section sizing pass

Each row below documents the new container shape and what changes inside to fit one viewport without crowding.

#### Home (`/`)

| Block | Old height | New height | Internal change |
|---|---|---|---|
| `Hero` (architect-bleed) | `min-h-[78vh]` desktop | `min-h-[100svh]` everywhere | Remove eyebrow chip + caption rail (axis 1) → headline gets more breathing room, fits on phones without overflow |
| `BrandStatement` | `SECTION_PADDING.calm` (~600px) | `min-h-[100svh] flex justify-center` | Centered serif sentence, hairline above + below — reads as a wall plate |
| `EditorialImageBreak` (1) | aspect-[4/3] mobile / [21/9] desktop | `SECTION_HEIGHT.bleed` (68svh / 78svh), `object-cover`, no internal aspect | Bleed becomes a true break, not a stub |
| `Services` (homepage list) | content-driven (~1400px) | `min-h-[100svh]` with internal `overflow-y-auto md:overflow-visible` and **truncate to 8 services on mobile** + "see all" link to `/services` | The 16-service list cannot legibly fit one mobile viewport. Mobile shows 8 + CTA; tablet shows 12; desktop shows all 16 in a 2-column grid (`md:columns-2`) so it fits 100svh |
| `HomeGalleryStrip` | content-driven | `min-h-[100svh]` with the 3 figures using `aspect-[3/4]` and the heading row collapsed to a single line | |
| `CrewMoment` | content-driven | `min-h-[100svh]`, image `aspect-[4/5]` mobile / `aspect-[3/4]` desktop, body trimmed to one paragraph (already one) | Drop "On the boards · Alberta" caption (axis 1) |
| `TestimonialStrip` | content-driven | `min-h-[100svh]` with **single rotating testimonial** instead of the current strip; auto-rotate every 6s, dots underneath | A wall of quotes can't fit one screen. One quote fits beautifully. |
| `EditorialImageBreak` (2) | as above | `SECTION_HEIGHT.bleed` | |
| `QuoteCloserCard` | `SECTION_PADDING.default` (~500px) | `min-h-[100svh]`, plate centered inside | The evergreen plate stays the same shape; just the section around it is centered to one screen |

#### About (`/about`)

| Block | New height | Internal change |
|---|---|---|
| `PageHero` (evergreen-typographic, triptych) | `min-h-[100svh]` (already ~100vh-ish) | Remove `sectionLabel`, drop `OUR STORY` eyebrow, drop fallback captions |
| `section-story` (2-col) | `min-h-[100svh]` centered | Trim 2 paragraphs to 1, drop the pull-quote (it's a third text moment in the same screen) — image and one paragraph + CTA fits cleanly |
| `EditorialImageBreak` | `SECTION_HEIGHT.bleed` | |
| `section-process` | `min-h-[100svh]` centered | Five steps stay; cap each step description to one line (`line-clamp-1`) so the whole list fits portrait viewports |
| `EditorialImageBreak` | `SECTION_HEIGHT.bleed` | |
| `section-areas` | `min-h-[100svh]` centered | Drop the helper italic line; the city grid is self-contained |
| `QuoteCloserCard` | `min-h-[100svh]` | as above |

#### Services (`/services`)

| Block | New height | Internal change |
|---|---|---|
| `PageHero` (service-portrait, triptych) | `min-h-[100svh]` | Drop sectionLabel + fallback captions |
| `section-catalogue` | `min-h-[100svh]` with internal scroll on mobile, 2-column on lg | Truncate to 12 items mobile / show all 16 in 2 columns desktop. Drop the "Don't see what you need" footer row |
| `EditorialImageBreak` | `SECTION_HEIGHT.bleed` | |
| `section-contract` | `min-h-[100svh]` centered | Drop the `${n} ITEMS` counters; cap each row to one line; grid: image col-4 + matrix col-8 (existing) |
| `MiniFaq` | `min-h-[100svh]` centered, **only first 4 FAQs**, "see all" link removed | |
| `EditorialImageBreak` | `SECTION_HEIGHT.bleed` | |
| `QuoteCloserCard` | `min-h-[100svh]` | |

#### Contact (`/contact`)

| Block | New height | Internal change |
|---|---|---|
| Slim photo band (added Pass 51) | `min-h-[24svh]` capped — ornament, not a plate | |
| Form section | `min-h-[100svh]` centered | Already approximately fits; tighten vertical padding so the headline + 2-col grid lands on one phone screen |

#### Work (`/work`)

| Block | New height | Internal change |
|---|---|---|
| `PageHero` (cinematic-bleed, triptych) | `min-h-[100svh]` | Drop sectionLabel + fallback captions |
| `GalleryWall` | natural CSS-columns masonry | **Exempt** — a wall is meant to scroll; locking it to 100svh would crop the gallery. Keep as-is. |
| `TestimonialStrip` | `min-h-[100svh]` rotating | as above |
| `QuoteCloserCard` | `min-h-[100svh]` | |

### Mobile / tablet / desktop verification matrix

For each route × viewport (375×812, 768×1024, 1280×800, 1920×1080) we step through every section and confirm:

1. The section height equals or exceeds the viewport height (`100svh`).
2. The content is **vertically centered** with no clipping at top or bottom.
3. No horizontal overflow.
4. Touch targets ≥ 44px (already enforced).

Any section that exceeds 100svh because of content overflow on mobile (services list, FAQ, testimonials) gets one of three remedies — **truncate**, **paginate** (rotating quote), or **internal scroll with a visible hairline cue**. No section is allowed to push the next section off-screen by more than 5%.

---

## File changes

### New
- *(none — only edits and deletes)*

### Edits
1. `src/lib/spacing.ts` — add `SECTION_HEIGHT`, `SECTION_LAYOUT` tokens.
2. `src/lib/page-sections.ts` — empty every entry to `[]`.
3. `src/components/Navigation.tsx` — remove `SectionRail` + `SectionRailCompact` imports/calls. Keep `HeaderBreadcrumb`.
4. `src/App.tsx` — remove `<FloatingQuoteCTA />` mount and import.
5. `src/components/Hero.tsx` — remove `sectionLabel`, `breadcrumb` props.
6. `src/components/ui/page-hero.tsx`:
   - Drop `caption`, `description`, `provenance`, `fallbackCaptions` props from interfaces.
   - Delete the architect-bleed top eyebrow row (~873–894).
   - Delete the architect-bleed bottom captionLine row (~993–1016).
   - Same for evergreen-typographic + service-portrait + cinematic-bleed: remove sectionLabel BronzeRule.
   - Drop the auto-derived `captionLine` `useMemo`s.
   - Apply `min-h-[100svh] flex flex-col justify-center` to each variant root.
7. `src/components/media/HeroTriptych.tsx` — drop `fallbackCaptions` from props, the column tuple, and pass-through.
8. `src/components/media/MediaSlot.tsx` — drop `caption` from `EditorialFallback` and the JSX that renders it.
9. `src/components/BrandStatement.tsx` — wrap in `min-h-[100svh] flex flex-col justify-center`.
10. `src/components/Services.tsx` (homepage list) — `min-h-[100svh] flex flex-col justify-center`; mobile shows first 8 + "see all 16 services" link; desktop renders all 16 in 2-column. Drop "Don't see what you need" trailing row.
11. `src/components/HomeGalleryStrip.tsx` — `min-h-[100svh]`; delete the bottom "More photographs / See the full gallery" hairline row.
12. `src/components/CrewMoment.tsx` — `min-h-[100svh] flex justify-center`; delete `On the boards · Alberta` caption.
13. `src/components/TestimonialStrip.tsx` — refactor to **single rotating quote** (auto-rotate, prefers-reduced-motion freezes on first); `min-h-[100svh] flex justify-center`.
14. `src/components/MiniFaq.tsx` — `min-h-[100svh] flex justify-center`; cap to first 4 items; remove "see all" link if present.
15. `src/components/QuoteCloserCard.tsx` — `min-h-[100svh] flex justify-center` on the section wrapper.
16. `src/components/media/EditorialImageBreak.tsx` — replace `aspect-[4/3] md:aspect-[21/9]` with `min-h-[68svh] md:min-h-[78svh]`, image becomes `absolute inset-0 object-cover`. Stays a "break", not a plate.
17. `src/components/media/FieldClipsStrip.tsx` — drop the `${count} Clips · Calgary & Edmonton` badge.
18. `src/pages/Index.tsx` — no structural change; section components handle their own heights.
19. `src/pages/About.tsx` — `section-story` 2-col: trim to one paragraph, remove pull-quote; `section-process`: cap each step description with `line-clamp-2`; `section-areas`: drop italic helper line. All three sections wrapped in `${SECTION_PADDING.default} ${SECTION_HEIGHT.fullScreen} ${SECTION_LAYOUT.centered}`.
20. `src/pages/Services.tsx` — `section-catalogue` mobile-truncate or 2-column; `section-contract`: drop `${n} ITEMS` counters and `${n} ITEMS` chips. All sections clamped to one viewport.
21. `src/pages/Contact.tsx` — tighten paddings so the form fits one phone viewport.
22. `src/pages/Work.tsx` — tweak `PageHero` to drop sectionLabel; GalleryWall exempt from 100svh rule.

### Deletes
- `src/components/FloatingQuoteCTA.tsx`
- `src/components/navigation/SectionRail.tsx`
- `src/components/navigation/SectionRailCompact.tsx`
- `src/components/navigation/MobileSubNav.tsx`
- `src/hooks/useActiveSection.ts`
- `src/components/ui/hero-provenance-card.tsx`

---

## Verification

After implementation, walk every page at four viewports and screenshot. Expectations:

1. **No chip, eyebrow, or service-location caption appears anywhere outside primary headlines.**
2. **Every section's content is centered in a single viewport** (no scroll required to reach a section's footer before it ends — except `/work`'s gallery, which is exempt).
3. **No floating CTA, no section rail, no breadcrumb chip on `/`** (the breadcrumb chip stays only on sub-pages).
4. Headers contain only: brand mark + (phone · Quote · MENU) on desktop, brand + MENU on mobile.
5. `rg "·.[A-Z]" src/components/ui/page-hero.tsx src/components/media/` returns zero "X · Y" caption strings.
6. `rg "fallbackCaptions|sectionLabel|caption=" src/pages src/components/Hero.tsx` returns zero hits.
7. Lighthouse: CLS ≤ 0.05 (svh prevents resize jumps); LCP unchanged.
8. Screen reader: every section retains its `aria-labelledby`/`aria-label`; nothing decorative gets a label.

This is the largest refactor since the navigation pass — but it is purely subtractive. Every change removes mass; no new patterns are introduced beyond two spacing tokens.
