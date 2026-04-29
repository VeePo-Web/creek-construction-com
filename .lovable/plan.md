# Site-Wide Audit & Cleanup Pass

## Health snapshot

- `tsc --noEmit` → **0 errors**
- `eslint --quiet` → **0 errors** (P0 lint debt from last pass is gone)
- Routes, lazy boundaries, section registry, RLS-backed media queries → all healthy
- No 404s in network, no broken imports

So this is a **polish** pass, not a structural one. Five concrete issues to clean up.

---

## Issues found

### 1. Runtime React warning on every homepage load (P0)

The browser console fires this on `/`:

```
Warning: React does not recognize the `fetchPriority` prop on a DOM element.
… spell it as lowercase `fetchpriority` instead.
  at img → TriptychColumn (HeroTriptych.tsx:284)
```

Root cause: `src/components/media/HeroTriptych.tsx:258` writes the prop as a literal JSX attribute:

```tsx
fetchPriority={priority ? "high" : undefined}
```

React 18 in this project does not normalize the camelCase form to the lowercase DOM attribute, so it leaks through and warns. The other two call sites that work cleanly (`EditorialPicture.tsx:111`, `ProgressiveImage.tsx:96`, `page-hero.tsx:462,669`) all use the spread form:

```tsx
{...(priority ? { fetchPriority: "high" as const } : {})}
```

…but the same warning is latent there too — it just hasn't fired because most renders don't satisfy `priority`. We'll standardize **all five sites** on the lowercase DOM attribute via spread:

```tsx
{...(priority ? { fetchpriority: "high" } : {})}
```

…cast through `as React.ImgHTMLAttributes<HTMLImageElement>` once where TS complains.

**Files touched (5):**
- `src/components/media/HeroTriptych.tsx` (line ~258)
- `src/components/media/EditorialPicture.tsx` (line ~111)
- `src/components/ProgressiveImage.tsx` (line ~96)
- `src/components/ui/page-hero.tsx` (lines ~462, ~669)

### 2. Residual `transition-all` in two admin pages (P1, narrow scope)

The April perf-pass left two admin tiles using `transition-all`:

- `src/pages/admin/Classify.tsx:783` — selection tile in classify queue
- `src/pages/admin/MediaLibrary.tsx:629` — selection tile in library grid

These are internal-only (admin routes), but they're hot grids with hundreds of nodes — the cheapest possible win. Replace each with `transition-[border-color,box-shadow,transform]`.

The remaining `transition-all` matches are upstream shadcn primitives (`toast.tsx`, `accordion.tsx`, `progress.tsx`, `tabs.tsx`, `sidebar.tsx`, `input-otp.tsx`) — leave those alone; they're vendor and the perf cost is irrelevant at their usage volume.

### 3. Stale apostrophe (P2)

Memory rule: curly quotes in user-visible copy.

- `src/pages/NotFound.tsx:10` — `useDocumentTitle` description: `"The page you're looking for doesn't exist…"` — both `you're` and `doesn't` are ASCII. This goes to `<meta name="description">` and the browser tab, so it IS user-visible. Fix to `you're` / `doesn't`.

The other `'` matches in the rg sweep are inside `<lov-` doc strings or code labels and stay as-is.

### 4. Stale `Portfolio` reference in `MEDIA_PLAYBOOK.md` (P2)

`MEDIA_PLAYBOOK.md:18` still lists "Homepage Portfolio strip (decks card)" in the routing table — but `Portfolio.tsx` was deleted. Replace the row with the current routing target: `FeaturedProjects` on the homepage and the decks galleries on `/work`.

### 5. Email casing inconsistency in display (P2, optional polish)

`Creekproconstruction@gmail.com` is the documented brand spelling (capital C is intentional per the style guide — `StyleGuide.tsx:770` documents it). **No change.** Closing this loop so we don't keep flagging it on every audit.

---

## What's verified clean (no action needed)

- Section-anchor registry vs. all `id="section-…"` — exhaustive match
- Skip-link target (`#section-services`) exists on every public page
- Lazy-loaded route chunks (`Services`, `Work`, `About`, `Contact`, all admin, StyleGuide) — correctly excluded from the homepage bundle
- All decorative `alt=""` are intentional (logos accompanied by text, ambient triptych images)
- All `console.warn` / `console.error` calls are guarded or are legitimate non-fatal channels
- No stale `Portfolio` / `Testimonials` / `FieldClipsStrip` imports anywhere in `src/`
- TypeScript: 0 errors. ESLint: 0 errors.

---

## Verification after fixes

1. `npx tsc --noEmit` → 0 errors
2. `npx eslint src --quiet` → 0 errors
3. Reload `/`, watch console: zero warnings (the `fetchPriority` warning is gone)
4. `rg "transition-all" src/components src/pages` → only upstream shadcn matches
5. `rg "fetchPriority" src` → zero matches; only lowercase `fetchpriority` remains

**Estimated footprint:** 7 files, all small surgical edits. No structural changes, no design shifts, no new dependencies.
