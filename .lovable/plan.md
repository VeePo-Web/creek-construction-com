# Batch 02 — Riverbend Studio Shed, Interior Threshold

One photo this round (the others were too large by your message — that's fine, I batched what you sent). It's the **same project** as Batch 01: same OSB-sheathed walls, same curved cantilever roofline visible at the top, same cedar privacy fence in the background. This is a portrait-orientation shot taken straight-on through the framed doorway, with the table saw, drill, and screw bins on the threshold.

## Why this single photo matters more than its count suggests

Batch 01 was two **exterior** angles. This is the **first interior frame** in the entire project — it changes the gallery story from *"two angles of a building"* into *"a build you can step into."* That's the difference between a brochure and a documentary. A future client doesn't just see the shed; they see the workshop *making* the shed.

It also activates the **3-photo gallery layout** I built in Batch 01 (`<ProjectGallery>` count===3 branch): one dominant frame + two supporting on a 2/3 + 1/3 + 1/3 grid. We've never rendered that layout on the live site — Batch 02 lights it up.

## Photo audit

- **Source:** `user-uploads://IMG_6339.PNG`, ~1170×2530 portrait, iPhone screenshot with thick black letterbox bars top and bottom (visible in preview)
- **Subject:** Edmonton backyard studio shed, framed doorway centered, interior visible (table saw on stand, drill, screw bins, sunlight raking across OSB studs), curved roof eave at the top, cedar fence right
- **Shot type:** `interior` (the existing convention covers it)
- **Sequence number:** `03` (continues 01-hero, 02-elevation)

## File operations

1. `code--copy user-uploads://IMG_6339.PNG /tmp/p2-interior.png`
2. ImageMagick conversion — same recipe as Batch 01, no exceptions:
   ```
   convert /tmp/p2-interior.png \
     -fuzz 5% -trim +repage \                     # strip iPhone letterbox
     -resize '2000x2000>' \                       # cap long edge
     -strip \                                     # remove EXIF (privacy — addresses leak via GPS)
     -interlace Plane -sampling-factor 4:2:0 \    # progressive JPEG, standard chroma
     -quality 82 \                                # quality budget
     src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-03-interior.jpg
   ```
3. `identify` to log final dimensions (needed for the registry's `width`/`height` to prevent CLS)
4. `rm /tmp/p2-interior.png` cleanup
5. **Target file size:** ≤350 KB. Likely lands ~150–200 KB given Batch 01 came in at 168–174 KB at similar source resolution.

## Registry update — the only file edited

`src/data/projects.ts` gets exactly two changes:

1. New import alongside the existing two:
   ```ts
   import riverbendInterior from "@/assets/projects/riverbend-studio-shed/riverbend-studio-shed-03-interior.jpg";
   ```
2. Append a third entry to the `photos` array of the existing Riverbend project:
   ```ts
   {
     src: riverbendInterior,
     alt: "Interior view through the framed doorway of an Edmonton backyard studio shed mid-construction, showing OSB stud walls, a table saw on its stand, and tools on the plywood threshold.",
     width: <from identify>,
     height: <from identify>,
     shotType: "interior",
   }
   ```

That's it. **Zero component edits.** `Portfolio.tsx`, `Work.tsx`, `ProjectGallery.tsx`, `JsonLd.tsx` all consume the registry and update automatically. This is the entire point of the architecture I shipped in Batch 01 — Batch 02 proves it works.

## What the user will see after this ships

- **Homepage Portfolio:** unchanged — that card uses `project.hero` (still the 01-hero shot), so the "sheds" tile stays the curved-roofline exterior. Correct behaviour: the homepage is a teaser, not a gallery.
- **`/work` page Featured Project section:** the 60/40 two-photo layout switches to the **three-photo dominant + two layout**. The hero (curved roof) becomes the dominant 2/3-width frame on the left, with the elevation and the new interior shot stacked in the right column. On mobile, all three stack vertically at native aspect.
- **JSON-LD:** the `CreativeWork` node for Riverbend automatically picks up a third entry in its `image` array — three URLs Google can index instead of two.
- **Performance:** dominant frame keeps `priority` for LCP; both supporting frames lazy-load. CSS containment + `content-visibility: auto` on the section already handle render budget.

## Mixed orientation handling — a worth-noting design moment

Batch 01 was two landscape 4:3 shots. This new frame is portrait (~1:2-ish after trim). The `<ProjectGallery>` component uses native `aspectRatio` from the registry's `width`/`height` for every figure — so when it lands in the 1/3-width supporting slot, it'll render tall and narrow, while the 2/3-width landscape hero anchors the composition. **That asymmetry is editorial, not a bug** — it's what magazine spreads do. No code change needed; the layout already respects native proportions, which is exactly why I built it that way in Batch 01.

If after seeing it live you'd rather force-uniform aspect (e.g., crop everything to 4:5), say the word and I'll add an `aspect` override to the `ProjectPhoto` interface. But my recommendation is to let mixed orientations breathe — Fantasy.co and Pentagram both lean into this on case-study pages.

## Alt text rationale (SEO + a11y, no front-facing caption)

> *"Interior view through the framed doorway of an Edmonton backyard studio shed mid-construction, showing OSB stud walls, a table saw on its stand, and tools on the plywood threshold."*

- **Geographic anchor:** "Edmonton" — feeds Local SEO image-pack
- **Structural detail:** "framed doorway… OSB stud walls… plywood threshold" — searchable construction terminology
- **Tool inventory:** "table saw… tools" — implicit signal of active craftsmanship without marketing fluff
- **No marketing language:** no "stunning," "beautiful," "premium" — those words belong in copy, never in alt text

This brings Riverbend to **3 indexed image URLs** in the JSON-LD `ItemList` after this batch.

## QA after ship

1. Verify file size is ≤350 KB (visual confirmation in `ls -la`)
2. `bunx tsc --noEmit` — clean build
3. Spot-check the rendered `/work` page in screen-replay terms: dominant landscape frame on the left, two supporting frames (one landscape, one portrait) stacked right; on mobile all three stack
4. Confirm the JSON-LD `image` array now has 3 entries for Riverbend (visible in page source)

## Files touched

**Edited (1):**
- `src/data/projects.ts` — new import + one new entry in `photos` array

**Created (1):**
- `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-03-interior.jpg` — converted, EXIF-stripped, q82, ≤350 KB

**Untouched (the proof of architecture):**
- `src/components/ProjectGallery.tsx`
- `src/components/Portfolio.tsx`
- `src/pages/Work.tsx`
- `src/components/JsonLd.tsx`

## Forward look — what to watch for in Batch 03+

When you reach **6+ photos on Riverbend**, I'll proactively spin up a dedicated `/work/riverbend-studio-shed` route with a long-form editorial layout (full case-study treatment — hero takeover, sequenced narrative, before/after pairings, materials callout). That's the Batch 04-or-05 trigger; not yet.

When you reach **a second photographed project** (decks, fencing, painting, etc.), the homepage Portfolio's icon-placeholder cards swap to real heroes automatically — same `getProjectsByService()` selector that lit up the sheds card in Batch 01.

When a single batch contains photos from **multiple projects**, just tell me which photo belongs to which project and I'll group accordingly. If it's obvious from visual inspection (same building, lot, season), I'll group on my own and confirm before converting.