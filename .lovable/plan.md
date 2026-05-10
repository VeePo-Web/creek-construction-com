# Pass 48 — Image-first cleanup: anonymous gallery, single services list, new hero

User wants three structural moves:
1. **One new AI hero image** to replace `hero-architect-color.jpg`.
2. **All imagery dispersed as pure visuals** — no project titles, locations, summaries, statuses, or descriptions anywhere. `/work` becomes a single editorial gallery wall.
3. **Single `/services` page** with the user's exact 16-item list and one description per item — no group-tiers, no service subpages (none exist today, which is correct; just collapse the homepage rows to the same flat list voice).

## A. New hero image

Replace `src/assets/hero-architect-color.jpg` (current image is fine but the user explicitly asked for a better one). Generate via `imagegen--generate_image` with the **`standard`** model at **1920×1200** (PageHero `architect-bleed` is full-bleed widescreen).

Prompt (premium editorial, golden-hour, negative space on the **left** for hero typography over a cinematic exterior build):

> "Wide editorial photograph of a freshly built two-storey modern Alberta home at golden hour: warm cedar siding, black trim, low-slope roof, a wraparound cedar deck with horizontal railings, large double-glazed picture windows reflecting amber sky. Foreground: clean concrete walkway leading to the front entry, soft prairie grass to the side. Background: open prairie horizon with distant Rockies in soft haze. Negative space on the LEFT third for typography overlay. Cinematic depth, shallow depth of field on the foreground walkway, sharp focus on the home. Natural color, no people, no text, no logos. Architectural-magazine quality, Dwell / Architectural Digest aesthetic."

Save to `src/assets/hero-architect-color.jpg` (overwrite — one import path, no cascading edits). Keep the existing `Hero.tsx` import unchanged.

## B. `/work` — anonymous gallery wall

Rewrite `src/pages/Work.tsx` from a project-listing page into a single editorial masonry gallery. Removes:

- `<ProjectsJsonLd />` (was emitting CollectionPage with project names)
- `PROJECTS.map(...)` "Featured editorial galleries" block — gone (titles, locations, statuses, summaries, `ProjectGallery`)
- `PLACEHOLDERS` "Across every service" tile grid — gone (titles, locations, descriptions, click-to-quote chips)
- The `SectionHeader` subheadings that name regions ("…across Calgary, Edmonton…")

Replaces with one section:

```text
PageHero (cinematic-bleed, title only — no subtitle, no breadcrumb sublabel)
   ↓
GalleryWall — 3-column desktop / 2-col tablet / 1-col mobile masonry
   • Pulls from src/assets (sauna-*.jpg, hero-*.jpg, projects/*) plus
     any new disperse-friendly photos
   • Each <img> has descriptive alt only ("Cedar deck, golden hour")
   • No captions, no overlays, no hover labels, no links
   • Lazy-load below the fold; first 6 images priority
   • Calm 16px gap, 4:5 / 3:4 / 1:1 / 16:9 mix for editorial rhythm
   ↓
QuoteCloserCard
Footer
```

Hero copy on `/work`: title `["The work."]`, **no** subtitle, **no** breadcrumb second crumb beyond "Gallery".

A new component `src/components/GalleryWall.tsx` will be created — pure presentation, takes an array of `{ src, alt, ratio }` and renders a CSS columns masonry. No hover labels, no click handlers.

Source list lives in a new `src/config/gallery.ts` (one array of imports — easy to extend). Initially populated from existing assets:
- `hero-architect-color.jpg`, `hero-architecture.jpg`
- `sauna-acreage-premium.jpg`, `sauna-backyard-premium.jpg`, `sauna-mountain-premium.jpg`, `sauna-interior-premium.jpg`, `sauna-stones-premium.jpg`, `sauna-winter-steam.jpg`, `sauna-interior-editorial.jpg`, `sauna-interior-detail.jpg`, `sauna-stones-macro.jpg`
- `projects/riverbend-studio-shed/*` three photos

That's ~16 images for v1 — the wall reads dense and curated.

## C. Homepage — replace `FeaturedProjects` with anonymous image strip

`FeaturedProjects` currently renders project titles, services, and locations as captions over each tile. The user explicitly said "no specific projects listed" — so this section must shed its labels.

Two options:
- **C1 (recommended): Replace with `<HomeGalleryStrip />`** — a 3-up editorial row of pure images (no captions, no titles), pulled from the same `src/config/gallery.ts`. Click anywhere → `/work`.
- **C2:** Remove the section entirely.

Going with **C1**. New component `src/components/HomeGalleryStrip.tsx`:
```text
[ section "OUR WORK" eyebrow removed; H2 only ]
H2: "Recent work."
3-up grid of 3 hand-picked gallery images (4:5, 1:1, 4:5)
Below: single text link "See the full gallery →" → /work
```
No project metadata. No ProjectGallery import. No data layer.

`src/pages/Index.tsx` line 38 swaps `<FeaturedProjects />` for `<HomeGalleryStrip background="secondary" />`.

`src/components/FeaturedProjects.tsx` stays in the repo (deprecated, unused) for now — safer than a delete spree mid-pass; we can drop it in a later cleanup.

## D. `/services` — the single, definitive list

The user's exact 16-item list **with one description per item**. Replace `SERVICE_GROUPS` + `SERVICE_ITEMS` in `src/config/services.ts` with a single flat `SERVICES` array:

| # | Title | Description (one-line, calm voice) |
|---|---|---|
| 01 | Siding | Repairs, replacements, and full re-clads — cedar, fiber-cement, vinyl. |
| 02 | Exterior Paint & Sanding | Proper prep, premium paint, clean lines that hold for a decade. |
| 03 | Decks | Cedar, pressure-treated, composite — built for how you use the outdoors. |
| 04 | Platforms | Hot-tub, equipment, and seating platforms engineered to sit dead level. |
| 05 | Fireplaces | Outdoor fireplaces and surrounds — masonry, steel, stone. |
| 06 | Sheds | Garden sheds, workshops, bunkies — finished to the same standard as the house. |
| 07 | Gutter Cleaning | Seasonal clean-out and inspection so the envelope keeps doing its job. |
| 08 | Roof Repairs | Leaks, missing shingles, flashing — diagnosed and fixed in one visit when possible. |
| 09 | New Roof Builds | Full re-roofs and new construction — shingle, metal, membrane. |
| 10 | Fences | Wood, vinyl, chain link, and gates — straight posts, square corners. |
| 11 | Exterior Fixtures | Lights, vents, mounts, and hardware — properly flashed and sealed. |
| 12 | Landscaping | Grading, sod, beds, and full yard transformations. |
| 13 | Walkways | Stone, paver, and concrete paths laid on a base that won't heave. |
| 14 | Backyard Gardens | Raised beds, planters, and garden builds tuned to your sun and soil. |
| 15 | Driveway Pressure Cleaning | Restore concrete, pavers, and stone to factory tone. |
| 16 | Garage Builds | Detached and attached garage construction, foundation to finish. |

A **back-compat shim** (`SERVICE_GROUPS`, `SERVICE_ITEMS`, `getItemsForGroup`) is kept to avoid a 30-file blast-radius edit; the shim returns one synthetic group containing all 16 items so existing call-sites (Services.tsx homepage rows, QuoteModal checkboxes) keep functioning. Then:

- `src/components/Services.tsx` (homepage strip): replace the 5-row group display with a single tight 16-row list (`SERVICES.map`), each row: `index — title — description`. Same hairline rhythm, same hover-cedar marker, same click-to-open-quote-modal behavior. Headline becomes "Sixteen services. One crew."
- `src/pages/Services.tsx` (full menu page): replace the nested groups loop (`SERVICE_GROUPS.map → getItemsForGroup`) with one flat `SERVICES.map`, same row template. Catalog headline: "Everything we build."
- `src/components/quote/QuoteModal.tsx` & `QuoteFormInline.tsx`: replace any `SERVICE_GROUPS`/`getItemsForGroup` usage with the flat `SERVICES` list (16 checkboxes in one column).

Hero block on `/services` stays (`PageHero variant="service-portrait"`) but the `queries=[decks, fencing, sheds]` array stays unchanged — those three keys are valid `ServiceCategory` ids in `src/lib/api/public-media.ts` and just drive the hero photo composition; they aren't shown to the user.

## E. Out of scope (deliberate)

- `/work` no longer shows `PROJECTS` data, but `src/data/projects.ts` and `src/components/ProjectGallery.tsx` stay in the repo so the existing `src/assets/projects/riverbend-studio-shed/*` photos are still imported by the gallery config. No file deletes this pass — just removed from rendered output.
- The MediaSlot system (`src/lib/api/public-media.ts`, `src/components/media/*`) drives PageHero photo composition. Stays as-is — it's invisible plumbing, not user-facing labels.
- No changes to `/about`, `/contact`, `/style-guide`, or admin routes.

## F. Verification

1. Preview at 360 / 768 / 1440:
   - Home: new hero image renders, deck + amber prairie composition with left negative space; below the fold the "Recent work." strip shows three captionless images.
   - `/services`: scroll one calm 16-item list, each row reads `01 — Siding — Repairs, replacements, and full re-clads…`. Clicking a row opens QuoteModal pre-checked to that service.
   - `/work`: hero "The work." then a clean masonry of ~16 photos. No titles, no chips, no descriptions, no "Featured Project" callout, no service-tile grid.
2. `rg "project.title|project.location|project.summary" src/pages/Work.tsx src/components/HomeGalleryStrip.tsx src/components/GalleryWall.tsx` → zero matches.
3. `rg "PLACEHOLDERS" src/pages/Work.tsx` → zero matches.
4. `SERVICES.length === 16` in console.
5. QuoteModal opens with 16 checkboxes (was 15).
6. No build errors; no broken imports from the back-compat shim.

## Files touched

**Generated/new:**
1. `src/assets/hero-architect-color.jpg` (overwrite — new AI hero)
2. `src/components/GalleryWall.tsx` (new — masonry presenter)
3. `src/components/HomeGalleryStrip.tsx` (new — 3-up home strip)
4. `src/config/gallery.ts` (new — image array)

**Edited:**
5. `src/config/services.ts` (flat 16-item `SERVICES` + back-compat shim)
6. `src/pages/Work.tsx` (gallery rewrite)
7. `src/pages/Services.tsx` (flat list rewrite)
8. `src/pages/Index.tsx` (swap FeaturedProjects → HomeGalleryStrip)
9. `src/components/Services.tsx` (homepage 16-row list)
10. `src/components/quote/QuoteModal.tsx` (flat 16 checkboxes)
11. `src/components/quote/QuoteFormInline.tsx` (flat 16 checkboxes)
