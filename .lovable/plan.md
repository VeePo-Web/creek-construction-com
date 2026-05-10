# Pass 50 — Forensic audit: zero project descriptions, anywhere

## Audit results

I traced every surface that could render project metadata (titles, locations, years, summaries, captions). Here is the complete picture.

### ✅ Live render surfaces — already clean

| Surface | Renders | Verdict |
|---|---|---|
| `/work` (`src/pages/Work.tsx`) | `<GalleryWall>` — pure `<img>` grid, only `alt` text, no `<figcaption>`, no overlay | Image-only ✅ |
| `/` homepage (`src/pages/Index.tsx`) | `<HomeGalleryStrip>` — 3-up `<img>`, only `alt` text, no captions | Image-only ✅ |
| `/services` | Service rows only, no project references | Clean ✅ |
| `PageHero` cinematic-bleed (Work hero) | Supports optional `caption={service, location, year}` prop, but **no page passes it** (`rg "caption=\{" src/pages/` returns zero hits) | Inert ✅ |
| `ProjectsJsonLd` (in `src/components/JsonLd.tsx`) | Exported but **not mounted in App.tsx, index.html, or any page** | Inert ✅ |

### ⚠️ Dead code that still contains project descriptions

These files are orphaned (no live import path mounts them) but the metadata still lives in the repo, which is a forensic risk — a future agent could re-introduce them, or a stray import could light them up. The user's instruction is "make sure this is the case on ALL THINGS," so we scrub them.

| File | Risk |
|---|---|
| `src/data/projects.ts` | Defines `Project` type with `title`, `location`, `year`, `summary`, `status`, plus the full **Riverbend Studio Shed** entry with marketing copy ("A backyard studio shed with a curved cantilever roofline…") |
| `src/components/FeaturedProjects.tsx` | Renders titles, locations, summaries from `PROJECTS` |
| `src/components/ProjectGallery.tsx` | Renders project metadata grid |
| `src/components/media/HomeProjectRecapStrip.tsx` | Imports `PROJECTS` for a recap strip |
| `src/components/JsonLd.tsx` — `ProjectsJsonLd` export | Emits `name` + `description` from `PROJECTS` into structured data |

### ✅ What is allowed to remain

- **`alt` attributes** on `<img>` elements in `src/config/gallery.ts` ("Modern Alberta home with cedar siding…", etc.). These are accessibility text for screen readers and SEO crawlers — they are never rendered visibly. Per WCAG, removing them would break the site for blind users. Leaving as-is.
- **Region/locale text** unrelated to projects ("Calgary · Edmonton · Alberta" in Hero, Footer, About). This is service-area copy, not project descriptions.

## Changes

### 1. Delete dead project artifacts

- `rm src/components/FeaturedProjects.tsx`
- `rm src/components/ProjectGallery.tsx`
- `rm src/components/media/HomeProjectRecapStrip.tsx`
- `rm src/data/projects.ts`
- `rm -r src/assets/projects/riverbend-studio-shed/` (only its three JPEGs are imported by `gallery.ts`; we'll re-source those)

### 2. Update `src/config/gallery.ts`

Three of the gallery images currently import from the `projects/riverbend-studio-shed/` folder we're deleting. Move those JPEGs to `src/assets/gallery/` with neutral filenames (`gallery-shed-01.jpg`, `gallery-shed-02.jpg`, `gallery-shed-03.jpg`) and update the imports. Strip the file's header comment reference to "no project metadata" → reword to "captionless gallery, alt text only" so the intent is unambiguous on its own.

### 3. Strip `ProjectsJsonLd` from `src/components/JsonLd.tsx`

Remove the `ProjectsJsonLd` export entirely and its `PROJECTS` import. Other JSON-LD exports in the file (Organization, LocalBusiness, etc.) stay untouched.

### 4. Strip dead reference in `src/components/ui/bronze-rule.tsx`

The doc comment mentions "FeaturedProjects" — change to "FeaturedWork" or remove that one word so a future grep for `FeaturedProjects` returns truly zero hits.

### 5. Strip the `caption` prop pathway in `PageHero` (optional, lower priority)

`PageHero` still accepts `caption={service, location, year}` and renders a provenance rail when passed. No page passes it today, so it's dormant. Leaving it in keeps the component flexible but means a future agent could enable it. **Recommendation: leave as-is** — removing it would touch ~80 lines across three hero variants for zero current visual change. Flag in commit message instead.

## Verification

After changes, these greps must all return zero hits in `src/`:

```bash
rg "PROJECTS\b" src/
rg "FeaturedProjects" src/
rg "HomeProjectRecapStrip" src/
rg "ProjectGallery" src/
rg "ProjectsJsonLd" src/
rg "Riverbend|cantilever|studio shed" src/
```

Then visit `/`, `/work`, `/services`, `/about`, `/contact` and confirm no titles, captions, locations, years, or summaries appear over or beside any image.
