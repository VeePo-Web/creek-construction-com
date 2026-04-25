# Plan: World-Class Photo & Video Distribution

## The situation

You have **113 raw assets** in `media-library/uncategorized/`:
- **106 iPhone screenshots** (`img_6215.png` → `img_6493.png`, etc.) — likely PNG-saved photos
- **7 .MOV videos** — silent ambient material

Zero metadata. Zero project assignment. Filenames are useless. We cannot place them editorially without first **knowing what's in each frame**. Two of those (6339–6341) already live in `Riverbend Studio Shed`.

So this plan is in **three acts**: (1) understand the assets, (2) prepare them for the web, (3) distribute them across the site with editorial restraint.

---

## ACT I — Classification & metadata (the unlock)

### 1. AI Vision Classifier (edge function `classify-media`)

Build one new edge function `supabase/functions/classify-media/index.ts`. Admin-only. For each asset:

1. Generate a small (1024px max edge) preview from the public URL.
2. POST it to **Lovable AI Gateway** (`google/gemini-2.5-pro` — the strongest at vision + nuance, worth the cost for one-time classification of 100+ shots).
3. Use **tool calling** (structured output, not free-text JSON) to extract:
   ```json
   {
     "service": "decks|fencing|sheds|painting|siding|pergolas|interiors|exterior|other",
     "shot_type": "hero|elevation|detail|interior|process|wide|aerial|texture",
     "subject": "1-line description (e.g. 'cedar privacy fence with horizontal slats, mid-build, framing visible')",
     "alt": "12-22 word geographic + structural alt text — never marketing copy",
     "project_guess": "kebab-case slug suggestion or null",
     "quality": "hero|portfolio|reference|reject  // rejects = blurry, accidental, screenshots-of-screenshots",
     "season": "summer|fall|winter|spring|unknown",
     "notes": "any caveat (e.g. 'duplicate of img_6234', 'wrong orientation')"
   }
   ```
4. Persist into `media_metadata` (already has the right columns).
5. Surface results in the existing `/admin/media` detail drawer with a “**AI suggestion**” chip you can accept-or-edit in one click.

### 2. Cluster into project groups

After classification, a small server-side step groups assets by `service` + `project_guess` + filename proximity (sequential `img_NNNN` numbers shot within minutes are almost certainly the same project). Each cluster becomes a candidate project — you confirm/rename before they go live.

### 3. New admin screen `/admin/classify`

A two-pane reviewer:
- **Left**: thumbnail grid of unclassified assets, multi-select.
- **Right**: AI suggestion card with editable fields + “Approve all in cluster” bulk action.
Once approved, the asset is **moved** from `uncategorized/` into `{service}/{project-slug}/` (the existing `move` op in `manage-media-library` already handles this).

### 4. Reject pile

`quality: 'reject'` shots stay in `uncategorized/_rejected/` for your review — never deleted automatically.

---

## ACT II — Asset preparation pipeline

### Images

Building a second edge function `process-media` that, **after classification**, does for each accepted image:

1. **Strip iPhone letterbox bars** (the black/white margins on `.PNG` screenshots).
2. **Re-encode**: PNG → JPEG (q82) for photos; keep PNG only for the few that need transparency.
3. **Generate three responsive variants** stored alongside the original in the bucket:
   - `…-2000.jpg` (full-bleed hero)
   - `…-1200.jpg` (gallery)
   - `…-640.jpg` (mobile / blurhash placeholder source)
4. **Create AVIF + WebP siblings** for next-gen formats (5–25 % smaller).
5. **Compute a tiny LQIP** (16×24 px JPEG, base64) and write it into `media_metadata.lqip` (new column) — this becomes the blur-up placeholder, replacing the current shimmer for cached, instant blur reveals.
6. **Strip EXIF** (privacy + a few KB savings).
7. **Persist `width` / `height`** into `media_metadata` so we never get layout shift.

### Videos (the 7 .MOV files)

Decision locked: **silent autoplay ambient bleeds.** Pipeline:

1. Probe with `ffprobe` to get duration, dimensions, and orientation.
2. **Trim to ≤ 8 seconds** (the editorial sweet spot — long enough to feel intentional, short enough that nobody waits for a “loop point”). I'll pick the most cinematic 8-second window using a simple motion-content heuristic (skip first 0.5s for handshake jitter).
3. **Drop audio entirely** (`-an`).
4. **Encode three sources**:
   - `.mp4` H.264, `crf 22`, `tune film`, `faststart` — universal.
   - `.webm` VP9, `crf 32` — smaller for Chromium/Firefox.
   - **`.jpg` poster frame** at the visually richest moment (use ffmpeg `-vf "thumbnail"`).
5. **Cap at 1080p edge**; downscale anything taller. Target ≤ 2.5 MB per file.
6. **Loop seamlessly**: re-encode with a 0.4s crossfade tail-to-head when the source doesn't loop cleanly.

### New components introduced

| Component | Purpose |
|---|---|
| `<AmbientVideoBleed />` | Full-bleed silent video. Renders `<video muted autoplay loop playsinline preload="metadata" poster=…>` only when (a) `prefers-reduced-motion` is not set, (b) `navigator.connection.saveData` is false, (c) the section enters the viewport (IntersectionObserver). Falls back to the poster frame as a still image otherwise. WCAG-safe, mobile-data-respectful. |
| `<EditorialPicture />` | A `<picture>` with AVIF → WebP → JPEG sources, srcset for the 3 sizes, sizes hint, LQIP background, `decoding="async"`, optional `fetchPriority="high"` for above-the-fold. Replaces the current `<ProgressiveImage>` for cloud-hosted assets. |
| `<MediaCDN />` helper | Resolves `media://{path}` references to the right Supabase public URL + variant. Decouples markup from storage layout — if we ever migrate to a real CDN (Cloudflare, Bunny), only this resolver changes. |
| `useCloudMedia(filter)` hook | Reads from `media_metadata` via a typed selector, returns memoized lists for any (service, project, shot-type) combo. This is what every page uses — never hard-coded asset imports for cloud media. |

---

## ACT III — Editorial distribution (where each photo *actually* goes)

Below is the page-by-page plan. Every placement is intentional; nothing is decoration. Captions are **never** rendered front-facing per your standing rule — they live only in `alt` and JSON-LD.

### `/` (Home)

| Slot | Treatment | Source |
|---|---|---|
| **Hero** | Stays photo-free. Adds **one ambient `<AmbientVideoBleed />`** as a low-opacity (12 %) right-side bleed behind the headline — preferably a slow pan of cedar grain or a blade through wood. Reinforces craft without competing with type. | First eligible video tagged `texture` or `process` |
| **Services strip** | Each of the 6 service cards gets a **subtle background photo** at 14 % opacity revealed on hover (50 % opacity, 600 ms cedar warmth). Already-discovered photos pulled by `service`. | `useCloudMedia({ service, shot_type: 'detail' \|\| 'hero', limit: 1 })` |
| **About teaser** (existing) | Add a **2-up asymmetric photo pair** between the existing copy block and the stats row — one wide environmental shot + one tight detail. Sets the “we work outdoors in Alberta” tone before stats. | Best two `quality: 'hero'` shots not used elsewhere |
| **Portfolio strip** | Already wired to `getProjectsByService('sheds')`. Once Aspen Fence / Bridgeland Deck etc. are confirmed projects, they auto-light-up. No code change. | Existing |
| **Footer pre-bleed** | A new full-width **`<AmbientVideoBleed />`** above the footer — 280 px tall, pure visual signature. The “end credits” shot. | Best video tagged `wide` |

### `/services`

The services page is currently text-heavy and photo-empty. New treatment:

1. **Per-service inline gallery**: under each accordion service item, when expanded, render a **3-photo editorial strip** (one tall + two squares) using `<ProjectGallery>` in 3-photo mode. Photos pulled by `service`. No labels. Hover reveals a single line: *“Riverbend Studio Shed · Edmonton · 2025.”*
2. **Sticky sidebar “moodboard”** on desktop (≥ lg): a slow vertical scroll of 6 small thumbnails — one per service — that pulses a subtle cedar glow as you scroll the corresponding section. Replaces today’s blank right column.
3. **Hero**: keep evergreen gradient (per your constraint that subpage heros are gradient-based), but add **one looping ambient bleed** at 18 % opacity behind the page title.

### `/work`

Already the photo-densest page. Upgrades:

1. **Service filter chips** at the top: All · Decks · Fencing · Sheds · Painting · Siding · Pergolas. Filters the project list. (Nothing fancy — `useState` + a derived array.) Reads from `useCloudMedia` so it auto-populates as new projects come online.
2. **Each project gets**:
   - Existing `<ProjectGallery>` (1/2/3/masonry adaptive layout).
   - A new **silent `<AmbientVideoBleed />` divider** between projects — only when a video is tagged to that project. Otherwise, a typographic divider (the existing `<ImageDivider>`).
3. **Project hero shot** uses `fetchPriority="high"`, AVIF, and the LQIP for instant LCP.
4. **JSON-LD** (`ProjectsJsonLd`) is already wired — automatically picks up new projects.

### `/about`

1. **Hero image bleed**: the evergreen gradient stays, but a **right-anchored ambient video** (40 % width, 60 % opacity, masked into a soft-edged column) plays behind the headline. A working-hands type of clip if we have one. If not, an environmental wide shot as a still image.
2. **“Who We Are” section**: introduce a **single full-bleed editorial photo** between the intro copy and the process steps. Captionless. The hero project shot.
3. **“The Creek Process” steps**: each of the 5 steps gets a **tiny 64×64 thumbnail** to its left — a specific shot that visualizes that step (request = blueprint detail, build = framing, walkthrough = finished product). All pulled from cloud media tagged `process`.
4. **“Where We Work”**: keep the city pills. Add a **single panoramic photo** (Calgary or Edmonton skyline if any qualify, otherwise a wide rural shot) above the pills as a place-setting frame.

### `/contact`

Add **one ambient video bleed** as the page background at 8 % opacity — pure mood, never competing with the form. This is the final touchpoint before submission; we want it to feel like a place, not a form.

### Shared site-wide upgrades

1. **`<NarrativeBreadcrumb>`** — when a breadcrumb is on a project page, show a **6×6 px pulsing thumbnail dot** of the project's hero. Tiny, editorial, almost subliminal.
2. **OG / Twitter cards** — every project page now has an auto-generated OG image (use the project hero, 1200×630, with a thin cedar bottom bar containing the project name in DM Serif). One edge function: `og-image-generator`. SEO + social sharing win.
3. **Sitemap + image sitemap** — a generated `/sitemap.xml` and `/sitemap-images.xml` that lists every project image with its alt text. Critical for Google Image SEO.

---

## Performance budget (non-negotiable)

For every page touched, the following must hold after the upgrade:

| Metric | Target |
|---|---|
| LCP | ≤ 2.0 s on 4G (p75) |
| CLS | < 0.02 |
| Total photo bytes per route | ≤ 600 KB initial, lazy-load the rest |
| Total video bytes per route | ≤ 2.5 MB initial (one bleed only), defer rest until idle |
| INP | ≤ 200 ms |

Mechanisms used to hit these:
- AVIF/WebP fallback chain.
- Responsive `srcset` + `sizes`.
- `<AmbientVideoBleed>` only loads sources after IntersectionObserver fires *and* `requestIdleCallback`.
- LQIP base64 inline → no extra request.
- `content-visibility: auto` on every below-the-fold gallery section.
- Per-project page: a single `<link rel="preload" as="image" imagesrcset=…>` for the LCP hero.

---

## Accessibility

- Every `<img>` and `<video>` carries the AI-generated alt text (you'll review/edit in the classifier UI before approval).
- Videos have `aria-hidden="true"` when used purely as ambient texture (they're decoration; the content is the surrounding text). When a video carries narrative weight, it gets a `<track kind="descriptions">` and a poster image with meaningful alt.
- `prefers-reduced-motion` disables all ambient video — falls back to poster stills.
- `prefers-reduced-data` (where supported) does the same.
- Touch targets on the `/work` filter chips ≥ 44px (WCAG 2.5.8).

---

## Build order (what I'll do, in order, once you approve)

| # | Step | Touches |
|---|---|---|
| 1 | **DB migration**: add `media_metadata.lqip text`, `media_metadata.variants jsonb`, `media_metadata.ai_review_status text`, `projects` table (slug, title, service, status, year, summary, hero_path, video_path) — so projects become data, not code. | `supabase/migrations/` |
| 2 | **Edge function `classify-media`**: vision classification via Lovable AI. Tool-calling for structured output. | new |
| 3 | **Edge function `process-media`**: image variant generation, EXIF strip, LQIP, format conversion, video transcode + poster. | new |
| 4 | **Edge function `og-image-generator`**: per-project OG cards. | new |
| 5 | **Edge function `sitemap-xml`** + **`image-sitemap-xml`**. | new |
| 6 | **Admin `/admin/classify`**: review/approve UI. | new page |
| 7 | **Run the classifier** over all 113 assets. Estimated cost: ~$0.40 in Lovable AI credits. | one-time |
| 8 | **You spend ~15 minutes** approving / correcting in the classifier UI. | manual |
| 9 | **Run the processor** over approved assets. ~5 minutes server time. | one-time |
| 10 | **`<EditorialPicture>`**, **`<AmbientVideoBleed>`**, **`<MediaCDN>`**, **`useCloudMedia`** — the new primitives. | new components |
| 11 | **Wire Home, Services, Work, About, Contact** to use cloud media via `useCloudMedia`. Gradually replace placeholder icons. | edits to existing pages |
| 12 | **Lighthouse + WebPageTest** sweep on each route. Iterate until budgets are green. | QA |
| 13 | **Sitemaps** registered in `index.html` + Search Console payload. | small |

---

## What this gives you

- A **scalable** pipeline: drop 200 more raw photos into the cloud, hit “classify all”, approve in 20 minutes, and they auto-distribute to the right pages with proper alt text, sizes, OG cards, and sitemaps.
- **Captionless on the front, fully described in the metadata.** Image SEO wins without visual noise.
- **Performance unchanged or better** despite the photo density — AVIF + LQIP + lazy + bleed-only-on-visible.
- **Editorial restraint**: photos never crowd type, videos are silent texture, every placement earns its space. This is how Fantasy and Pentagram do it: the work is the marketing.
- **No more `lov-image-upload` / chat uploads** ever. Cloud-first, AI-assisted, you-in-control.

---

## One open question before I build

Do you want me to also **write a project page route** (`/work/[slug]`) so each project becomes a deep-link-shareable case study (Bridgeland Deck, Riverbend Studio Shed, etc.), or keep `/work` as a single scroll? I'd recommend per-project pages for SEO and shareability — they take ~30 minutes more — but it's your call. I'll default to **yes, build per-project pages** unless you say otherwise when you approve.