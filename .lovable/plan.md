# Plan — Auto-classify every pending image and surface them on the live site

## Current state (verified)
- **113 pending assets** in `media_metadata`, all parked in the `uncategorized/` storage folder.
- 1 of those is a `.mov` (will be auto-skipped — vision models only handle images).
- So **~112 images** to classify, approve where strong enough, cluster into projects, and LQIP-backfill.
- The existing `classify-media` edge function is **admin-only** and requires a user JWT (can't be triggered headlessly from the sandbox with a service key).
- The auto-approve / project-cluster / LQIP-backfill flow currently lives only inside the React `Classify.tsx` page — meaning a human must sit on that tab and watch ~112 sequential AI calls finish (≈ 8–12 min) without closing the browser.

## What "world-class" looks like here
A single button press on `/admin/classify` fires one server-side orchestrator that:
1. Pulls every `pending` row.
2. Classifies images in batches against the existing AI gateway (Gemini vision via `LOVABLE_API_KEY`).
3. Auto-approves anything scoring **hero/portfolio quality + real service tag + ≥12-char alt text**.
4. Moves approved files from `uncategorized/` into the right service or project folder.
5. Clusters: any `project_guess` with ≥3 approved photos becomes a row in `projects` (featured, with the strongest hero shot).
6. Fires LQIP + width/height backfill for the freshly approved set.
7. Returns a structured summary the UI can toast.

The browser tab can be closed mid-run — the work continues server-side. This matches how Fantasy / Work&Co structure long-running content jobs.

## Implementation

### 1. New edge function — `auto-classify-batch`
- File: `supabase/functions/auto-classify-batch/index.ts`
- Verify admin via `has_role(auth.uid(),'admin')` (same pattern as existing `classify-media`).
- Body: `{ limit?: number, dryRun?: boolean }` — default `limit=200`, `dryRun=false`.
- Logic:
  - Query `media_metadata` for `ai_review_status='pending'` storage paths (skip videos via regex).
  - Loop in batches of 8 paths, calling Lovable AI Gateway (`google/gemini-2.5-flash` for cost/speed) with the same JSON-tool schema used in `classify-media/index.ts` (extract: `service, shot_type, subject, alt, project_guess, quality, season, notes`).
  - For each result:
    - Always upsert classification → `ai_review_status='suggested'`.
    - If `quality ∈ {hero,portfolio} && service !== 'other' && len(alt) ≥ 12` → push to `approveQueue`.
  - For the approve queue, sequentially:
    - Compute target folder = `project_guess || service`.
    - If different from current folder, call `storage.move()` to relocate the object; capture the new path.
    - Upsert `media_metadata` with `ai_review_status='approved'`, `project_slug` set when present, and the new `storage_path`.
  - Cluster pass: group approved items by `project_slug`; for each slug with ≥3 photos and no existing `projects` row, insert one (`featured=true`, `display_order=50`, hero pick = `quality:hero AND shot_type:hero`, then fallbacks).
  - LQIP pass: chunk approved paths by 30 and call the existing `backfill-lqip` function (with the original auth header forwarded) — keeps the LQIP work isolated and retry-safe.
  - Return `{ success, processed, approved, projectsCreated, backfilled, errors[] }`.
- Throttle: 250 ms between AI calls inside a batch + 1 s between batches to stay under the 60 RPM Lovable AI gateway limit; surface 429/402 errors back to the client.
- `supabase/config.toml`: add `[functions.auto-classify-batch]` with `verify_jwt = true`.

### 2. Wire it into `/admin/classify`
- Add a third button next to "Classify with AI" + "Classify + Auto-Approve":
  - **"Auto-classify everything (server-side)"** — primary cedar CTA.
  - On click: call the new function via `supabase.functions.invoke('auto-classify-batch', { body: { limit: 500 } })`.
  - Show a `Sonner` "Working in the background…" toast with the request ID; on resolve, show the structured summary toast (e.g. *"Classified 112 · Auto-approved 47 · Seeded 3 new projects · LQIP for 47"*).
  - On error (429 / 402 / 500), surface the message in a destructive toast.
- After completion, call existing `loadAssets()` to refresh the grid.

### 3. Verify on the live site
After the run completes:
- `/` Homepage `<Hero>` will pick the strongest `min_quality:hero, shot_type:hero` image (auto).
- Portfolio strip + `HomeProjectRecapStrip` will populate from the deduped approved set.
- `/work` will show any newly-clustered projects.
- `/services` service tiles will pull representative shots per service.
- I will eyeball each surface in the preview after the run and flag anything that looks off (e.g., a "decks" tag accidentally landing on a fence shot) for the user to manually re-categorize via the existing detail drawer.

## What this does NOT change
- No schema migrations needed — `media_metadata`, `projects`, and storage RLS are already in place.
- No client-side images are imported. The site already reads from approved cloud media via `useApprovedMedia` / `MediaSlot`.
- No existing component is touched besides `Classify.tsx` (one new button + invoke wiring).

## Risks & mitigations
- **AI rate limit (429)**: 1 s inter-batch delay + per-call throttle. Function returns partial progress so a re-run picks up the remainder.
- **AI credit exhaustion (402)**: Function exits cleanly with `{ success:false, error:'credits exhausted' }`; UI shows a red toast directing to Workspace → Usage.
- **Misclassification**: Auto-approve gate is conservative (must be hero/portfolio quality AND have a real service AND a meaningful alt). Anything weaker stays as `suggested` for human review on the same page.
- **Edge function timeout**: With ~112 images at ~3 s each (incl. throttle), worst case is ~6 min — well under the Supabase 150 s synchronous limit per call. **So the function will internally chunk and self-invoke**: it processes up to 25 images per invocation, then if more pending remain, it calls itself recursively (fire-and-forget) and returns immediately with `more_pending: true`. Client polls `media_metadata` count every 5 s until zero.

## Success criteria
- 0 rows in `media_metadata` with `ai_review_status='pending'` (after run completes; the lone `.mov` will be marked `pending` with note "video skipped").
- ≥30 rows now `approved`, surfacing photos on Hero / Portfolio / FeaturedProjects.
- ≥1 new row in `projects` (the cluster threshold is conservative; if AI doesn't cluster confidently we'll review manually rather than over-seed).
- Console + toast confirm counts.
