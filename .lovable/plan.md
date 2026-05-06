
# Pass 9 — FlexServices funnel discipline (without surrendering Creek's editorial DNA)

After studying every public component of FlexServices.Org alongside Creek as it stands, the gap is **not visual** — Creek's editorial system is more polished. The gap is **funnel friction**: FlexServices ruthlessly removes every step between "user lands" and "lead captured." Pass 9 transplants that discipline onto Creek without flattening the editorial aesthetic.

## Audit — what FlexServices does that Creek doesn't

| FlexServices pattern | Why it converts | Creek today |
|---|---|---|
| **Inline form on `/contact` hero** — no clicks, just type | Removes the modal-open step entirely | `/contact` shows info card + closer; form lives in modal |
| **Stripped header on `/contact`** — logo + phone only, no nav | Eliminates exit paths from the form page | Full nav on `/contact` (testimonials/FAQ rail, etc.) |
| **Bottom sticky bar — Quote + Call side-by-side** | Phone-preferrers don't have to scroll for the number | Creek FAB is Quote-only |
| **Inline quote form on the homepage**, between hero proof and services | Captures users who don't want to scroll the whole page | Creek homepage funnels to a closer card at the bottom |
| **Stats trio under owner moment** (3+ Years · 500+ Customers · 100% Satisfaction) | Proof inside the human moment | Creek `CrewMoment` has paragraphs only |
| **FAQ closes with "Call us at (403)…"** | Phone fallback at every conversion edge | Creek MiniFaq has a CTA but no tel link |
| **Compact stats bar** under TrustCredibility | Numerical proof without taking a section | Creek has `TrustStrip` icons but no numbers |

Creek already does some FlexServices things *better*: section-rail nav, design tokens, page rhythm. The work is additive — keep the editorial frame, transplant the friction-removal.

## Plan

### 1 · `/contact` becomes the conversion page (the biggest win)

FlexServices' `/contact` is a single hero with the form embedded — no nav, no testimonials, no FAQ to distract. Creek's `/contact` is a 4-section page that *talks about* the form instead of *being* the form.

Refactor to a stripped layout, FlexServices-style but in Creek's editorial voice:

```text
Header (slim variant — logo + phone CTA only, no SectionRail / GlobalMenu chrome)
PageHero(evergreen-typographic) — title, subtitle, ContactInfoCard (phone/email rows on left)
                                   QuoteFormInline (right column — the actual form)
MiniFaq(secondary) — kept as objection-killer above the fold-out
Footer (minimal: copyright + 2 links)
```

Remove TestimonialStrip + the duplicate QuoteCloserCard from `/contact`. Replace right-column "QuoteCloserCard asSection={false}" with `<QuoteFormInline />` — the actual form fields, not a button to open the modal.

`<QuoteFormInline />`: extract the existing `QuoteModal` body into a standalone component. Same Supabase submission path, same fields, no dialog wrapper. Used in two places: the modal (existing) and `/contact` page (new).

Header gets a `variant?: "default" | "minimal"` prop. Minimal hides SectionRail + nav links + GlobalMenu trigger; renders only logo (links home) + phone tel link. Used by `/contact` only — preserves brand mark for credibility, removes exit doors.

### 2 · Bottom bar replaces the Quote-only FAB

FlexServices' mobile sticky is **Quote + Call** as a single bar across the bottom. Reason: ~40% of contractor leads still call. Creek's `MobileQuoteFAB` only offers Quote.

Convert `MobileQuoteFAB.tsx` → `MobileConversionBar.tsx`:

- Two-up bar pinned to bottom (safe-area inset preserved).
- **Left (flex-1):** Cedar pill — "Get my free quote."
- **Right (auto):** Phone tel link with "Call" + a `(403)…` two-line treatment.
- Visibility rules unchanged (hidden until 600px scroll, hidden when modal open, hidden near footer, hidden when in-view CTA detected via `[data-quote-cta]`).
- Hidden entirely on `/contact` (the form is the page).
- Editorial styling: cedar primary + cream secondary border, NOT FlexServices blue gradient. Tokens stay Creek.

### 3 · Inline quote form on the homepage

FlexServices puts the form **between the hero and the services** so the funnel ends in section 2, not section 9. Creek's funnel ends at section 9 (the closer).

Add an `<InlineQuoteSection />` wrapping `<QuoteFormInline />` inside the homepage rhythm:

```text
Hero(B/W) → InlineQuoteSection(secondary) → Services(bg) → CrewMoment(secondary) →
About(bg) → FeaturedProjects(secondary) → TestimonialStrip(bg) →
MiniFaq(secondary) → QuoteCloserCard(bg, id="section-contact") → Footer
```

InlineQuoteSection layout:
- Left column: editorial eyebrow + serif headline ("Tell us what you're building.") + 3 trust bullets.
- Right column: `<QuoteFormInline />`.
- Same `bg-secondary` rhythm so it fits between Hero and Services.

This gives the page **two** funnel terminations — the form in section 2 (impatient leads) and the editorial closer in section 9 (slow scrollers). FlexServices does exactly this.

### 4 · Stats inside CrewMoment

Add an optional `<StatTrio />` row under the paragraphs in `<CrewMoment />`:

```
05+ YEARS BUILDING        500+ ALBERTA HOMES        24–48 hr RESPONSE
```

Numbers come from `src/config/trust-signals.ts` (extend with a `STATS_TRIO` array). `StatTrio` primitive already exists per memory — just compose. Default off for non-homepage contexts to preserve quietness.

### 5 · MiniFaq gets a phone fallback

After the FaqAccordion, append a tiny bronze-rule with:

```
Have more questions? Call (403) 689-1990 — Mon–Sat, 8am–7pm
```

Tel link uses `CONTACT.phoneTel`. Same minimal treatment FlexServices uses, in Creek typography. Toggleable via `showPhoneFallback` prop, default `true`.

### 6 · Compact stats bar inside TrustStrip

Add a 5-column tabular stats row at the bottom of TrustStrip (same component used in HeroProofBand + Footer) using existing `STATS_TRIO`-style data. One line per stat, bronze-rule numerals, muted labels. Keeps Creek's quiet treatment but adds the numerical proof FlexServices proves with.

### 7 · Per-page section rhythm after these additions

```text
/                Hero → InlineQuote(secondary) → Services(bg) → CrewMoment(secondary, +stats) →
                 About(bg) → Featured(secondary) → Testimonials(bg) → MiniFaq(secondary) →
                 Closer(bg) → Footer

/services        Hero → Catalogue(bg) → Contract(secondary) → Testimonials(bg) →
                 MiniFaq(secondary) → Closer(bg)

/about           Hero → Story(bg) → CrewMoment(secondary, +stats) → Process(bg) →
                 Areas(secondary) → Testimonials(bg) → MiniFaq(secondary) → Closer(bg)

/work            Hero → Featured(bg) → CrewMoment(secondary) → Gallery(bg) →
                 Testimonials(secondary) → Closer(bg)

/contact         Header(minimal) → PageHero + QuoteFormInline → MiniFaq(secondary) →
                 Footer(minimal)
```

### 8 · What we are NOT doing

- No urgency timers, no "15% OFF" scarcity banners, no "Booking fast" copy. Creek's brand is calm precision — FlexServices' urgency theatrics would cheapen it.
- No Tooltip overlays on trust badges (FlexServices over-explains; Creek's quiet rule + uppercase label is enough).
- No gradient buttons, no neon accents. Cedar + cream stays.
- No FlexServices-style "guarantee details" bottom collapsible — already covered by MiniFaq + closer copy.
- No analytics events / gtag wiring (out of scope; can be a separate pass).
- No edits to Supabase schema, edge functions, `.env`, or `supabase/config.toml`.

## Technical notes

**New files (5):**
- `src/components/quote/QuoteFormInline.tsx` — extracted form body (services chips, name/phone/email/address, contact preference radio, submit). Same Supabase insert path as `QuoteModal`. `compact?: boolean` prop for the inline-on-homepage variant.
- `src/components/InlineQuoteSection.tsx` — homepage section: 2-column eyebrow/headline/bullets + QuoteFormInline.
- `src/components/MobileConversionBar.tsx` — replaces `MobileQuoteFAB`. Quote pill + Call pill, safe-area inset, route-aware (hidden on `/contact`).
- `src/components/navigation/HeaderMinimal.tsx` *(or a `variant` on existing `Navigation`)* — slim header for `/contact`. Logo + phone, no nav, no rail.
- `src/config/stats.ts` — `STATS_TRIO: { value, label }[]` (5 Years / 500+ Homes / 24–48hr Response, etc.). Source of truth.

**Modified files (~10):**
- `src/components/quote/QuoteModal.tsx` — refactor body into `QuoteFormInline`; modal becomes a Dialog wrapper.
- `src/components/MobileQuoteFAB.tsx` — **delete** (replaced by MobileConversionBar).
- `src/App.tsx` (or wherever FAB mounts) — swap import + add route guard.
- `src/components/CrewMoment.tsx` — add `showStats?: boolean` prop, render `<StatTrio />` row when true.
- `src/components/MiniFaq.tsx` — add phone-fallback footer row, `showPhoneFallback?: boolean` (default true).
- `src/components/TrustStrip.tsx` — append compact stats row (data from `src/config/stats.ts`).
- `src/pages/Index.tsx` — insert `<InlineQuoteSection background="secondary" />` after `<Hero />`, set `<CrewMoment showStats />`.
- `src/pages/About.tsx` — `<CrewMoment showStats />`.
- `src/pages/Contact.tsx` — full rewrite per Section 1 above.
- `src/lib/page-sections.ts` — `/contact` returns `[]` (minimal header has no rail). `/` updates anchors order.

**Z-index / layout:**
- `MobileConversionBar` z-40, same band as the previous FAB.
- `Header variant="minimal"` keeps the existing fixed positioning & cream chrome — only inner content changes.

**A11y:**
- Inline form has its own `<h2 id="quote-form-heading">` + `aria-labelledby` on the wrapping `<section>`.
- Phone tel link in MobileConversionBar has 44px min height (existing accessibility memory).
- Minimal header phone link: `aria-label="Call (403) 689-1990"`.

**Performance:**
- `QuoteFormInline` pulled out of the existing lazy-loaded modal chunk. Homepage now ships the form eagerly (~6kb), but eliminates one round-trip when user clicks Quote. Net win for conversion; tracked against the Performance memory's "Home eager" policy which already permits this.
- `InlineQuoteSection` rendered in initial bundle (above-the-fold for tall viewports). Acceptable per same memory.

## Expected outcome

`/contact` becomes a single-screen conversion page indistinguishable from FlexServices' funnel discipline, but rendered in Creek's editorial typography. Mobile users always have a one-tap path to either Quote or Call without scrolling. Homepage offers two funnel exits: the inline form in section 2 for impatient leads, and the editorial closer in section 9 for considered ones. Every page that talks about the work ends with social proof + FAQ + closer, with phone fallback wired through. Visual aesthetic: untouched. Funnel: FlexServices-grade.
