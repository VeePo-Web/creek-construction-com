# Editorial Media System — Playbook

This is the contract for every photograph and video on Creek Construction. Read this once before adding new media.

## How to add new media to the site

1. **Upload** raw photos/videos to `/admin/media`. Drag-drop, hundreds at a time.
2. **Classify** — go to `/admin/classify`, hit "Classify all unclassified". Vision AI tags each photo with service, shot type, alt text, quality, and a project guess (~$0.005/photo).
3. **Review & Approve** — for each AI-suggested photo, confirm or edit the metadata, set a `project_slug` if multiple shots are from the same site, then click Approve.
4. **Done** — approved photos appear automatically on the right pages of the live site. No code changes needed.

The live site reads from `media_metadata` where `ai_review_status='approved'`. RLS allows public read on that subset only.

## Where each photo will appear (by metadata)

| If the AI classifies a photo as... | It appears on... |
|---|---|
| `service: decks`, `shot_type: hero` | Homepage FeaturedProjects strip (decks card), `/work` decks galleries |
| `service: sheds`, `shot_type: hero` + `project_slug: riverbend-studio-shed` | Riverbend project gallery on `/work` |
| Any approved video, `quality: portfolio`+ | Homepage hero ambient bleed |
| `shot_type: process` | About page process section, between-section bleeds |

## The Ten Image Laws

1. No image without `alt` text.
2. No image without `width`/`height` (prevents layout shift).
3. AVIF + WebP + JPG fallback (auto when process-media ships).
4. LQIP blur-up always — no spinners, no flashes.
5. Above-the-fold hero gets `fetchpriority="high"` + `loading="eager"`. One per page.
6. Below-the-fold uses `loading="lazy"` + `decoding="async"`.
7. Responsive `sizes` mandatory.
8. Aspect ratio locked via CSS `aspect-ratio`.
9. No text overlaid on photo unless the photo has a deliberate negative-space zone.
10. `prefers-reduced-motion` disables Ken Burns, parallax, and video autoplay.

## The Five Video Laws

1. Always `muted`, `playsinline`, `autoplay`, `loop` for ambient — never with sound.
2. Always a poster image as fallback.
3. MP4 (H.264) + WebM (VP9) — Safari needs MP4, Chrome prefers WebM.
4. Max 2.5 MB per ambient loop.
5. Never more than one playing video per viewport (IntersectionObserver pauses off-screen).

## Components

- `<EditorialPicture src alt width height lqip />` — the atomic image. Use directly when you have a known asset.
- `<AmbientVideoBleed src poster />` — silent looping bleed. Use for section dividers.
- `<MediaSlot query={{...}} fallback={...} />` — pulls from approved cloud media. Pages should use this, never hardcoded imports.
- `<MediaStrip query count renderItem fallback />` — render N items from a query.
- `<ProvenanceCaption numeral location year subject />` — editorial line under any media block.

## When to break the rules

You don't.
