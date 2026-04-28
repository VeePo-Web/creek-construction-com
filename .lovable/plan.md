# Site Audit — Consistency & Error Pass

A thorough sweep of the codebase. TypeScript compiles cleanly and the architecture is sound. Findings below are grouped by severity.

---

## What's already healthy

- `npx tsc --noEmit` — **0 errors**.
- No broken imports to the removed `Portfolio` / `Testimonials` components.
- Section-anchor registry (`src/lib/page-sections.ts`) matches every `id="section-…"` on every page. No orphans, no missing anchors.
- Routes, lazy boundaries, and the Mobile Quote FAB gating in `App.tsx` are correct.
- Curly-quote standard is honored in **headlines and hero copy** (the high-visibility surfaces).

---

## Issues found (prioritized)

### P0 — Lint errors (3)

ESLint reports 3 errors that should not be in `main`:

1. `src/components/ui/command.tsx:24` — empty interface (`@typescript-eslint/no-empty-object-type`). Convert to `type ... = ...` alias.
2. `src/components/ui/textarea.tsx:5` — same empty-interface error. Same fix.
3. `src/hooks/useAlbertaTemp.ts:30` — `let interval` never reassigned, must be `const`.

### P1 — Curly-quote violations in user-visible copy

Project memory mandates curly quotes (' " "). Twelve user-facing strings still use ASCII apostrophes. None are in headlines, but they appear in body copy where the eye catches them next to curly quotes elsewhere on the same page:

- `src/components/About.tsx` — process steps + body paragraph (`you're`, `isn't`, `don't`, `you'll`, `That's`).
- `src/components/Contact.tsx` — body paragraph (`you're`, `We'll`).
- `src/components/FeaturedProjects.tsx:166` — subheading (`we're`).
- `src/pages/About.tsx:62-68` — long-form story (`don't`, `That's`, `it's`, `we'd`, `doesn't`).
- `src/pages/NotFound.tsx:43` — 404 line (`doesn't`).
- `src/pages/Services.tsx:45-46` — checklist notes (`We'll`).
- `src/components/quote/QuoteModal.tsx:179, 294-295, 580, 676, 874-875` — modal body, error helper, success state.
- `src/components/navigation/GlobalMenu.tsx:327` — menu copy.

Fix: replace ASCII `'` with `'` (U+2019) in display strings only. Code comments and `aria-*` strings stay ASCII.

### P1 — Residual `transition-all` (performance)

The April perf-pass swept components but missed shared primitives. `transition-all` forces the browser to interpolate every animatable property:

- `src/lib/motion.ts:74, 86, 90` — three motion presets used by `service-tile`, `project-tile`, etc. (high-leverage).
- `src/lib/colors.ts:275, 285, 295` — three transition presets in the token surface map.
- `src/components/CedarCTA.tsx:34, 60` — the **primary conversion CTA**, shipped on every page.
- `src/components/ui/project-tile.tsx:100, 123, 132, 143, 183` — five spots on the project card.
- `src/components/ui/faq-accordion.tsx:34`.
- `src/components/ui/card-premium.tsx:11`.
- `src/components/ProgressiveImage.tsx:99, 131`.

Fix: replace each with the explicit property list it actually animates (`transition-colors`, `transition-[transform,box-shadow]`, `transition-[width,background-color]`, etc.). Admin pages (`MediaLibrary.tsx`, `Classify.tsx`) stay as-is — internal-only.

### P2 — Stale comments referencing deleted components

After `Portfolio.tsx` and `Testimonials.tsx` were removed, several comments still reference them and mislead future edits:

- `src/data/projects.ts:11, 57` — "never edit Portfolio.tsx" / "homepage Portfolio strip".
- `src/components/ui/bronze-rule.tsx:34` — "Hero, About, Portfolio, FeaturedProjects".
- `src/components/FeaturedProjects.tsx:18` — "Portfolio + recap strip carry the weight".
- `src/components/media/HomeProjectRecapStrip.tsx:9` — "between Portfolio and Contact".

Fix: rewrite each comment to reflect the current homepage rhythm (Hero → TrustStrip → Bleed → Services → About → FeaturedProjects → Contact).

### P2 — Minor UX consistency

- **Contact email casing**: `src/config/contact.ts` exports `Creekproconstruction@gmail.com` with a capital `C`. Email local-parts are case-insensitive in practice, but the inconsistency reads sloppy in `mailto:` links and the visible footer line. Normalize to lowercase everywhere it's *displayed*; keep the address as-is in the `mailto:` href (servers accept both).
- **`<input>` font-size**: `src/components/ui/input.tsx` is `text-base` on mobile and `text-sm` on `md+`. iOS auto-zooms any input under 16px, which is correct on mobile but the QuoteModal also uses `Input` on desktop where `text-sm` is fine. No change needed — flagging that this is intentional and correct.

### P3 — Cosmetic / docs

- `STYLE_GUIDE.md` and `MEDIA_PLAYBOOK.md` were not updated when `Portfolio` and `Testimonials` were removed. Quick scan + prune of any stale references.
- `src/lib/page-sections.ts` comment block correctly documents the n=2/n≥3 rule and matches `Core` memory — no change.

---

## What I'm NOT changing

- The architecture (route lazy-loading, two-tier nav, section registry, design tokens) is correct as-is.
- Curly quotes inside JSX comments and `aria-*` labels stay ASCII (screen-reader compatibility, source clarity).
- The QuoteModal flow — already frictionless in the previous pass.
- Admin-route `transition-all` — internal tooling, not perf-critical.

---

## Verification steps after the fixes

1. `npx tsc --noEmit` → 0 errors.
2. `npx eslint src --quiet` → 0 errors.
3. `rg "you'll|don't|we're|that's|isn't|can't|won't|it's|we'd|you're|we'll|doesn't" src/components src/pages` → only matches inside `//`, `/* */`, or `aria-*`.
4. `rg "transition-all" src/components src/lib` → only `progress.tsx` (shadcn upstream, safe).
5. Visual spot-check `/`, `/services`, `/work`, `/about`, `/contact`, `/404` — copy reads with consistent typography.

Estimated change footprint: ~14 files, all small edits, no structural changes.
