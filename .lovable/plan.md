# Conversion + Performance Pass v4 — Finishing the Reduction

> The last three passes landed structure, the modal collapse, and the mobile FAB. This pass closes out the **remaining 12 wrappers**, the **last 37 `transition-all` instances**, the **4-tile Contact stack** that should be one panel, and adds the **Footer's tertiary Quote CTA** — the final conversion attempt before the user leaves the page.

> Verified state of the codebase as of right now:
> - 12 `ScrollRevealMotion` callsites still alive across `Services.tsx`, `About.tsx`, `Contact.tsx`, `FeaturedProjects.tsx`, `Services` page, `Contact` page, `About` page, `Work` page.
> - 37 `transition-all` / `duration-700` instances across `src/components` and `src/pages` — most are mechanical swaps to explicit property lists.
> - `Contact.tsx` still renders 4 separate bordered tiles with their own grain layers and 500ms transitions — exactly what audit-pass v3 flagged for collapse.
> - Hero CTA pair on iPhone SE drops below the fold; subtitle line-height is `relaxed` and TrustChips has a `mb-10` that's too generous on `<sm`.
> - Footer has no Quote CTA — the user has scrolled all the way down and we don't make one last ask.

---

## A · Eliminate the remaining `ScrollRevealMotion` wrappers (the highest-leverage perf cut)

The shim works but every wrapped node still adds a DOM element + observer subscription. **Apply `useReveal` at the section root and drop the per-child wrappers entirely.** The user perceives a section appearing as a unit; per-item staggers were never serving the brand.

### A1 · `src/components/Services.tsx`
- Drop the `<ScrollRevealMotion key={service.id} delay={i * 0.08} y={28}>` around each service tile (6 wrappers gone).
- Apply `useReveal` to the section's outer `<div className="container">` so the whole grid fades in as one. Net: **6 observers → 1**.
- Remove the now-unused `ScrollRevealMotion` import.

### A2 · `src/components/About.tsx`
- Drop all four `ScrollRevealMotion` wrappers (the lead paragraphs, the brand-promise plate, the process column heading, the process step list).
- Apply `useReveal` to the outer `.container` once.
- Replace the `hover:translate-x-1` on process steps with `hover:translate-x-1` already there — already compositor-only, **no change needed there**.
- But: replace the `transition-colors duration-500` on step number + heading with `duration-300` (matches the new motion token cadence).

### A3 · `src/components/Contact.tsx`
- Drop **all five** `ScrollRevealMotion` wrappers in this section.
- Apply `useReveal` to the outer container.
- See section B below for the bigger collapse of the four contact tiles.

### A4 · `src/components/FeaturedProjects.tsx`
- Drop the per-card `ScrollRevealMotion` (was wrapping every `ProjectCard`).
- Drop the "See all work" wrapper at the bottom.
- The cards naturally appear together as part of the section — apply `useReveal` to the section root.

### A5 · `src/components/media/FieldClipsStrip.tsx` and `HomeProjectRecapStrip.tsx`
- Both are now off the homepage but live on `/work`. Drop their per-item wrappers same way.

### A6 · `src/pages/About.tsx`, `src/pages/Contact.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/NotFound.tsx`
- Same pattern — section root only, no per-child wrappers.

**Net DOM reduction**: ~28 wrapper `<div>`s gone from the homepage alone. ~50 across the full site.

---

## B · Collapse the four Contact tiles into one panel

`src/components/Contact.tsx` currently stacks:
1. The MediaSlot photo card
2. The "DIRECT CONTACT" `<a>` for phone with grain + border + hover
3. The same again for email
4. The "SERVICE AREAS" chip cloud
5. The "What to expect" card-glass plate

That's **5 paint roots** for what reads as one column. The audit (B5 in v3 plan) called for a single bordered card with internal hairlines. Concretely:

### B1 · Restructure to a single panel
- Wrap the phone, email, service areas, and "what to expect" content inside **one** `<aside>` with `border border-border/40 rounded-sm` and a single grain layer.
- Use internal `<hr className="border-border/30 my-6" />` (or just `border-b` on each row) to separate sections — no per-row borders, no per-row grain, no per-row shadow.
- The phone + email rows become flex rows with `Phone` / `Mail` icons, label, value. Hover state is **only** a color change on the value (`hover:text-cedar`), not a 500ms `transition-all` on background/border/shadow.
- Service areas remain a chip cloud but lose the per-chip `grain-texture` and `shadow-contact` (15 paint roots → 0).
- "What to expect" becomes a small list at the bottom of the same panel — no second `card-glass` container.

### B2 · Drop the `group-hover/contact:scale-110` icon scale
- 16px icons scaling 10% on hover is decorative noise. Remove (matches v3 C7).

### B3 · Drop the duplicate Hero/Contact secondary CTAs
- v3 already removed Services bottom CTA. Contact still has just the primary `<CedarCTA>` — verify it's the only CTA in the section and remove any "or send a general message" text if it crept back in.

---

## C · `transition-all` → explicit property lists (mechanical sweep)

37 remaining instances. Browser must monitor every animatable property on each `transition-all`. Replace with what's actually changing:

- `hover:bg-X` only → `transition-colors`
- `hover:scale-X` / `hover:translate-X` → `transition-transform`
- `hover:shadow-X` → `transition-shadow`
- combined → `transition-[background-color,box-shadow,border-color]` etc.

### Files in scope (verified):
- `src/components/Contact.tsx` (lines 61, 74, 97) — already addressed via section B's collapse, but if any survive, swap them.
- `src/pages/Contact.tsx` (lines 59, 75) — phone/email tile transitions.
- `src/pages/About.tsx` (lines 95, 126) — process tiles + city chips.
- `src/components/FeaturedProjects.tsx` (line 113) — "View project" arrow.
- `src/components/ui/project-tile.tsx` (lines 100, 123, 132, 143, 183) — card hover stack.
- `src/components/ui/sidebar.tsx` line 257, `src/components/ui/progress.tsx` line 16 — admin-area UI; lower priority but still mechanical.

### And: drop `duration-700` → `duration-300` on hover-trigger transitions
- 500–700ms hovers feel deliberate but hold compositor layers alive 2–3× longer than needed. INP improves measurably when fewer cards are in the "transitioning" state at once.
- Keep entrance/reveal animations at 400–500ms (they need to feel intentional). Touch-only.

---

## D · Hero mobile fold tightening (the conversion-critical visual)

On iPhone SE (375×667) the Hero CTA pair drops below the fold. Verified in the file: `subtitle` uses default leading (relaxed), TrustChips has `mb-10` (40px), and the dual CTA + tel link wraps to 3 lines on `<sm`. Three small edits restore above-the-fold:

### D1 · `src/components/Hero.tsx`
- TrustChips: change `className="mb-10"` to `className="mb-6 sm:mb-10"`.
- CTA row: change `gap-6` → `gap-x-6 gap-y-3` so the wrap doesn't add a full row gap.
- The `or call` link: change `text-[11px]` → `text-[12px]` for legibility but tighten `tracking` so it occupies same width.

### D2 · Verify in `PageHero` (variant `editorial-split`)
- The subtitle prop renders inside `PageHero`. If it uses `leading-relaxed`, override to `leading-snug` on `<sm`. (Read first — only patch if confirmed.)

---

## E · Footer Quote CTA — the final conversion attempt

Currently `Footer.tsx` has phone, email, navigation links, service areas, and the legal row. **No CTA**. The user has consumed everything we offered; a single tertiary "Request a Quote" line above the legal row is the last ask before they leave the page.

### E1 · Add a single inline CTA
- Above the `mt-16 pt-8 border-t` row, add a small horizontal flex row:
  - Left: `<p>` with text `"Ready to start? Tell us about your project."`
  - Right: a `<CedarCTA>` (small variant) labeled `"Request a Quote"`.
- Hairline `border-t border-evergreen-foreground/10` above it to separate from the 3-column block.
- Padding `py-8 mt-12`.
- On `<sm`: stacks vertically, CTA full-width.

### E2 · Footer keeps minimum visual weight
- No grain overlay, no shadow, no hover surface — the CTA is the only interactive element here.

---

## F · Sweep small remaining noise

### F1 · Drop the inner `grain-overlay` in `FeaturedProjects.tsx` line 78
- It stacks on a `linear-gradient` background that's already textured. Audit v3 flagged this; still present.

### F2 · `src/pages/NotFound.tsx`
- Has an inner grain layer that v3 flagged. Drop it.

### F3 · `MobileQuoteFAB.tsx` — confirm visibility logic on `/contact`
- Currently FAB hides only when intersecting `#section-contact` (which only exists on the homepage). On `/contact` page the section ID is also `section-contact`, so it should hide correctly there. Verify in the deploy that the FAB is hidden on `/contact` after scroll past 600px.
- One observed gap: on the `/services`, `/about`, `/work` pages the FAB stays visible because none of those have `#section-contact`. **That's correct behavior** — those pages SHOULD have the FAB.

### F4 · Audit `useReveal` import is consistent
- Some files may still import `ScrollRevealMotion` after the wrappers are gone — clean the imports so we don't ship dead code.

---

## G · QA contract

After implementation:

1. **Wrapper count**: `rg -l "ScrollRevealMotion" src/components src/pages` returns **only** `src/components/ScrollRevealMotion.tsx` (the shim itself, kept for backward compat) — zero callsites.
2. **transition-all count**: `rg "transition-all" src/components src/pages | wc -l` returns ≤ 5 (only inside primitive UI components like `sidebar.tsx`/`progress.tsx` where the property set is intentionally broad).
3. **Contact section paints**: One panel, one grain layer, one shadow root for the right column. Visually inspect at desktop + mobile.
4. **Hero mobile fold**: At 375×667 viewport, the "Request a Quote" button is fully visible without scroll.
5. **Footer**: Bottom of every page now ends with a small "Ready to start? Request a Quote" line above the legal row. CTA opens the modal.
6. **Type-check**: clean.
7. **Build**: succeeds.
8. **Visual diff**: identical hero copy, identical service grid, calmer About process column, single-panel Contact column, footer with one final CTA.
9. **Reduced motion**: still skips all reveals (the shared `useReveal` honors `prefers-reduced-motion`).
10. **No console errors** on `/`, `/services`, `/about`, `/contact`, `/work`.

---

## H · Files touched

### Edited
- `src/components/Services.tsx` — drop wrappers, apply `useReveal` once.
- `src/components/About.tsx` — drop 4 wrappers, apply `useReveal` once, tighten step durations.
- `src/components/Contact.tsx` — drop 5 wrappers, **collapse 4 tiles to 1 panel**, drop icon scale, swap `transition-all`.
- `src/components/FeaturedProjects.tsx` — drop per-card + footer wrappers, apply `useReveal` once, drop inner grain, swap `transition-all`.
- `src/components/Hero.tsx` — D1 mobile-fold tightening.
- `src/components/Footer.tsx` — E1 add tertiary Quote CTA.
- `src/components/media/FieldClipsStrip.tsx` — drop wrappers.
- `src/components/media/HomeProjectRecapStrip.tsx` — drop wrappers.
- `src/components/SectionHeader.tsx` — drop any wrapper if present.
- `src/pages/Services.tsx` — drop wrappers, sweep `transition-all`.
- `src/pages/About.tsx` — drop wrappers, swap `transition-all` (lines 95, 126).
- `src/pages/Contact.tsx` — drop wrappers, swap `transition-all` (lines 59, 75).
- `src/pages/Work.tsx` — drop wrappers.
- `src/pages/NotFound.tsx` — drop inner grain.
- `src/components/ui/project-tile.tsx` — swap `transition-all` and `duration-700`.
- `src/components/ui/page-hero.tsx` — D2 verify subtitle leading on `<sm` (read first; only patch if needed).

### Mechanical sweep (no visual change)
- `transition-all` → explicit property list across the verified files.
- `duration-700` → `duration-300` on hover-only transitions.

### Kept as-is
- `src/components/ScrollRevealMotion.tsx` — kept as a shim so any future re-introduction doesn't break, but no callsites use it.
- `src/lib/*` — frozen design tokens.
- `src/components/quote/QuoteModal.tsx` — already optimized in v3.
- `src/components/MobileQuoteFAB.tsx` — already complete.
- All admin routes, RLS, schema — untouched.

---

## I · The principle

Every wrapper the user doesn't see costs something. Every transition that doesn't communicate state costs INP. Every CTA that doesn't appear at a moment of decision is a lost lead. This pass takes the site from "structurally clean" to **"shipped"** — the level of finish where you stop noticing the design and start noticing the work.
