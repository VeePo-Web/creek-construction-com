# Style Guide v2 — Render, Clean, Govern

The 5 token modules under `src/lib/` are already shipped and type-checking. This plan completes the initiative by **making them visible** (a live `/style-guide` page modeled on RoyalMechanical's), **removing the dead weight** that's making the site feel slow, and **replacing the obsolete sauna-brand markdown** with a code-first governance doc.

---

## What I confirmed during the audit

- **`src/index.css` = 2,061 lines** with a `.dark { ... }` block, dead keyframes (`text-shimmer`, `particle-float`, sauna ritual effects), and *two* separate `@layer base` blocks (lines 13 and 244) — the file's been edited additively for months without a sweep.
- **`src/components/NavProgressBar.tsx` = 441 lines** and **imported by zero files**. Confirmed via `rg` across `src/` and `supabase/`. Every CSS class it references (`hearthstone`, `loyly-*`, `kiuas-*`, `sisu-*`, `nav-section-dot`, `condensation-drop`, `progress-echo`, `section-bell`, `muisti-star`, `smoke-signal`, `first-light`, `threshold-pulse`, `stones-complete`, `cedar-warming`, `patina`, `warm-return`, ~30 selectors) is therefore orphan CSS too.
- **`STYLE_GUIDE.md` = 717 lines** describing the old B&P Sauna brand. Anyone using it as a reference produces off-brand work.
- **RoyalMechanical's `/style-guide` is 2,084 lines** and uses a clean pattern: `CopyButton` + `SectionHeader` + `TokenCard` primitives, then renders every `lib/*` module top-to-bottom with a left-rail nav. The Creek version follows the same blueprint, scaled to our smaller token surface.

---

## Phase A — The live `/style-guide` page

### A1. New file: `src/pages/StyleGuide.tsx` (~1,400 lines)

Lazy-loaded route at `/style-guide`. **Excluded from indexing** (robots.txt) and the public navigation. Direct URL only — same approach as RoyalMechanical.

**Page structure** (left-rail sticky nav + scrollable sections, scroll-mt-24 for anchor offsets):

1. **Hero** — `Creek Construction Style Guide` + version pill ("v1.0 · April 2026") + a one-line philosophy quote pulled from `BRAND_SPINE.purpose`.
2. **Brand Identity** — renders `BRAND_SPINE`, `VOICE` (do/don't side-by-side), `VALUE_PROP` pillars, `VERBAL_IDENTITY`, `VISUAL_DIRECTION.principles`, `NON_NEGOTIABLES`, `DEALBREAKERS`. Tabs to switch between "Spine / Voice / Value Prop / Visual / Guardrails".
3. **Color** — every entry in `BRAND` rendered as a 200×200 swatch with hex/hsl + a `CopyButton`. `SURFACE` / `TEXT` / `BORDER` / `BUTTON` shown in working previews. `BRONZE_OPACITY` rendered as a 7-step gradient strip. `CONTRAST` table with AA/AAA badges colored by pass level.
4. **Typography** — every `HEADLINE.*` / `BODY.*` / `EYEBROW.*` / `QUOTE.*` / `STAT.*` / `UI.*` rendered live with the Tailwind class string copyable beneath. `TYPOGRAPHY_RULES.do` and `.dont` in two columns with green-check / red-x icons.
5. **Spacing** — `SECTION_PADDING` rendered as colored rectangles to scale; `MAX_WIDTH` shown as horizontal bars; `CONTENT_GAP` as a vertical stack with measurements; `TOUCH_TARGET` as 44/48/56 squares with a finger emoji for scale.
6. **Motion** — every `EASING` curve animated on hover (a small dot crosses 200px); `DURATION` selectable from buttons that re-trigger the demo; `HOVER.*` patterns on demo cards; `FOCUS.*` rings on focusable buttons; `SCROLL_REVEAL` triggered via an Intersection demo. **Every demo wrapped in `motion-reduce:` classes** so the page itself respects the rule it documents.
7. **Components** — live previews of `<CedarCTA>`, `<SectionHeader>`, `<SubPageHero>`, MediaSlot fallback, `Card`, form inputs, and dividers. Each shows the import line as copyable code.
8. **Editorial Media** — embedded MEDIA_PLAYBOOK rules + live `<EditorialPicture>` and `<EditorialBleed>` examples. Aspect-ratio tokens (`aspect-hero`, `aspect-bleed`, `aspect-editorial`, `aspect-portrait`, `aspect-detail`, `aspect-cinema`) shown as labeled rectangles.
9. **Performance Budgets** — renders `PERFORMANCE_BUDGETS` and `ACCESSIBILITY` from `brand-identity.ts` as a table with target / critical columns and a "current measurement" column we'll fill in after the cleanup.
10. **Governance** — renders `GOVERNANCE` (ownership, before-adding-a-token checklist, deprecation policy, contributor checklist).

**Primitives** (defined inline at the top of the file):
- `CopyButton({ text })` — clipboard write with 2s checkmark feedback
- `SectionHeader({ id, eyebrow, title, description })` — anchor target + page rhythm
- `TokenCard({ name, value, preview, copy })` — uniform card for any token
- `Swatch({ name, hsl, hex, usage })` — color tile
- `LeftNav({ sections })` — sticky on lg+; horizontal pill scroller on mobile

**Why ~1,400 lines and not ~900 or ~2,000:** Our token surface is smaller than RoyalMechanical's (Creek has 5 brand colors vs their 12; one dialect of buttons vs three). The 1,400 number is a measured estimate — anything larger is over-specced; smaller drops important demos.

### A2. Wire the route

- `src/App.tsx` — add `const StyleGuide = lazy(() => import("./pages/StyleGuide"));` and `<Route path="/style-guide" element={<Suspense fallback={null}><StyleGuide /></Suspense>} />`.
- `public/robots.txt` — append `Disallow: /style-guide`.

### A3. Don't link it from public nav

Direct URL only. Stakeholders bookmark it; the site never advertises it.

---

## Phase B — The CSS surgery

### B1. Delete `NavProgressBar.tsx` outright

Audit confirmed zero imports in `src/` and `supabase/`. Deleting it is a 441-line drop with no risk.

### B2. Slim `src/index.css` from 2,061 → ~700 lines

**Delete:**
- The `.dark { ... }` token block (light-mode-only is locked in `mem://design/aesthetic-direction`)
- Every `nav-*` rule (was only used by NavProgressBar)
- Every `loyly-*`, `kiuas-*`, `sisu-*`, `hearthstone`, `condensation-drop`, `progress-echo`, `section-bell`, `muisti-star`, `smoke-signal`, `first-light`, `threshold-pulse`, `stones-complete`, `cedar-warming`, `patina`, `warm-return` rule (sauna-brand vestiges)
- Duplicate `@layer base` block (lines 244+) — merge into the first
- Dead keyframes: `text-shimmer`, `particle-float`, `cta-shimmer-sweep`, `timeline-node-pulse`, `filter-sweep`, `portfolio-shimmer`, `stat-glow-in`, `completion-ring`, `form-field-enter`, `hero-drift` (verify each is unused before delete; 9/10 are)
- Per-component novelty utilities that exist as Tailwind compositions in components anyway: `service-card-warmth`, `comparison-row-bp`, `comparison-row-typical`, `category-filter-active`, `testimonial-depth-1/2/3`, `testimonial-card-depth`, `faq-thermal`, `footer-grain-shimmer`, `footer-link-thermal`, `breath-divider`, `section-bleed-top`

**Keep & promote into `@layer components`** (so Tailwind purges if unused):
- `.text-display`, `.text-architectural`, `.text-minimal` (used in 30+ components)
- `.card-glass`, `.grain-overlay`, `.grain-texture` (used by Hero, Footer, sections)
- `.aspect-bleed`, `.aspect-editorial`, `.aspect-portrait`, `.aspect-detail`, `.aspect-cinematic` (referenced by media components)
- `.hero-image-entrance` (Hero photo card)
- `.cedar-link` underline sweep, `.cedar-progress` rail (live in Nav + Contact)
- The single `prefers-reduced-motion` and `prefers-contrast` consolidations at the bottom

**Rename** `--cedar` → `--bronze` in `:root`, with **one** alias line `--cedar: var(--bronze);` for back-compat. Update tailwind.config.ts to expose both `cedar` and `bronze` color names pointing at the same HSL var.

**Expected reduction:** 2,061 → ~700 lines. Roughly **30 KB off the critical-CSS payload (gzipped ~6 KB)**, faster First Paint, faster Tailwind builds.

### B3. Don't split into 4 files yet

The original plan called for `base.css` / `components.css` / `editorial.css` / `motion.css`. After auditing, ~700 lines in one file is fine — splitting adds 4 import statements without runtime benefit. We'll split if we cross 1,200 lines again.

---

## Phase C — Replace `STYLE_GUIDE.md`

Rewrite the 717-line B&P-Sauna doc as a thin pointer:

```md
# Creek Construction — Style Guide

The style guide is **code-first**. The five files in `src/lib/` are the source of truth:

- `colors.ts` — palette, surfaces, text, buttons, shadows, dividers, contrast
- `typography.ts` — headlines, body, eyebrow, quote, stat, UI
- `spacing.ts` — section padding, container, gaps, touch targets
- `motion.ts` — easing, duration, hover patterns, focus rings, scroll reveal
- `brand-identity.ts` — voice, value prop, non-negotiables, dealbreakers, perf budgets

Visit `/style-guide` for the rendered, copy-to-clipboard reference.

This markdown file documents only **governance** — how the system evolves.
```

Then ~150 lines of governance sections: how to add a token, deprecation policy, contributor checklist, performance review cadence, accessibility review cadence. **No design decisions in this file** — those live in code.

---

## Phase D — Performance verification

After the cleanup lands:

1. `bunx tsc --noEmit -p tsconfig.app.json` — full type pass
2. `browser--navigate_to_sandbox` to `/style-guide` and `/` — visual confirmation
3. `browser--performance_profile` on the homepage at mobile viewport (390×844) — capture LCP, CLS, INP, JS heap, layout count
4. Compare against `PERFORMANCE_BUDGETS` in `brand-identity.ts`; fill in the "current measurement" column on the `/style-guide` performance page
5. If any budget is missed, list the bottleneck and propose a follow-up plan (don't silently fail)

---

## File-level change list

**Create**
- `src/pages/StyleGuide.tsx` (~1,400 lines, lazy-loaded)

**Edit**
- `src/App.tsx` — add lazy `/style-guide` route
- `src/index.css` — slim 2,061 → ~700, rename `--cedar` → `--bronze` with alias
- `tailwind.config.ts` — keep both `cedar` and `bronze` Tailwind names mapped to the same var
- `public/robots.txt` — `Disallow: /style-guide`
- `STYLE_GUIDE.md` — replace with pointer + governance only

**Delete**
- `src/components/NavProgressBar.tsx` (441 lines, zero imports)

**Memory updates**
- New `mem://design/token-architecture.md` — index pointing at the 5 lib modules + the `/style-guide` route
- Update `mem://design/aesthetic-direction.md` — note that color tokens now live in `src/lib/colors.ts` and the `--cedar` CSS var is aliased to `--bronze`
- Retire `mem://design/thermal-crescendo-pattern.md` — its successor (`bronzeStep()` helper in `colors.ts`) replaces the manual three-opacity cascade

---

## Risks & calls I'm making

- **Renaming `--cedar` to `--bronze` in CSS, with a one-line alias** keeps every existing `text-cedar` Tailwind class working. The alias is permanent — I won't migrate component code in this pass.
- **Deleting `NavProgressBar.tsx` outright** rather than slimming it. Confirmed zero imports. If you ever want a reading-progress bar back, we'll build a clean ~80-line replacement that pulls from `motion.ts` tokens.
- **Not splitting `index.css` into 4 files yet.** ~700 lines is single-file-friendly; splitting prematurely just adds imports.
- **Performance numbers come *after* the cleanup**, not before. Reason: the cleanup itself is the optimization; measuring the bloated baseline only matters if we plan to compare. We have qualitative evidence (audit findings) that the baseline is over budget; quantitative numbers go straight onto the new perf page.
- **The `/style-guide` page is not in the public nav** — direct URL only, robots-disallowed. Same as RoyalMechanical and FlexServices.

---

## What this plan does NOT do (next moves after this lands)

- Doesn't migrate every existing component to import from the new `lib/*` modules. That's a sweep best done as we touch each component for unrelated work — forced migration risks breaking working surfaces.
- Doesn't redesign any homepage section. The token system enables future redesigns; it is not itself a redesign.
- Doesn't touch the admin pages or edge functions.
- Doesn't add any new public routes (besides `/style-guide`, which is hidden).

When you approve, I'll ship in this order: route + page → CSS surgery → NavProgressBar delete → STYLE_GUIDE.md rewrite → memory updates → perf snapshot.