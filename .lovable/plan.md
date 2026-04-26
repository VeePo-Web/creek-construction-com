
# Audit — Every Surface That's Currently Green-When-It-Should-Be-A-Photo

I walked the live preview at `/work#portfolio-fencing-2025`, mapped every `BACKDROP.evergreenPlate` / `bg-evergreen` callsite, and cross-referenced against the actual approved-media inventory. The result: **9 surfaces** silently render flat green right now. The reasons fall into three buckets:

1. **Query gates set too tight.** Most slots demand `min_quality: "portfolio"` or `"hero"`. The library has the work — 65 portfolio/hero photos — but the *combinations* (e.g. `service:fencing` + `shot_type:[hero,wide,elevation]` + `min_quality:portfolio`) match zero rows. No match → green plate.
2. **Plate painted underneath every successful image.** Cards in `Portfolio.tsx`, `Services.tsx`, and the project tile render `BACKDROP.evergreenPlate` as the *base* of the tile, then `MediaSlot` paints on top. During load — and forever, on cards that fall back to the icon — the green plate is the entire visible surface.
3. **Hard-coded green even when media exists nearby.** `GlobalMenu` paints a literal `bg-evergreen` div as the menu's editorial photo fallback. `ProjectTile` placeholders never even *try* to fetch a photo for the service category.

The fix is not "soften the green." A premium exterior contractor's site shows the *exterior contracting work*. Below is the surface-by-surface plan, in priority order.

---

## A. Library inventory (so the fix is grounded in reality)

```
By shot_type × quality (approved, images):
  process    × reference   44   ← largest pool
  process    × portfolio   24   ← excellent fallback for non-hero slots
  elevation  × reference   15
  detail     × reference   11
  elevation  × hero         8   ← only true "hero"-tier supply
  wide       × hero         1
  detail     × portfolio    1

By service × quality (approved):
  decks    : 1 hero,  5 portfolio, 21 reference  →  good coverage
  sheds    : 6 hero, 20 portfolio, 29 reference  →  excellent coverage
  fencing  : 2 hero,  0 portfolio, 17 reference  →  thin at portfolio tier
  painting :         0 portfolio,  3 reference   →  thin everywhere
  siding   : 0  approved photos                  →  no coverage
  pergolas : 0  approved photos                  →  no coverage
  videos   : 0 approved                          →  no field clips yet
```

**Implication**: the hard rule "show a photo at hero or portfolio quality only" is fighting the data. The right rule is *photo-or-fallback per surface, with the gate set to whatever the surface can plausibly receive*.

---

## B. The nine green surfaces, ranked by how loud they shout

### 1. `/work` page hero — full-bleed flat green ⚠️ (loudest offender)

**File**: `src/components/ui/page-hero.tsx` lines 360–485 (`CinematicBleed`)

**What's happening**: query is `shot_type:[hero,elevation,wide] + min_quality:portfolio + kind:image`. The library has 8 elevation+hero, 1 wide+hero, 0 portfolio-tier shots in `[hero,elevation,wide]` shot types. The hero+elevation rows *should* match, but `min_quality:"portfolio"` requires quality ≥ portfolio (the QUALITY_ORDER index gate); `hero` qualifies and 8 of those exist. So why is it green? Because `CinematicBleed` calls `useFirstApprovedMedia(props.query)` separately from `MediaSlot`, and *only* the `useFirstApprovedMedia(props.videoQuery)` is set to videos; if photo loading is slow OR the query doesn't return, the vignette stack still paints (3 layers of dark gradient + grain), darkening the page even after the photo loads.

**Two fixes — apply both**:
- **Loosen the gate** to `min_quality: "reference"` for the hero photograph, since the cinematic vignette darkens everything anyway. We have 39+ usable images for this.
- **Replace the `BACKDROP.evergreenPlate` fallback (line 417)** with a layered editorial fallback: a deep stone gradient + grain + a quiet bronze rule + the literal text `"Photographing this season."` as a 10px tracked caption in cedar/40. Never green again on this surface.

### 2. Homepage `Portfolio` cards — green base under every tile

**File**: `src/components/Portfolio.tsx` line 163

**What's happening**: `<div … style={{ background: BACKDROP.evergreenPlate }}>` is the *base layer* of every card. `MediaSlot` paints on top — but during the LQIP→full-image transition the green flashes through, and any card whose service has no `[hero,elevation,wide]` photo at `reference+` quality (the current floor) reverts to a green plate with an icon overlay.

**Fix**: 
- Change the base layer from `BACKDROP.evergreenPlate` to a warm **stone-grain plate** (`bg-stone-100 grain-overlay` with a 1px hairline border) so the loading state *and* the icon-fallback state read as a calm editorial card, never a black-green void.
- Loosen the per-card query from `min_quality:"reference"` (which is already set, good) to *also* drop the `shot_type` constraint so any hero/elevation/wide/detail shot can fill a service card. With 21 reference-grade decks photos, the deck card should always have a photo.
- Inside the icon fallback, replace the lonely Lucide icon with the icon **layered over a faint cedar→stone gradient and the service name as 10px tracked uppercase**, so even a fallback feels intentional, not "missing photo."

### 3. Homepage `Services` cards — same green-base disease

**File**: `src/components/Services.tsx` lines 92–103 (`MediaSlot` fallback)

**What's happening**: each service tile's `MediaSlot` fallback is again `BACKDROP.evergreenPlate` with a centered icon. For `siding` and `pergolas` (zero photos in library), this is *every page load*.

**Fix**:
- Change the per-tile fallback to the same warm-stone editorial plate as the Portfolio card — *consistent fallback aesthetic across the site*.
- Loosen the `MediaSlot` query from `min_quality:"portfolio"` to `min_quality:"reference"`. For `decks`, `sheds`, `fencing`, this immediately lights up the cards with real work.
- For services that genuinely have no photo (`siding`, `pergolas`, `painting` near-zero), keep the warm-stone fallback but add a corner ribbon: `"NEW WORK COMING — JOIN THE WAITLIST"` linking to `openModal([service.id])`. Turns the absence into a conversion moment.

### 4. `ProjectTile` placeholders on `/work` — green plate icon cards

**File**: `src/components/ui/project-tile.tsx` line ~70 (the `else` branch when no `image` prop)

**What's happening**: the five `PLACEHOLDERS` in `Work.tsx` (Two-Tier Cedar Deck, Cedar Privacy Fence, Full Exterior Repaint, Soffit & Fascia Replace, Cedar Pergola) all render with no `image` prop, so each one is a green plate with a centered icon. That's five back-to-back green tiles in the "MORE WORK" grid — exactly the section that needs to *prove* breadth.

**Fix**:
- Make `ProjectTile` *itself* photo-aware: when no `image` prop is supplied but a `service` prop is, internally call `useFirstApprovedMedia({ service, kind:"image", min_quality:"reference" })` and render that photo. Each tile becomes auto-illustrated from the cloud library.
- When still nothing matches, fall back to a **stone-grain plate + Lucide icon + the service name as caption**. Same warm fallback as #2 and #3 — consistency builds trust that this is *intentional editorial design*, not broken images.
- Pass `service` from `Work.tsx`'s `PLACEHOLDERS.map` into the tile so it can do the lookup.

### 5. About section — "On the boards" green plate

**File**: `src/components/About.tsx` lines 78–86

**What's happening**: the editorial `MediaSlot` queries `shot_type:[interior,process,detail] + min_quality:portfolio`. We have 24 process+portfolio rows, plenty of supply — but the `interior` shot type has zero rows, and `detail+portfolio` has only 1. The query *should* hit the 24 process shots. If it doesn't (RLS / pagination order), the fallback is again green with bronze-glow.

**Fix**:
- Loosen to `min_quality:"reference"` — that opens 44 process shots + 11 detail. Effectively guarantees a photo.
- If the query still misses (network race), replace the green fallback with a **diagonally-cropped stone+cedar wash card** that contains the *literal brand-promise text* as art — turns the photo absence into a typographic moment instead of a flat-green hole. The right column already has the brand-promise; the left should be either a photo *or* a typographic eyebrow card ("Crew owned from Calgary" set in DM Serif Display, italic, with a cedar hairline). Either path: zero green plates.

### 6. `Contact.tsx` (homepage section) — green Brand-Promise card *(intentional, but isolated)*

**File**: `src/components/About.tsx` lines 91–108

This one I *don't* propose changing. The deep evergreen "Brand promise" plate with the white serif quote is a deliberate dark-on-light editorial moment — the only intentionally dark card in the page rhythm. It's grain-textured and has a cedar borderleft, so it already reads as designed, not as a missing image. **Leave it alone — it's a designed dark surface, not a fallback.**

### 7. `EditorialBleedSection` — `bg-evergreen/5` wash

**File**: `src/components/media/EditorialBleedSection.tsx` line 59

**What's happening**: the section's outer wrapper is `bg-evergreen/5`. This is barely visible (5% green tint) and gives a sub-aural background while the photo loads. *Fine on most pages*, but on the homepage it sits between the trust strip and Services, where it briefly shows during image load. With `hideIfEmpty=true` (default) the section renders nothing when no media matches, so the green wash is only visible during the LQIP fade.

**Fix**: change `bg-evergreen/5` to `bg-stone-50` (warm cream-tinted neutral). The temperature shifts from cold to warm without losing the section delineation.

### 8. `AmbientVideoBleed` and `FieldClipsStrip` — `bg-evergreen` posters

**Files**: `src/components/media/AmbientVideoBleed.tsx` line 97, `src/components/media/FieldClipsStrip.tsx` line 73

**What's happening**: video tiles render a green plate before the video frame loads. With **zero approved videos** in the library, `FieldClipsStrip` returns `null` early so users don't see this — but `AmbientVideoBleed` doesn't, and any future ambient bleed would flash green.

**Fix**: change both base backgrounds to `bg-stone-200 grain-overlay` so any future video has a warm poster instead of a cold green frame. Cost: one className change × 2 files.

### 9. `GlobalMenu` editorial photo — hard-coded green

**File**: `src/components/navigation/GlobalMenu.tsx` lines 273–283

**What's happening**: when the menu's `useFirstApprovedMedia({ kind:"image", min_quality:"portfolio", shot_type:["hero","elevation","wide"] })` misses (and it currently does because the gate is too tight), the right column paints `<div className="absolute inset-0 bg-evergreen" />`. The whole point of the right column is the editorial photograph. Green-when-empty defeats the design.

**Fix**:
- Loosen the menu's photo query to `min_quality:"reference"` — we have 65+ matching shots.
- Cycle: instead of one fixed photo, request `useApprovedMedia({ ..., limit: 6 })` and rotate through them on a 4-second crossfade (respect `prefers-reduced-motion` — if reduced, just pick one randomly per session). Adds quiet life to the menu without being theatrical.
- Replace the `bg-evergreen` fallback (line 282) with a **stone-grain panel + the literal type "Field photography updates each season — request a quote and we'll send you our latest project deck"** as a *content* fallback. Turns the missing photo into a soft conversion prompt.

---

## C. Two-line architectural change so this doesn't regress

Right now every component invents its own fallback styling and its own quality gate. That's why we have nine variations of "flat green plate" — each one was a separate decision. To make sure this stays fixed:

1. **Add `EvergreenPlate` → `EditorialPlate` rename + variants in `src/lib/colors.ts`.**  
   Replace `BACKDROP.evergreenPlate` (line 110–112) with **three** intentional plate gradients:
   - `BACKDROP.stonePlate` — warm cream stone, the new default fallback for *light cards* (Portfolio, Services, ProjectTile).
   - `BACKDROP.cedarPlate` — soft cedar→stone wash for hero-card fallbacks (About left column).
   - `BACKDROP.evergreenPlate` — kept for *deliberate* dark editorial surfaces (About brand-promise card only). Add a JSDoc warning: *"Use only as a deliberate dark surface, never as a 'missing photo' fallback."*

2. **Centralize the fallback in `MediaSlot`.**  
   Add an optional `fallbackVariant: "stone" | "cedar" | "evergreen"` prop to `MediaSlot`. When supplied, MediaSlot renders the right plate from the new BACKDROP set + an optional centered icon + optional caption text — so callers don't have to hand-roll the fallback `<div>` every time. Keeps the system honest.

---

## D. Image-quality gate policy (write it down once, kill the bug forever)

Add to `mem://design/aesthetic-direction.md`:

> **Gate policy**: Hero positions request `min_quality:"reference"` (we vignette + Ken Burns to upgrade any photo into a hero). Card positions request `min_quality:"reference"`. Bleed dividers between sections request `min_quality:"portfolio"`. Hero-tier (`min_quality:"hero"`) is reserved for: the homepage above-the-fold split-photo, and the `/services` triptych — surfaces where the photo is the entire content and any compromise shows.

This single policy keeps every future page from redoing the green-plate dance.

---

## E. Files I'll touch (concrete change list)

| File | Change |
|---|---|
| `src/lib/colors.ts` | Add `BACKDROP.stonePlate` + `BACKDROP.cedarPlate`, JSDoc warning on `evergreenPlate` |
| `src/components/media/MediaSlot.tsx` | Add `fallbackVariant` + `fallbackIcon` + `fallbackCaption` props |
| `src/components/ui/page-hero.tsx` | Loosen CinematicBleed query to `reference`; replace green fallback (line 417) with stone+grain editorial plate |
| `src/components/Portfolio.tsx` | Replace `evergreenPlate` base with stone; drop `shot_type` constraint to broaden hits |
| `src/components/Services.tsx` | Replace `evergreenPlate` fallback with stone; loosen quality to `reference`; add corner ribbon for empty services |
| `src/components/ui/project-tile.tsx` | Make tile photo-aware via internal `useFirstApprovedMedia({ service })`; stone fallback |
| `src/pages/Work.tsx` | Pass `service` to ProjectTile so the photo lookup works |
| `src/components/About.tsx` | Loosen MediaSlot query to `reference`; replace green plate fallback with cedar-wash typographic card |
| `src/components/media/EditorialBleedSection.tsx` | `bg-evergreen/5` → `bg-stone-50` |
| `src/components/media/AmbientVideoBleed.tsx` | `bg-evergreen` → stone+grain poster |
| `src/components/media/FieldClipsStrip.tsx` | Tile background `bg-evergreen` → stone+grain |
| `src/components/navigation/GlobalMenu.tsx` | Loosen photo query to `reference`; rotate among 6 photos with 4s crossfade; replace `bg-evergreen` fallback with stone+typographic content |
| `mem://design/aesthetic-direction.md` | Document the gate policy + the "no green-as-fallback" rule |

---

## F. Out of scope (intentionally)

- The `/contact` standalone page hero, `/about` page hero, footer, QuoteModal sidebar — those are **deliberately** dark-evergreen surfaces (chrome, modals, footers). They're not photo positions; they're brand surfaces. Leaving them.
- Generating or uploading new photography — the library already has 65+ portfolio-grade photos. The fix is to *let them through the gate*, not to ask for more.
- Video work — zero approved videos, so `FieldClipsStrip` is dormant; the fix is the styling, not the content pipeline.

---

## Outcome

After this pass:
- Every card on Home, Services, Work shows a real photograph (not a green plate) for any service with library coverage.
- Every fallback for services without coverage reads as **intentional warm-stone editorial design**, not a missing-image hole.
- The `/work` hero never paints green — even on a cold cache it shows stone + grain + bronze hairline + a quiet caption.
- The Global Menu becomes a small editorial gallery instead of a green box.
- A documented gate policy + a centralized `MediaSlot` fallback prevent the next contributor from re-introducing flat green anywhere.
