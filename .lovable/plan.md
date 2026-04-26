# Style Guide v4 — Token Adoption + Editorial Refinement

## Why this work, right now

We shipped a beautiful design-system in `src/lib/{colors,typography,spacing,motion,brand-identity}.ts` and a live `/style-guide`. **But only the style guide imports those tokens.** Every shipping component (Hero, Services, About, Testimonials, Portfolio, Contact, Footer, Navigation, CedarCTA, SubPageHero) still uses ad-hoc Tailwind strings and **77 inline `style={{}}` blocks across 20 files**. That means:

- The token rules can drift forever and nothing breaks visibly — there is no enforcement.
- Designers can't trust the style guide as a contract — it shows what *should* be true, not what *is* true.
- Inline `style` is render-cost (no static class, runs JS on every paint) and unreviewable in diffs.

This pass turns the design system from documentation into **the actual implementation** of the homepage and sub-pages, and makes the editorial layout itself feel like Fantasy/FlexServices/RoyalMechanical instead of "good Tailwind site."

---

## Audit findings (visible at 1366×768 right now)

### Editorial / craft issues
1. **Hero right column is a 600px-tall dead rectangle** when no project photo is approved. The fallback "Project photography coming soon" is honest but takes ~40% of above-the-fold real estate. Fantasy never shows empty plates this large; they collapse to a one-column type-led hero.
2. **Headline breaks at "the / Work."** at 1366px because the headline column is constrained to 7/12 cols. The line "Excellence in the Work." should hold on one line through `xl`.
3. **Three trust chips look like form badges**, not provenance. They use a sharp 1px border and uppercase 10px — the visual weight of `aria-label` chips, not editorial signals. Fantasy/Aesop use a thin horizontal rule with comma-separated micro-text.
4. **Section transitions are gradient-fades to muted** — soft, but the rhythm is monotonous: every section has the same `pb-32` and the same gradient cap. There's no "breath" — no tiny full-bleed quote break, no aspect change, no asymmetry.
5. **`Portfolio` and `FeaturedProjects` both run on the homepage**, both grid-of-three, both bronze-accent-line. They read as duplicates. One must die or become structurally different (one cinematic, one tabular).
6. **Floating stat card overlaps off-screen** at lg breakpoint with `lg:left-[-24px]`, but the photo card behind it is still empty in the screenshot — so the floating card has nothing to anchor to.
7. **`grain-overlay` + `grain-texture` is on every section** (Services, Testimonials, Portfolio, About). When everything is textured, nothing is. Fantasy uses grain on **one or two** plates per page max.

### System-level issues
8. **Zero token imports outside `/style-guide`.** `BUTTON.primary.base`, `HEADLINE.section`, `EYEBROW.default`, `STAT.hero`, `BODY.lead` — all unused. The system does not yet exist in production.
9. **77 inline `style={{}}` blocks** mostly to do `borderLeft: 'hsl(var(--cedar) / X)'` (the bronze-step pattern). That logic now lives in `bronzeStep()` in `src/lib/colors.ts` — the 33 site-wide hand-rolled gradients should call it.
10. **Four orphaned components** still on disk (`LifeAfterFirstHeat`, `RitualIdentity`, `TemperatureTicker`, `ImageDivider`) — sauna-brand leftovers, zero references. They keep showing up in greps and confusing future-you.
11. **`CedarCTA` defines its own shadow strings** (`hsl(28 50% 52% / X)`) instead of using `BUTTON.primary` + `SHADOW.thermal` from the token files. Same for `Navigation`'s "Request a Quote" button (a third bronze-button implementation).
12. **`SubPageHero` has its own animation strings inline** (`clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1)`) instead of the `EASING.smooth` + `DURATION.cinematic` tokens.

---

## The plan — one approved batch, broken into clean phases

### Phase 1 — Component primitives (the missing layer)

Build three new primitives in `src/components/ui/` that wrap the tokens so consumers never write inline styles for these patterns again:

- **`<BronzeRule />`** — the canonical horizontal divider (`numeral · short rule · eyebrow`). Replaces ~15 hand-rolled `<div className="w-8 h-px bg-cedar/40" />` blocks across Hero, About, Portfolio, FeaturedProjects, ScrollReveal, etc.
- **`<TrustChip icon label />`** — replaces the chip pattern in Hero. Default style: borderless, comma-separated row with vertical hairline dividers; opt-in `variant="badge"` keeps the boxed look for forms.
- **`<StatTrio items />`** — the 3-up stat row used by Hero floating card AND the About section AND the Footer (currently three different implementations). One component, three uses.

These primitives import directly from `STAT`, `EYEBROW`, `BORDER`, `bronzeStep`, `DIVIDER` — so any token change ripples to every consumer.

### Phase 2 — Hero re-cut (the highest-impact section)

Two changes only — keep the bones, fix the editorial:

1. **Adaptive layout**: when `MediaSlot` returns no media, the hero collapses to a single-column type-led layout (full-width headline + lead + CTA stack, no empty plate). When media exists, return to the two-column FlexServices-style layout. This needs a new `<MediaSlot.WithFallbackMode>` API or the page can read `useFirstApprovedMedia` directly and branch.
2. **Headline upgrade**: increase `clamp` max from `4.75rem` to `5.5rem`, drop `lg:col-span-7` constraint when no photo, replace the trust chips with a single comma-separated rule: `WCB covered  ·  Fully insured  ·  Locally owned, Alberta`.
3. Replace inline gradient with a tokenized `BACKDROP.evergreenRadial` constant in `src/lib/colors.ts` so other dark sections can reuse it.

### Phase 3 — Token adoption sweep (the structural win)

Convert these files to import from `src/lib/`:

| File | Currently | Becomes |
|---|---|---|
| `Hero.tsx` | 9 inline styles + raw classes | `HEADLINE.hero`, `BODY.lead`, `EYEBROW.accent`, `STAT.hero`, `bronzeStep()` |
| `Services.tsx` | 8 inline + raw `bronzeStep` math | `HEADLINE.section`, `BODY.default`, `bronzeStep()`, new `<BronzeRule />` |
| `About.tsx` | 6 inline + duplicated stat code | Replaces hand-rolled `StatCard` with `<StatTrio />`, uses `QUOTE.pull` |
| `Testimonials.tsx` | 6 inline + 3 hard-coded width classes | `QUOTE.testimonial`, `QUOTE.attribution`, `bronzeStep()` for avatar tints |
| `Portfolio.tsx` | 5 inline + a duplicate of FeaturedProjects | Become **Editorial Strip** — full-bleed scroll-snap row, no card grid; FeaturedProjects keeps the grid (deliberate structural difference) |
| `FeaturedProjects.tsx` | own grid | unchanged structure, but uses `HEADLINE.section`, `BODY.small` |
| `Contact.tsx` (component) | 6 inline | `HEADLINE.section`, `BODY.lead`, `BUTTON.primary.base`, removes inline gradients |
| `Footer.tsx` | none of token system | uses `EYEBROW.onDark`, `UI.navLink`, new `<StatTrio variant="footer">` |
| `Navigation.tsx` | own button impl | uses `BUTTON.primary.base`, `UI.navLink` |
| `CedarCTA.tsx` | hand-rolled shadows | uses `BUTTON.primary` + `SHADOW.thermal` from `colors.ts` |
| `SubPageHero.tsx` | inline animations + 9 inline styles | uses `EASING.smooth`, `DURATION.cinematic`, `HEADLINE.display`, `EYEBROW.onDark` |
| `SectionHeader.tsx` | half-tokenized | wraps the new `<BronzeRule />` |

After this sweep the count of `style={{` blocks across `src/components` drops from **~120 to <20** (only legitimate dynamic things: parallax transform, computed `--accent-intensity`, MediaSlot bg-image url).

### Phase 4 — Section rhythm (the breathability fix)

Currently every section is `py-24 md:py-32` + `grain-overlay`. Replace with the tokenized rhythm in `src/lib/spacing.ts`:

- **Hero** — `SECTION_PADDING.hero` (no top, generous bottom, no grain)
- **TrustStrip** — `SECTION_PADDING.strip` (compact, no grain) ✅ already correct
- **Services** — `SECTION_PADDING.default`, grain on the responsibility-matrix only
- **About** — `SECTION_PADDING.default`, NO grain (let it breathe), keeps the brand-promise plate as the textural moment
- **Testimonials** — `SECTION_PADDING.default`, grain on each card not on the section
- **EditorialBleedSection** — promote one between Testimonials and Portfolio (the rule is "never two bleeds in a row" — currently we have zero between hero and footer)
- **Portfolio** — restructure to a single-row scroll-snap strip (cinematic), one grain plate
- **FeaturedProjects** — keep grid, NO grain (clean tabular contrast)
- **Contact + Footer** — already good

Net effect: visible cadence of textured → calm → textured → calm down the page, instead of the current "everything is grainy."

### Phase 5 — Cleanup

- Delete the 4 orphaned components: `LifeAfterFirstHeat.tsx`, `RitualIdentity.tsx`, `TemperatureTicker.tsx`, `ImageDivider.tsx` (zero references confirmed).
- Move `useAlbertaTemp.ts` and `useSeason.ts` into a deprecation list (still imported by `TemperatureTicker` only — go together).
- Re-run `tsc --noEmit` and ensure zero new errors.

### Phase 6 — Validation

- Visual: screenshot Home at 1366×768, 1024×768, 390×844 — diff against today's screenshots.
- Token coverage: `rg "from \"@/lib/(colors|typography|spacing|motion)\"" src/components | wc -l` — must show ≥ 9 components (currently 0).
- Inline-style count: `rg "style=\{\{" src/components src/pages | wc -l` — target < 35 (currently 110+).
- Re-measure the homepage with `browser--performance_profile` to confirm the inline-style purge does NOT regress LCP/CLS.
- Update `mem://design/token-architecture` with the new "components consume these tokens" matrix and add a memory `mem://design/component-primitive-map` listing which primitive each consumer uses.

---

## What this does NOT include (deliberately deferred)

- Sub-page (`/services`, `/work`, `/about`, `/contact`) interior content rewrites — only their `SubPageHero` gets tokenized in this pass.
- New illustrations/photography sourcing — that's a content task, separate from system enforcement.
- The QuoteModal interior — already heavily customized, low ROI to touch this pass.
- A11y audit — separate dedicated pass once the token architecture stops shifting.

After this lands, the next loop's natural target is the sub-page interiors (Services pricing tiles, Work case studies, About founder section, Contact two-column form) — they'll go fast because the primitives will be in place.

---

## Estimated impact

| Metric | Before | After (target) |
|---|---|---|
| Token files imported by shipping components | 0 | 9+ |
| `style={{}}` blocks in `src/components` | 110 | < 30 |
| Distinct bronze-button implementations | 3 | 1 |
| Distinct stat-row implementations | 3 | 1 (`<StatTrio />`) |
| Sections with `grain-overlay` on root | 5 | 2 |
| Orphaned sauna-brand components | 4 | 0 |
| Hero readability at 1366px (no photo case) | dead right column | full-width type hero |

The site will feel more like Fantasy / FlexServices because the rhythm is intentional and the system is the implementation, not aspiration.