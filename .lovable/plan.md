## Goal

Finish the Creek Construction rebrand so the site is fully functional, on-brand, and free of sauna-specific content. Fix the active runtime error (`useQuoteModal must be used inside <QuoteModalProvider>`) as the first step.

---

## 1. Wire the global quote modal (fixes runtime error)

**`src/App.tsx`**
- Wrap the app in `<QuoteModalProvider>` (around `<BrowserRouter>` content).
- Render a single `<QuoteModal />` instance once, inside the provider, so every `CedarCTA` and the nav "Request a Quote" button can open it from anywhere.
- Replace the legacy route table with the new IA used by `Navigation.tsx`:
  - `/` → `Index`
  - `/services` → `Services` page (rebuilt)
  - `/work` → `Work` page (rebuilt as project gallery)
  - `/about` → `About` page (rebuilt)
  - `/contact` → `Contact` page (rebuilt — info + CTA, no static form)
  - `*` → `NotFound`
- Remove `/signature`, `/custom`, `/standard`, `/plan`, `/resources`, `/resources/:id` routes and the `Blog`/`BlogPost` imports.

---

## 2. Remove sauna-only features

Delete (or stop importing) these files so no sauna content can leak back in:
- `src/components/TemperatureTicker.tsx`
- `src/components/LifeAfterFirstHeat.tsx`
- `src/components/RitualIdentity.tsx`
- `src/data/blogPosts.ts`
- `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`
- `src/hooks/useAlbertaTemp.ts`, `src/hooks/useSeason.ts`
- Sauna-specific assets in `src/assets/` referenced only by removed components.

Keep generic primitives: `SectionHeader`, `CedarCTA` (now opens modal), `SubPageHero`, `ImageDivider`, `ScrollRevealMotion`, `Footer`, `Navigation`, `ProgressiveImage`, `JsonLd`.

---

## 3. Rebuild `src/pages/Index.tsx`

New section order, all evergreen/bronze, all "excellence in the work" voice:
1. `<Navigation />`
2. `<Hero />` (already rebranded — verify CTA opens modal)
3. **Brand promise band** — short editorial line: "No gimmicks. No upsells. Just the work, done right." (3 supporting micro-points: Built right · Finished clean · Stands up to Alberta)
4. `<Services />` (rewritten — see §4)
5. `<ImageDivider />` with neutral wood/cedar texture (reuse existing `cedar-texture-premium.jpg` — wood is on-brand for exterior carpentry)
6. `<About />` (rewritten — see §5) — "How we work" + the Creek Process (Quote → Plan → Build → Walkthrough)
7. `<Testimonials />` (rewritten copy, generic placeholders the user can edit later — 3 cards, no sauna references)
8. `<Portfolio />` (rewritten as "Recent Work" — placeholder cards labeled Deck / Fence / Painting until real photos are uploaded; uses existing dark-gradient placeholder treatment)
9. **Service-area band** — Calgary, Cochrane, Airdrie, Okotoks, Edmonton, Sherwood Park, St. Albert, Spruce Grove, Leduc
10. **Final CTA section** — single bronze CTA "Request a Quote" + phone/email line
11. `<Footer />`

Drop: `RitualIdentity`, `LifeAfterFirstHeat`, `TemperatureTicker`, the Contact form section.

---

## 4. Rewrite `src/components/Services.tsx`

- Drive entirely from `SERVICES` in `src/config/services.ts` (already correct: Decks, Fencing, Sheds, Exterior Painting, Siding & Exterior Repair, Pergolas & Gazebos).
- 6 cards in a 3-col grid (1-col mobile, 2-col tablet), each using its Lucide icon and the existing thermal-crescendo border opacity ramp from `intensity`.
- Each card click → `openModal([service.id])` so the quote modal opens with that service preselected.
- Keep the existing "We handle / You handle" responsibility matrix but rewrite for exterior construction:
  - **We handle:** site assessment, materials sourcing, permits where required, build, cleanup, final walkthrough.
  - **You handle:** property access, HOA approvals if any, color/material preferences, paying invoices on milestones.
- Bottom CTA: bronze "Request a Quote".

---

## 5. Rewrite `src/components/About.tsx`

- Section header: numeral III, "OUR APPROACH", heading "Excellence is the marketing".
- Lede paragraphs: pride-in-craftsmanship voice, no sauna references.
- Replace the interior sauna image with a neutral dark-gradient placeholder block (or reuse `cedar-texture-premium.jpg`) — user will swap real photos later.
- Replace "First Heat™ Process" with **The Creek Process** (5 steps): Request → Site Visit & Quote → Schedule → Build → Walkthrough & Warranty.
- Stats: replace "Alberta Communities (7)" + "Starting at ~$8,000" with:
  - **Service area:** Calgary + Edmonton metros
  - **Free quotes:** $0, no obligation
  - (Optional third) **Response time:** 24–48 h
- CTA: bronze "Request a Quote".

---

## 6. Rewrite `src/components/Testimonials.tsx`

- 3 placeholder testimonials with generic Calgary/Edmonton names + service type (Deck / Fence / Painting). Mark them clearly in a code comment so the user knows to replace.
- Remove "anxiety" badge; replace with service-type badge.
- Keep star ratings, reveal animations, layout.
- Bottom CTA: bronze "Request a Quote".

---

## 7. Rewrite `src/components/Portfolio.tsx`

- Replace 3 sauna projects with 3 placeholder "Recent Work" cards using existing dark-gradient overlays (no real photos required yet).
- Card labels: "Custom Cedar Deck — Calgary", "Privacy Fence — Sherwood Park", "Full Exterior Repaint — Cochrane".
- Each links to `/work` (gallery page) instead of nonexistent project pages.
- Keep the parallax/scale-reveal animation hooks intact.

---

## 8. Rebuild sub-pages

**`src/pages/Services.tsx`** (`/services`)
- `<Navigation />`, `<SubPageHero />` (placeholder image, evergreen treatment), full grid of all 6 services with longer descriptions, the "We handle / You handle" matrix, FAQ-style accordion (3–4 common questions: timelines, warranty, payment, materials), bronze CTA, `<Footer />`.

**`src/pages/Work.tsx`** (`/work`)
- `<Navigation />`, `<SubPageHero />`, gallery grid (6 placeholder cards grouped by service), short editorial caption per card, bronze CTA, `<Footer />`.
- Comment block at top explaining the user should swap placeholders for real photos.

**`src/pages/About.tsx`** (`/about`)
- `<Navigation />`, `<SubPageHero />`, "Who we are" narrative, the Creek Process timeline (same as homepage but expanded), service-area map-like list, bronze CTA, `<Footer />`.

**`src/pages/Contact.tsx`** (`/contact`)
- `<Navigation />`, `<SubPageHero />`, two-column layout:
  - Left: phone (`CONTACT.phone`), email (`CONTACT.email`), service area, response time — all clean editorial styling.
  - Right: a single large bronze CTA card "Request a Quote" that opens the modal.
- No standalone form on the page — the modal is the canonical capture path.
- `<Footer />`.

---

## 9. Footer & global polish

- `Footer.tsx`: confirm copy is Creek Construction, evergreen background, bronze accents, includes phone/email from `CONTACT`, service areas, copyright year, link list matching new IA. (Already partly rebranded — review and finish.)
- `JsonLd.tsx` `LocalBusinessJsonLd`: rewrite to Creek Construction — name, telephone `+17807775178`, email `Creekproconstruction@gmail.com`, areaServed Calgary + Edmonton metros, removes sauna-specific schema. Use `GeneralContractor` schema type.
- `index.html` meta: title, description, OG tags rewritten for Creek Construction. Update favicon to the new logo.
- `useDocumentTitle` calls on each page updated to Creek copy.

---

## 10. Verification

- Confirm no remaining imports of removed files (`rg "TemperatureTicker|LifeAfterFirstHeat|RitualIdentity|blogPosts"` should return zero hits in `src/`).
- Confirm every `CedarCTA` opens the modal (it already does via the `to` prop being intercepted — verify after provider is mounted).
- Confirm `QuoteModal` submits to `submit-quote-request` edge function and shows success state.
- Test `submit-quote-request` once with `supabase--curl_edge_functions` to confirm the row lands in `quote_requests` and no errors appear in `supabase--edge_function_logs`.
- Run `supabase--linter` to confirm RLS posture is still clean.

---

## What this plan does NOT do

- Does **not** add real project photos — placeholders only, with clear comments showing where to swap them.
- Does **not** wire outbound email yet. The edge function currently inserts to the DB and logs the lead; an email-sending step (Resend or similar) can be added in a follow-up once an email-sending domain is verified. Leads will not be lost — they're stored in `quote_requests` and can be viewed in the Lovable Cloud dashboard.
- Does **not** add authentication, an admin dashboard, or analytics — out of scope for the rebrand.
