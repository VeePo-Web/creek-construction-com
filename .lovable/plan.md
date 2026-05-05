
# Pass 7 — "FlexServices-clean" Funnel Audit

Goal: Every public page should funnel from **arrival → trust → quote** with the same minimal cadence and shared components. Keep the Creek editorial aesthetic (cedar/cream, DM Serif/Sans, light-only). Borrow only the *funnel discipline* from FlexServices (testimonials reused, mini-FAQ reused, CTA repeated at every scroll milestone, owner/crew moment), not its visual style.

## Audit findings

| Page | Missing vs ideal funnel |
|------|--------------------------|
| `/` Index | No testimonials, no mini-FAQ, no owner/crew moment. Hero → Services → About → Featured → Closer leaves a long stretch with no social proof. |
| `/services` | No testimonials. FAQ exists (good). Mid-page CTA exists (good). |
| `/about` | No owner photo / crew portrait moment, no testimonials. |
| `/work` | No testimonials below the gallery. CTA only at the very bottom of the placeholder grid. |
| `/contact` | No mini-FAQ. Quote card is good but the page is short — feels thin. |
| Footer | Tertiary CTA exists. Good. |

Three components are missing as **reusable** modules:
1. A canonical `<TestimonialStrip />` (3 quotes, editorial cards — bronze hairline, no avatars, just first name + city).
2. A canonical `<MiniFaq />` (4 questions, accordion) that takes an `items` prop so each page can pass page-relevant Q&A while sharing all styling.
3. A canonical `<CrewMoment />` (single editorial photo + 2-paragraph note + CedarCTA) — Creek's equivalent of FlexServices' "Meet the Owner".

## Plan

### 1 · New shared modules (`src/components/`)

- **`TestimonialStrip.tsx`** — 3 quotes from a new `src/config/testimonials.ts`. Layout: 3-col grid on md+, stacked on mobile. Each card: hairline border, large pull-quote in DM Serif, attribution line `— First name · City`. Optional `eyebrow` + `heading` props (defaults: `"WHAT NEIGHBORS SAY"` / `"Quiet recommendations."`). No stars, no avatars (stays editorial). Trailing `<CedarCTA />` underneath.
- **`MiniFaq.tsx`** — wraps existing `<FaqAccordion />`. Props: `items`, `eyebrow?`, `heading?`. Defaults match Services page tone. Single column, max-w-3xl, `bg-background`.
- **`CrewMoment.tsx`** — 2-col editorial: left = `<MediaSlot>` portrait (query: `shot_type:["portrait","process"]`), right = headline `"The crew on-site is the crew you meet."` + 2 short paragraphs + `<CedarCTA />`. No bio fluff.
- **`src/config/testimonials.ts`** — 5–6 quote objects: `{ quote, firstName, city, service }`. Single source of truth.

### 2 · Per-page edits

**`/` Index** — insert in this order:
```
Hero → HeroProofBand → Services → CrewMoment → About →
FeaturedProjects → TestimonialStrip → MiniFaq → Contact (closer) → Footer
```
- Replace the lone `<EditorialBleedSection />` between Hero and Services with `<CrewMoment />` (one bleed → one human moment; the proof band already gives a beat after Hero).
- Add `<TestimonialStrip />` after FeaturedProjects.
- Add `<MiniFaq />` (4 high-conversion questions: pricing, timeline, warranty, areas) before the Contact closer.

**`/services`** — add `<TestimonialStrip />` between the Responsibility matrix and the existing FAQ. Trim Services FAQ to the same 4 questions used on home + 1 service-specific (it's currently 4, fine — leave as is).

**`/about`** — add `<CrewMoment />` after the "Who we are" story section, and `<TestimonialStrip />` after the Service Areas chips. Closer stays.

**`/work`** — add `<TestimonialStrip />` between the placeholder gallery and the closer. Insert one extra mid-page `<CedarCTA />` row above the placeholder grid (mirrors Services mid-catalogue prompt) so the long page never goes >1 viewport without an ask.

**`/contact`** — add `<MiniFaq />` below the contact info / closer grid. Use the same 4 questions as home.

### 3 · Funnel hygiene tweaks

- **CTA cadence rule:** every page must have a CedarCTA in the hero, mid-page, and closer. Audit confirms all four pages will satisfy this after Pass 7.
- **Anchor IDs:** new sections get `id="section-testimonials"`, `id="section-faq"`, `id="section-crew"` — registered in `src/lib/page-sections.ts` so the SectionRail nav picks them up automatically (per Core memory rule).
- **Reveal:** every new module uses `useReveal()` for entrance, matching Services/About/FeaturedProjects.
- **Skip-to-content targets:** unchanged — they still point to the first content section.

### 4 · What we are NOT doing

- No new colors, fonts, or design tokens — strictly compose existing primitives.
- No dark mode, no gradients beyond what's already in `BACKDROP`.
- No new page routes.
- No edits to `src/integrations/supabase/*`, `.env`, or `supabase/config.toml`.
- No edits to the navigation, hero, or footer beyond what's listed above.

## Technical notes (for the implementer)

- `useReveal`, `MediaSlot`, `FaqAccordion`, `SectionHeader`, `BronzeRule`, `bronzeStep`, `BACKDROP`, `SECTION_PADDING`, `MAX_WIDTH`, `BODY` are all already in the codebase — reuse, don't fork.
- `CrewMoment` mediaslot should pass `fallbackVariant="cedar"` so the section reads correctly even before a portrait photo is approved in the media library.
- `TestimonialStrip` cards: `border border-border/40` + `borderLeft: 2px solid hsl(var(--cedar) / bronzeStep(i, n))` to keep the thermal-crescendo pattern consistent with Services/About lists.
- `MiniFaq` should re-export the same FAQ list constant from `src/config/faqs.ts` (new file, single source) — replace the inline FAQ arrays currently in `src/pages/Services.tsx` with an import from this new config.

## Expected outcome

Five public pages, one funnel rhythm, one set of reusable modules. Visiting any page surfaces: photo proof → human moment → social proof → answer to the obvious objection → CedarCTA. Same beats, same components, no per-page divergence — like FlexServices' funnel discipline rendered through Creek's editorial system.
