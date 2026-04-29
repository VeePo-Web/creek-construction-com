## Optimized progressive image loading — eliminate landing-page CLS

The site already runs most photographs through `EditorialPicture` (LQIP + intrinsic dimensions + aspect-ratio lock). Audit confirms the landing page has **zero raw `<img>` tags** other than the hero photograph and the footer logo. So this isn't a rewrite — it's a targeted hardening pass on the remaining gaps.

### Findings

1. **Hero photo (`architect-bleed` variant in `page-hero.tsx`)** — uses an absolutely-positioned `<img>` with `object-cover`. Width/height are passed but the parent has `min-h-[88vh]`, so before the image decodes there's a brief paint of the bare black background (no layout shift, but a flash). No LQIP wired in.
2. **`HeroTriptych`** — three `EditorialPicture`-equivalent images. Already CLS-safe. But each column triggers its own approved-media fetch; columns that arrive last cause a faint "pop-in" cascade.
3. **`ProgressiveImage` (legacy)** — hardcoded `width="1200" height="800"`. Used in `ProjectGallery` (linked from /work, not the landing page). Causes CLS whenever the host element's aspect ratio differs. Out of scope for *landing page* but worth noting; we'll mark it deprecated and route /work's gallery through `EditorialPicture` if it's reachable from the homepage. Not a landing-page blocker.
4. **`HomeProjectRecapStrip`, `FeaturedProjects`, `EditorialBleedSection`, `Services`, `About`, `Contact`** — all already render through `EditorialPicture`/`MediaSlot`. Aspect-ratio locked, LQIP wired, fetchpriority correct. **No changes needed.**
5. **Footer logo** — fixed 48×48 with explicit dims. Fine.

### What changes

1. **Hero photograph: full progressive treatment**
   - In `ArchitectBleed` (`src/components/ui/page-hero.tsx`), wrap the bare `<img>` in a self-contained progressive layer:
     - Read `lqip` from the `useFirstApprovedMedia` item (the field already exists on `ApprovedMedia`).
     - Render an absolutely-positioned LQIP backdrop (`backgroundImage: url(data:image/jpeg;base64,…)`, `filter: blur(24px) grayscale(1)`, `transform: scale(1.06)`) underneath the photo. Fades out on `onLoad`.
     - Keep the existing grayscale + brightness filter on the loaded image.
     - Add `onLoad` state hook (mirrors `EditorialPicture`).
     - Keep the section's `min-h-[88vh] md:min-h-screen` so the layout box is reserved before the photo arrives — no shift.
     - Keep `fetchpriority="high"`, `decoding="sync"`, `loading="eager"`.
   - Add `useHeroPreload` for the actual `MEDIA_SIZES.HERO_FULL` (already there) — verified.

2. **HeroTriptych: synchronized reveal**
   - Today each column fades in independently as its fetch resolves, producing a staggered pop. Change column reveal to wait for **column A** (the LCP) and use a tiny coordinated stagger (60ms B, 120ms C) for an editorial cadence rather than a network race.
   - Each column already has aspect-ratio reservation via the grid; no CLS today, this is a polish-only fix to remove perceived jank.

3. **`MEDIA_SIZES` audit on landing page**
   - Verify each landing-page MediaSlot passes a `sizes` value tight to its rendered width so the browser doesn't fetch oversized variants. Findings file-by-file:
     - `Hero` → `HERO_FULL` ✓
     - `EditorialBleedSection` → `BLEED_FULL` ✓
     - `HomeProjectRecapStrip` → `THIRD` ✓
     - `FeaturedProjects` → confirm; if missing, add `MEDIA_SIZES.HALF`.
     - `Services` → confirm; if missing, add `MEDIA_SIZES.THIRD`.
   - Any gap gets a one-line addition. No prop renames.

4. **Deprecation note**
   - Add a JSDoc `@deprecated` on `ProgressiveImage` pointing to `EditorialPicture`, with a one-line note in `MEDIA_PLAYBOOK.md`. We don't migrate /work's gallery in this pass (out of landing-page scope), but the deprecation prevents new callers.

5. **Memory update**
   - Update existing `mem://standards/performance-rendering-strategy` (already referenced in the index) with one new bullet: "Hero photographs render through an LQIP-backed progressive layer; landing page contains zero raw `<img>` tags except the footer logo." No new memory file — this folds into the existing rendering-strategy doc.

### What does not change

- `EditorialPicture`, `MediaSlot`, `EditorialBleedSection`, `HomeProjectRecapStrip`, `FeaturedProjects` API or behavior.
- Cream + bronze tokens.
- The architect-bleed visual language (filter, scrim, headline).
- /work, /services, /about hero treatments.

### File touch list

- `src/components/ui/page-hero.tsx` — add LQIP layer + load-state to `ArchitectBleed`.
- `src/components/media/HeroTriptych.tsx` — coordinated reveal stagger.
- `src/components/Services.tsx`, `src/components/FeaturedProjects.tsx` — verify/add `sizes` props (only if missing).
- `src/components/ProgressiveImage.tsx` — `@deprecated` JSDoc.
- `MEDIA_PLAYBOOK.md` — one-line deprecation note.
- `mem://standards/performance-rendering-strategy` — append bullet.

### Why this is the right scope

The codebase already enforces aspect-ratio reservation and LQIP via `EditorialPicture` everywhere on the landing page except the hero. A wholesale "progressive image" rewrite would duplicate work and risk regressions. The targeted fix closes the one remaining flash (hero) and the one remaining perceived-jank source (triptych staggered fetch), then locks the discipline in via deprecation + memory.
