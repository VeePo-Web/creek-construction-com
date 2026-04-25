# Creek Construction — Homepage Refinement Plan

## Read me first — what changed in scope

You asked for an "award-winning architect landing page" with a black/white palette and provided images. After we talked it through:

- **No rebrand.** Creek Construction stays. Same services (decks, fencing, sheds, painting, siding, pergolas), same Calgary/Edmonton/Alberta scope, same crew voice.
- **No black/white.** We keep the warm cedar (bronze) + deep evergreen + warm cream system that's already locked into the design memory.
- **Reference**: FlexServices.info — clean serif headline, hero photo card with a floating stat card, big trust numbers, professional crew imagery, calm conversion-first rhythm. We borrow the *clarity* and *photo-forwardness*, not the blue palette.
- **Images**: All 113 uploaded files are still `pending` in the database. Step 1 of this plan is running the existing auto-classifier — nothing on the live page can use real photos until that's done.

The current homepage is already strong (it has the Editorial Media System, slot-based image fetching, ambient bleeds, recap strip). This plan **refines and saturates** it to FlexServices polish, it doesn't rebuild from scratch.

---

## Phase 1 — Saturate the media library (prerequisite, ~3 min)

Without this, every photo slot on the page falls back to a gradient.

**1.1 Auto-classify all 113 pending files.**
Run the existing `classify-media` edge function via the `/admin/classify` "Classify & auto-approve" button on every pending row. The function (already deployed) uses Gemini vision to assign:
- `service` (decks / fencing / sheds / painting / siding / pergolas)
- `shot_type` (hero / wide / detail / process / portrait / before-after)
- `ai_quality` (hero / portfolio / supporting / context)
- `project_guess` (groups photos by build → seeds the `projects` table when ≥3 cluster)
- `alt` text + `lqip` placeholder + dimensions

High-confidence rows auto-promote to `approved` and physically move into `service/` or `project/` folders in storage. Anything ambiguous lands in `suggested` — visible in `/admin/classify`, one click to publish.

**1.2 Backfill LQIP + dimensions** for any approved-but-incomplete rows via the `backfill-lqip` edge function (also already deployed). Required so every `<EditorialPicture>` renders with zero CLS and a blur-up.

**1.3 Smoke test the data layer.**
Confirm `useApprovedMedia({ service: 'decks', shot_type: 'hero' })` returns at least one row before Phase 3 starts. If a service ends up with zero approved hero shots, log it — the slot will use the existing gradient fallback (still beautiful, just not ideal).

---

## Phase 2 — Design tokens (small, surgical)

We're not changing the palette. We're *extending* it for two new patterns FlexServices uses well.

**2.1 Add a "card surface" token** — for the floating stat card, project cards, and award chips that sit *over* photos. Off-white with a 1px hairline border and a soft shadow. Lives in `index.css` as:
```
--surface-card: 38 30% 99%;
--surface-card-border: 35 15% 88%;
--shadow-float: 0 16px 40px -12px hsl(150 20% 10% / 0.18);
```

**2.2 Add `aspect-photo-portrait`** (4/5) and `aspect-photo-card` (3/4) to `tailwind.config.ts` — both already nearly-there, just not registered semantically. Used by the new featured-projects grid.

**2.3 Add a "trust strip" rhythm class** — a thin band that sits between sections (cream → muted → cream) with an evergreen hairline. Replaces a couple of jarring gradient transitions on the current page.

No new colors. No black/white. No new fonts.

---

## Phase 3 — Section-by-section refinement

Each section is an *upgrade* of what exists, not a replacement. I'll keep section IDs (`section-hero`, `section-services`, etc.) so anchor links and the nav progress bar keep working.

### 3.1 Hero (`src/components/Hero.tsx`)

Today: evergreen gradient + radial glow + an ambient video slot in the right 55%. Type sits on the left.

**Upgrade**:
- Keep the evergreen background and the silent-video bleed (it works).
- **Replace the hard right-edge video crop with a FlexServices-style "photo card on the right"**: a rounded `aspect-[4/5]` card that holds the hero photo or video, with **a floating stat card overlapping its bottom-left corner** showing "07 Years on tools · 200+ Builds · Calgary + Edmonton". Card uses the new `--surface-card` token.
- The hero photo is pulled via `<MediaSlot query={{ shot_type: 'hero', min_quality: 'hero' }} priority />`. If no hero is approved yet, the existing evergreen gradient still fills the card.
- Tighten the headline: keep "Excellence in the Work." but drop the italic "Pride in every detail." sub-line into a smaller eyebrow position. Replace with a single sub-headline: "Decks, fencing, sheds, painting & siding — built to last across Alberta."
- CTA row stays (`Request a Quote` + `or call …`), but I'll add a **small trust row above the CTA**: three thin chips ("WCB covered · Fully insured · Locally owned") to mirror FlexServices' trust band.
- Mobile: stat card collapses to a single inline row beneath the photo. Photo height capped to 60vh on phones.

### 3.2 NEW — Awards / Trust strip

A slim full-width band immediately under the hero. **Not "awards" in the architect sense** — Creek doesn't have AIA awards. Instead:
- Section label: "TRUSTED ACROSS ALBERTA"
- Five-column row of small marks: `WCB Covered`, `Fully Insured`, `Google · 5.0★`, `Locally Owned`, `Free Estimates`. Each rendered as a typographic mark (lucide icon + label, monochrome cedar-on-cream), not a logo lockup we don't have rights to.
- Below the row: a horizontal `EditorialBleedSection` pulling a `wide` shot — just one strip, 21:9, with provenance caption ("Calgary · 2025 · Custom cedar deck"). This is the section break between hero and services.

Net new file: `src/components/TrustStrip.tsx`. Slots into `src/pages/Index.tsx` between `<Hero />` and the existing `<EditorialBleedSection>` (or replaces it — I'll keep one bleed, not two, to avoid stacking).

### 3.3 Services (`src/components/Services.tsx`)

Today: 6 service cards in a 3-column grid + "We handle / You handle" matrix.

**Upgrade**:
- Each service card gets a **small photo header** — a 16:9 strip at the top of the card, pulled via `<MediaSlot query={{ service: <id>, shot_type: ['hero','detail'] }} sizes={MEDIA_SIZES.CHIP} />`. If no photo is approved for that service, the icon-only treatment we have now stays as the fallback.
- Card hover: subtle Ken Burns scale (1.02) on the photo, cedar overlay at 8% (we already have the warmth principle in memory).
- Keep the "We handle / You handle" matrix but **shrink it** — it currently dominates the section. Tighter padding (p-8 → p-6), smaller heading scale, two columns merge to a single rhythm on tablet.
- Section label stays Roman numeral II per the existing SectionHeader pattern.

### 3.4 About (`src/components/About.tsx`)

Today: copy + brand promise quote on the left, 5-step process + 3 stat cards + CTA on the right.

**Upgrade**:
- **Add a portrait photo** above the brand-promise quote on the left — pulled via `<MediaSlot query={{ shot_type: 'portrait', min_quality: 'portfolio' }} />`. Aspect 3:4. Caption underneath in the existing minimal label style: the owner's name + "Founder · On every site". Falls back to the existing evergreen gradient block if no portrait is approved.
- The brand-promise quote slab stays — it's strong.
- Replace one of the three stat cards (currently "$0 quotes / 48h response / 2 metros") with a more emotional metric: "**507+ builds completed**" using `useCountUp`. Keep the other two.
- The 5-step process keeps the thermal-crescendo border opacity (locked in memory).

### 3.5 Testimonials (`src/components/Testimonials.tsx`)

Today: three placeholder testimonial cards with initials + 5-star rating + CTA.

**Upgrade**:
- Keep the three-card structure, but **add a "project photo thumbnail" to each card** — a small 1:1 image in the top-right corner of each card, pulled via `<MediaSlot query={{ service: <matching service> }} sizes={MEDIA_SIZES.THUMB} />`. Ties the testimonial back to a real build.
- The "trust strip" footer (5-star rating + CTA) stays.
- Copy stays placeholder until the user supplies real testimonials — I won't invent quotes.

### 3.6 NEW — Featured Projects gallery

This is the "featured projects" you asked for. Right now we have `<HomeProjectRecapStrip />` (4-up grid of hero photos) and a separate `<Portfolio />` with 3 service cards. They overlap.

**Resolution**:
- Keep `<Portfolio />` as the **service-anchored "Recent Work"** section (3 cards, one per primary service, click → quote modal pre-filled).
- Replace `<HomeProjectRecapStrip />` with a richer **`<FeaturedProjects />` section** that pulls the top 6 rows from the `projects` table where `featured = true`, rendered as an asymmetric 2-row layout:
  - Row 1: one large 60% card (hero project) + two stacked 40% cards.
  - Row 2: three equal cards.
- Each card: hero photo via `<EditorialPicture>`, project title (DM Serif Display), location + service tag, and a "View project" link that jumps to `/work#<slug>`. (Per-project routes are out of scope for this loop; the user deferred them.)
- If fewer than 6 featured projects exist after Phase 1 classification, the layout collapses gracefully (4-up, then 3-up, then hidden).

Net new file: `src/components/FeaturedProjects.tsx`. Slots into `src/pages/Index.tsx` after `<Portfolio />` and before `<Contact />`.

### 3.7 Contact (`src/components/Contact.tsx`)

Today: copy + tel/email links + service-area badges + "what to expect" card.

**Upgrade**:
- Wrap the section in an evergreen background (matches the hero) so the page closes the same way it opens — narrative bookends.
- Add a **photo to the right column** — a `<MediaSlot query={{ shot_type: 'wide' }} aspectRatio="4/3" />` showing crew on-site. Falls back to the existing layout if nothing approved.
- Service-area badges become hover-active chips with the cedar-tint principle from memory.

### 3.8 Footer (no change)

Already clean. Leave it alone.

---

## Phase 4 — Page-level orchestration

**`src/pages/Index.tsx`** ends up as:

```
<Navigation />
<Hero />
<TrustStrip />              ← new
<EditorialBleedSection />   ← keep, single instance
<Services />
<About />
<Testimonials />
<FeaturedProjects />        ← new (replaces HomeProjectRecapStrip)
<Portfolio />
<Contact />
<Footer />
```

Section spacing: standardize to `py-24 md:py-32` everywhere (some sections currently drift). Background alternation: `bg-background` → `bg-secondary` → `bg-background` → `bg-muted` → `bg-evergreen` (Contact). The trust strip and bleed sit *between* sections, not as their own padded section.

---

## Phase 5 — Performance & SEO discipline

Non-negotiables, applied across every change above:

- **Hero photo gets `priority`** and `fetchpriority="high"` (one per page, already enforced by `<EditorialPicture>`).
- Every other `<MediaSlot>` is lazy.
- Every photo passes a `MEDIA_SIZES.*` preset (no hand-written `sizes` strings).
- Section wrappers use `content-visibility: auto` + `contain-intrinsic-size` (already locked in memory; I'll audit each new section to confirm).
- All new images use `<EditorialPicture>` (LQIP + aspect-ratio lock = zero CLS).
- New `<TrustStrip>` and `<FeaturedProjects>` components get proper landmark roles + `aria-labelledby`.
- Update the `useDocumentTitle` description on `Index.tsx` to mention the trust signals ("WCB covered, locally owned, free estimates") for richer search snippets.
- `LocalBusinessJsonLd` already on the page — confirm it includes the new trust signals as `additionalProperty` entries.

---

## What I'm NOT doing in this loop (deferred)

- Per-project case study routes (`/work/[slug]`) — separate effort, ~30 min.
- Image sitemap / dynamic OG cards — both queued from earlier loops.
- ffmpeg.wasm video transcoder — `<AmbientVideoBleed>` handles raw `.MOV` directly for now.
- Inventing testimonial copy or owner bio — waiting on real content from you.

---

## Risks & honest tradeoffs

1. **Phase 1 auto-approve will publish high-confidence photos to the live site without your eyeballing each one.** That's how we agreed to handle it. If anything looks wrong post-launch, `/admin/classify` lets you reject in one click.
2. **If the AI classifier mis-tags a photo's `service`, the wrong photo will appear in the wrong service card.** Mitigation: each service card still works visually with the icon fallback, and you can fix tags in the admin.
3. **`<FeaturedProjects />` needs at least 3-4 featured projects to feel substantial.** If Phase 1 only seeds 1-2 projects, I'll downgrade the layout to a single-row 3-up grid automatically, and we plan a Phase 6 to seed manually.
4. **Hero stats ("07 Years · 200+ Builds") are placeholder until you confirm real numbers.** I'll mark them with a comment so they're easy to find and edit.

---

## Order of operations once approved

1. Trigger the auto-classifier on all 113 pending files. **(~3 min, runs in the background.)**
2. Add the new design tokens to `index.css` and `tailwind.config.ts`.
3. Build `<TrustStrip />` and `<FeaturedProjects />` as new components.
4. Refine `<Hero />`, `<Services />`, `<About />`, `<Testimonials />`, `<Portfolio />`, `<Contact />` in place.
5. Reorder `src/pages/Index.tsx` to the new flow.
6. Audit performance (lazy/priority, sizes presets, content-visibility).
7. Deliver. Tell you which slots ended up empty and need follow-up photos.