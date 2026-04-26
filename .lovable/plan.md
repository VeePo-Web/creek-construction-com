# Style Guide v5 — Bug Triage + Sub-Page Token Sweep

## Why this work, right now

Live audit at 1366×768 surfaced **two shipping bugs** introduced by v3/v4 plus a clear next target: the **sub-pages** (`/services`, `/work`, `/about`, `/contact`) and `SubPageHero` are the last places still hand-rolled. The homepage is now token-driven; the rest of the site is not. After this pass the entire shipping surface — every route, every hero, every section — composes from the same `src/lib/` tokens and `src/components/ui/` primitives.

## Audit findings (live, just measured)

### Critical bugs
1. **Homepage sections appear empty/collapsed** at 1366px. The `style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }}` I added to Services and Portfolio reserves 1200px of layout space, but when the actual content is taller (Services with the matrix + CTA is closer to 1900px), scrolling jumps over real content. Result: large blank gaps on the page. Need to either remove containIntrinsicSize, raise it dramatically, or convert to plain `loading="lazy"` images + below-fold `contain-intrinsic-block-size: none`.
2. **Hero lead paragraph fails WCAG AA on desktop**. `text-evergreen-foreground/75` on the evergreen radial = ~3.4:1 contrast. Must lift to /85 minimum and add a subtle shadow plate behind the text or pull color to `text-evergreen-foreground` (full opacity).

### Style/system gaps
3. **Curly-quote violation** in `src/components/Contact.tsx`: `"Let's Build Something Right."` — memory says strict curly. Must be `Let\u2019s`.
4. **`SubPageHero` is the last hand-rolled hero** — 9 inline `style={{}}` blocks, raw `clip-reveal 1.2s cubic-bezier(...)` strings, hand-rolled breadcrumb, hand-rolled provenance row. Should compose from `BronzeRule`, use `EASING.smooth` + `DURATION.cinematic` from `motion.ts`, and use `BACKDROP.evergreenRadial` for the gradient overlay.
5. **`/services`, `/work`, `/about`, `/contact` interiors** all still hand-roll: their own evergreen hero (5–7 inline styles each, duplicating SubPageHero), their own bronze-step math, their own grid math, their own service/project tile, their own FAQ accordion styles. Token coverage on these files = 0.
6. **Three different breadcrumb implementations** — `SubPageHero`, `Services.tsx` page, `NarrativeBreadcrumb` component. Should be one `<Breadcrumb items />` primitive sourced from the tokens.
7. **`StyleGuide.tsx`** never had a token sweep — it documents tokens but uses 6 inline styles itself. Eat its own dogfood.
8. **`FeaturedProjects.tsx`** still uses raw classes; not in v4 sweep.
9. **Mobile hero (390px)** doesn't show the floating stat card or the inline stat row in the photo-variant — only the no-media branch shows stats. Must always show them.

## Plan — six phases

### Phase 1 — Fix the two shipping bugs (must land first)
- **Remove `containIntrinsicSize` overrides** on Services and Portfolio sections. Replace with `loading="lazy"` on below-fold images only. Keep `content-visibility: auto` only where the section is **always** offscreen on first paint AND we can prove the intrinsic estimate is a lower bound.
- **Hero lead text contrast**: lift `text-evergreen-foreground/75` to `text-evergreen-foreground/90` and add `text-shadow: 0 1px 2px hsl(150 30% 6% / 0.6)` so it remains legible on the radial backdrop. Add a token `TEXT.onDark.legibleShadow` for reuse.

### Phase 2 — New shared primitives (the missing layer for sub-pages)
- **`<Breadcrumb items />`** in `src/components/ui/breadcrumb-trail.tsx` — replaces the 3 hand-rolled implementations. Default light variant + `onDark` variant for hero contexts.
- **`<PageHero />`** in `src/components/ui/page-hero.tsx` — the canonical sub-page evergreen hero. Composes `BACKDROP.evergreenRadial`, `BronzeRule`, `Breadcrumb`, `HEADLINE.display`, `EASING.smooth`. Replaces the 4 hand-rolled hero blocks in `Services.tsx`/`Work.tsx`/`About.tsx`/`Contact.tsx` AND replaces `SubPageHero` (which is image-led) with a clearer split: `<PageHero variant="evergreen" />` vs `<PageHero variant="cinematic" image>`.
- **`<ServiceTile />`** in `src/components/ui/service-tile.tsx` — the canonical service card used on `/`, `/services`, `/work`. One implementation, three callsites.
- **`<FaqAccordion items />`** wrapping the existing `Accordion` UI with the bronze-step border treatment baked in.

### Phase 3 — `SubPageHero` rebuild
- Replace `SubPageHero.tsx` with a thin re-export of `<PageHero variant="cinematic">`. Internally:
  - Inline-styled gradient strings → `BACKDROP.cinematicVignette` (new constant).
  - `clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1)` → `EASING.smooth` + `DURATION.cinematic`.
  - Hand-rolled breadcrumb → `<Breadcrumb items onDark />`.
  - Hand-rolled provenance row → `<BronzeRule numeral label variant="onDark" />`.
  - Inline animation strings → utility classes already in `index.css` (`reveal`, `clip-reveal`).
- Net result: `SubPageHero` shrinks from ~160 lines / 9 inline styles to ~40 lines / 0 inline styles.

### Phase 4 — Sub-page interior sweeps

| Page | Currently | Becomes |
|---|---|---|
| `pages/Services.tsx` | own hero, own tile grid, own FAQ styling, hand-rolled breadcrumb (5 inline + duplicated bronze math) | `<PageHero variant="evergreen">`, grid of `<ServiceTile>`, `<FaqAccordion items={FAQS}>`. Inline-style count: 5 → 0. |
| `pages/Work.tsx` | own hero, own card grid, hand-rolled hover/border bronze math (3 inline) | `<PageHero variant="cinematic">`, grid of `<ProjectTile>` (new primitive, derived from current Portfolio card). Inline → 0. |
| `pages/About.tsx` | own hero, hand-rolled stat row, hand-rolled "founder" pull-quote (4 inline) | `<PageHero variant="evergreen">`, `<StatTrio variant="card">`, `QUOTE.pull` from typography tokens. Inline → 0. |
| `pages/Contact.tsx` | own hero, two-column form/info card, hand-rolled gradients (7 inline) + curly-quote bug | `<PageHero variant="evergreen">`, tokenized two-column layout, `BACKDROP.evergreenPlate` for the right pane, `Let\u2019s` (curly). Inline → 1 (legitimate dynamic CSS var). |
| `pages/StyleGuide.tsx` | own headers + 6 inline styles | uses `<BronzeRule>`, `HEADLINE.section`, `EYEBROW.default`. Inline → 0. |
| `components/FeaturedProjects.tsx` | own grid, raw classes | uses `HEADLINE.section`, `BODY.small`, `<ServiceTile>` or new `<ProjectTile>`. |

### Phase 5 — Mobile hero parity + small craft fixes
- **Stat row always visible**: in the photo-variant Hero, hoist the `StatTrio` outside the `lg:absolute` floating card so on mobile the stats render below the photo (not hidden until lg).
- **Trust chip wrap**: at 320–360px the current `flex-wrap` on three chips with hairline dividers stacks into a vertical column with extra dividers — fix the divider so it hides when wrapped.
- **Nav active state**: current cedar text is too quiet at 11px — add a 1px cedar underline (animated) on `:hover`/active so the active page is unmistakably marked.
- **Single Source breadcrumb**: delete `NarrativeBreadcrumb.tsx` after migrating its consumers (it's referenced by older code).

### Phase 6 — Validation
- `tsc --noEmit` clean.
- Screenshot at 1366×768, 1024×768, 390×844 and confirm:
  - Hero lead text contrast ≥ 4.5:1 (manually inspect or use devtools Contrast Checker).
  - No 1200px empty gaps between sections on `/`.
  - Sub-pages all use the same `PageHero` shell.
  - Curly quotes throughout.
- `rg "from \"@/lib/(colors|typography|spacing|motion)\"" src/components src/pages | wc -l` should jump from 12 → 20+.
- `rg "style=\{\{" src/pages | wc -l` should drop from 27 → < 5.
- Update `mem://design/component-primitive-map` with the new `PageHero`, `Breadcrumb`, `ServiceTile`, `ProjectTile`, `FaqAccordion` primitives.

## Out of scope (deferred deliberately)

- Real photography sourcing (content task, not a code task).
- Quote modal interior re-skin (high custom, low ROI this pass).
- A11y audit pass (separate dedicated loop once primitives are stable).
- Any `/admin/*` interior changes (utility surface, separate priority).

## Estimated impact

| Metric | Before | After |
|---|---|---|
| Token files imported by `src/pages` | 0 | 5+ |
| Inline `style={{}}` in `src/pages` | 27 | < 5 |
| Hand-rolled hero implementations | 5 (Hero + 4 sub-pages, all distinct) | 1 `<PageHero>` (with two variants) |
| Hand-rolled breadcrumb implementations | 3 | 1 `<Breadcrumb>` |
| Service-tile implementations | 3 | 1 `<ServiceTile>` |
| Hero lead contrast | ~3.4:1 (fail) | ≥ 4.5:1 (AA) |
| Phantom blank gaps on home | yes | no |
| Curly-quote violations | 1 | 0 |

After this lands, every route on the site composes from the same primitive set. The natural next loop becomes either real photography integration or the quote-modal re-skin.