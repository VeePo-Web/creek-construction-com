# Plan — Use every image and video on the live site

## Current state (audited just now)

| Bucket | Count |
|---|---|
| pending (all images, no videos left) | 61 |
| suggested (classified but not approved — mostly `quality:reference` or service `other`) | 37 |
| approved | 14 |
| rejected — silently skipped videos | 7 |
| Projects rows seeded | **0** |

Why nothing is on the live site yet:
1. **Videos were treated as garbage.** The orchestrator marks every `.mov/.mp4` as `rejected` with `ai_notes: 'video — auto-classifier skipped'`. The user explicitly wants videos used.
2. **Projects table is empty.** `FeaturedProjects` requires ≥3 featured projects to render. The clustering rule needs ≥3 photos sharing a `project_guess`, but the AI invented a unique slug for almost every photo (`edmonton-shed-build`, `calgary-osb-shed`, `urban-shed-build`, `urban_shed_calgary`, …) so no cluster reaches 3.
3. **37 suggested rows are stranded.** They have valid `service` + alt text but `quality:reference` or `service:other`, which the strict gate rejects. They're publishable as portfolio fill, just not as heroes.
4. **The remaining 61 pending images haven't been touched** — the orchestrator likely halted on a 429 from the AI gateway and the recursion didn't restart.

---

## Step 1 — Teach the orchestrator to ingest videos *(supabase/functions/auto-classify-batch/index.ts)*

Today: any `.mov|.mp4|.webm|.m4v` is marked `rejected` and never seen again. Replace that branch with a real video pipeline:

- **Probe a still frame.** Use the existing public URL + the `?t=2` time-fragment hint (Supabase Storage serves the first frame for many `.mov`s, but unreliable). Fallback: synthesize a poster client-side later. For classification, we hand the AI gateway the *poster* (when the file already has one in `poster_path`) or skip vision and infer from filename/folder.
- **Vision-free heuristic for videos.** Set:
  - `service` = best guess from sibling photos taken within ±10 min (using `created_at`), else `other`.
  - `shot_type = "process"` (every Creek video on file is a build-progress clip).
  - `ai_quality = "portfolio"` so it's eligible for ambient bleeds.
  - `alt = "Project build process clip from {service} job in Calgary or Edmonton, Alberta."` (12+ words, geographic, no marketing).
  - `ai_review_status = 'suggested'` (humans still confirm before going live, but it's no longer dead).
- **Convert .mov → .mp4 path hint.** Browsers can't autoplay `.mov` reliably outside Safari. Add a `mime_warning` ai_note flagging the seven `.mov` files so the admin UI can show "needs transcode" without breaking the gallery.
- **Move videos out of `uncategorized/`** into `video-process/` so the gallery selector finds them.

Deliverable: `processed_videos` count returned in the API response.

---

## Step 2 — Smarter project clustering *(same Edge Function)*

Today: a project row is created only when a `project_guess` slug appears 3+ times. Almost no slug repeats, so clustering never fires.

Replace the strict ≥3 rule with a **two-pass hierarchical merge**:

1. **Normalize slugs** — lowercase, replace `_` with `-`, strip dupes (`urban-shed-build` and `urban_shed_calgary` collapse to `urban-shed-calgary`).
2. **Sibling-pair merge** — group by `(service, taken_at_bucket=±15min)` and merge any singletons into the closest cluster. So a lone "calgary-osb-shed" photo joins the active "edmonton-shed-build" cluster if they were shot the same afternoon.
3. **Lower the project threshold to ≥2 photos** when service is `sheds`/`fencing`/`decks` (we've only got ~50 shots total — waiting for 3 is unrealistic). Hero project still needs ≥3.
4. **Fallback service-bucket projects.** If after merging we still have <3 projects, auto-seed three "service portfolios" (`portfolio-decks-2025`, `portfolio-sheds-2025`, `portfolio-fencing-2025`) using the best approved hero per service. These guarantee `FeaturedProjects` always renders.

Deliverable: ≥3 rows in `projects`, each with `featured=true` and a real `hero_path`.

---

## Step 3 — Loosen the auto-approve gate, then promote stranded "suggested" rows

The 37 suggested images all have valid alt text + a service tag — they're just `quality:reference`. Reference shots are perfect for the secondary `Portfolio` strip and `HomeProjectRecapStrip`, just not for the homepage hero.

- Add a **second tier**: any `suggested` row with `service ∈ {decks, fencing, sheds, painting, siding, pergolas}` and alt ≥12 chars gets auto-promoted to `approved` with `ai_quality:'reference'` preserved (so the existing `min_quality:'hero'` queries still skip them, but the unfiltered service galleries pick them up).
- Tighten the public-media query layer (`src/lib/api/public-media.ts`) so `min_quality:'reference'` (or omitted) returns *everything*, while `min_quality:'hero'` stays restrictive. Audit the call sites to confirm: `Hero.tsx` and `EditorialBleedSection` already gate on `min_quality:'hero'` ✓.
- Keep `service:'other'` rows as `suggested` — those need human eyes.

Deliverable: ~50 approved photos, distributed across services.

---

## Step 4 — Wire the `Portfolio.tsx` strip to pull live media

`Portfolio.tsx` currently renders hard-coded service tiles. Refactor it to use `<MediaStrip>` keyed off `service`, so the freshly-approved `reference` shots actually appear:

```tsx
<MediaStrip
  query={{ service: 'sheds', limit: 4 }}
  count={4}
  renderItem={(m) => <EditorialPicture src={m.url} alt={m.alt} ... />}
  fallback={() => <ServicePlaceholder service="sheds" />}
/>
```

One strip per active service. Keep the placeholder for empty services.

---

## Step 5 — Add an ambient video bleed to the homepage

`AmbientVideoBleed` exists and `MediaSlot variant="bleed"` already routes videos through it. Add one bleed between `<About>` and `<Testimonials>` on `Index.tsx`:

```tsx
<EditorialBleedSection
  query={{ kind: 'video', min_quality: 'portfolio' }}
  asVideo
  aspect="cinema"
  hideIfEmpty
/>
```

`hideIfEmpty` means: if no video is approved yet, the section silently disappears — no broken layout. Once Step 1 promotes the 7 `.mov` clips to `suggested → approved`, the bleed lights up automatically.

---

## Step 6 — Restart the orchestrator and drain the 61 pending images

Re-invoke `auto-classify-batch` with `limit:500`. With the loosened gate (Step 3) and video pipeline (Step 1), the result should be:

- 61 pending images → ~50 approved + ~11 suggested (true rejects: blurry / debris)
- 7 `.mov` videos → 7 suggested with portfolio quality
- 37 stranded suggested → ~30 promoted to approved

End-state target: **~95 approved assets, ≥6 projects rows, every homepage section populated with real photography, plus one ambient video bleed.**

---

## Step 7 — Verification (non-destructive, in default mode)

- `psql` count check: `approved ≥ 90`, `projects ≥ 6`, `pending = 0`.
- Browser screenshot of `/` at 1440px and 390px confirms: hero photo loads, FeaturedProjects renders 6 cards, Portfolio strips show real shots, video bleed plays.
- Browser screenshot of `/work` confirms project galleries fan out per service.
- Re-run `tsc --noEmit` to make sure the `MediaStrip` refactor compiles.

---

## Files touched

- `supabase/functions/auto-classify-batch/index.ts` — video pipeline + smarter clustering + tier-2 approval (rewrite of ~120 lines)
- `src/lib/api/public-media.ts` — formalize `min_quality` tiers (small edit)
- `src/components/Portfolio.tsx` — swap hard-coded tiles for `<MediaStrip>` (rewrite ~80 lines)
- `src/pages/Index.tsx` — insert one `EditorialBleedSection` for video (3 lines)

No schema changes, no new tables. All work is incremental on top of v6.