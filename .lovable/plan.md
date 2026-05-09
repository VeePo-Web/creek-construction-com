# Pass 32 — Sub-Page Calm + Editorial Atomics

Goal: Carry the Pass 31 homepage calm into Work, About, Contact, Services and the shared atomics. Strip remaining decorative borders, hand-wave hairlines, and dual-eyebrow patterns. Tighten container math and SectionHeader rhythm so every page feels cut from the same cloth — Fly4Me-grade.

## Principles (continued)
1. One eyebrow per section maximum. Numerals/badges are reserved for Work + Services catalogues.
2. Replace `border-image` "fading hairlines" with flat `border-cedar/12` unless the rule is a true centered ornament.
3. Section headers center on sub-pages, left-align on homepage. Pick one and stick to it per page.
4. Form fields and chips share a single 44px height + `rounded-[4px]` token across the site.

---

## A. About page (`src/pages/About.tsx`)

- Drop the inline `StatTrio` from `#section-story`. Stats are owned by the closer's adjacent space, not the story prose. Replace with a single italic pull-quote underneath the two paragraphs ("We don't subcontract, and that decides everything else.").
- `#section-process`: lighten step rows. Remove `bronzeStep` left bar (cedar/0.16 on every row instead — uniform, calmer). Remove `hover:shadow-[…]` (use only background tint). Bump row gap to `space-y-3`.
- Replace process step number `text-cedar/55` with `text-cedar/45` and switch `font-serif text-lg` → `font-mono text-[11px] tracking-[0.22em]` to read as metadata, not a heading.
- `#section-areas`: city chips → `text-[11px] tracking-[0.18em] uppercase`, `border-cedar/14`, no `bronzeStep` opacity ramp, no `hover:shadow`. Replace closing italic line with a smaller sentence (`text-xs text-muted-foreground/70`, no centered fading rule above).

## B. Work page (`src/pages/Work.tsx`)

- Featured project header: keep numeral indexing on each project (`01 / 04`), add a thin `border-cedar/12` divider above it. Drop the decorative `h-px w-6 bg-cedar/40` hairline-dot in the metadata row — replace with a middle-dot glyph (` · `) only.
- Placeholder gallery: switch grid gap to `gap-4 md:gap-6` (tighter feels editorial). Add a 1-line "Photography in progress" eyebrow above the grid replacing the bottom "More projects added each month" footer line — promote it to title-row metadata.
- Add a single `border-cedar/12` hairline between Featured and More-Work sections instead of the implicit background tone change. Reads as continuous catalogue.

## C. Contact page (`src/pages/Contact.tsx`)

- Drop the centered "FREE QUOTE" eyebrow with two flanking hairlines. Replace with left-aligned single-line eyebrow above the headline (mirror the Services row pattern).
- Headline: tighten to `tracking-[-0.035em]`, `leading-[1.02]`, max-w `12ch` on lg+.
- Direct-contact card: remove `grain-texture`, drop `bronzeStep`-driven left border (use flat `border-l-[3px] border-cedar`). Replace inner fading dividers with flat `border-t border-cedar/10`.
- Make the form column visually heavier: form panel gets a `bg-secondary/40` wash and `p-6 md:p-8` padding, so the eye lands on it first. Direct card stays plain background.
- All inputs/selects/textarea: `h-12 rounded-[4px] border-cedar/15 focus:border-cedar focus:ring-cedar/30`. Centralise this in `QuoteFormInline` if the styles live there.

## D. Services page (`src/pages/Services.tsx`)

- Catalogue groups: switch from `pb-3 mb-5 border-b` per group to a single `border-cedar/12` divider between groups, no fading gradient. Number column moves to `font-mono text-[11px] tracking-[0.22em] text-cedar/45`.
- Item buttons: drop the `→` arrow on hover (already minimal hover tint). Keep `hover:bg-cedar/[0.035]`. Reduce padding to `py-3.5 md:py-4`. Apply `border-cedar/8` between sibling items.
- "WE HANDLE / YOU HANDLE" cards: drop `bronzeStep` left bars on every row (only the panel has a 2px left bar). Inside rows are flat with no border. Drop `BACKDROP.bronzeWash` from "WE" panel — use plain `bg-secondary` so the two cards have equal visual weight; differentiate with a single cedar accent line on top of "WE HANDLE" only.

## E. Shared atomics

- `SectionHeader.tsx`: add a `align?: "left" | "center"` prop (default `left`). Sub-page headers pass `center` for sections that aren't the page hero. Update About/Contact/Work/Services accordingly.
- `BronzeRule` usage: ensure it never renders an empty rule when `label` is empty (current implementation is fine, but add visual audit).
- New utility in `src/index.css`: `.eyebrow` class encapsulating `text-[11px] uppercase tracking-[0.22em] text-cedar/65`. Sweep all hand-rolled eyebrow strings to use this class to keep them in lockstep.
- New utility `.hairline` for `border-cedar/12` 1px rules; used wherever a flat divider currently uses inline `border-image`.

## F. Footer (`src/components/Footer.tsx`)

- Remove the radial gradient background — flat `bg-evergreen` reads cleaner, mirrors Fly4Me. Adds calm.
- Replace fading horizontal/vertical `borderImage` rules with flat `border-evergreen-foreground/10`.
- Tighten copyright row: drop the `// 2026` cedar marker — keep only `© Creek Construction — All rights reserved` left and `Made in Alberta` right. Less is more.
- Reduce link arrow animation; only show underline on hover (the `→` slide is decorative noise here, not a CTA).

## G. Navigation chrome

- Audit `Navigation.tsx` and `NavigationMinimal.tsx` for any remaining `border-image` seams; convert to flat `border-cedar/10`.
- SectionRail centered pill: reduce vertical padding to `py-1.5`, tighten font to `text-[11px] tracking-[0.18em]`. Pill uses `rounded-full` for Apple-feel.
- Mobile header height locks at `h-14` (currently 16) to free more vertical space on 390px viewports. Logo wordmark scales accordingly.

## H. Type/color token tightening

- `src/lib/typography.ts` — add `EYEBROW = "text-[11px] uppercase tracking-[0.22em] text-cedar/65"` constant; export. Update `BODY.lead` to `text-[15.5px] md:text-base leading-[1.6] text-foreground/78`.
- `src/lib/colors.ts` — add `RULE.cedar = "border-cedar/12"`; deprecate `bronzeStep` for borders that are not in a thermal-crescendo context (testimonials/services). Keep the function alive for the testimonials strip even though Pass 31 already removed its use — leave note in core memory.

## I. FloatingQuoteCTA polish

- Add a tiny chip-pulse on first reveal: `animate-[fade-in-up_0.6s_cubic-bezier(0.22,1,0.36,1)]` keyframe in `index.css`. Single play on mount only.
- Keep hidden on `/`, `/contact`, and below `md` (already done Pass 31).

## J. Image audit

- Run a one-off pass: list `src/assets`, mark hero-grade vs. duplicates, generate at most 2 new AI images only if a hero slot has no >=1600px option (decks hero, painting hero). Otherwise reuse.
- Convert any remaining JPG that's referenced inline-only to a webp source via `<picture>` (already through EditorialPicture in most spots — verify).

## K. Verification

Browser screenshots at 390 / 768 / 1280 / 1440 of `/work`, `/about`, `/services`, `/contact`. Check:
- No double eyebrows, no stacked hairlines, no centered+flanked rules outside the homepage hero.
- Process/services rows feel like a single continuous list, not stacked cards.
- Contact form column dominates visual weight on lg+; stacks cleanly at mobile.
- Footer reads as a calm closing band, not another section.
- All tap targets ≥ 44px on mobile.

## Files to touch

`src/pages/About.tsx`, `src/pages/Work.tsx`, `src/pages/Contact.tsx`, `src/pages/Services.tsx`, `src/components/SectionHeader.tsx`, `src/components/Footer.tsx`, `src/components/Navigation.tsx`, `src/components/navigation/NavigationMinimal.tsx`, `src/components/quote/QuoteFormInline.tsx`, `src/components/FloatingQuoteCTA.tsx`, `src/index.css`, `src/lib/typography.ts`, `src/lib/colors.ts`.
