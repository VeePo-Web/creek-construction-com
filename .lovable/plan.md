
# Editorial Saturation Plan — Filling the Site with Real Photography & Video

## The honest diagnosis

I just queried the database. Here's what's actually happening right now:

| Status | Count |
|---|---|
| `pending` (no AI metadata, no `service`, no `shot_type`) | **113** |
| `suggested` (classified, awaiting your review) | 0 |
| `approved` (publicly visible to the site) | **0** |
| Rows in `projects` table | **0** |

The infrastructure I shipped last loop is excellent — `<MediaSlot>`, `<EditorialPicture>`, `<AmbientVideoBleed>`, the quality-weighted query layer — but it's all **starving for data**. Every `<MediaSlot>` on the live site is silently falling back to its placeholder because there are zero approved photos to pull. That's why the site doesn't *look* filled with your photography even though the pipes are connected.

There are also only **two** `<MediaSlot>` instances wired right now (Hero video bleed + Portfolio service cards). A truly "filled" editorial site needs **20–30 slots** distributed across Home, Services, Work, About, and per-project pages — sequenced like a magazine, not sprinkled like a Pinterest board.

This plan fixes both problems in one pass.

---

## The three-filter test for every decision below

1. **Elevate the human experience** — A visitor on a phone in Cochrane should *feel* the craft before they read a single word. Photos must load instantly (LQIP blur-up, no spinners), respect `prefers-reduced-motion`, and never break layout.
2. **Embody brand truth with excellence** — These are *your* projects, not stock. Every image must carry a provenance line, fit a deliberate aspect ratio, and live inside the cedar+evergreen system. No exceptions, no "good enough."
3. **Innovate responsibly for impact** — Each photo must serve a job: prove credibility, anchor a service, build trust, or convert. We measure the result (LCP, CLS, scroll depth, quote-form starts), not the prettiness alone.

---

## Phase 1 — Run the classifier & auto-seed projects (foundation)

**Why first:** Without approved metadata, every other phase is invisible. This unblocks the entire site.

### 1.1 Run the AI classifier on all 113 files
- I'll add a one-shot trigger so I can kick off `classifyMany()` programmatically (current flow requires you to be on `/admin/classify` and click a button). I'll add a "**Classify & auto-approve high-confidence**" button to that page that:
  - Runs the Gemini classifier on all `pending` files (~$0.55 total at $0.005/photo).
  - Auto-approves anything the AI scores `quality: portfolio` or `hero` *and* assigns a `service` *and* an alt text — these are safe.
  - Leaves `quality: reference`, anything missing fields, and all `.MOV` videos in **`suggested`** state for your manual review (a much smaller pile, maybe 15–25 items).
- This means in ~3 minutes you go from 0 approved → ~80–95 approved, with a focused review queue for the rest.

### 1.2 Detect & cluster project groups automatically
- The classifier already returns `project_guess`. I'll add a **clustering pass** that groups consecutive `IMG_xxxx` filenames sharing a `project_guess` into a candidate project, then upserts a row in the `projects` table with `featured: true` if the group has ≥3 photos including a `hero` shot.
- Result: 4–8 real projects appear in `/work` automatically, named (e.g.) "Bridgeland Cedar Deck", "Sherwood Park Privacy Fence" — you rename inline if desired.

### 1.3 Promote per-project hero
- For each project, the highest-quality `shot_type: hero` photo becomes `projects.hero_path`.
- The single best video clip per project (if any) becomes `projects.video_path` for the per-project page bleed.

### 1.4 Bridge to public site
- Already wired in `Classify.tsx`'s `handleApprove` — verified during audit. Approving a photo with a `project_slug` upserts a `projects` row. Phase 1.2's auto-cluster uses the same path, so nothing custom is needed.

---

## Phase 2 — The Editorial Slot Map (where photos go)

This is the actual *design plan* for media distribution. Every slot has a job, an aspect ratio, a query, and a fallback. No photo appears "just because we have one."

### 2.1 Home (`/`) — the storytelling spine
Sequenced as a thermal crescendo: cool gradient → first photo → quiet copy → richer photo → CTA.

| # | Section | Slot | Aspect | Query | Fallback |
|---|---|---|---|---|---|
| 1 | Hero (existing) | Right-side ambient video bleed | Free (right 55%) | `kind: video, min_quality: portfolio` | Pure evergreen gradient (current) |
| 2 | **NEW between Hero & Services** | Full-bleed photo divider w/ provenance caption | 21:9 | `shot_type: wide \| hero, min_quality: hero` | Skip (return null) |
| 3 | Services (existing block) | **NEW** small photo chip per service card (decks/fencing/painting) | 4:3 | `service: <s>, shot_type: detail \| elevation` | Lucide icon (current) |
| 4 | About preview (existing) | **NEW** portrait-oriented "process" photo to the right of the copy | 3:4 | `shot_type: process` | Cedar gradient panel |
| 5 | Testimonials (existing) | **NEW** quiet desaturated background bleed | 16:9 cover | `shot_type: texture \| process` | Current grain texture |
| 6 | Portfolio (existing 3-card) | Real photo per card (already wired) | 4:5 | per-service hero | Icon plate (current) |
| 7 | **NEW between Portfolio & Contact** | "Project recap" 4-up strip pulled from any 4 hero shots | 1:1 each | `shot_type: hero, min_quality: hero, limit: 4` | Skip section entirely |
| 8 | Contact (existing) | **NEW** subtle texture bleed in the right column | 4:5 | `shot_type: texture` | Current evergreen panel |

That's **5 new image slots + 1 new strip + 1 enhanced video** on the home page alone. Every one degrades gracefully.

### 2.2 Services (`/services`) — proof per discipline
Currently zero photos. Becomes a portfolio-first page.

- **Hero**: keep the evergreen gradient hero, but add an **ambient bleed at the bottom** that fades into the first service block — pulls a `wide` shot of any service.
- **Per-service section** (we'll restructure the SERVICES list rendering): each service gets a **2-column block** — copy on the left, a 3:4 portrait photo on the right pulled by `service: <s>, shot_type: hero`. If only smaller shots exist, fall back to a **3-thumbnail strip** (`detail` shots). If nothing exists, fall back to the current accordion-only view.
- **Between sections**: 21:9 cinematic divider every 2 services (`<ImageDivider>` style) using `texture` or `process` shots — gives the page breathing rhythm.
- **FAQ section**: precede with a quiet `21:9` desaturated bleed. Optional — only renders if a portfolio-grade photo is approved.

That adds **6 service-block photos + 2–3 dividers** = ~9 new slots on `/services`.

### 2.3 Work (`/work`) — the gallery
Currently shows hardcoded `PROJECTS` from `src/data/projects.ts` (which is empty of new entries) plus icon placeholders. Rebuild around the DB:

- **Replace `PROJECTS` import with `useProjects({ featured: true })`** — pulls live from the new auto-seeded projects.
- For each project: render a **`<ProjectGallery>`** sourced from `useApprovedMedia({ project_slug, limit: 12 })`, sorted hero → wide → elevation → detail → process. The component already adapts beautifully to 1/2/3/4+ photos.
- **Between projects**: a 21:9 **video bleed** if the project has one, otherwise a `texture` photo divider with the project's location stamped over it.
- **Below real projects**: keep the icon placeholder grid for service categories with zero photos yet — but reduce its visual weight (smaller, monochrome) so it doesn't compete.
- **Sticky project nav** on desktop (left rail): jump to each project, fades in after scrolling past the hero.

### 2.4 About (`/about`) — humanize the crew
Currently zero photography. Becomes the most personal page.

- **Hero**: replace the gradient with a **wide `process` shot** if any are approved (hands working, framing, sawdust) — `shot_type: process, min_quality: portfolio`. Falls back to current evergreen gradient.
- **"Who we are" section**: 2-column with a `process` portrait on the left.
- **"The Process" 5-step list**: each step gets a **small square photo** (1:1, 80×80 → 200×200 responsive) — pull `process` shots, fall back to a numbered cedar circle (current).
- **Stats row**: precede with a 21:9 wide shot — site-with-finished-deck establishes scale.
- **CTA section**: small `texture` strip behind the CTA for warmth.

That's ~7 new slots on `/about`.

### 2.5 NEW per-project pages (`/work/:slug`)
Each auto-seeded project gets a deep-link-shareable case study:
- Editorial hero: full-bleed hero photo (or video bleed if `video_path` exists), title overlay.
- Body: location, year, service chips, summary, and a `<ProjectGallery>` with all photos for that slug (typically 6–15 shots from one job).
- Below gallery: "Want one like this?" CTA → opens quote modal pre-filled with the matching service.
- Footer breadcrumb back to `/work`.

This unlocks SEO long-tail (e.g. "Calgary cedar deck builder Bridgeland") and gives you shareable URLs.

---

## Phase 3 — Format Rules (the contract every photo must obey)

These get codified into an updated `MEDIA_PLAYBOOK.md` and enforced by the components themselves (warnings in dev, fallbacks in prod).

### 3.1 The Image Laws (extends existing 10)
Adding 6 new ones specific to this saturation pass:

11. **Aspect ratio is sacred.** Every slot has a fixed aspect ratio set on the *wrapper*, never the image. iPhone screenshots get auto-cropped via `object-cover` — never letterboxed.
12. **Max 1 hero/page.** Only one image per page may have `priority={true}`. The above-the-fold image. Everything else lazy-loads.
13. **Provenance always.** Every standalone photo block (not strips, not chips) gets a `<ProvenanceCaption>` underneath: `"01 · Calgary NW · Summer 2026 · Cedar deck"`. Hover-revealed at 60% opacity.
14. **No more than 1 active video per viewport.** Already enforced by `IntersectionObserver` in `<AmbientVideoBleed>`.
15. **Min spacing rule.** Two media blocks must be separated by at least one copy block, or by an intentional divider. Never two photos touching.
16. **Caption opacity ladder.** Image captions use cedar/60 → cedar/40 → cedar/20 in the thermal-crescendo pattern across a sequence of 3+ photos.

### 3.2 The Video Laws (existing 5 stand)
No changes — they're correct. We'll just *use* them more.

### 3.3 Aspect-ratio token system
Add to `tailwind.config.ts`:
```
aspectRatio: {
  'hero': '16 / 9',     // page heroes
  'bleed': '21 / 9',    // dividers between sections
  'editorial': '4 / 5', // portfolio cards (current)
  'portrait': '3 / 4',  // about/services side photos
  'square': '1 / 1',    // strips & process steps
  'detail': '4 / 3',    // service-card chips
}
```
Now every slot uses semantic tokens, not magic numbers.

### 3.4 Sizes-attribute presets
Add to `src/lib/media-sizes.ts` — eight named presets so we never hand-write `sizes` strings again. (`HERO`, `BLEED_FULL`, `CARD_THIRD`, `CARD_HALF`, `STRIP_QUARTER`, `CHIP`, `PORTRAIT_HALF`, `THUMB`.) This is what world-class agencies do — design tokens for image delivery hints.

---

## Phase 4 — Performance & SEO hardening

### 4.1 LQIP backfill on approve
When you approve a photo in `/admin/classify`, the edge function will fetch the image, generate a 16×16 base64 LQIP, store dimensions, and write both into `media_metadata.lqip` + `width` + `height`. Means **zero CLS** and **instant blur-up** site-wide. Currently those fields are null, which is why the blur step is being skipped.

### 4.2 Image sitemap
New edge function `image-sitemap` returns an `image-sitemap.xml` listing every approved photo with caption + project context. Linked from `robots.txt` so Google indexes the photography for image search.

### 4.3 Per-project OG cards
Edge function `og-image` generates a 1200×630 social card per project at request time, composing the hero photo + project title + Creek logo. Wired into `<JsonLd>` and `<meta property="og:image">` for `/work/:slug` routes.

### 4.4 Preload the LCP
On Home, when the new full-bleed photo divider (slot #2) is identified as the LCP candidate, inject `<link rel="preload" as="image">` in the document head with the right responsive `imagesrcset`. Drops LCP by 200–500ms.

### 4.5 Save-Data + reduced-motion compliance
Already enforced for video. Extend to images: when `Save-Data: on`, swap full photos for LQIP-only renders on below-fold slots. Worldclass agencies (especially in regions with patchy mobile data) do this.

### 4.6 Analytics events
Lightweight `data-media-slot="home/hero-bleed"` attributes on every `<MediaSlot>`. Easy to wire to GA4 / Plausible later for which photos drive scroll depth.

---

## Phase 5 — The motion & interaction layer

Restraint, not razzle-dazzle. Three rules:

1. **Photos drift, never bounce.** A 1.5% scale on hover over 700ms with `cubic-bezier(0.25, 0.1, 0.25, 1)`. Already in `EditorialPicture`'s `cedarHover`. Default ON for portfolio cards & project galleries; OFF for ambient bleeds (which already have video motion).
2. **Captions reveal on intent.** Provenance captions translate up 8px + fade 0→100% on hover/focus. Tab-key reachable for accessibility.
3. **Section transitions use the photos as anchors.** When a photo bleed enters viewport, the *next* copy block triggers its `<ScrollRevealMotion>` with a 200ms delay — chaining the eye downward.

All of the above respects `prefers-reduced-motion: reduce` (skips animation entirely, photos render at final state).

---

## Phase 6 — What I'll build, in order, when you approve

Each step is independently shippable so you'll see progress every few minutes.

1. **Auto-approve + auto-cluster trigger** in `/admin/classify` (Phase 1.1 + 1.2). Run it. Verify ~80 approved photos appear.
2. **LQIP + dimension extraction** edge function, retrofit to all approved rows (Phase 4.1).
3. **Aspect-ratio tokens + sizes presets** (Phase 3.3 + 3.4). One file each.
4. **Home page — 7 new slots** (Phase 2.1).
5. **Services page rebuild — 9 new slots** (Phase 2.2).
6. **About page — 7 new slots** (Phase 2.4).
7. **Work page rebuild around live `projects` table** (Phase 2.3).
8. **Per-project case-study route `/work/:slug`** (Phase 2.5).
9. **`MEDIA_PLAYBOOK.md` v2** with the new laws codified (Phase 3.1).
10. **Image sitemap + per-project OG cards + LCP preload** (Phase 4.2–4.4).
11. **QA pass**: Lighthouse run on each page, verify LCP < 2.0s, CLS < 0.05, accessibility = 100, all photos have alt text.

---

## What I will NOT do (boundaries from the persona prompt)

- ❌ Use any stock photo. Every image is yours, classified and approved.
- ❌ Auto-publish anything the AI flagged `quality: reject` or with empty alt text. Those go to manual review only.
- ❌ Add motion that triggers without `prefers-reduced-motion` respected.
- ❌ Cram every photo onto every page — restraint > saturation. If we have only 5 great deck photos, decks gets 5 slots, not 15. Better to leave a slot empty than fill it with a `reference`-quality shot.
- ❌ Touch the Supabase reserved schemas, `client.ts`, `types.ts`, or `.env`.
- ❌ Add dark patterns (false scarcity counters, urgency timers, etc.) — explicitly forbidden in the brief.

---

## One judgment call I want your blessing on

The auto-approver in Phase 1.1 will publish ~80 photos to your live site without you eyeballing each one first. The AI is good but not perfect — there's a small risk one or two ship with awkward alt text or a wrong service tag.

**Two ways to handle it:**

- **A — Auto-publish high-confidence, you fix in flight** (recommended): Site fills up in 3 minutes. You scan the live `/work` page after, click anything wrong → drops you into the editor. Fast.
- **B — All 113 stay in `suggested` state, you click-approve each** (safer): Takes you ~20 minutes of clicking, but nothing ships unreviewed.

I'll default to **A** unless you say otherwise when you approve this plan. (You can still reject any individual photo from the editor afterward — it'll be unpublished within seconds.)
