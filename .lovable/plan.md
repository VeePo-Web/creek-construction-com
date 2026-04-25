
# Photography System + Batch 01: Riverbend Studio Shed

You've told me there will be ~200 photos coming in batches of 10. So the first job isn't to embed 2 photos — it's to lay down the **architecture** that all 200 will flow through. Then drop these two in cleanly as the first proof.

Both uploaded frames are the **same project**: a backyard studio-shed with a distinctive curved cantilever roofline, OSB-sheathed walls mid-build, behind a cedar privacy fence. One frame is the front elevation (door framed in, ladder leaning); the other is a low-angle hero showing the curved roof against the sky. Single project, two angles.

---

## Part 1 — The architecture (built once, reused for all 200 photos)

### 1.1 A single source of truth: `src/data/projects.ts`

A typed registry of every project. One entry per build. Each entry holds metadata + an ordered list of photos. This is the only file that changes when new batches arrive — no component edits, ever.

```ts
export interface ProjectPhoto {
  src: string;              // import('@/assets/projects/...')
  alt: string;              // SEO + a11y, no front-facing caption
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

export interface Project {
  slug: string;             // 'riverbend-studio-shed'
  title: string;            // 'Riverbend Studio Shed'
  service: 'sheds' | 'decks' | 'fencing' | 'painting' | 'siding' | 'pergolas';
  location: string;         // 'Edmonton'
  year: number;
  status: 'in-progress' | 'complete';
  summary: string;          // one editorial sentence, used for OG/meta only
  hero: ProjectPhoto;       // the lead frame
  photos: ProjectPhoto[];   // includes hero + all others, in display order
  featured: boolean;        // surfaces on the homepage Portfolio strip
}

export const PROJECTS: Project[] = [ /* ... */ ];
```

**Why this matters:** When Batch 02 arrives — say, 10 photos across 3 different projects — I add three entries (or extend an existing one), drop the imports in, and the Work page, homepage Portfolio, and any future project-detail route automatically pick them up. Zero component churn across 200 photos.

### 1.2 File naming convention (locked in now)

All project photos live in `src/assets/projects/{slug}/` and are named:

```
{slug}-{NN}-{shot-type}.{ext}
```

- `slug`: kebab-case project ID
- `NN`: two-digit sequence within the project (01, 02, ... 12)
- `shot-type`: one of `hero`, `elevation`, `detail`, `interior`, `process`, `wide`, `aerial`

Example for this batch:
- `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-01-hero.jpg`
- `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-02-elevation.jpg`

This gives you sortable filenames, predictable URLs, and human-scannable diffs forever.

### 1.3 Format conversion at import time

Both uploads are PNG (~2–4 MB each). For 200 photos, PNG is unacceptable — that's nearly a gigabyte of payload. Each incoming photo gets converted to **JPEG q82** (or WebP where it wins decisively) using `nix run nixpkgs#imagemagick` during the embed step. Target: every photo ≤ 350 KB, hero shots ≤ 500 KB. The original PNGs are discarded after conversion (you have them in chat history if ever needed).

### 1.4 Reusable component: `<ProjectGallery />`

A new component, `src/components/ProjectGallery.tsx`, that takes a `Project` and renders an editorial photo grid. Reuses the existing `<ProgressiveImage />` (so we get the cedar-shimmer blur-up, vignettes, lazy loading already battle-tested in your codebase). Layout rules:

- **1 photo:** full-bleed editorial frame, 16:9 or native aspect, capped at `max-h-[80vh]`
- **2 photos:** asymmetric — hero takes 60% width / portrait companion 40%, or stacked on mobile
- **3 photos:** rule-of-thirds grid with one dominant + two supporting
- **4–6 photos:** masonry-lite (CSS columns) preserving native aspect ratios
- **7+ photos:** masonry + a "more" fade — but at that point we route to a dedicated project page (deferred until needed)

**No front-facing captions on photos.** Per your instruction. The image speaks. Project metadata (title, location, year) sits *outside* the gallery in a thin editorial header, never overlaid on the image.

### 1.5 Per-image SEO that actually works

Every `<img>` gets:
- A descriptive `alt` (geographic + structural, never marketing fluff): *"Cedar-roofed backyard studio shed mid-construction in Edmonton, showing curved cantilever roofline and OSB sheathing."*
- Explicit `width` / `height` attributes (no CLS)
- `loading="lazy"` except the hero of the first project (`fetchPriority="high"`)
- A `sizes` hint matching the layout slot
- The hero image is referenced in the page-level JSON-LD as the project's `image`

Plus, on the Work page, we extend `JsonLd` with an `ItemList` of `CreativeWork` nodes — one per project — each with `image`, `name`, `locationCreated`, `dateCreated`. Google reads this for image-pack indexing. This is how 200 photos become 200 indexed search results instead of 200 silent megabytes.

### 1.6 Performance budget enforced from photo #1

- `content-visibility: auto` on every gallery section (already standard in your codebase)
- Native `loading="lazy"` everywhere below the fold
- No carousels, no lightboxes, no JS-heavy galleries — just images that load when scrolled to
- `<ProgressiveImage>` already handles blur-up + reduced-motion fallback

If 200 photos still feels heavy at scale, the next escalation is a `responsive-images` Vite plugin that emits `srcset` variants — but we don't need that for batch 01–05. Decide at batch 06.

---

## Part 2 — Batch 01: Riverbend Studio Shed

### 2.1 Project entry

```ts
{
  slug: 'riverbend-studio-shed',
  title: 'Riverbend Studio Shed',
  service: 'sheds',
  location: 'Edmonton',
  year: 2025,
  status: 'in-progress',
  summary: 'A backyard studio shed with a curved cantilever roofline, framed and sheathed on a tight urban lot.',
  hero: { /* 02-elevation, the dramatic upward angle */ },
  photos: [hero, elevation],
  featured: true,
}
```

I'm naming it **"Riverbend Studio Shed"** as a working title — it reads editorial, it's regionally evocative for Edmonton, and it doesn't lock you to a specific neighbourhood you may not want to disclose. Tell me if you want it renamed (e.g. to a real neighbourhood like *Westmount*, *Bonnie Doon*, *Ritchie*) and I'll swap it in.

### 2.2 File operations

1. `code--copy user-uploads://IMG_6341.PNG /tmp/p1-hero.png` (the dramatic low-angle — becomes the hero)
2. `code--copy user-uploads://IMG_6340.PNG /tmp/p1-elevation.png` (the front elevation)
3. Convert both via ImageMagick:
   - `q82` JPEG, max 2000px on the long edge, strip EXIF (privacy)
   - Output: `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-01-hero.jpg` and `...02-elevation.jpg`
4. Delete `/tmp/*.png` scratch files

### 2.3 Where they appear

- **Homepage `Portfolio.tsx`:** the icon-only placeholder card for "sheds" gets replaced by the real hero frame. The other two cards (decks, fencing) stay icon-placeholders until those batches arrive — but the *visual contract* is now established: one real photo proves the system works, the rest fall in as you upload.
- **`/work` page:** the "Backyard Workshop" entry is replaced by Riverbend Studio Shed. It uses the new `<ProjectGallery>` rendering both photos in the asymmetric 2-photo layout. The other 5 entries keep their icon placeholders awaiting future batches.

### 2.4 The bleed (subtle, editorial)

You mentioned cross-project bleeds like `@project:bae409ab-...:"B & P Saunas"` — those work in Lovable's chat-link syntax inside markdown content, but on a published marketing site they don't auto-resolve to anything visitors can click. So a literal bleed isn't useful here.

What I'll do instead, in the spirit of "clean, editorial, minimal" cross-pollination: a single line of small-caps text under the Work page intro that reads:

> *Sister studios: B & P Saunas · Hickory & Rose*

…rendered as a thin centered footnote in `text-[11px] tracking-[0.2em] uppercase text-foreground/30`. No links, no logos, no flash — just a quiet acknowledgement that Creek operates in a family of brands. If you'd rather have actual outbound links to public-facing URLs for those projects, give me the URLs and I'll wire them as low-key text links with a hairline cedar underline on hover.

### 2.5 Cleanup

The legacy `project-1.jpg`, `project-2.jpg`, `project-3.jpg`, `portfolio-acreage.jpg`, `portfolio-backyard.jpg`, `portfolio-mountain.jpg` in `src/assets/` aren't referenced (I checked — `rg` returned nothing). I'll delete them in this batch since the new `src/assets/projects/` structure supersedes them. ~6 stale assets removed = cleaner repo, smaller LFS footprint as the photo library grows.

---

## Part 3 — The plan for batches 02 through ~20

For every future batch of 10 photos, the workflow is:
1. **You** upload 10 images + tell me which project(s) they belong to (or I'll group by visual inspection if it's obvious — same building, same lot, same season)
2. **I** create or extend the project entries in `src/data/projects.ts`, convert + name the files per the convention above, and the gallery component automatically renders them
3. No component code is touched after Part 1 ships. Period.

When a project crosses 6+ photos, I'll proactively spin up a dedicated route at `/work/{slug}` so it doesn't drown the index. That's a Batch 04-ish concern, not now.

---

## What I won't do this round

- No lightbox / modal photo viewer (you said "no flash, just integrity")
- No image filters, no duotones, no overlays beyond the existing subtle vignette — your photos carry their own weight
- No front-facing captions on individual images
- No carousel — they're banned by the no-flash brief
- No literal `@project:` bleed syntax on the published site — it doesn't render outside Lovable chat. The "Sister studios" footnote replaces it cleanly.

## Files that will be created or edited

**Created:**
- `src/data/projects.ts` — the registry
- `src/components/ProjectGallery.tsx` — the editorial gallery
- `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-01-hero.jpg`
- `src/assets/projects/riverbend-studio-shed/riverbend-studio-shed-02-elevation.jpg`

**Edited:**
- `src/components/Portfolio.tsx` — sheds card uses real hero
- `src/pages/Work.tsx` — Riverbend entry renders via `<ProjectGallery>`, "Sister studios" footnote added
- `src/components/JsonLd.tsx` — `ItemList` of project `CreativeWork` nodes for image SEO
- `mem://design/logo-asset-map.md` → renamed/expanded to `mem://design/asset-map.md` to also cover the projects/ directory convention

**Deleted:**
- 6 unreferenced stale photo placeholders in `src/assets/`
