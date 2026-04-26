## Goal

Eliminate every "flat green hero plate" on the four public landing pages — **Home (`/`)**, **Services (`/services`)**, **Work (`/work`)**, **About (`/about`)**, **Contact (`/contact`)** — and replace the background with a **thirds-split photographic triptych** that showcases real Creek work. The headline, BronzeRule, and CTA chrome stay 100% legible via a calibrated scrim system. Where photography is missing, a designed stone-grain fallback renders — never a green plate.

This is a Fantasy.co-grade upgrade: landing chrome should *prove the work* the moment a visitor lands.

---

## Audit — what is green today

| Page | Hero variant | Status |
|---|---|---|
| `/` Home | `editorial-split` | **Left 55% column is solid evergreen** (`bg-evergreen` + `evergreenRadial`) |
| `/services` | `service-portrait` | Triptych exists but at `opacity-70` with `evergreenRadial @0.55`, vignette, and `bg-evergreen` base — reads ≥80% green |
| `/about` | `evergreen-typographic` | **100% solid green** (`bg-evergreen` + `evergreenRadial @0.9`) |
| `/contact` | `evergreen-typographic` | **100% solid green** (same as About) |
| `/work` | `cinematic-bleed` | Already a single full-bleed photo — *not* green; left as-is, but we will offer the triptych as an opt-in (`triptych` prop) for symmetry. |

The user's directive applies to all five. Four require a full triptych replacement; `/work` gets an additive opt-in.

---

## Design concept — "Triptych Bleed"

A horizontal **3-column photographic backdrop** spans the full hero. Each column is a different approved photograph that hand-picks a different shot type so the eye reads the breadth of the craft (e.g., elevation · detail · interior). The chrome (headline, sub, CTA) sits on the left third with a precision scrim; the right two-thirds breathe full-bleed.

### Layout — three image rhythms

The triptych is not "three equal slabs" — that reads as a stock grid. Three rhythms, all 100% width, depending on context:

1. **Equal thirds (33/33/33)** — default. Used on About, Contact, Services. Hairline cedar dividers (`hsl(var(--cedar) / 0.18)`) at column gutters.
2. **Asymmetric (40/30/30)** — Home. The lead column is widest because the headline column overlays it; the two right columns are tighter editorial accents.
3. **Cinematic single + two accents (60/20/20)** — opt-in for `/work`. One hero plate dominates left; two narrow vertical "field strips" on the right play subtle Ken Burns at half speed.

All rhythms maintain 1px hairline cedar gutters. On mobile (`<md`), the triptych collapses to a **vertical stack of three short slabs (40vh / 30vh / 30vh)** so the photographs are not deformed; the headline overlays the top slab. At `<sm` (≤640px), the triptych collapses to the **single best image** with the same scrim — never green.

### Scrim system — uncompromising legibility

Each landing page picks a **scrim direction** based on where its headline sits. The scrim is a layered, painterly gradient designed to keep the imagery readable while guaranteeing WCAG AA on the type:

- **Left-anchored scrim** (Home, Services, About): `linear-gradient(90deg, hsl(150 30% 6% / 0.78) 0%, hsl(150 30% 6% / 0.55) 38%, hsl(150 30% 6% / 0.18) 62%, transparent 78%)` — sweeps right, leaving the rightmost ~22% photographic.
- **Bottom-anchored scrim** (Contact, Work): `linear-gradient(180deg, transparent 0%, hsl(150 30% 6% / 0.25) 45%, hsl(150 30% 6% / 0.78) 90%)` — top stays photographic; type lives in the lower 38%.
- Universal grain pass at `opacity-25` and a top scrim (`from-evergreen/55 → transparent`, 96px) so navigation chrome remains legible.
- All scrims use the same `hsl(150 30% 6%)` base so the green tone reads as *atmosphere*, not as a plate.

Contrast targets: headline AAA (≥7:1), subtitle AA (≥4.5:1), 10px BronzeRule label AA-large (≥3:1). Spot-check with the `pages/StyleGuide` ratio grid.

### Photographic curation rules

The triptych must *narrate*. We pick one query per column with a deliberate shot-type story:

- **Column A (lead)** → `shot_type: ["hero","elevation"]`, `min_quality: "reference"`
- **Column B (middle)** → `shot_type: ["detail","process"]`, `min_quality: "reference"`
- **Column C (trail)** → `shot_type: ["interior","wide"]`, `min_quality: "reference"`

Per-page narrative seasoning:

- Home — A: deck hero · B: cedar grain detail · C: wide site landscape
- Services — A: deck · B: fence detail · C: siding wide
- About — A: crew/process · B: tool detail · C: portfolio wide
- Contact — A: warm exterior · B: hand detail · C: site context
- Work (opt-in 60/20/20) — already cinematic; A is the existing `query`, B/C are sister `shot_type:"detail"` strips

If a column resolves no media, it renders the **stone-plate** with a `cedar/35` icon (lucide `Hammer/Fence/Trees` per service) and `text-[10px] tracking-[0.28em] uppercase` caption — never green.

### Motion

- Each column: `hero-kenburns` 16s loop with **staggered phase** (`animation-delay: 0ms / 600ms / 1200ms`) so the three images never breathe in sync. Reduced to `none` under `prefers-reduced-motion`.
- Scrim opacity has no motion — it is fixed.
- Headline keeps the existing `KineticHeadline` clip-path reveal.
- Hairline gutters animate width-in (`0 → 1px`) over 600ms after first paint — a Pentagram-grade detail nobody asks for but everyone feels.

### Accessibility

- Each `<img>` has the real `alt` from `media_metadata`. Decorative duplicates use `alt=""`.
- Triptych container is `aria-hidden` because the meaningful caption is the headline.
- Scrim contrast hand-verified at the breakpoint where the headline first wraps (~`md`).
- Reduced-motion: kill Ken Burns, kill gutter draw — the triptych is static.
- `<sm` collapse to a single image preserves AA on every device (no triptych = no scrim split risk).

---

## Implementation plan

### 1. New primitive: `<HeroTriptych />` — single source of truth

Create `src/components/media/HeroTriptych.tsx`:

```ts
type TriptychRhythm = "equal" | "asymmetric" | "cinematic";
type ScrimDirection = "left" | "bottom" | "none";

interface HeroTriptychProps {
  queries: [MediaQuery, MediaQuery, MediaQuery]; // exactly 3
  rhythm?: TriptychRhythm;       // default "equal"
  scrim?: ScrimDirection;        // default "left"
  fallbackIcons?: [LucideIcon?, LucideIcon?, LucideIcon?];
  fallbackCaptions?: [string?, string?, string?];
  /** Marks column A as LCP candidate for `useHeroPreload`. */
  priority?: boolean;
  className?: string;
}
```

Internals:
- Resolves three `useFirstApprovedMedia` calls.
- Renders a `grid` with template-columns per rhythm (`33% 33% 34%` / `40% 30% 30%` / `60% 20% 20%`).
- Per-column: real `<img>` with `hero-kenburns` + staggered delay, OR `<EditorialFallback variant="stone" icon caption />` (extracted from `MediaSlot.tsx` as a named export so we don't duplicate).
- Hairline cedar gutters as `box-shadow: inset 1px 0 0 hsl(var(--cedar)/0.18)` on columns 2 and 3.
- Top scrim (96px, navigation legibility) always on.
- Direction scrim — switch by prop.
- Mobile: at `<md`, switches `grid-rows-[40vh_30vh_30vh] grid-cols-1`. At `<sm`, hides cols B and C, fills A 100%.
- `useHeroPreload(itemA?.url, MEDIA_SIZES.HERO_FULL)` when `priority`.

This primitive lives in `src/components/media/` next to `EditorialBleedSection`. It is **the only thing that knows how to draw a hero photo background** going forward.

### 2. Refactor `page-hero.tsx`

Replace green plates inside the four affected variants with `<HeroTriptych />`. Each variant retains its own *content layout* — only the background changes.

#### `EvergreenTypographic` (used by About + Contact)
- Remove `bg-evergreen` from the `<section>`.
- Remove the `BACKDROP.evergreenRadial` overlay div.
- Mount `<HeroTriptych queries={…} rhythm="equal" scrim="left" priority />` as the first child of the section.
- Keep the cedar spine, BronzeRule, KineticHeadline — they sit in `relative z-10` over the scrim.
- Add a new optional prop `triptychQueries?: [MediaQuery, MediaQuery, MediaQuery]` — if omitted, the variant falls back to a stone-plate triptych (still no green).

#### `EditorialSplit` (used by Home)
- Remove `bg-evergreen` and `evergreenRadial`.
- Mount `<HeroTriptych queries={[lead, detail, wide]} rhythm="asymmetric" scrim="left" priority />`.
- The existing right-column "photo card with provenance" stays — it now reads as a *zoomed/featured detail* layered over the trailing third of the triptych. Kept its `border-cedar/15` and `shadow-float` so it pops from the backdrop.
- Provenance card now reads cinematically because it sits above a real backdrop, not a green plate.

#### `ServicePortrait` (used by Services)
- Replace its in-house triptych implementation with `<HeroTriptych />`. This consolidates the duplicated logic — there will be **one** triptych renderer.
- Drop the `evergreenRadial @0.55` overlay; the new scrim handles legibility.
- `queries` prop maps 1:1 to the new triptych queries.

#### `CinematicBleed` (used by Work — opt-in)
- Add `triptych?: boolean` prop (default `false`). When `true` AND `videoQuery` is empty, render `<HeroTriptych rhythm="cinematic" />` instead of the single image. Keeps Work's existing single-image cinematic as the default — we only *offer* the triptych.
- This is additive only; no breaking change to `/work`.

### 3. Per-page wiring

Update each landing page to pass deliberate triptych queries with brand narrative:

- **`src/components/Hero.tsx`** — Home: 
  ```ts
  triptychQueries: [
    { service: "decks", shot_type: ["hero","elevation"], min_quality: "reference", kind: "image" },
    { shot_type: ["detail","process"], min_quality: "reference", kind: "image" },
    { service: "siding", shot_type: ["wide","aerial"], min_quality: "reference", kind: "image" },
  ]
  ```
- **`src/pages/Services.tsx`** — already uses `queries`; refine the array to enforce shot-type variety (currently three of the same service).
- **`src/pages/About.tsx`** — add `triptychQueries` for crew/process, tool/detail, portfolio/wide. Brand-narrative: *who we are · what we touch · what we leave behind*.
- **`src/pages/Contact.tsx`** — add `triptychQueries` for warm exterior, hand/tool detail, site context. Brand-narrative: *the warmth waiting on the other end of the call*.
- **`src/pages/Work.tsx`** — keep current single image. (Optional toggle later.)

### 4. Fallback hierarchy (no green, ever)

The triptych uses this resolution order per column:
1. Approved media matching the query → render photo
2. Approved media matching a relaxed query (drop `service`, keep `shot_type`) → render photo
3. Stone-plate with icon + caption (`MediaSlot`'s `EditorialFallback`)

We export `EditorialFallback` from `MediaSlot.tsx` so `HeroTriptych` reuses the exact same warm-stone visual language used elsewhere on the site.

### 5. Token additions in `src/lib/colors.ts`

```ts
// Triptych scrims — calibrated for AAA headline contrast over photographic mid-tones.
SCRIM = {
  left: "linear-gradient(90deg, hsl(150 30% 6% / 0.78) 0%, hsl(150 30% 6% / 0.55) 38%, hsl(150 30% 6% / 0.18) 62%, transparent 78%)",
  bottom: "linear-gradient(180deg, transparent 0%, hsl(150 30% 6% / 0.25) 45%, hsl(150 30% 6% / 0.78) 90%)",
  topNav: "linear-gradient(180deg, hsl(150 30% 6% / 0.55) 0%, transparent 100%)",
} as const;
```

This becomes the only sanctioned way to scrim a hero — documented in the memory file.

### 6. Performance

- Only column A is `loading="eager"` + `fetchPriority="high"` + preload via `useHeroPreload`. Columns B and C lazy-load.
- `MEDIA_SIZES.THIRD` for B/C; `MEDIA_SIZES.HERO_FULL` for A on Home/Work, `MEDIA_SIZES.THIRD` on Services/About/Contact.
- `contain: layout style paint` on the triptych container so Ken Burns repaints don't bleed into the page.
- The headline section sits above the triptych in DOM order — the LCP candidate is still the first photo.

### 7. Accessibility & responsive QA matrix (before sign-off)

| Breakpoint | Behavior | Headline contrast |
|---|---|---|
| `≥1280px` | 3-column triptych, scrim `left` | AAA (≥7:1) |
| `768–1279px` | 3-column triptych, scrim `left` | AAA |
| `640–767px` | Vertical stack (40/30/30 vh) | AA (single image under headline) |
| `<640px` | Single image (column A only), scrim `bottom` | AAA |

I will hand-verify each by sampling a known photograph from the library against the calculated headline cedar text.

### 8. Memory updates

- **Update** `mem://design/aesthetic-direction.md` — the **No-Green Gate Policy** is now codified to extend to *hero plates*: a hero may never be a flat green field. It must be photographic OR the stone-plate fallback OR an explicit dark cinematic where dictated by approved imagery.
- **Create** `mem://features/hero-triptych.md` — the contract of `HeroTriptych` (rhythms, scrim directions, query convention, fallback ordering, mobile collapse rules) so future heroes consume the primitive instead of inventing new backdrops.
- **Update** `mem://features/editorial-media-system.md` — list `HeroTriptych` next to `MediaSlot` / `EditorialBleedSection` as a top-level orchestrator.

### 9. Files touched

**Create**
- `src/components/media/HeroTriptych.tsx`
- `mem://features/hero-triptych.md`

**Edit**
- `src/components/media/MediaSlot.tsx` — export `EditorialFallback` for reuse
- `src/lib/colors.ts` — add `SCRIM` token group
- `src/components/ui/page-hero.tsx` — refactor `EvergreenTypographic`, `EditorialSplit`, `ServicePortrait`; add `triptych` prop to `CinematicBleed`
- `src/components/Hero.tsx` — pass `triptychQueries`
- `src/pages/Services.tsx` — refine query story
- `src/pages/About.tsx` — pass `triptychQueries`
- `src/pages/Contact.tsx` — pass `triptychQueries`
- `mem://design/aesthetic-direction.md` — extend Gate Policy to hero plates
- `mem://features/editorial-media-system.md` — register the new primitive
- `mem://index.md` — add memory reference

### 10. Verification (post-build)

1. `bunx tsc --noEmit` — zero errors.
2. Browser walk: `/`, `/services`, `/about`, `/contact`, `/work` at 1440 / 1024 / 768 / 390 — confirm zero green plates, scrim legibility, triptych rendering.
3. Toggle media library access off (or query for a non-existent service) on `/contact` to verify stone-plate fallback renders, **never** green.
4. Check console: no React key warnings, no LCP regression.

---

## Outcome

After this work, **every public landing page leads with photographic proof of Creek's craft**. The flat green plate becomes impossible to draw — the primitive doesn't allow it, the gate policy forbids it, and the fallback for missing media is warm stone, not green. The triptych is the new editorial signature of the brand.