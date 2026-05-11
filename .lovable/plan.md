# Purge AI Imagery — Saunas + Unrealistic Renders

 **THE ONLY AI IMAGE YOU WILL KEEP IS ON THE HERO PAGE**** NONE ELSE. Forensic audit identified **27 AI-generated assets** in `src/assets/`:

**AI saunas** (all to delete):
`hero-sauna.jpg`, `hero-sauna-cinematic.jpg`, `hero-sauna-premium.jpg`, `hero-sauna-twilight.jpg`, `sauna-acreage.jpg`, `sauna-acreage-premium.jpg`, `sauna-backyard.jpg`, `sauna-backyard-hero.jpg`, `sauna-backyard-premium.jpg`, `sauna-interior.jpg`, `sauna-interior-detail.jpg`, `sauna-interior-editorial.jpg`, `sauna-interior-hero.jpg`, `sauna-interior-premium.jpg`, `sauna-mountain.jpg`, `sauna-mountain-hero.jpg`, `sauna-mountain-premium.jpg`, `sauna-stones-macro.jpg`, `sauna-stones-premium.jpg`, `sauna-stones-steam.jpg`, `sauna-winter-steam.jpg`

**Other unreal AI renders** (delete):
`hero-architect-color.jpg`, `hero-architecture.jpg`, `cedar-texture-premium.jpg`, `cedar-texture.jpg`, `404-steam-fog.jpg`, `blog-hero-loyly.jpg`, `blog-minimalist-living.jpg`, `blog-sauna-ritual.jpg`, `blog-sustainable-architecture.jpg`, `blog-urban-planning.jpg`

**Real photos kept**: `gallery/gallery-shed-01..03.jpg` + 104 approved photos in the media library (`media_metadata.ai_review_status = 'approved'`) reachable via `useApprovedMedia` / `MediaSlot`.

---

## Replacement strategy

Every visible reference must either pull from the **media library** (preferred — already wired through `useApprovedMedia`) or use one of the 3 real shed photos. No new AI assets, no placeholders.

### `src/components/Hero.tsx`

- Remove hardcoded `imageSrc={heroArchitectColor}` + `imageAlt`.
- PageHero `architect-bleed` already accepts a `query` prop and falls back to the media library — pass `query={{ shot_type: ["hero","elevation","wide"], min_quality: "reference", kind: "image" }}`.
- Drop the `inColor` flag if its only purpose was the AI render.

### `src/pages/Index.tsx`

- Delete both `<EditorialImageBreak>` (saunaBackyardPremium, saunaMountainPremium) and their imports.
- Homepage rhythm becomes: Hero → BrandStatement → Services → HomeGalleryStrip → CrewMoment → TestimonialStrip → Closer.
- HomeGalleryStrip already pulls real photos.

### `src/pages/About.tsx`

- Delete both `<EditorialImageBreak>` (saunaInteriorEditorial, saunaAcreagePremium) and their imports.
- Replace the story-section `<figure>` (currently `saunaBackyardPremium`) with a `<MediaSlot>` query for `{ shot_type: ["detail","elevation"], min_quality: "reference", kind: "image" }`. If no match, MediaSlot's stone fallback renders — no AI.

### `src/pages/Services.tsx`

- Delete both `<EditorialImageBreak>` (saunaStonesPremium, heroArchitecture) and their imports.
- Replace the responsibility-matrix `cedarTexturePremium` `<figure>` with a `<MediaSlot>` query for `{ shot_type: ["detail","process"], min_quality: "reference", kind: "image" }`.

### `src/pages/Contact.tsx`

- Delete the top photo band (saunaInteriorDetail) entirely. Contact stays form-first per Pass-52 conversion discipline.
- Drop the import.

### `src/config/gallery.ts`

- Drop every sauna/hero-architect/hero-architecture import + GALLERY entry.
- GALLERY becomes the 3 real shed photos + an injection from `useApprovedMedia` (kind:image, min_quality:reference) inside `GalleryWall`. Keep `HOMEPAGE_GALLERY` referencing only the 3 real shed indices.
- Audit `GalleryWall.tsx` to make sure it merges real shed assets + media-library query (already does for /work via PageHero, but the wall itself currently iterates GALLERY only — confirm and adapt).

### Asset files

- `rm` all 31 AI files listed above from `src/assets/` and `src/assets/blog/` if present.
- Vite build will fail loudly if any straggler import survives — that's the safety net.

### `src/index.css`

- The line `* It does NOT own dark mode, sauna-brand effects…` is a code comment — leave or rephrase to `legacy brand effects`. Cosmetic only.

---

## Verification

1. `rg -n "sauna|hero-architect|hero-architecture|cedar-texture-premium|blog-hero|blog-sauna|blog-minimal|blog-sustain|blog-urban|404-steam" src` returns **zero hits** in `src/pages`, `src/components`, `src/config`.
2. `ls src/assets` shows no `sauna-*`, no `hero-sauna-*`, no `hero-architect*`, no `hero-architecture*`, no `cedar-texture*`, no `blog-*`, no `404-steam*`.
3. Build passes (auto-run by harness).
4. Visual sweep at 1280×800 + 390×844 of `/`, `/about`, `/services`, `/contact`, `/work`, `/404` confirms every previously-AI slot now shows either a real shed photo, a media-library photo, or is removed.

---

## Technical notes

- `useApprovedMedia` is the canonical hook for real photography pulled from `media_metadata` where `ai_review_status='approved'`.
- `MediaSlot` is the drop-in primitive for a single approved photo with a stone fallback — exactly what AI `<img src=...>` calls should become.
- No design tokens change. No section heights change. Pure asset purge + slot rewiring.