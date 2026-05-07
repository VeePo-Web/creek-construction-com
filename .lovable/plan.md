# Pass 13 — Section-by-Section Viewport Audit (Taste-Skill Minimalist + Redesign)

Applying `minimalist-skill` and `redesign-skill` from `Leonxlnx/taste-skill` to a section-by-section, viewport-by-viewport sweep. The site is already disciplined; this pass attacks the remaining flab — duplicate conversion paths, mobile chrome that's too crowded, breakpoints that the recent token changes haven't been re-checked against, and per-section ergonomics at 360px, 768px, 1280px, and 1920px.

Single rule: **one terminal CTA per page, one mid-page CTA per page, never two of the same kind back-to-back.** FlexServices.org runs ~3 conversion surfaces total per route. We currently run 5–7.

---

## A. Funnel discipline — kill duplicate CTAs sitewide

Current homepage funnel: nav Quote → Hero CedarCTA → **InlineQuoteSection (full form)** → Services tiles (open modal) → CrewMoment → Featured → Testimonials → MiniFaq → **QuoteCloserCard (modal)** → footer. Plus **MobileConversionBar** fixed at the bottom on `<sm`. That's six conversion entry points on one scroll.

A1. **Remove `<InlineQuoteSection />` from `src/pages/Index.tsx`.** Reasoning: pasting an entire 8-field form mid-homepage breaks the editorial scan and competes with the closer form/CTA. Move the form-mid-page pattern to `/contact` only, where it belongs.
A2. **Remove `MobileConversionBar` from `src/App.tsx`.** The nav already pins phone+Quote on mobile and never fades. A second fixed CTA strip is the textbook "AI shipped two of everything" smell. Delete the file.
A3. **Remove `<MidPageQuotePrompt />` from `src/pages/Services.tsx` (after group #3).** The `/services` page already ends with the canonical `QuoteCloserCard`, and every service row is itself a button that opens the modal. Mid-page prompt is redundant.
A4. **Keep MidPageQuotePrompt on `/work`** — but only one, after the placeholder gallery (already the case). No change.
A5. After A1, the homepage rhythm becomes: `Hero → Services → CrewMoment → Featured → Testimonials → MiniFaq → QuoteCloserCard`. Seven beats, one form, two CTAs. Aligned with FlexServices.

---

## B. Navigation chrome — simplify mobile + tighten desktop

B1. **Mobile right cluster (< sm):** today shows `[📞 icon][Quote pill][☰]`. Three buttons in 11rem of width feels crowded. Drop the standalone phone icon on `<sm` only — the menu and the Quote pill stay; the phone link still exists at the top of GlobalMenu. (Tablet `sm`–`lg` keeps the icon — it has room.)
B2. **Desktop right cluster (lg+):** today shows `· phone · Free quote · MENU`. Move the phone link inside `MENU` flyout's header instead, so the chrome carries only `[Free quote] [MENU]`. Phone is one click further on desktop where users hardly tap-to-call. (If the user wants to keep desktop phone visible, we leave this change out.)
B3. **Top hairline gradient** in `Navigation.tsx` (`via-cedar/40`) — drop to `via-cedar/25`. At 1920px it currently reads as a colored ruler. Should be a hint, not a stripe.
B4. **Section rail centered text** (`SectionRail`) — verify sections fit in 980px viewport. If they overflow → push to `SectionRailCompact` earlier (tighten breakpoint from `lg` to `xl`).
B5. **NavigationMinimal (Contact page nav):** verify on `<sm` that logo + phone fit in 360px without truncation; if it does, no change.

---

## C. Hero (Index.tsx → Hero.tsx) — tighten responsive type

C1. **PageHero `architect-bleed` variant**, breakpoints to verify:
- 360px: title "Excellence in / the Work." should be ~`text-5xl` not `text-6xl`. Check `KineticHeadline` size mapping; if needed add a smaller mobile step.
- 768px: subtitle should remain on 1–2 lines, not 3.
- 1920px: title at desktop currently runs at one size for `lg+`; consider an `xl:` step.

C2. **Eyebrow** "Exterior Construction · Calgary · Edmonton" duplicates the breadcrumb "Calgary · Edmonton · Alberta". Drop the eyebrow's city tail — keep just `EXTERIOR CONSTRUCTION`. Breadcrumb stays as the geo signal.

C3. **HeroProofBand** stat trio — verify on 360px the three stats don't word-wrap their labels. If they do, cut "Quote turnaround" to "Quote reply" (10 chars vs 16) so all three labels stay one line.

C4. **Hero phone secondary link** ("or call …") — verify color contrast on the dark architect bleed. `text-white/70` may fail WCAG AA on a busy photo. Bump to `/85`.

---

## D. Services tiles (Services.tsx homepage section)

D1. **Tile min-height** is `min-h-[340px]`. On 1920px with five tiles in a 3-col grid, the second row has only two tiles → asymmetric whitespace. Either drop to a clean 3-col on `lg+` and keep min-height (current), or switch to a 5-col `xl:grid-cols-5` so the row fills. Recommend: keep 3-col but make the two tiles in row 2 span gracefully (`xl:grid-cols-3` with the last two centered or use a 2-3 layout).
D2. **Tile copy lengths** — confirm `group.short` strings are all ≤80 chars; longer ones bloat tile height inconsistently across breakpoints. If any exceed, trim in `src/config/services.ts`.
D3. **Tile hover** — `hover:bg-cedar/[0.03]` on a 340px-tall card with image shows the wash mostly over the bottom 100px (the text area). Move the wash to the entire button (already the case). No change. Verified by re-reading Services.tsx.
D4. **Tablet (md → lg)**: today renders 2-col, but the third row has one orphan tile. Add `lg:grid-cols-3` (already present) — verify the in-between `md` is the orphan-prone band; consider `md:grid-cols-2` for a clean 2×2 + 1 reads OK editorially.

---

## E. CrewMoment — quiet ergonomics

E1. After Pass 12, the eyebrow is gone. Verify the section headline `"The crew on-site is the crew you meet."` doesn't visually compete with the surrounding sections. If it reads identical-weight to Services H2, drop one display step (`text-3xl md:text-4xl` instead of `text-4xl md:text-5xl`) inside `HEADLINE.section` for `quiet` variant only. Implementation: add a `headingClass` override prop to `SectionHeader`.
E2. **Mobile (360px)** — the photo on the left collapses above the paragraph. Make sure the photo is cropped portrait (already `aspect-portrait`) and confirm it loads at a sensible mobile width via the existing `MEDIA_SIZES.PORTRAIT_HALF` sizes hint.

---

## F. FeaturedProjects — the asymmetric grid

F1. **Tablet (768–1024)** — the asymmetric `1 lead + 2 stack` row may look cramped. Force `md:grid-cols-2` for the lead row at this band so the lead photo gets a fair half and stack collapses below.
F2. **Image lazy-loading** — first project's hero needs `priority` (LCP); subsequent ones lazy. Verify `EditorialPicture` honors a `priority` flag passed from `FeaturedProjects` to the lead card.
F3. **Hover scale `1.04`** — at 1920px on a 800px-wide image this magnifies micro-grain. Drop to `1.025` for the lead variant only.

---

## G. TestimonialStrip — viewport sweep

G1. **Quote cards** at 360px have 32px padding (`p-8`). Cut to `p-6` on mobile (`p-6 md:p-9`).
G2. **Cedar opening quote glyph** (`text-5xl`) at 360px crowds the body text. Drop to `text-4xl` on mobile.
G3. **Card border-left** is `2px` solid cedar with progressive opacity. Verify the leftmost (lightest) card on a `bg-secondary` surface still shows the rule. If invisible, raise the floor in `bronzeStep()` from current `0.20` to `0.30`.

---

## H. MiniFaq — accordion polish

H1. Verify `FaqAccordion` uses `+` / `−` icons per the taste-skill minimalist directive (Section 5: Accordions). If it currently uses chevron, swap to a plus-minus toggle.
H2. **Mobile question text** — current size on `FaqAccordion`. Ensure tap targets ≥44px; if items are short, pad vertically.
H3. The phone fallback row uses `border-t border-cedar/15`. Acceptable on `bg-background` but on `bg-secondary` the cedar tint is hard to see — change to `border-border/40` for surface-agnostic contrast.

---

## I. QuoteCloserCard — the page-end ask

I1. **Padding on mobile** — currently `p-10 md:p-12`. At 360px, 40px padding eats too much of a 360-wide card. Change to `p-7 md:p-12`.
I2. **Trust strip** — six trust signals wrap to two lines on mobile. Verify line-height between rows doesn't collide; if it does, add `gap-y-2.5`.
I3. **Headline on 1920px** at `text-3xl md:text-4xl` — bump desktop to `text-4xl md:text-5xl` so it carries the closer with the same weight as the page H1.

---

## J. /about — page-by-page audit

J1. Hero: today three text rows below breadcrumb (sectionLabel, title, italic, subtitle). That's four lines. Drop `italic="Locally owned. No gimmicks."` — duplicates the subtitle's "The crew you meet is the crew on-site."
J2. Story section: `MAX_WIDTH.content` (max-w-4xl) is correct for prose. Stats trio below — verify mobile column gap (`gap-6`) doesn't push numbers off-screen at 360px when a stat reads `200+`. Test, tighten to `gap-4` on `<sm` if needed.
J3. Process section: 5 steps in `space-y-4`. Tablet (768) — works. Desktop wide (1920) — the prose feels narrow at `max-w-4xl`. Acceptable; do not widen (FlexServices runs even narrower).
J4. Areas section: cities chips. At 360px, `px-3 py-2` chips at `text-sm` may overflow by 1 chip per row. Acceptable wrapping. Confirm chip min-height ≥44px (currently borderline at `py-2`). Bump to `py-2.5`.

---

## K. /services — page-by-page audit

K1. Hero: same italic-vs-subtitle redundancy. Keep `italic="Fifteen services. One crew."` AND drop subtitle to `"All residential. All built to outlast Alberta winters."` (cut "All exterior" — implied).
K2. Catalogue groups: borders use `bronzeStep()`. Verify the lightest group (last) still has visible separator on mobile. If invisible, raise floor as in G3.
K3. **Catalogue 2-col grid** at 768–1024 — works. At 360px collapses to 1-col: confirm row min-height ≥44px (`py-4` × text yields ~52px — fine).
K4. Responsibility matrix: two cards side-by-side on `md+`. At 768 they get cramped — switch breakpoint to `lg:grid-cols-2` so 768–1024 stacks vertically.
K5. After A3 (remove MidPageQuotePrompt), confirm the catalogue still reads end-to-end without the strip; the closer is one screen below.

---

## L. /work — page-by-page audit

L1. Hero `cinematic-bleed`: verify the "Sister studios" footnote reads on 360px without truncation. If it wraps to 3 lines, shorten to "Sister studios · B&P Saunas · Hickory & Rose" (no spaces around `&`).
L2. Featured section: `subheading={PROJECTS[0].summary}` may be 200+ chars; verify it doesn't dwarf the headline. If long, truncate visually via line-clamp or pull the first sentence only.
L3. Per-project header: at 768 the title + meta wrap awkwardly. Stack vertically on `<lg`: `flex-col items-start lg:flex-row lg:items-baseline lg:justify-between`.
L4. Placeholder gallery: 5 placeholder tiles in a 3-col grid → 2 orphans on row 2. Either show 6 (add one more service slot) or shift grid to `lg:grid-cols-2` with bigger tiles. Recommend 2-col bigger tiles — feels intentional, not "padding".
L5. After L4, MidPageQuotePrompt sits below 6 tiles → fine.

---

## M. /contact — page-by-page audit

M1. Headline strip: `text-4xl md:text-5xl lg:text-6xl` — at 360px `text-4xl` is 36px, fine. At 1920px `text-6xl` is 60px and the page only has one section → headline dominates correctly. No change.
M2. Two-column grid `lg:grid-cols-[5fr_7fr]` collapses on `<lg`. At 768 stacks: contact card on top, form below. Verify form CTA is visible without scrolling on iPad portrait — likely is.
M3. Direct contact card: `min-h-[44px]` rows. The `Call/Text` row says "Reply in 24–48h" but our turnaround promise is "24h" elsewhere. Standardize copy: pick one ("24–48 hours" everywhere or "24 hours" everywhere). Recommend "24–48 hours" — under-promises, over-delivers.
M4. The form's success state shows a "Call us now" button — confirm it falls back gracefully on `<sm`.

---

## N. Spacing + typography token consistency (sitewide)

N1. **`SECTION_PADDING.default`** is now `py-20 md:py-28` (Pass 12). Verify `bg-secondary` ↔ `bg-background` alternation still reads at the new tighter rhythm; if blocks blur together, raise to `py-22 md:py-30`. Likely fine — keep.
N2. **`HEADLINE.section`** — confirm tracking is negative (`-0.02em` to `-0.04em` per minimalist-skill). If `letter-spacing: 0`, add `-0.025em`.
N3. **Tabular numerals** — stats and "Reply in 24–48h" should use `tabular-nums`. Verify by grep; add `font-variant-numeric: tabular-nums` to `BODY.lead` where stats appear.
N4. **`text-balance` on H1/H2** — apply `text-wrap: balance` (Tailwind: `text-balance`) sitewide on display headings to kill orphans (per redesign-skill typography rule). Add to `HEADLINE.section`/`HEADLINE.display` Tailwind classes.

---

## O. Color + surface drift (per minimalist-skill §4)

O1. Verify body text is **not** pure `#000`. Check `--foreground` token in `index.css`; should be a warm off-black (e.g. `hsl(30 8% 12%)`). If absolute, warm it.
O2. Verify card borders use a **single** ultra-light tone (e.g. `hsl(30 12% 88%)`). Today we have `border-border/40`, `border-border/60`, `border-cedar/15`, `border-cedar/20` floating around. Document the canonical four:
- Default border: `border-border/60` (always-visible structural)
- Quiet border: `border-border/40` (cards on `bg-background`)
- Cedar accent: `border-cedar/20` (CTA cards)
- Cedar progressive: `bronzeStep()` (sequential lists)
Anything else gets normalized.

O3. **No drop shadows** beyond `shadow-contact` (which is already low-opacity). Verify by `rg "shadow-md|shadow-lg|shadow-xl|shadow-2xl"` — replace any hits with `shadow-contact`.

---

## P. Motion sweep (per minimalist-skill §7)

P1. `useReveal` already applies fade+translate. Verify duration ≤600ms and easing `cubic-bezier(0.16, 1, 0.3, 1)`.
P2. No `scroll` listeners — confirm everything uses `IntersectionObserver`. `useScrollChrome` is the one allowed exception (chrome state).
P3. Hover scales >1.04 anywhere → drop. (Already noted in F3 for FeaturedProjects.)

---

## Q. Verification checklist (executed after each section is shipped)

For every page (Index, About, Services, Work, Contact) at viewports **360, 768, 1280, 1920**:
1. No horizontal scroll.
2. All tap targets ≥44×44.
3. Headline doesn't have orphan word.
4. ≤1 fixed/sticky element above the fold.
5. ≤2 primary CedarCTA instances on the route (hero + closer; closer can also be the inline form on Index after the InlineQuote removal — but Pass 13 removes that, so closer-only).
6. Section-to-section background alternates `background ↔ secondary`.
7. No `text-white`, `bg-black`, or hex literals inside components.
8. `MENU` opens, `tel:` works, `Quote` modal opens.

---

## Expected outcome

- Three fewer conversion surfaces on the homepage.
- One file deleted (`MobileConversionBar.tsx`), one section call removed (`InlineQuoteSection`), one mid-page prompt removed (`/services`).
- Two duplicate italic/subtitle pairs collapsed.
- Tighter mobile chrome (one fewer button on `<sm`).
- Verified responsive rhythm at 360/768/1280/1920 for every page.
- Color & shadow tokens reduced to a documented four.
- Display headings use `text-balance` and slight negative tracking sitewide.

After this pass, the site reads like FlexServices: one thought per section, one ask per page, no chrome that competes with content.
