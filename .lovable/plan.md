# Pass 10 — FlexServices-Grade Minimalism Audit

The site already has the right vocabulary (Hero → InlineQuote → Services → CrewMoment → About → Featured → Testimonials → MiniFaq → Closer). But after Pass 8/9 it carries **too many trailing CedarCTAs, redundant proof bands, and 7–8 sections per page**. FlexServices wins not by adding chrome but by stripping it: one decisive form anchor per page, every other module just earns the scroll to it.

This pass applies a hard rule across every public page:

> **One terminal CTA per page** (`QuoteCloserCard`). Reusable strips (`CrewMoment`, `MiniFaq`, `TestimonialStrip`) default to **`showCta={false}`** when used as supporting modules — only the final closer carries the cedar pill.

It also trims each page's section count, unifies hero treatment, and removes a few legacy duplications.

---

## A. Homepage (`src/pages/Index.tsx`)

Current: 9 stacked sections. Target: **6 sections, one form anchor mid-page, one closer at the bottom**.

```text
Hero (B/W bleed + ProofBand)
InlineQuoteSection            ← funnel terminal #1
Services                       ← five group tiles
CrewMoment (no CTA, no stats)  ← human moment
FeaturedProjects               ← editorial proof
TestimonialStrip (no CTA)      ← words proof
MiniFaq (no CTA, phone fallback only)
QuoteCloserCard                ← funnel terminal #2
Footer
```

Changes:
- Remove `<About />` from homepage. The brand promise plate already lives there; on the homepage we already have CrewMoment + the "Excellence is the marketing" line is restated in the closer. About has its own page.
- Pass `showCta={false}` to `CrewMoment`, `TestimonialStrip`, `MiniFaq`.
- Drop `showStats` on `CrewMoment` (stats already live in HeroProofBand — duplication).
- Keep `InlineQuoteSection` as the one mid-funnel form so "Get a Quote" CTAs route to a real input within one viewport.

Result: ~30% shorter scroll, a single visible cedar pill at any given moment.

---

## B. About page (`src/pages/About.tsx`)

Current: Hero + Story + CrewMoment(stats+CTA) + Process + Areas + TestimonialStrip(CTA) + MiniFaq(CTA) + Closer = 8 sections, 4 cedar pills.

Target: **Hero + Story + Process + Areas + Closer = 5 sections, 2 cedar pills (hero + closer)**.

Changes:
- Remove `CrewMoment`, `TestimonialStrip`, `MiniFaq` from About. About is the brand-trust page; testimonials and FAQ belong to the homepage funnel and Services. Story + Process + Areas are enough.
- Inline a 3-up `STATS_TRIO` strip beneath the Story paragraphs (small, no border, no CTA) — replaces the CrewMoment stat row.
- Convert "Where We Work" section to **`bg-background`** (story is `bg-background`, Crew was `secondary` — when Crew is removed, alternation needs reset: Story `bg` → Process `secondary` → Areas `bg` → Closer `secondary`).

---

## C. Services page (`src/pages/Services.tsx`)

Current: Hero + Catalogue (with mid-page prompt) + Contract + TestimonialStrip + MiniFaq + Closer = 6 sections, 4+ cedar pills.

Target: **Hero + Catalogue + Contract + MiniFaq + Closer = 5 sections, 2 cedar pills**.

Changes:
- Remove `TestimonialStrip` from Services — Services is a catalogue page; testimonials interrupt scanning. Keep them on Home and Work.
- Pass `showCta={false}` to `MiniFaq`.
- Keep the single `MidPageQuotePrompt` after group 3 (already there) — that is the one mid-page form anchor.
- Tighten group catalogue: drop the per-group "01 / 05" tabular badge — it competes with the bronze rule. Replace with a quiet bronze rule only.

---

## D. Work page (`src/pages/Work.tsx`)

Current: Hero + Featured (with per-project CedarCTA) + CrewMoment + Gallery (with MidPagePrompt) + TestimonialStrip + Closer = 6 sections, **6+ cedar pills** (one per featured project).

Target: **Hero + Featured + Gallery + TestimonialStrip + Closer = 5 sections, 2 cedar pills**.

Changes:
- Remove the per-project trailing `<CedarCTA preselectServices=…>` after each featured `ProjectGallery`. The closer at the bottom already carries this. Keeps the editorial reading uninterrupted.
- Remove `<CrewMoment>` from Work — it's redundant with the closer's eyebrow ("Quote a similar build") and breaks the visual rhythm between featured + gallery (both should read as "the work").
- Pass `showCta={false}` to `TestimonialStrip`.
- Keep `MidPageQuotePrompt` inside the gallery section as the only mid-page form anchor.

---

## E. Contact page (`src/pages/Contact.tsx`)

Already minimal post-Pass 9. Two refinements:
- Remove `MiniFaq` entirely — contact is a single-screen conversion page; FAQ creates "are you sure?" friction. (FlexServices contact has no FAQ either.)
- Tighten the info card from 4 rows to 3 (merge "Response Time" into the Phone row's caption, drop the standalone clock row).

Result: header + headline strip + (info card | form) + footer. One screen on desktop.

---

## F. Reusable strip defaults (component-level, one-time fix)

Change the **default** of `showCta` on supporting modules so future page authors get clean rhythm by default:

| Component | Current default | New default |
|---|---|---|
| `CrewMoment` | `showCta` always on (no prop) | add `showCta?: boolean = false` prop, render CTA only when explicitly `true` |
| `TestimonialStrip` | `showCta = true` | `showCta = false` |
| `MiniFaq` | `showCta = true` | `showCta = false` |

Pages that genuinely need a trailing CTA (none after this pass) opt in. The closer card is always the page's terminal CTA.

Inside `CrewMoment`, also drop `showStats` defaulting — it is now only used on the About page's inline stats variant (or removed entirely; About handles its own stats now).

---

## G. CTA hierarchy audit (one-time scrub)

After all the above, run `rg "<CedarCTA"` and verify each route has **exactly two** `<CedarCTA>` instances:
1. Inside `<PageHero>` (top of page)
2. Inside `<QuoteCloserCard>` (bottom of page)

Plus mid-page form anchors: `<InlineQuoteSection>` (Home only) and `<MidPageQuotePrompt>` (Services + Work). These are *forms*, not pills — they don't count toward CTA fatigue.

---

## H. Minor polish (cheap, high-leverage)

- **HeroProofBand on homepage only.** Confirm no other PageHero variants accidentally render a proof band beneath them. (Already true — `Hero.tsx` is the only file rendering `HeroProofBand`.)
- **Services group tile**: drop the redundant `Quote this →` row when the entire tile is the button. The cursor + hover-tint already telegraph it. Keep just the icon + 01/02 numeral header and the title/short/description.
- **MiniFaq phone fallback**: keep it on the closer-less variants (it's the only fallback when CTA is suppressed).
- **GlobalMenu / SectionRail**: re-run `src/lib/page-sections.ts` so the rail picks up the new section IDs after removals (Home loses `section-about`; About loses `section-crew`/`section-testimonials`/`section-faq`; Services loses `section-testimonials`; Work loses `section-crew`).

---

## Technical implementation order

1. **Component defaults** (single touch each):
   - `src/components/CrewMoment.tsx` → `showCta?: boolean = false`, render CTA conditionally.
   - `src/components/TestimonialStrip.tsx` → flip `showCta` default to `false`.
   - `src/components/MiniFaq.tsx` → flip `showCta` default to `false`.
2. **Page rewrites** (sequential — each is a small, contained edit):
   - `src/pages/Index.tsx` — drop `<About />`, drop `showStats` on Crew, props already cascade.
   - `src/pages/About.tsx` — remove Crew/Testimonial/Faq sections, inline a `STATS_TRIO` strip after the story paragraphs, fix `bg-background` / `bg-secondary` alternation across remaining sections.
   - `src/pages/Services.tsx` — remove `TestimonialStrip`; keep MiniFaq with new default (no CTA).
   - `src/pages/Work.tsx` — remove per-project `<CedarCTA>`, remove `<CrewMoment>`, keep TestimonialStrip with new default.
   - `src/pages/Contact.tsx` — remove `<MiniFaq>`, merge Response Time into Phone caption.
3. **Section registry**: update `src/lib/page-sections.ts` to drop removed IDs per route so `SectionRail` doesn't render dead anchors.
4. **Services group tile cleanup** in `src/components/Services.tsx`: remove the `Quote this →` row.
5. **Verify**: `rg "<CedarCTA" src/pages src/components` → confirm each route lands at exactly the expected count.

No new files. No new dependencies. No backend changes. Pure subtraction + a handful of default-prop flips.

---

## Expected outcome

- Homepage scrolls in **6 sections** with **2 visible cedar pills** (hero + closer) and **1 mid-page form** (InlineQuoteSection).
- About / Services / Work each scroll in **5 sections** with **2 cedar pills**.
- Contact remains a **single-screen** conversion page.
- Every page reads as: *attention → proof → form*. Nothing else.
- Net code: ~150 fewer lines, zero new components, zero risk to the design system.
