
# Pass 8 — Minimalism polish: rhythm, dedupe, and FlexServices-grade tightness

After Pass 7 every page has the right *parts*. Pass 8 fixes the *rhythm* between them — same level of editorial discipline FlexServices.org has where every section visibly contrasts with its neighbour, copy never repeats verbatim, and there’s no duplicated logic between pages.

Audit found 12 concrete issues across 5 pages; this plan fixes them all.

## Audit findings

### A · Background rhythm (sections stacking same-tone)
| Where | Problem |
|-------|---------|
| `/` (Home) | `Services (bg)` → `CrewMoment (bg)` → no contrast band; reads as one massive scroll. |
| `/about` | `Story (bg)` → `CrewMoment (bg)` → same. |
| `/services` | `TestimonialStrip (bg)` → `MiniFaq-equivalent (bg)` → same. |
| `/work` | `Featured (bg)` → `Gallery (muted)` → `Testimonials (bg)` → muted is the only `muted` use site-wide; breaks the bg/secondary 2-tone pattern. |

### B · Duplication / dead weight
- `/services` still has an **inline FAQ section** (~30 lines) when `<MiniFaq />` exists. Pure duplication of styling, not data.
- `<Contact />` (home closer) is a 3-line wrapper around `<QuoteCloserCard asSection={false}>`. Redundant — Home should just render `<QuoteCloserCard />` directly.
- `FeaturedProjects` uses raw `py-24 md:py-32` instead of `SECTION_PADDING.default`. Inconsistent with every other section.
- `<SectionHeader />` internally wraps content in `<ScrollRevealMotion>` (framer); when used inside `useReveal`’d parents (TestimonialStrip / MiniFaq / CrewMoment / About / Services), the headline animates *twice*. Wasteful + perceptible jitter.

### C · CTA & copy hygiene
- StyleGuide example uses `"Get a free quote"` (everywhere else: `"Get my free quote"`). Drift.
- Work page mid-CTA prompt uses `"Like what you see?"` while Services mid-CTA uses `"Seen something you want?"` — two phrasings for the identical pattern. Pick one canonical phrasing.
- `/contact` PageHero subtitle says “No high-pressure sales” but the proof rail elsewhere already says it — repeats verbatim. Needs a non-redundant variation.

### D · Page-specific thinness
- `/contact` page is 3 sections. Add `<TestimonialStrip />` between contact info and FAQ so the page mirrors the others’ proof cadence.
- `/about` has no FAQ. Add `<MiniFaq />` before the closer (mirrors Home and Services and Contact).
- `/work` has no human moment. Add `<CrewMoment />` between Featured projects and Gallery.

### E · Tiny consistency wins
- All hero subtitles end in a period — except `/work` (`Alberta-built. Crew-owned.`) — fine, italic. OK.
- `<TestimonialStrip />`, `<MiniFaq />`, `<CrewMoment />` use static `headingId` strings (`testimonials-heading`, `faq-heading`, `crew-heading`). If two ever appear on the same page, IDs collide. Make them prop-overridable with sensible defaults.
- Trust signals strip in QuoteCloserCard + Footer + HeroProofBand all render the same array with slightly different sizing. Already centralised in `TRUST_SIGNALS`. ✅

## Plan

### 1 · Background rhythm (the big one)

Adopt a strict **2-tone alternation** site-wide: every adjacent pair of sections must differ. `bg-background` (cream) ↔ `bg-secondary` (warmer cream-grey). `bg-muted` retired from `/work`.

Final per-page rhythms:

```text
/                Hero(B/W) → ProofBand(bg) → Services(bg) → CrewMoment(secondary) →
                 About(secondary→keep, but switch to bg) → Featured(secondary) →
                 Testimonials(bg) → MiniFaq(secondary) → Closer(bg) → Footer

/services        Hero → Catalogue(bg) → Contract(secondary) → Testimonials(bg) →
                 MiniFaq(secondary) → Closer(bg)

/about           Hero → Story(bg) → CrewMoment(secondary) → Process(bg) →
                 Areas(secondary) → Testimonials(bg) → MiniFaq(secondary) →
                 Closer(bg)

/work            Hero → Featured(bg) → CrewMoment(secondary) → Gallery(bg, was muted) →
                 Testimonials(secondary) → Closer(bg)

/contact         Hero → ContactGrid(bg) → Testimonials(secondary) → MiniFaq(bg) →
                 Closer(secondary, via QuoteCloserCard)
```

Implementation: flip a single `background` prop on the new modules per insertion, plus change `<About />` (homepage) from `bg-secondary` to `bg-background`, change `<Work>` gallery from `bg-muted` to `bg-background`, and change Process section default mapping.

### 2 · Dedupe

- **`/services`**: delete the inline 18-line FAQ section, replace with `<MiniFaq items={FAQS_SERVICES} />`.
- **`<Contact />` homepage wrapper**: delete, replace its usage in `Index.tsx` with `<QuoteCloserCard />` directly. (Preserves the `id="section-contact"` anchor by passing `id` prop — add that prop to `QuoteCloserCard`.)
- **`FeaturedProjects`**: swap `py-24 md:py-32` → `SECTION_PADDING.default`, add `background` prop matching home rhythm.
- **`SectionHeader` double-reveal**: when a `disableMotion` prop is passed, render plain children (no framer wrapper). Pass it from every component that already calls `useReveal` on a parent (TestimonialStrip, MiniFaq, CrewMoment, FeaturedProjects, About, Services). Cuts ~6 framer subscriptions per homepage scroll.

### 3 · CTA & copy normalisation

- StyleGuide CedarCTA example → `"Get my free quote"` (matches site-wide canonical).
- Replace Services + Work mid-page CTA prompts with a new tiny shared component `<MidPageQuotePrompt label="..." />` that renders the cedar bordered prompt + headline + CedarCTA. One source. Default headline: `"Start a quote — pick the rest later."`. Same line on both pages.
- `/contact` hero subtitle changed to: `"Tell us what you’re building. We respond within 24–48 hours, by phone or email — your pick."` (avoids duplicating the trust strip line).

### 4 · Per-page module additions

- **`/contact`** → add `<TestimonialStrip background="secondary" />` between the contact grid and `<MiniFaq />`.
- **`/about`** → add `<MiniFaq background="secondary" />` between TestimonialStrip and the QuoteCloserCard.
- **`/work`** → add `<CrewMoment background="secondary" />` between Featured and Gallery sections.

### 5 · ID & a11y polish

- `TestimonialStrip`, `MiniFaq`, `CrewMoment` get an optional `headingId` prop (default unchanged). Document in JSDoc that callers placing two on one page must pass distinct ids.
- Update `src/lib/page-sections.ts` `/work` to add `Reviews` (already present from Pass 7 — verify) and also `Crew` if CrewMoment lands on /work.

### 6 · What we are NOT doing

- No new colors, fonts, animations, or design tokens.
- No content rewrites beyond the two CTA-prompt phrasings + one Contact subtitle line.
- No edits to Navigation, Footer, Hero, MobileQuoteFAB, or routing.
- No edits to Supabase, `.env`, or `supabase/config.toml`.
- No dark mode (forbidden by Core memory).

## Technical notes

Files touched (~12):

- `src/pages/Index.tsx` — replace `<About />` bg via component prop pass-through; remove `<Contact />`, render `<QuoteCloserCard />`; toggle `background` props on inserted modules.
- `src/pages/Services.tsx` — delete inline FAQ section; render `<MiniFaq items={FAQS_SERVICES} background="secondary" />`; swap mid-page prompt for `<MidPageQuotePrompt />`.
- `src/pages/About.tsx` — flip CrewMoment / TestimonialStrip backgrounds; add `<MiniFaq background="secondary" />`.
- `src/pages/Work.tsx` — add `<CrewMoment background="secondary" />`; change Gallery `bg-muted` → `bg-background`; flip TestimonialStrip background; swap mid-page prompt for shared component.
- `src/pages/Contact.tsx` — add `<TestimonialStrip background="secondary" />`; flip MiniFaq background; update hero subtitle.
- `src/pages/StyleGuide.tsx` — single CedarCTA label change.
- `src/components/Contact.tsx` — **delete** (homepage closer wrapper, redundant).
- `src/components/About.tsx` — accept `background` prop, default `"secondary"` (preserves current default).
- `src/components/FeaturedProjects.tsx` — accept `background` prop, switch to `SECTION_PADDING.default`, pass `disableMotion` to SectionHeader.
- `src/components/QuoteCloserCard.tsx` — accept optional `id` prop (defaults to `"section-closer"`); add `background` prop.
- `src/components/SectionHeader.tsx` — add optional `disableMotion` prop (skips ScrollRevealMotion wrapper).
- `src/components/{TestimonialStrip,MiniFaq,CrewMoment}.tsx` — accept `headingId` prop; pass `disableMotion` to SectionHeader.
- `src/components/MidPageQuotePrompt.tsx` — **new**, ~25 lines, used by Services + Work.

Type-check confirms after each batch. No DB migrations needed.

## Expected outcome

Five public pages that visually breathe — every section visibly contrasts with the next, the same FAQ + testimonials rendering paths in every place they appear, one mid-page prompt component, one closer component, one canonical CTA label. Reads like FlexServices’ funnel discipline rendered through Creek’s editorial system, with all of Pass 7’s benefits and none of its repeated fragments.
