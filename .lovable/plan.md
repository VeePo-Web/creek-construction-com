# Pass 26 — NotFound, FeaturedProjects, Contact, MidPageQuotePrompt, and the global radius/typography sweep

Pass 25 unified hero + gallery + section seams. Pass 26 attacks the remaining "almost-canonical" surfaces — the 404, the FeaturedProjects gallery, the Contact info card, the MidPageQuotePrompt — plus a global rounded-radius + truncation + tabular-nums sweep. These are the surfaces FlexServices nails by being relentlessly consistent; we're 90% there and the last 10% is what reads as "premium" vs. "good".

## A. NotFound (`src/pages/NotFound.tsx`) — bring it onto the same editorial chassis

Currently it ships a custom evergreen radial + custom 404 rule + raw `<h1 style={{fontSize: clamp(...)}}>`. None of it composes from the design system.

1. **Replace the entire hero** with `PageHero variant="evergreen-typographic"`, sectionLabel `"404 · Off the map"`, title `["Nothing here.", "But the work does."]`, subtitle copy moved to the variant's subtitle slot. Drop the manual `radial-gradient` and the manual 404 rule — the BronzeRule + triptych backdrop carry the same weight, branded.
2. **CTA cluster** — keep `<CedarCTA to="/">Back to home</CedarCTA>` + `<CedarCTA to="/services" variant="secondary">Browse services</CedarCTA>` as PageHero children. Spacing already handled by hero.
3. **Section anchor** — give the wrapper section the canonical `id="section-not-found"` so it gets the new global `scroll-mt` and feels first-party.
4. **Drop `flex-col flex-1` from `<main>`** — PageHero owns its own min-height now; the dual-flex layout is what produced the "stuck mid-screen" 404 on tall viewports.

## B. FeaturedProjects (`src/components/FeaturedProjects.tsx`)

5. **Radius drift** — every `rounded-sm` (4px) here clashes with ProjectGallery's new `rounded-[6px]` from Pass 25. Promote to `rounded-[6px]` everywhere (image wrapper, focus ring, "See all work" button) so the two galleries match.
6. **Hover scale ladder** — line 68 still uses two different scales depending on variant (`1.025` for lead vs `1.04` for stack/row). Pass 25 standardized Services tiles to `1.025`. Apply the same here: every variant `group-hover:scale-[1.025]`.
7. **Headline size ladder** — the lead heading goes `text-2xl md:text-3xl lg:text-[32px] xl:text-[36px]` while the stack/row ones top out at `text-xl md:text-2xl`. The lead at xl is only 4px bigger than stack — hierarchy disappears on desktop. Spread the ladder: lead `text-2xl md:text-3xl lg:text-[34px] xl:text-[40px]`, others `text-lg md:text-xl lg:text-[22px]`.
8. **Eyebrow row tabular-nums alignment** — the index numeral, location · service, and year all read in three slots. The first uses `tabular-nums`, the third uses `tabular-nums`, the middle (location · service) uses neither. Add a single `tabular-nums` to the row container so the dot separators don't drift between cards.
9. **Truncation collision** — line 91 has `truncate min-w-0` on the location/service span. When location is short and service is long ("decks") this looks fine, but when location is "Sherwood Park" the truncation eats the service. Switch to two-line wrap on `<sm`: `flex-wrap` + `whitespace-normal sm:whitespace-nowrap sm:truncate`.
10. **Placeholder gradient color** — hardcoded `hsl(150 25% 14%)` etc. Replace with the existing `BACKDROP.evergreenGradient` token (or add it if missing) so the dark-mode-cousin colors stay sourced from one file. Light-mode-only is fine; just don't hardcode.
11. **"See all work" button radius + padding** — `rounded-sm` → `rounded-[6px]`; the button is `border + bg-cedar/[0.04]` already which reads as a pill on most viewports. Add `tracking-[0.18em]` to match the secondary CedarCTA exactly.

## C. Contact (`src/pages/Contact.tsx`)

12. **Hero h1 scale** — `text-[32px] sm:text-4xl md:text-[44px] lg:text-[56px]` is one rung shy of the cinematic hero ladder (`xl:text-[64px]`). Add `xl:text-[64px]` so the headline lands at parity with home/services on large desktops.
13. **Headline tracking** — uses `tracking-[-0.025em]` while the cinematic hero uses `tracking-[-0.02em]`. Match the cinematic value site-wide for consistent letter-spacing.
14. **Subhead lift** — currently `mt-5 text-base md:text-lg text-muted-foreground`. Promote to `mt-6 text-base md:text-lg text-muted-foreground text-balance max-w-[44ch] mx-auto` to match the new hero subtitle spec from Pass 25.
15. **Eyebrow ("FREE QUOTE")** — currently raw `<p>`. Replace with `<BronzeRule label="FREE QUOTE" variant="onLight" />` so the eyebrow renders the bronze hairline like every other page hero.
16. **Direct contact card** — `rounded-sm` → `rounded-[6px]`. The bronze left-bar is good. The three rows currently divide via `border-t border-border/30`; replace with a fading hairline (linear-gradient borderImage at 0.20 mid) for editorial parity with the section seams from Pass 25.
17. **Phone row hierarchy** — the phone number renders as `text-foreground font-medium`. Bump to `font-serif text-lg` (it's the single most important conversion target on the page); leave email and area at sans body.
18. **Service Areas row "Including … + more towns"** — drop the literal `+ more towns` and replace with an em-dash phrasing per the typography memory: `"Including {first three cities} — and the towns in between."`
19. **Section vertical rhythm** — `pt-10 sm:pt-14 md:pt-20 pb-20 md:pb-28` is a custom ladder. Use `SECTION_PADDING.default` for `pb-*` and explicit smaller `pt-*` only (since NavigationMinimal is shorter than full nav). Cleans the spacing tokens.

## D. MidPageQuotePrompt (`src/components/MidPageQuotePrompt.tsx`)

20. **Border + bg combo too loud** — `border-cedar/20 bg-cedar/[0.04]` reads as a "callout box". The rest of the editorial system uses borderless cedar-tinted strips with a left bar. Replace with `border-l-[3px] border-cedar/40 bg-cedar/[0.03] rounded-r-[6px] rounded-l-none px-6 md:px-8 py-7`.
21. **Heading scale** — `text-xl md:text-2xl` is timid against the surrounding catalogue. Bump to `text-2xl md:text-3xl` with `text-balance max-w-[28ch]`.
22. **CTA gap** — on `<sm` the CTA stacks below; add `mt-2 sm:mt-0` so the gap respects the prompt baseline rather than the flex-gap.

## E. Global radius sweep

23. `rg "rounded-sm" src/components src/pages | rg -v "//"` — there are likely 30–60 hits. The new editorial radius is `rounded-[6px]` for image surfaces and `rounded-sm` (2–4px) only for chips/pills. Audit and migrate image/card surfaces to `rounded-[6px]`. Specifically Hero, FeaturedProjects ProjectCards, ProjectGallery (done), QuoteCloserCard image area, CrewMoment MediaSlot, MidPageQuotePrompt, Contact direct card, MiniFaq cards, NotFound — anywhere an image or media-bearing card sits.

## F. Tabular-nums + curly-quote sweep

24. **Tabular-nums** — every metadata strip with numerals (years, dates, indexes, addresses) should ship `tabular-nums`. Sweep `rg "[0-9]{4}" src/components src/pages -l` and confirm. CrewMoment stat row, FeaturedProjects index, Work meta line, About cities counter (if exists) — all need it.
25. **Curly quotes** — `rg "[a-zA-Z]'[a-z]" src/{components,pages}` and replace `'` → `’` in JSX text. Same for straight `"…"` → `"…"`. Do NOT touch JS string literals (props, hrefs, classNames, alt text identifiers); only visible JSX text.

## G. Section anchor IDs sanity

26. **Verify every page-level `<section>` has `id="section-*"`** so the global `scroll-mt` from Pass 24 catches it. NotFound currently has none. About story/process/areas — confirm. Work featured/gallery — confirm. Services catalogue/responsibility — confirm.

## H. Skip-to-content + landmark hygiene

27. **`SkipToContent target` audits** — Contact uses `section-contact`, Work uses dynamic `section-featured`/`section-gallery`. Verify each target id exists in the rendered DOM (no dead anchors). For NotFound, add `target="section-not-found"`.
28. **`<main>` `aria-label`** — every page already has one. Audit the wording to match the canonical pattern: `"<Page name> — Creek Construction"`. NotFound says "Page not found — Creek Construction" (good). Index says? Verify and align.

## I. Light QA

29. After edits: screenshot 404, Contact, Work-with-featured at 375 / 768 / 1366. Verify the 404 hero feels like the rest of the site (BronzeRule eyebrow, triptych backdrop, CedarCTA cluster), the FeaturedProjects gallery shares ProjectGallery's gap+radius DNA, and Contact's direct card uses fading hairlines + bronze-rule eyebrow.

## Files to touch

`src/pages/NotFound.tsx`, `src/components/FeaturedProjects.tsx`, `src/pages/Contact.tsx`, `src/components/MidPageQuotePrompt.tsx`, plus radius/quote sweep across `src/components/**` and `src/pages/**`. No schema, no business logic, no component deletions. Tokens-first, light-mode only.
