# Editorial Reduction Pass — "Less, but louder."

The homepage currently runs 11 stacked sections, each shouting through 6 typographic layers (roman numeral + bronze rule + ALL-CAPS eyebrow + serif headline + italic subhead + counter badge). The same trust signals, the same stat numbers, the same CTA, and the same project work appear two-to-three times each before the user reaches the footer. This is the opposite of how Fantasy, Pentagram, or Collins composes a homepage.

This pass does **not** redesign anything new. It removes, consolidates, and lets whitespace do the work.

---

## Audit findings (the clutter inventory)

| # | Redundancy | Where | Fix |
|---|---|---|---|
| 1 | "WCB Covered / Fully Insured" appears in **hero trust chips** *and* **TrustStrip 200px below** | `Hero.tsx` + `TrustStrip.tsx` | Collapse TrustStrip into a single hairline byline |
| 2 | StatTrio shown in hero provenance *and* at bottom of About — same numbers | `Hero.tsx` + `About.tsx` | Remove from About, replace with signed pull-quote |
| 3 | Two project galleries running back-to-back | `FeaturedProjects` + `Portfolio` | Keep `FeaturedProjects` (DB-driven, editorial). Retire `Portfolio` from homepage. |
| 4 | Placeholder testimonials with fabricated bylines ("Mark T., Calgary NW") | `Testimonials.tsx` | **Hide section until real reviews exist.** Replace with one signed pull-quote on About. (Boundaries doc rule #1 + #8.) |
| 5 | 5 "Request a Quote" CTAs on a single page | Hero / Services / Services-matrix / About / Contact | Reduce to 3 (Hero, Services, Contact). About + matrix lose the redundant CTA. |
| 6 | Every section opens with `numeral + rule + label + heading + italic subhead + badge` | `SectionHeader` callsites | Add a `quiet` mode that drops numeral + badge. Use `quiet` on About + Featured. |
| 7 | "We Handle / You Handle" responsibility matrix lives on homepage | `Services.tsx` lines 138–213 | Move to `/services` page (where it belongs editorially) |
| 8 | Mid-section dotted-rule divider before the matrix | `Services.tsx` lines 130–136 | Delete (matrix is moving anyway) |
| 9 | Services has `weHandle` + `youHandle` + service grid + matrix + section CTA — 5 jobs | `Services.tsx` | Section becomes: header + 6 service cards + one closing CTA. |
| 10 | Top + bottom gradient overlays on nearly every section, stacking into seams | `Services` / `About` / `Testimonials` / `Contact` | Audit and keep at most one gradient per section transition |

---

## The new homepage rhythm

**Before** (11 sections, ~9000px scroll on desktop):
`Hero → TrustStrip → Bleed → Services → About → Testimonials → FeaturedProjects → Portfolio → FieldClipsStrip → Contact → Footer`

**After** (7 sections, target ~6500px scroll, more whitespace per section):
`Hero → TrustByline (hairline) → Bleed → Services (simplified) → About (calmer) → FeaturedProjects → Contact → Footer`

`Testimonials`, `Portfolio`, and `FieldClipsStrip` are not deleted — they remain in the codebase and either (a) move to a more honest home (Portfolio → `/work`) or (b) become opt-in once real content exists (Testimonials gated behind real reviews; FieldClips is already gated, so it just gets pulled from the homepage rotation).

---

## Concrete file changes

### 1 · `src/components/TrustStrip.tsx` — collapse to a hairline byline
- Drop the 5-icon grid, the eyebrow rule, the boxes, the hover states, the `ScrollRevealMotion` per item.
- Replace with a single centered line of small-caps:
  > `WCB COVERED · FULLY INSURED · LOCALLY OWNED · CALGARY + EDMONTON · FREE ESTIMATES`
- Section height drops from ~280px to ~88px.
- Background: stays `bg-secondary` but borderless top — sits under the hero like a byline, not like a second band.

### 2 · `src/pages/Index.tsx` — re-sequence
```diff
  <Hero />
  <TrustStrip />              // now a thin byline
  <EditorialBleedSection … />
  <Services />                // matrix removed
  <About />                   // StatTrio removed, pull-quote added
- <Testimonials />
  <FeaturedProjects />
- <Portfolio />
- <FieldClipsStrip />
  <Contact />
  <Footer />
```
Update `page-sections.ts` `/` entry to drop the `Reviews` anchor (no testimonials section anymore).

### 3 · `src/components/Services.tsx` — strip the matrix
- Delete lines 130–213 (the dotted divider + WE HANDLE / YOU HANDLE plates).
- Delete the section-bottom `CedarCTA` (lines 215–218) — the next section will carry the CTA weight.
- Result: header + 6-card grid + the small "Need something else exterior? Just ask." line. **One job, one section.**
- Move the matrix into `src/pages/Services.tsx` between the catalogue grid and the FAQ — that page is where users with intent already are, so the contract framing helps them, not first-time visitors.

### 4 · `src/components/About.tsx` — quiet down
- Remove the `StatTrio` block (lines 133–145) — already in the hero provenance card.
- Remove the standalone `<CedarCTA>` (lines 147–151) — Contact section is the closer.
- Replace what was the StatTrio space with a single signed pull-quote in the existing brand-promise voice (already present at lines 90–98, but re-cast as the column's terminal moment, larger and lower-contrast).
- Switch the SectionHeader to `quiet` (no numeral, no badge — just `OUR APPROACH` eyebrow + headline + italic subhead).
- Net: section drops two visual layers and one CTA, gaining vertical breath.

### 5 · `src/components/SectionHeader.tsx` — add `variant="quiet"`
New prop:
```ts
variant?: "default" | "quiet";  // quiet = no numeral, no badge
```
- `default` keeps current behaviour for /services + /work + /about pages where the rail wayfinding makes the numerals useful.
- `quiet` is used on the homepage About + on the FeaturedProjects header, where the page already signals progress through the scroll.

### 6 · `src/components/Testimonials.tsx` — gate behind real data
- Wrap the entire return in:
  ```tsx
  if (testimonials.length === 0) return null;
  ```
- Replace the hard-coded placeholder array with an empty array for now (`const testimonials: Testimonial[] = [];`).
- Component stays in the tree, ready the moment real reviews arrive — but does not render fabricated bylines on a production site.
- Removed from `Index.tsx`'s render order regardless (covered above).

### 7 · `src/pages/Index.tsx` — remove `Portfolio` + `FieldClipsStrip` imports
- Both still exist in the codebase. `Portfolio` already lives implicitly on `/work` via `Work.tsx`; `FieldClipsStrip` is a "renders nothing if no clips" component, so it's safe to drop from the home rotation and re-introduce later as a `/work` element.

### 8 · `src/components/Contact.tsx` — drop the floating quote-mark ornament
- Lines 41–53 render a giant `quote-mark-float` glyph + the tagline already shown in the hero ("Excellence in the work. Pride in every detail.").
- That tagline is the **page's opening line**. Showing it again 6000px down breaks the editorial arc.
- Replace with a single small-caps eyebrow over the contact column, no ornament:
  > `THE NEXT STEP IS A CONVERSATION.`

### 9 · Gradient seam audit
For each section that adds both a top *and* a bottom gradient overlay (`Services`, `About`, `Testimonials`, `Contact`), keep only the bottom-fade where the **next** section is a different background, and delete the top-fade. Result: section transitions feel intentional instead of laminated.

Specifically remove:
- `Services.tsx` line 47–50 (bottom gradient — services already sits on `bg-background` going into About's `bg-secondary`, the secondary plate provides the transition)
- `About.tsx` line 31–34 (bottom evergreen overlay — no longer needed because we removed Testimonials, and FeaturedProjects sits on its own plate)
- `Contact.tsx` line 18–21 (top evergreen overlay — Featured already ends quietly)

### 10 · `mem://design/aesthetic-direction.md` — codify the rule
Append to the gate policy:
> **Reduction principle.** Confidence is silence. A homepage section earns its place by saying one thing; if two sections say the same thing, the second one loses. Eyebrows, roman numerals, badges, and uppercase counters are *garnish* — use at most three on any single screen. The hero gets stats; subsequent sections do not repeat them. The hero gets the brand tagline; subsequent sections do not repeat it. The hero gets the trust chips; subsequent sections do not repeat them.

---

## What this is NOT doing (intentionally out of scope)

- Not redesigning any single section. No new components. No new colors. No layout reinventions.
- Not touching `/services`, `/work`, `/about`, or `/contact` page heroes. (Those were just stabilized in v3.2.)
- Not touching nav chrome, GlobalMenu, MobileSubNav, or the rail.
- Not touching tokens (colors / typography / spacing). The reduction works *because* the tokens are already disciplined.
- Not deleting components. Everything that's removed from the homepage stays in the codebase and either re-homes to a deeper page or sits dark until real content unlocks it.

---

## QA contract for the implementation pass

After edits, verify on the preview at three breakpoints (375 / 768 / 1366):

1. The homepage shows **no duplicate stat numbers** between hero and About.
2. The homepage shows **no duplicate trust signals** between hero and TrustStrip (TrustStrip is now a single line).
3. There is **only one project gallery** on the homepage.
4. There are **no fabricated testimonial bylines** rendered anywhere on the production site.
5. "Request a Quote" appears at most three times before the footer.
6. Section transitions read as deliberate, not as stacked gradient bands.
7. Page-sections rail on `/` shows: `Services · About · Work · Contact` (dropped `Reviews`).
8. No console errors; type-check clean; `Testimonials.tsx`, `Portfolio.tsx`, `FieldClipsStrip.tsx` still compile (still imported elsewhere or kept for future use).

---

## Why this matters (the principle behind the cuts)

Fantasy.co's homepages for clients like Sports Illustrated, USA Today, or Balenciaga don't impress because of how much they put on screen — they impress because of what they're confident enough to leave off. Every uppercase eyebrow you delete is one more piece of weight the headline gets to carry alone. Every duplicated CTA you remove makes the remaining one feel like an answer instead of a sales pitch. Every redundant trust signal you cut makes the one that survives feel earned.

This pass takes the existing tokens, components, and content — all of which are already strong — and removes the parts that are working against them. Nothing here is additive. The site gets quieter, larger, and more sure of itself.