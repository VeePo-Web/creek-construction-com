# Creek Construction — World-Class Style Guide & Performance Repair

## Audit findings (why the site feels slow & clunky right now)

1. **`src/index.css` is 2,061 lines.** It still contains the deprecated dark-mode block (`.dark { ... }`), shimmer/particle/grain keyframes, and seasonal nav animations from a previous brand. Tailwind has to parse every line on every build, and the browser ships unused CSS to every visitor.
2. **`STYLE_GUIDE.md` is the old "B&P Sauna" doc.** It references cedar-sauna ritual language, not Creek Construction. Anyone using it as a reference produces off-brand work.
3. **No typed token modules.** Colors, type, spacing, motion, and brand voice live as raw CSS variables and Tailwind classes — no `colors.ts / typography.ts / spacing.ts / brand-identity.ts`. RoyalMechanical (the reference) has all five and a `/style-guide` page that renders them live.
4. **`NavProgressBar.tsx` is 441 lines and runs on every route.** It tracks ~15 derived values (hearthstone, patina, sisu glow, vapour, rekka, kondenssi…) most of which are dead "ritual" features from the sauna brand.
5. **The legacy `--cedar` token is silently re-mapped to bronze** in `index.css` (line 9-11). New developers reading `text-cedar` see "cedar" but get bronze — that's a footgun.
6. **No motion-reduction discipline at the source.** Animations are sprinkled into class names individually instead of being declared once and referenced by name.

## Strategy — three deliverables, one outcome

A premium construction brand earns trust by being **quiet, precise, and fast.** We're going to:

- **(A)** Codify the visual language into a single, documented source of truth (typed TS modules).
- **(B)** Render that source of truth as a live `/style-guide` page (developer + stakeholder reference).
- **(C)** Surgically remove dead CSS and dead JS so the site loads and feels fast.

No new homepage features — this step makes everything *that already exists* read as world-class.

---

## A. The Token Architecture (new `src/lib/` modules)

Mirror the proven RoyalMechanical pattern, adapted for Creek's evergreen + bronze palette.

### `src/lib/colors.ts` — semantic color contracts
```ts
export const BRAND = {
  evergreen: { hsl: '150 25% 16%', hex: '#1F3329', usage: 'Primary text, dark sections, footer' },
  bronze:    { hsl: '28 55% 45%',  hex: '#B27340', usage: 'CTAs, accents, dividers — sparingly' },
  cream:     { hsl: '38 30% 97%',  hex: '#FAF7F2', usage: 'Page canvas — never pure white' },
  stone:     { hsl: '38 20% 93%',  hex: '#EDE8DF', usage: 'Alternating section bg, muted surfaces' },
  ink:       { hsl: '150 15% 10%', hex: '#15201B', usage: 'Body text — warm near-black' },
} as const;

export const SURFACE = { page, section, card, elevated, scrim } // semantic shortcuts
export const TEXT    = { onLight: { primary, secondary, tertiary, accent }, onDark: {...} }
export const BORDER  = { hairline, default, strong, accent } // 4 weights, no more
export const BUTTON  = { primary, secondary, ghost, link } // each w/ default+hover+focus+disabled
export const SHADOW  = { hairline, soft, float, dramatic } // 4 elevations
export const DIVIDER = { hairline, accent, ornamental } // for the editorial dividers we already use
```
Why: every component imports from one place. Renaming a color is a one-line change.

### `src/lib/typography.ts` — fluid type scale
Defines `HEADLINE.hero | display | section | sub`, `EYEBROW`, `BODY.lead | default | small`, `QUOTE`, `STAT`, `UI` — each as a Tailwind class string. Encodes the rules already in MEDIA_PLAYBOOK: DM Serif Display for headlines, DM Sans body, curly quotes only, balanced wrap on hero.

### `src/lib/spacing.ts` — 8px grid + section rhythm
`SECTION_PADDING` (py-32 desktop / py-20 mobile), `STRIP_PADDING`, `CONTAINER_PADDING`, `MAX_WIDTH.{prose, content, wide, full}`, `CONTENT_GAP.{tight, default, generous, sectionBreak}`. Replaces the ad-hoc `mb-12 mb-16 mb-20` scattered through components.

### `src/lib/motion.ts` — easing, duration, hover, focus, scroll-reveal
`EASING.smooth = 'cubic-bezier(0.16, 1, 0.3, 1)'`, `DURATION.fast/normal/slow/cinematic`, plus `HOVER.cardLift | linkUnderline | imageZoom`, `FOCUS.ring`, `REDUCED_MOTION.disableTransform`. Every animation in the codebase will pull from here — and `prefers-reduced-motion` is honored at the source.

### `src/lib/brand-identity.ts` — the editorial brain
Documents (in TypeScript constants the code can import + the `/style-guide` page renders):
- **Brand spine** — purpose, promise, personality (3 adjectives), audience
- **Voice & tone** — do/don't with example phrases ("Quoted in writing." not "We send quotes!")
- **Value proposition stack** — primary, supporting (3), proof points
- **Verbal identity** — naming conventions, capitalization rules, curly-quote enforcement
- **Visual identity direction** — when to use evergreen vs bronze, photography rules (link to MEDIA_PLAYBOOK)
- **Non-negotiables** — never pure black/white; never sans-serif headlines; never cedar+evergreen on the same surface at >40% opacity each
- **Dealbreakers** — what would invalidate the brand (e.g. emojis in body copy, gradient buttons, drop shadows on text)
- **Guardrails** — accessibility minimums (WCAG AA, 44px touch, focus-visible:ring), performance budgets (LCP < 2.0s, CLS < 0.05, JS < 180KB gz)

This file is the "Pentagram partner" reviewing every PR.

---

## B. Live `/style-guide` route

A single new page at `src/pages/StyleGuide.tsx` (lazy-loaded, blocked from indexing in `robots.txt` and excluded from sitemap), with a left-rail nav and copy-to-clipboard buttons on every token. Sections, in order:

1. **Brand identity** — spine, voice, dealbreakers (rendered from `brand-identity.ts`)
2. **Color** — swatches with HSL/hex, contrast ratios labeled (AA/AAA), opacity scale demo
3. **Typography** — every scale step rendered live, with the class string copyable
4. **Spacing** — 8px grid visual, section rhythm demo
5. **Motion** — every easing curve animated on hover, duration sliders, reduced-motion preview
6. **Components** — buttons (all states), cards, dividers, form inputs, CTA, eyebrow+title+signature pattern
7. **Editorial media** — MediaSlot examples, aspect-ratio tokens, sizes presets (links to MEDIA_PLAYBOOK)
8. **Photography rules** — what's approved, what's banned (no stock people, no harsh blue skies, etc.)
9. **Accessibility** — focus-ring demo, touch-target sizing, color-contrast checker
10. **Performance budgets** — current LCP/CLS/JS-size targets, with a note linking to the audit

Pattern proven on `RoyalMechanical.com` and used by Pentagram, Frog, and Wolff Olins.

---

## C. Performance repair (the "feels slow & clunky" fix)

### C1. Surgically slim `src/index.css` (2,061 → ~700 lines target)
- **Delete** the entire `.dark { ... }` block (light-mode-only is locked in memory)
- **Delete** dead keyframes: `text-shimmer`, `particle-float`, seasonal nav animations, sauna "ritual" effects
- **Delete** the `--cedar` legacy alias comment block — rename CSS var `--cedar` → `--bronze`, keep a single one-line `--cedar: var(--bronze);` for backwards compat (one-line, not 6 lines of explanation)
- **Move** all reusable component styles (`.text-display`, `.card-glass`, `.divider-line`, `.text-minimal`, `.text-architectural`) into `@layer components` so Tailwind purges what isn't used
- **Split** `index.css` into focused files (`base.css`, `components.css`, `editorial.css`, `motion.css`) imported in order — same pattern as FlexServices, easier to audit
- Expected payoff: ~30 KB reduction in critical CSS, faster First Paint

### C2. Slim `NavProgressBar.tsx` (441 → ~120 lines)
The current component computes 15+ derived values that are no longer used (hearthstone, patina, sisu, vapour, rekka, kondenssi, loyly count). Strip to:
- Scroll progress fill (the actual visible bar)
- 5 section dots (Home/Services/Work/About/Contact)
- Reduced-motion respect

Removes ~3 effects, ~6 timers, and a `localStorage` write on scroll. Result: smoother scroll on mobile, lower JS heap, no jank.

### C3. Replace the deprecated `STYLE_GUIDE.md`
Rewrite it as a thin pointer doc:
> "The Creek style guide is **code-first**. See `src/lib/{colors,typography,spacing,motion,brand-identity}.ts` for the contracts, and visit `/style-guide` for the rendered reference. This markdown file documents only governance and how to extend the system."

Then add the governance sections that *don't* belong in code: contribution rules, deprecation policy, "before you add a token, ask…" checklist.

### C4. Performance budgets enforced
Add a comment header to each module declaring its budget (e.g. "This file ships in critical CSS — keep under 8KB"), and document the targets on the `/style-guide` performance page:

| Metric | Budget | Current (estimate) |
|---|---|---|
| LCP (mobile, 4G) | < 2.0s | unmeasured |
| CLS | < 0.05 | likely OK (we use aspect-ratio everywhere) |
| Total JS (gz) | < 180 KB | likely over (NavProgressBar bloat) |
| Critical CSS (gz) | < 14 KB | likely over (2,061-line index.css) |
| Lighthouse perf | > 95 | unmeasured |

After implementation, I'll run `browser--performance_profile` to capture real numbers and add them to the style guide.

---

## File-level change list

**Create**
- `src/lib/colors.ts` (~250 lines, fully typed `as const`)
- `src/lib/typography.ts` (~150 lines)
- `src/lib/spacing.ts` (~100 lines)
- `src/lib/motion.ts` (~120 lines)
- `src/lib/brand-identity.ts` (~600 lines — the editorial brain)
- `src/pages/StyleGuide.tsx` (~900 lines — lazy loaded, not in sitemap)
- `src/styles/base.css`, `src/styles/components.css`, `src/styles/editorial.css`, `src/styles/motion.css` (split from index.css)

**Edit**
- `src/index.css` — slim to imports + `@tailwind` + `:root` tokens only (~150 lines)
- `src/App.tsx` — add lazy `/style-guide` route
- `src/components/NavProgressBar.tsx` — strip dead computations (441 → ~120 lines)
- `tailwind.config.ts` — register the new bronze/evergreen named colors cleanly, retire the `cedar = bronze` alias confusion
- `public/robots.txt` — `Disallow: /style-guide`
- `STYLE_GUIDE.md` — replace with pointer + governance only

**Memory updates**
- New `mem://design/token-architecture` — points to the 5 lib modules as canonical
- Update `mem://design/aesthetic-direction` — note that color tokens now live in `src/lib/colors.ts`
- Retire (delete) `mem://design/thermal-crescendo-pattern` — that was a sauna-brand pattern; document its successor (progressive bronze opacity for ordered lists) inside `colors.ts` under `OPACITY_SCALE`

---

## Risks & calls I'm making

- **Renaming `--cedar` to `--bronze` in CSS** breaks nothing in the Tailwind class layer (we keep the `cedar` Tailwind color name pointing to the bronze HSL via the alias). I'm doing this because the inconsistency is actively harmful to new contributors. If you'd rather I keep the misnomer, say so and I'll leave the var name alone and only document the truth.
- **Dropping the dark-mode CSS block** is supported by `mem://design/aesthetic-direction` ("Light mode ONLY"). I'm acting on the memory.
- **Slimming NavProgressBar** removes the "ritual" features (warmReturn, sisuGlow, hearthstone). They're invisible on the current site already. If any of them is a feature you want to keep visible, name it and I'll preserve it.
- **The `/style-guide` page won't be linked from public nav** — it's a developer/stakeholder reference, accessed via direct URL only, and excluded from indexing. Same approach as RoyalMechanical and FlexServices.

## What this *doesn't* do (next steps after this lands)

- Doesn't redesign any homepage section — that's a separate plan once the system is in place
- Doesn't classify the 113 pending media assets — that's still a manual click in `/admin/classify`
- Doesn't add new pages, routes, or features — pure system + cleanup work
- Doesn't migrate every existing component to import from the new token modules in one pass — I'll convert the homepage components (Hero, Services, About, Contact, Footer, Navigation) in this step, and the rest will be migrated as we touch them

When you approve, I'll start with the token modules (so every later change has a place to live), then the `/style-guide` page, then the CSS surgery and NavProgressBar slim-down — measuring perf before/after with the browser profiler.
