# Style Guide v4 — Editorial Governance Reference

**Goal.** Promote `/style-guide` from a "developer reference" to a stakeholder-grade brand book. Same source-of-truth philosophy (everything still imported from `src/lib/*` so it can never drift from the live tokens), but with the **structural discipline of RoyalMechanical's guide** and the **clean, restrained aesthetic of FlexServices**.

**Why now.** The current page imports `VERBAL_IDENTITY` and `VISUAL_DIRECTION.colorUsage` but never renders them. Card padding, subhead rhythm, eyebrow casing, and copy-button states drift between sections because every section reaches for its own ad-hoc Tailwind. The result is exactly what you described: the data is there, the surface looks "cheap and inconsistent."

This plan fixes both problems in a single pass: (1) **one card system + one section template** that every block must use, and (2) **three new sections** that surface the brand data we already have.

---

## A. Layout primitives — the consistency contract

Move every visual primitive into a single block at the top of `src/pages/StyleGuide.tsx` so a future contributor cannot reinvent them.

1. **`<GuideShell>`** — single page chrome. Renders the cream canvas, the v4 header strip, the two-column grid (`200px` rail + content), and the footer. Today these styles live inline at the bottom of the file; promoting them means the page can never go off-grid.
2. **`<GuideSection>`** — replaces today's hand-rolled `<section className="mb-32">…</section>` blocks. Props: `id`, `numeral`, `eyebrow`, `title`, `description`, `children`. Owns the bottom margin, scroll-margin, and `<SectionAnchor>` so every section ends with the same breathing room.
3. **`<Subhead>`** stays, but is rewritten to `mt-16 mb-6 first:mt-0` and gains a leading hairline (`<div className="h-px w-8 bg-cedar/30 mb-3" />`) — a Royal-style detail that visually separates each subsection without ever looking decorative.
4. **`<TokenCard>`** — one canonical card. Replaces the inconsistent mix of `<Card>`, bare `<div className="border …">`, and the column rows used in Royal's pattern. Props: `title`, `value`, `description?`, `preview?`. Always renders title row → optional preview → mono `value` chip → copy button. **All token rows in Color/Spacing/Motion sections route through this.**
5. **`<DoDontGrid>`** — two-column do/don't card stack used at the end of Type, Spacing, and Motion. Today each section re-implements this; one component locks the casing of `✓ Do` / `✕ Don't`, the bronze/40 left border, and the muted strikethrough on "don't" items.
6. **`<RuleList>`** — replaces the various `<ul className="space-y-3">` patterns used for Non-Negotiables and Photography Rules. Two variants: `accent` (cedar bullet, dark text) and `mute` (gray dash, muted text).
7. **`<EyebrowLabel>`** — a tiny text component that produces the `text-[10px] tracking-[0.25em] uppercase text-cedar` label used 30+ times across the page. Right now every instance is a hand-typed Tailwind string and they drift (some are `text-[11px]`, some are `tracking-[0.18em]`).

After this primitive layer lands, every section becomes ~30% shorter and structurally identical — which is what makes it feel "designed" instead of assembled.

---

## B. Header & rail — quiet authority

The current hero is a stand-alone `<section>` near the bottom of the file with its own bespoke spacing. Replace it with a **fixed editorial header strip** modeled on Royal's `lg:ml-56` shift, but tuned to Creek's warmer canvas:

- **Top strip.** Pre-title eyebrow `Creek Construction · Brand & Design System · v1.0 · April 2026`. One line, hairline rule beneath, no decorative chips.
- **Headline.** `font-serif text-5xl md:text-6xl lg:text-7xl text-balance` reading "**The Editorial Brain.**" — replaces today's "Creek Construction Style Guide" which is descriptive, not memorable.
- **Standfirst.** `BRAND_SPINE.purpose` rendered in `font-serif italic text-xl text-foreground/65 max-w-2xl`. Same content as today, but moved into the header instead of duplicated in the Brand section.
- **Index strip.** A horizontal mini-TOC under the standfirst — `I · Brand · II · Color · III · Type · IV · Spacing · V · Motion · VI · Components · VII · Performance · VIII · Governance · IX · Verbal · X · Imagery · XI · Logo`. Cedar numerals, muted labels, hairline separators between each entry. Acts as a one-glance map of the document.

The existing **`<LeftRail>`** stays as the sticky companion on `lg`, but its anchors get the new section IDs and its label uppercases harmonize with the header strip.

---

## C. Eight existing sections — refit, not rewrite

Each section keeps its content but gets re-routed through the new primitives. No content is removed.

| § | Section       | Changes |
|---|---------------|---------|
| I | **Brand** | Drop the inline tagline duplication (now in header). Tabs stay. Add a fifth tab **Color Usage** that renders `VISUAL_DIRECTION.colorUsage` (`evergreen`, `bronze`, `cream`, `stone`) — currently exported but invisible. |
| II | **Color** | Every divider/border/shadow row routes through `<TokenCard>`. Swatch component keeps its photography-style header but the metadata table beneath is unified. Add `BACKDROP` (gradient backgrounds) preview row — they're exported but never shown. |
| III | **Typography** | `<TypeSpecimen>` becomes a `<TokenCard>` variant. Add `LINE_HEIGHT` and `LETTER_SPACING` tables that exist in `typography.ts` but aren't on the page today. |
| IV | **Spacing** | All token tables route through `<TokenCard>`. The 8px grid reference (`GRID_8PX`) gets its own visual ladder — currently never rendered despite being exported. |
| V | **Motion** | Easing demos keep their hover-to-play behavior; their card chrome is normalized. Add the `KEYFRAME` reference list (also exported, also currently invisible). |
| VI | **Components** | Aspect ratios + form inputs + card surfaces stay. Add a **"Components in situ"** strip that shows live `BronzeRule`, `TrustChips`, `StatTrio`, `CedarCTA` (primary + secondary), and `SectionHeader` (default + quiet) so the page documents the *shipped library*, not just the tokens. Direct imports from `@/components/ui/*` and `@/components/SectionHeader`. |
| VII | **Performance** | Table stays. The `LAST_MEASURED` block is moved out of the component and into a top-of-file constant with a `// Update after every perf pass` comment so contributors know it's the artifact, not auto-magic. |
| VIII | **Governance** | Cards route through the new primitive. Add a final **"This page is alive"** block stating the page is rendered from `src/lib/*.ts` and changes there propagate here without touching the JSX. |

---

## D. Three new sections — surfacing what's already in the data

These are the missing surfaces that make today's guide feel half-built.

**§ IX. Verbal Identity** (new, between Governance and the footer is wrong — it goes between Brand and Color so it reads as part of the editorial brain).
Renders:
- `VERBAL_IDENTITY.capitalization` as a `do / wrong[]` row with curly-quote examples.
- `VERBAL_IDENTITY.services` capitalization as chip rows.
- `VERBAL_IDENTITY.punctuation` as a numbered `<RuleList accent>`.
- A "Phone & address format" `<TokenCard>` triplet rendering `phone`, `email`, `serviceArea` so contributors copy the canonical strings instead of typing them.

**§ X. Imagery & Media.**
Pulls `VISUAL_DIRECTION.photographyRules` (already exported) into a dedicated section with three sub-blocks:
- **Provenance contract** — short prose paragraph explaining MEDIA_PLAYBOOK.md and the EditorialPicture / MediaSlot / EditorialBleedSection trio (cross-link to memory).
- **Aspect ratio ladder** — lift the AspectRatios array out of Components and re-render it here in context, with a one-sentence usage note per ratio.
- **Fallback gradients** — render `BACKDROP.editorialFallback` (and friends) as live tiles so contributors see what an empty media slot looks like instead of guessing.

**§ XI. Logo & Marks.**
Cross-references the `mem://design/logo-asset-map` rules in code:
- The Creek wordmark in light + dark contexts (renders `BrandMark` directly with `onDark` toggle).
- The favicon and social-card logo files listed as `<TokenCard>` rows pointing at their public-folder paths.
- A "Don't do this to the logo" do/don't grid (no recolor, no rotate, no add-effects, minimum 32px high).

These three sections take the page from "developer notes" to a brand book a stakeholder could actually walk a new hire through.

---

## E. Visual polish pass — kills the "cheap" feeling

These are the small, repeated details that, today, add up to the page looking thrown together. Fixing them in the primitives applies the fix everywhere at once.

1. **Eyebrow casing & tracking.** Lock to one spec: `text-[10px] uppercase tracking-[0.25em] text-cedar font-medium`. Every variant (some sections use `text-[11px]`, some use `tracking-[0.18em]`, some use `text-cedar/80`) collapses into `<EyebrowLabel>`.
2. **Card padding.** All `<TokenCard>` and `<Card>` instances use `p-6` content + `p-5` for compact rows. Today they range from `p-4` to `p-8` randomly.
3. **Border tone.** Standardize on `border-border/60` for cards and `border-border/40` for inner separators. Remove the `border-cedar/30` accent on cards (it adds noise) — keep cedar borders only for the `do` card in `<DoDontGrid>`.
4. **Code chips.** Today there are three rendering styles (`bg-secondary/60`, `bg-muted`, `bg-secondary`). Lock to one: `bg-secondary/50 text-foreground/80 font-mono text-[11px] px-2 py-1 rounded-sm`.
5. **Copy button.** Rebuild as a 28×28 hit target with a centered icon and an `aria-live` announcement on "Copied". Today the button appears with two different sizes between sections.
6. **Curly quotes.** Sweep the file for any `"` / `'` left over and replace with `"` / `'` / `'`. Memory rule already calls for this; one of the type specimens has a stray straight apostrophe.
7. **Numbering style.** All Roman numerals render with `tabular-nums text-cedar/40` at one consistent size. The current page has both `text-cedar/40` and `text-cedar/60` instances.
8. **Footer.** Replace the current "Source: src/lib/*.ts" with two short lines: a copyright/version line on the left, a "Built from `src/lib/*` — change tokens there to update this page" note on the right. Reads as documentation, not boilerplate.

---

## F. Anti-drift rules — the "never inconsistent again" gate

These get added as block comments inside `src/pages/StyleGuide.tsx` and as bullets in `STYLE_GUIDE.md` so future edits cannot regress the surface:

- **Rule 1.** No JSX in this file is allowed to use `<div className="border …">` directly — every bordered surface MUST use `<TokenCard>` or `<Card>`.
- **Rule 2.** No hand-written `text-[10px] uppercase tracking-[…]` strings — must go through `<EyebrowLabel>`.
- **Rule 3.** No new section may be added without `<GuideSection>` — the numeral, eyebrow, and scroll margin are then guaranteed.
- **Rule 4.** Any new token in `src/lib/*` requires a corresponding row in this file before merge. Enforced by review (no automation), but the rule is documented in `STYLE_GUIDE.md`.
- **Rule 5.** No section may import from `@/components/ui/*` directly except VI (Components in situ) — keeps the Token sections honest about being *token references*, not component demos.

---

## G. Files touched

- `src/pages/StyleGuide.tsx` — major refactor (rewrite around the new primitives, add §IX–XI, route every existing section through `<GuideSection>` + `<TokenCard>` + `<EyebrowLabel>`).
- `STYLE_GUIDE.md` — append the anti-drift rules from §F. Bump "Last revised" line.
- `mem://design/token-architecture.md` — add a one-line note that `/style-guide` now renders Verbal Identity, Imagery, and Logo sections, so contributors know to update them when those tokens change.

**Not touched.** All `src/lib/*.ts` files remain untouched — this pass is purely how those tokens are *displayed*. No contracts change.

---

## H. Verification checklist (before declaring done)

- TypeScript compiles clean (`tsc --noEmit`).
- Every existing section still renders its tokens; nothing dropped.
- New sections (§IX, §X, §XI) render on first paint with no console warnings.
- Copy button works on every chip and announces "Copied" once per click.
- All anchor links in the header strip and `<LeftRail>` jump to the right scroll position with the correct top offset (`scroll-mt-24`).
- Lighthouse a11y on `/style-guide` ≥ 95 (color contrast, focus rings, alt text on the BrandMark preview, keyboard nav of tabs).
- Page weight of `/style-guide` stays under 80 KB JS (gz) — it's lazy-loaded, but it should still be the lightest route on the site.
- `mem://index.md` doesn't need editing; the existing token-architecture entry already covers `/style-guide`.

---

## I. Out of scope

- No design-token changes (no new colors, no new fonts, no new motion curves). Those are separate plans.
- No publishing of `/style-guide` to the public nav — it stays at `/style-guide`, lazy-loaded, `noindex, nofollow`. Internal-only.
- No Markdown export of the style guide. The page IS the artifact; if a stakeholder wants a PDF, they print to PDF from the rendered page.
