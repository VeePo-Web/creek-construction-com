# Fantasy.co Hero System — Full Site Reskin

## The diagnosis (from the live database, not memory)

- **0 assets** carry `ai_quality = 'hero'`. Every hero query in the codebase asks for `min_quality: "hero"` and silently falls back. That is why pages look flat.
- We have **19 portfolio-tier shed process shots, 7 portfolio elevations**, and a deep `reference` bench (~70 photos). Plenty of raw material — the gate is wrong, not the inventory.
- Sub-pages (`/work`, `/about`, `/contact`) all use `variant="evergreen"` — a flat type-only hero. The `cinematic` branch in `PageHero` exists but is never invoked. Dead code.
- `/services` uses `PageHero` too but with no portrait or service signature.
- Homepage `Hero.tsx` already has an *adaptive* two-column layout, but with no hero media approved it collapses to single-column every render.

## The thesis

A Fantasy.co-grade hero is **cinematic, type-driven, and choreographed**. Three ingredients:

1. **Real photography pulled from the cloud** — never a gradient placeholder.
2. **Kinetic typography** — clip-path line reveals, weight shifts, italic punctuation that lands on a beat.
3. **Provenance & narrative chrome** — floating cards that tell you *where, when, what* without ever overlapping the headline.

Pages are not interchangeable. Each gets a hero variant tuned to its job:

| Page | Variant | Why |
|---|---|---|
| Home `/` | `editorial-split` | Two-column: headline + portrait. Best for trust-building. |
| Work `/work` | `cinematic-bleed` | Full-bleed photo or muted-loop video. Photography is the product. |
| Services `/services` | `service-portrait` | Triptych of service shots behind kinetic headline. |
| About `/about` | `evergreen-typographic` (refined) | Crew is private — type carries the weight, with a single ambient field clip behind. |
| Contact `/contact` | `evergreen-typographic` (refined) | Same. Gets a single contact-card collage. |

---

## Phase 1 — Promote real heroes (data, not code)

**1.1 Inventory the strongest candidates** via the admin tool and a SQL audit:

```sql
-- Promote the top 8 portfolio elevations + best process wides to hero
UPDATE media_metadata
   SET ai_quality = 'hero'
 WHERE ai_review_status = 'approved'
   AND ai_quality = 'portfolio'
   AND shot_type IN ('elevation','wide')
   AND width >= 1600;
```

Plus a manual promote for 2-3 standout `process` shots (judged by aspect + composition, picked by AI Vision against the alt text).

**1.2 Relax the homepage gate as a safety net.** In `src/lib/api/public-media.ts` the quality ordering already lets `portfolio` qualify when `min_quality:'portfolio'` is set. We change *callers* — every hero query becomes `min_quality: 'portfolio'` for now, with a `prefer_hero: true` client-side sort that pushes hero-tier first. No more silent fallback.

**1.3 Field-clip qualification.** For `/work` cinematic variant we want a 6-12s muted MP4. Backfill: re-run `auto-classify-batch` with the new `kind: 'video'` rule, mark any approved `.mov` as `ai_quality:'portfolio'` and let UI accept it.

---

## Phase 2 — New kinetic primitives (3 small files)

### 2.1 `src/components/ui/kinetic-headline.tsx`
A composable headline that splits the title into lines, then animates each line with a `clip-path` reveal on a staggered delay. API:

```tsx
<KineticHeadline
  lines={['Excellence in', 'the Work.']}
  italic="Pride in every detail."
  size="display"            // 'display' | 'cinematic' | 'service'
  staggerMs={120}
  onDark
/>
```

- Honors `prefers-reduced-motion`: clip-path becomes opacity 0→1.
- Italic tail auto-renders with a hairline 1px cedar underline that *draws* in 600ms after the last line lands.
- Uses `HEADLINE.display` from `src/lib/typography.ts` — never a hand-rolled font size.
- Exposes `onComplete` callback so downstream chrome (provenance card, CTA) waits its turn.

### 2.2 `src/components/ui/hero-provenance-card.tsx`
A floating editorial card with: numeral, eyebrow, location, year, optional bronze rule, optional CTA. Glassmorphic surface (`hsl(var(--surface-card) / 0.97)`), subtle shadow, drop-in for any hero variant. Replaces the bespoke "stat card" inside `Hero.tsx`.

### 2.3 `src/hooks/useHeroPreload.ts`
Injects `<link rel="preload" as="image" fetchpriority="high">` into `<head>` *before* React renders the `<img>`. Resolves the LCP race condition where the hero image starts loading after Hydration. Driven by a single `usePublicMediaUrl(query)` resolved at module-init for the homepage hero.

---

## Phase 3 — `PageHero` v2: four variants

Rewrite `src/components/ui/page-hero.tsx` (keep the export name + `evergreen` variant for backward-compat) so it dispatches to four sub-components:

### `editorial-split` — Home
- Two-column: 7/5 desktop, stacked mobile.
- Left: BronzeRule → KineticHeadline → italic subtitle → TrustChips → CedarCTA + tel link.
- Right: 4:5 aspect portrait inside an 8px radius frame with a 1px cedar/15 border.
- Floating ProvenanceCard sits **−24px left, −32px bottom** of the photo (lg+).
- Background: `BACKDROP.evergreenRadial` + grain — same evergreen as today.

### `cinematic-bleed` — Work
- Full-bleed `<img>` or `<video muted loop autoplay playsinline>` at 80vh / min 600px.
- Foreground rendered at `bottom-left`, max-width 720px:
  - Hairline cedar rule (24px wide) → numeral + eyebrow → KineticHeadline (size `cinematic`).
  - Subtitle italic.
  - **Caption rail** along the bottom edge: `service · location · year — photographer`. Renders hairline-divided.
- Two vignettes: `cinematicVignette` (radial) + a top-down 30% black gradient so the nav stays legible.
- Ken Burns drift on the image (1.0 → 1.06 over 14s, ease-out) — disabled under reduced motion.
- LCP image preloaded via `useHeroPreload`.

### `service-portrait` — Services
- A 3-column triptych grid behind the headline:
  - cols: 1fr 2fr 1fr at desktop, single image at mobile.
  - Each tile pulls `MediaSlot` queries with `service: 'decks'`, `'fencing'`, `'sheds'`. Each gets a different `aspect` (`portrait`, `editorial`, `portrait`) so the silhouettes differ.
- Headline overlaid in a center column with a black-to-transparent radial behind it (`mix-blend-multiply` on the photos).
- Service chips below the headline render as horizontal hairline-divided pills (link to anchored sections on Services page).

### `evergreen-typographic` — About + Contact
- Keeps today's evergreen radial but adds:
  - A **single ambient field clip** that loops top-right at 24% opacity (4:3 aspect, 320×240 max). Picked by query: `kind: 'video', shot_type: 'process'`. Renders nothing if no clip approved.
  - KineticHeadline replaces the static `<h1>`.
  - A new "spine" element on the left edge: a 1px vertical cedar line `bronzeStep(0,1)` running floor-to-headline-center, drawn in 800ms.
  - Sister-studio footnote (currently in `/work`) becomes a re-usable slot.

---

## Phase 4 — Per-page reskin work

### `src/pages/Index.tsx` + `src/components/Hero.tsx`
- `Hero.tsx` becomes a pure consumer of `PageHero variant="editorial-split"` with custom children (TrustChips + dual CTA).
- StatTrio + BronzeRule live inside the new `HeroProvenanceCard`.
- Remove the duplicated background layering — `PageHero` owns it now.
- Add `useHeroPreload(query)` at the top of `Index.tsx` so the LCP image preloads in `<head>`.

### `src/pages/Work.tsx`
Switch hero to:
```tsx
<PageHero
  variant="cinematic-bleed"
  query={{ shot_type: ['hero','elevation','wide'], min_quality: 'portfolio', kind: 'any' }}
  posterQuery={{ shot_type:'elevation', min_quality:'portfolio' }}
  numeral="I" sectionLabel="SELECTED WORK"
  title={['The work', 'speaks first.']}
  subtitle="Selected projects across Calgary, Edmonton, and the towns in between."
  caption={{ service: 'Mixed', location: 'Alberta', year: 2025 }}
  height="80vh" minHeight="600px"
/>
```

### `src/pages/Services.tsx`
Switch to `variant="service-portrait"` with three queries (decks/fencing/sheds). Headline becomes `['Built outside.', 'Built to last.']` italic tail "Six services. One crew."

### `src/pages/About.tsx` + `src/pages/Contact.tsx`
Adopt `evergreen-typographic` refinement. About gets `subject: 'process'` ambient clip; Contact gets `subject: 'wide'` if available, else nothing (slot is null-safe).

---

## Phase 5 — Motion choreography (cross-cutting)

Define a tiny orchestrator hook `useHeroSequence()` that returns named beats:

| Beat | Time | Element |
|---|---|---|
| `t0` | 0ms | image fade in (opacity 0 → 1, 600ms) |
| `t1` | 200ms | bronze rule scale-x 0 → 1 (400ms) |
| `t2` | 350ms | numeral + eyebrow fade-up (300ms) |
| `t3` | 500ms | headline line 1 clip-reveal (700ms) |
| `t4` | 620ms | headline line 2 (700ms) |
| `t5` | 1100ms | italic subtitle fade-up (400ms) |
| `t6` | 1300ms | provenance card fade + lift (500ms) |
| `t7` | 1500ms | CTA fade + bronze underline draw (400ms) |

All beats sourced from `DURATION` in `src/lib/motion.ts` (no magic numbers). Reduced-motion collapses to a single 300ms opacity fade for the whole composition.

---

## Phase 6 — Accessibility & performance budget

- **Headline** stays `<h1>` semantically; lines split by `<span aria-hidden>` so screen readers read the full string.
- **Cinematic video** ships with `aria-hidden`, a poster fallback, and pauses off-screen via existing `IntersectionObserver` in `AmbientVideoBleed`.
- LCP target: **< 2.0s** on Home (preloaded portrait, ~120KB AVIF).
- CLS target: **0.00** — every image carries explicit `width`/`height` and an `aspect-ratio` wrapper.
- Total JS added by all new primitives: **~3KB gzipped** (headline split is CSS-driven; no Framer Motion dependency added).
- Reduced motion path verified for every beat.

---

## Phase 7 — Memory + governance

After implementation, update memory:

- New file `mem://design/hero-system-v2.md` — variants, sequence beats, when to use which.
- Update `mem://architecture/core-design-system` to mark `SubPageHero` deprecated in favor of `PageHero`.
- Update `MEDIA_PLAYBOOK.md` to note that `min_quality: 'portfolio'` is now the canonical hero gate; `'hero'` is reserved for editor-promoted assets.

---

## Files this will create or change

**Create (3):**
- `src/components/ui/kinetic-headline.tsx`
- `src/components/ui/hero-provenance-card.tsx`
- `src/hooks/useHeroPreload.ts`

**Rewrite (1):**
- `src/components/ui/page-hero.tsx` — variant dispatcher + 4 sub-components

**Edit (5):**
- `src/components/Hero.tsx` — consume new PageHero
- `src/pages/Index.tsx` — add preload hook
- `src/pages/Work.tsx` — cinematic-bleed
- `src/pages/Services.tsx` — service-portrait
- `src/pages/About.tsx` + `src/pages/Contact.tsx` — refined evergreen

**Migration (1):**
- Promote portfolio→hero on qualifying assets; loosen caller gates.

---

## What this delivers

A site where every hero **earns its space** with real photography, type that lands on a beat, and chrome that respects the photo. No more gradient placeholders. No more flat sub-pages. Each page distinct in rhythm, unified in voice. Fantasy.co caliber — measured by LCP, CLS, *and* the gut feeling of the first 3 seconds.