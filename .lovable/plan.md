# Pass 34 — Calm Sweep Across Shared Modules + Homepage Loose Ends

Pass 33 quieted the homepage rhythm. Audit shows the *shared* atomics still ship Pass 30-era chrome (border-l accents, grain-texture, BACKDROP gradients, border-image gradients) — so any page that mounts MiniFaq, QuoteFormInline, ServiceTile, CardPremium, FaqAccordion, or TrustChip immediately breaks the Fly4Me calm we just achieved on the homepage. Pass 34 finishes the job by sweeping these primitives, then closes three small loose ends on the homepage itself.

## Principles (carried forward)
1. One eyebrow scale (`.eyebrow`), one hairline (`.hairline` / `border-cedar/12`), one card chrome (none — flat surface + hairline only).
2. No grain-texture, no border-image gradients, no BACKDROP gradient on UI surfaces (gradients live only on hero photographic scrims).
3. A left-edge cedar bar is the *only* "active accent" pattern. 2px width, never 3px. Used sparingly.

---

## A. MiniFaq (`src/components/MiniFaq.tsx`)
- Strip the `borderImage` top-rule wrapper at L63 → replace with `.hairline` class on the section.
- Accordion items: drop `grain-texture` and the open-state `bg-cedar/[0.03]` from `faq-accordion.tsx`. Use a clean stack of items separated by `.hairline`, no border box, no rounded corners. Open state shifts only the chevron (rotate 90°) and reveals a serif answer block.

## B. FaqAccordion primitive (`src/components/ui/faq-accordion.tsx`)
- Remove `grain-texture`, `border`, `rounded-sm`, `bg-background` and the cedar/30/40 hover/open border colors.
- New shell: `className="border-b border-cedar/12"` per item, button row `py-5 md:py-6 flex items-baseline justify-between gap-6 text-left`, trigger title `font-serif text-lg md:text-xl tracking-[-0.01em]`, chevron is a single 12×12 cedar plus-to-minus glyph (`+` → rotate to `×`) using CSS, not lucide.
- Answer panel: `pb-6 text-foreground/70 leading-relaxed max-w-[58ch]` — no inset background.

## C. QuoteFormInline shell (`src/components/quote/QuoteFormInline.tsx`)
- Remove `rounded-[6px] border border-cedar/15 border-l-[3px] border-l-cedar/40 grain-texture shadow-contact` from both the success state (L203) and the form shell (L224).
- Replace with: form sits in a flat `bg-secondary/40 p-6 md:p-8` plate with a single `.hairline-l` cedar accent on the left edge (already exists in CSS). No shadow. No grain.
- Audit and remove the two `borderImage` gradient dividers at L406/L413; replace with `.hairline`.
- Inputs: confirm `h-12 rounded-[2px] border-cedar/15` consistent with Pass 32 Contact treatment. Tighten focus to `focus:border-cedar focus:ring-0` (no offset ring inside the form — inset shadow instead).

## D. ServiceTile primitive (`src/components/ui/service-tile.tsx`)
- Drop `grain-texture` from the compact variant.
- Both variants: flat surface, no border by default, only a `.hairline` bottom rule when stacked. Hover reveals a 2px cedar left bar (matches Pass 33 Services rows pattern). Reuses the `.eyebrow` for the metadata line.

## E. CardPremium primitive (`src/components/ui/card-premium.tsx`)
- Remove `grain-texture` and `border-cedar/20` defaults.
- New default variant: zero chrome (just spacing) — let the page give it context. Accent variant: 2px cedar left bar only. This collapses the "premium card" treatment into Apple-grade restraint.

## F. TrustChip primitive (`src/components/ui/trust-chip.tsx`)
- Replace `border-cedar/25 bg-evergreen-foreground/[0.03]` with a flat row: small dot · label · dot · label, separated by middle dots in `.eyebrow` styling. No chip outline. Becomes a typographic strip rather than a pill row.

## G. FeaturedProjects (`src/components/FeaturedProjects.tsx`)
- "See all work" CTA at L223: replace bordered pill with a calm text link — `inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-cedar hover:text-cedar-hover py-3 min-h-[44px]` followed by an `→` arrow. Matches Hero's call CTA grammar.
- Numbered fallback for projects with no `hero_url` (L74–82): replace `BACKDROP.evergreenPlate` with flat `bg-secondary` and a centered serif numeral in `text-foreground/15` — no dark gradient block.

## H. CrewMoment dead-code cleanup (`src/components/CrewMoment.tsx`)
- The `showStats` block still uses an inline `borderImage` gradient (L80). Replace with `.hairline` `pt-8` since the prop is still functionally exposed for non-homepage callers.

## I. Navigation chrome (`src/components/Navigation.tsx`, `MobileSubNav.tsx`, `MenuTrigger.tsx`, `GlobalMenu.tsx`)
- Standardize cedar opacities: `border-cedar/25` → `border-cedar/12` for *idle* chrome borders; keep `/30` only as the hover/active state.
- `Navigation.tsx` L77 elevated state: `border-b border-cedar/25 shadow-[0_1px_0_0_…]` → `border-b border-cedar/12` with no shadow (relies on the hairline alone).
- `MenuTrigger.tsx` and `GlobalMenu.tsx` chip buttons: `border-cedar/20-25` → `border-cedar/12`, hover `border-cedar/40`.
- `MobileSubNav.tsx` L66: `border-cedar/15` → `border-cedar/12`. Confirm no double-border seam where SectionRail meets the nav.

## J. Services sub-page (`src/pages/Services.tsx`)
- The category cards at L139 still use a 2px cedar top-bar plus a full border (`border-cedar/15 border-t-2 border-t-cedar`). Replace with: flat surface, `.hairline` top rule only, eyebrow + serif title + body. The 2px top-bar is heritage Pass 28 chrome and competes with the homepage's left-bar pattern.
- Audit catalogue rows for any remaining `BACKDROP.bronzeWash` and remove.

## K. About sub-page (`src/pages/About.tsx`)
- L86 process step rows: `border-l-2 border-cedar/16 hover:bg-cedar/[0.035]` → match the Services-row treatment: flat row, `.hairline` between items, hover reveals a 2px cedar left bar (animated 0→2px). Identical interaction language site-wide.
- L115 city chips: `border-cedar/14 hover:bg-cedar/[0.035] hover:border-cedar/30` → `.hairline border` + hover swaps to `border-cedar/30` only. Drop the bg fill.

## L. Style-guide live atomic (`src/pages/StyleGuide.tsx`)
- Add a single new "Atomics (Pass 32+)" subsection inside the existing Components beat showing four flat tiles: `.eyebrow`, `.hairline`, `.hairline-l`, and the new "left-bar hover" idiom — with code snippets. Append-only insertion (1 SectionShell call). Does not touch the rest of the file.

## M. Token doc updates
- `colors.ts`: deprecate `BACKDROP.evergreenPlate` (still used as a hero fallback only — annotate "use ONLY in PageHero/MediaSlot, never as a card surface").
- `colors.ts`: deprecate `SHADOW.hairline` (`shadow-contact`) since Pass 33/34 stopped using shadows on cards; annotate as "available for elevation rare cases, prefer a `.hairline` rule".

## N. Verification
- Browser screenshots at 390 / 768 / 1280 / 1440 of `/`, `/services`, `/about`, `/contact`. Walk through each:
  - No visible card border anywhere except the new flat-with-hairline pattern.
  - No grain texture remaining (open DevTools → search for `grain-texture` class on rendered DOM = 0 hits).
  - No `border-image` style attributes on rendered nodes.
  - FAQ accordion reads as Apple-grade typographic stack.
  - Quote form reads as a calm secondary-tinted plate with one cedar left line.
  - Featured projects' empty fallback no longer reads as a "broken hero".
  - SectionRail + Navigation seam is a single 1px hairline, not a double line.
- Lighthouse spot pass on `/services` (most-changed) — no CLS regression.

## Files to touch
`src/components/MiniFaq.tsx`, `src/components/ui/faq-accordion.tsx`, `src/components/quote/QuoteFormInline.tsx`, `src/components/ui/service-tile.tsx`, `src/components/ui/card-premium.tsx`, `src/components/ui/trust-chip.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/CrewMoment.tsx`, `src/components/Navigation.tsx`, `src/components/navigation/MobileSubNav.tsx`, `src/components/navigation/MenuTrigger.tsx`, `src/components/navigation/GlobalMenu.tsx`, `src/pages/Services.tsx`, `src/pages/About.tsx`, `src/pages/StyleGuide.tsx`, `src/lib/colors.ts`.
