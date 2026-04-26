# Style Guide v6 — Sub-Page Primitive Adoption & System Cleanup

## Why this matters

In v5 I built the canonical primitives (`PageHero`, `BreadcrumbTrail`, `ServiceTile`, `FaqAccordion`, `ProjectTile`) but **none of the four sub-pages actually consume them yet**. Every sub-page (`Services`, `Work`, `About`, `Contact`) still hand-rolls:

- An evergreen hero with an inline `radial-gradient(...)` style block (4 copies)
- An inline `clamp()` h1 size (4 copies)
- A breadcrumb `<nav>` with the same 4 magic strings (4 copies)
- Service / FAQ / project / contact card patterns built directly with Tailwind + `style={{}}` blocks

This is *exactly* the drift the design system was built to prevent. A new contributor reading `src/lib/colors.ts` would think the system is enforced — when in reality the shipping pages bypass it. The result: when we tweak a token, four pages silently fall out of sync.

This loop closes that gap and removes the legacy primitives that the new ones replaced.

---

## Phase 1 — Sub-page hero adoption (PageHero everywhere)

Replace the hand-rolled hero `<section>` blocks at the top of each sub-page with `<PageHero variant="evergreen" ...>`. This single change deletes ~22 lines of duplicate JSX per page and routes everything through `BACKDROP.evergreenRadial`, `BreadcrumbTrail`, `BronzeRule`, and `HEADLINE.display`.

### `src/pages/Services.tsx`
- Remove lines 42–71 (hero `<section>`).
- Replace with:
  ```tsx
  <PageHero
    variant="evergreen"
    breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
    numeral="I"
    sectionLabel="EXTERIOR CONSTRUCTION"
    title="Six things, done right."
    subtitle="All residential. All exterior. All built to outlast Alberta winters."
    skipToId="all-services-heading"
  >
    <CedarCTA>Request a Quote</CedarCTA>
  </PageHero>
  ```

### `src/pages/Work.tsx`
- Remove lines 42–72.
- Replace with `<PageHero variant="evergreen" breadcrumb={[…, { label: "Our Work" }]} numeral="I" sectionLabel="SELECTED PROJECTS" title="The work speaks first." subtitle="Selected recent projects across Calgary, Edmonton, and surrounding Alberta." />`.
- Move the "Sister studios · B & P Saunas · Hickory & Rose" footnote into PageHero `children`.

### `src/pages/About.tsx`
- Remove lines 28–50.
- Replace with `<PageHero variant="evergreen" breadcrumb={[…, { label: "About" }]} numeral="I" sectionLabel="OUR STORY" title="Built on the work itself." subtitle="Locally owned. Calgary and Edmonton. No gimmicks — just the craft." />`.

### `src/pages/Contact.tsx`
- Remove lines 23–45.
- Replace with `<PageHero variant="evergreen" breadcrumb={[…, { label: "Contact" }]} numeral="I" sectionLabel="GET IN TOUCH" title="Let's talk about your project." subtitle="Free quote. No high-pressure sales. Honest answers." />`.
- Use the curly apostrophe (`Let's`) — currently shipping `Let's`.

**Outcome:** every sub-page hero is now a 7-line component invocation. ~120 lines of JSX deleted. Single tweak to `BACKDROP.evergreenRadial` updates four pages at once.

---

## Phase 2 — Card primitive adoption

### `src/pages/Services.tsx` — service grid
- Replace the `SERVICES.map` block (lines 86–121) with:
  ```tsx
  <ServiceTile key={s.id} item={s} index={i} total={SERVICES.length} variant="compact" onClick={() => openModal([s.id])} />
  ```
- This deletes the inline `border-left-color`, the manual icon plate, the manual numeral, the `style={{}}` block. All of it now lives in the primitive.

### `src/pages/Services.tsx` — FAQ
- Replace lines 138–164 with `<FaqAccordion items={FAQS} />` wrapped in `<ScrollRevealMotion delay={0.2}>`.

### `src/pages/Work.tsx` — placeholder grid
- Replace `PLACEHOLDERS.map` (lines 137–178) with `<ProjectTile item={{ title, location, description, icon }} index={i} total={PLACEHOLDERS.length} onClick={() => openModal([w.service])} />`.

### `src/pages/About.tsx` — process steps + city chips
- Process steps (lines 96–115): the bronze-step border pattern is identical to what `bronzeStep()` produces. Replace inline `style={{ borderLeft: ... }}` with `style={{ borderLeft: \`2px solid hsl(var(--cedar) / ${bronzeStep(i, steps.length)})\` }}` so the math lives in `src/lib/colors.ts`, not the page.
- City chips (lines 131–142): same — switch to `bronzeStep(i, CONTACT.cities.length)`. Better long-term: extract a `<CrescendoChip>` primitive in a follow-up loop.

### `src/pages/Contact.tsx` — contact rows + CTA card
- Contact rows (lines 60–121): four near-identical blocks. Replace each `style={{ borderLeft: ... }}` with `bronzeStep(i, 4)` from `src/lib/colors.ts` so the bronze crescendo is computed once. Keep the icon + label + value layout inline for now (extracting a `<ContactRow>` primitive is a v7 task — the visual only appears once on the site).
- CTA card (lines 126–166): swap the inline `linear-gradient(...)` for `BACKDROP.evergreenCard` (we'll add this token to `src/lib/colors.ts` if it isn't there yet — currently the gradient is duplicated here and in `Hero.tsx`). Use the curly apostrophe in body copy.

---

## Phase 3 — Token additions

Add to `src/lib/colors.ts` only what's actually duplicated across the codebase:
- `BACKDROP.evergreenCard` — `linear-gradient(135deg, hsl(var(--evergreen)) 0%, hsl(150 25% 10%) 100%)` (used by Contact CTA and Hero photo card overlay)
- Confirm `BACKDROP.evergreenRadial` exists; if not, add it as the canonical sub-page hero radial.

No speculative tokens. Tokens earn their place by appearing 3+ times.

---

## Phase 4 — Delete orphaned files

Once the new primitives are wired up everywhere, delete:
- `src/components/SubPageHero.tsx` — replaced by `PageHero` variant="cinematic"
- `src/components/NarrativeBreadcrumb.tsx` — replaced by `BreadcrumbTrail`

Update `src/index.css` line 345 comment that still references `SubPageHero`.

Verify with `rg -n "SubPageHero|NarrativeBreadcrumb" src/` returning zero matches before deleting.

---

## Phase 5 — Mobile + a11y polish

While we're touching every sub-page:
1. **Hero stat row on mobile**: in `src/components/Hero.tsx`, when there's no photo, the inline `STATS.map` block (lines 137–143) renders three columns that get crushed below 380px. Wrap in `flex-wrap gap-y-3` and bump tap targets to `min-h-[44px]`.
2. **Curly quotes sweep**: the v5 pass missed the description copy on `/services` ("we're", "we'll"), `/work` ("we'd"), `/about` ("don't", "isn't", "we'd"), and `/contact` ("Let's"). One sed-style replace pass across the four pages — apostrophes only, never inside JSX attribute strings.
3. **Active-state nav indicator**: in `src/components/Navigation.tsx`, add a 1px bronze underline that animates from 0 → 100% width when a route is active. Keyframe lives in `src/index.css`, NOT inline.

---

## Phase 6 — Memory & docs sync

- Update `mem://design/component-primitive-map.md` to add the four sub-page consumers under each primitive (PageHero → Services/Work/About/Contact, etc.).
- Update `mem://architecture/core-design-system.md` — replace `SubPageHero` references with `PageHero`.
- Add a one-line entry to `STYLE_GUIDE.md`'s "Source of truth" callout reminding contributors that **sub-pages must consume primitives, never re-implement them**.

---

## Phase 7 — Validation

- `tsc --noEmit` must pass.
- Open `/services`, `/work`, `/about`, `/contact` at 1280×720 and 375×812 viewports. Confirm:
  - Hero is visually identical (or better) — no regressions to the bronze crescendo
  - Breadcrumb is consistent across all four pages
  - Service tiles, FAQ, project tiles all reflect the same hover/focus pattern
  - No `style={{ background: "radial-gradient..." }}` left in any sub-page (`rg -n "radial-gradient" src/pages` should return zero)
- Re-run the inline-style audit: `rg -nl "style=\{\{" src/pages` should drop from 4 files to 0 (all remaining inline styles will live inside primitive components, which is correct — the page level is now declarative).

---

## What this loop deliberately does NOT do

- **No new visual concepts.** This is a system-enforcement loop. New ideas (animated section dividers, hero video on /work, etc.) are v7+ work and need their own brief.
- **No content rewrites.** Copy edits limited to apostrophe correctness.
- **No primitive extraction beyond what's already used 3+ times.** `<ContactRow>`, `<CrescendoChip>` are tempting but only appear once each — extracting them now would be premature.

---

## Files touched

- **Edit:** `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`, `src/components/Hero.tsx`, `src/components/Navigation.tsx`, `src/lib/colors.ts`, `src/index.css`, `STYLE_GUIDE.md`, `mem://design/component-primitive-map.md`, `mem://architecture/core-design-system.md`
- **Delete:** `src/components/SubPageHero.tsx`, `src/components/NarrativeBreadcrumb.tsx`
- **Create:** none — this loop is consolidation, not expansion

Net code change: roughly **−400 lines** (duplicate JSX deleted) and **+80 lines** (primitive invocations + token additions). The system gets smaller and stronger.
