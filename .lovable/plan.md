# Pass 38 — Sub-page Eyebrow Sweep + Contact/About/Work Grammar Alignment

Pass 37 unified Home + Footer + Closer eyebrows to the `.eyebrow` utility. Pass 38 finishes the sweep across the public sub-pages — Contact, About, Work — plus the two highest-visibility shared modules (`FaqAccordion`, `MidPageQuotePrompt`, the homepage `Services` end-of-list footnote) and the lone color override left inside `SectionHeader`. After this pass, every uppercase tracked label on a public page will share the single `.eyebrow` stamp; every section heading will use the `HEADLINE.section` token; and every interactive content row will follow the canonical "left-bar marker, no fill" pattern.

Modal/admin/over-photo strings (QuoteModal, GlobalMenu, PageHero hero chrome, MediaSlot fallback caption) are explicitly **out of scope** — they need different opacities for visibility on photography and will get their own targeted pass.

## Principles continued from Pass 37
1. One `.eyebrow` utility, applied everywhere on cream/secondary backgrounds. Counters use `.eyebrow tabular-nums opacity-{55|60|70}`.
2. One row pattern across the site: `border-b border-cedar/12`, hidden 2px cedar left-bar, no row-fill on hover.
3. Section headings use `HEADLINE.section` from `src/lib/typography.ts` — never bespoke `font-serif text-3xl md:text-4xl …` strings.
4. Italic-serif type is reserved for **pull-quotes only** (footer tagline, About story quote, Hero quote-style subhead). Never for sub-headings.

---

## A. Contact page direct-line card (`src/pages/Contact.tsx` L60–L118)

The aside currently mixes three different eyebrow tracking values (0.22em, 0.22em, 0.22em — but all hand-rolled), three different value-row treatments (`font-serif text-lg` for phone, `font-medium` for email, `font-medium` for areas), and the phone eyebrow row crams two ideas ("Call or Text · Reply in 24–48 hours") into a single dim line. Rebuild the rows to one shape:

- **All three eyebrows** L80, L97, L111: bespoke `text-[10px] tracking-[0.22em] uppercase text-muted-foreground/75` → `<p className="eyebrow opacity-70">…</p>`.
- **Phone row** L80–L83: drop the "Reply in 24–48 hours" addendum from the eyebrow (it lives in the headline copy already and inside QuoteFormInline trust strip). Eyebrow becomes simply `Call or Text`. Phone value keeps `font-serif text-lg text-foreground tabular-nums`.
- **Email row** L97–L100: eyebrow `Email`. Value becomes `text-base text-foreground tabular-nums truncate` (drop `font-medium` — the eyebrow already announces the row).
- **Service-areas row** L106–L117: eyebrow `Service Areas`. Primary line `text-base text-foreground` (drop `font-medium`). Secondary line stays `text-xs text-muted-foreground mt-1`.
- **Outer aside** L68–L71: drop `bg-secondary/40` (competes with the 2px cedar bar — Apple-clean direct-line list is borderless). Keep `border-l-[2px] border-l-cedar`. Replace inner row dividers (L87, L104) with shared `border-t border-cedar/12` (already correct — keep).

The two `<SectionHeader>` blocks (L60, L123) above and right of the aside already use `disableMotion` and the new quiet style — keep as-is.

## B. About page chips + pull-quote (`src/pages/About.tsx`)

- **City chips** L114–L120: bespoke `text-[11px] tracking-[0.18em] uppercase text-muted-foreground border border-cedar/15 rounded-[2px] px-3 py-2.5` → wrap with `.eyebrow` then add the chip-specific structural classes:
  ```tsx
  className="eyebrow text-muted-foreground/75 border border-cedar/15 rounded-[2px] px-3 py-2.5 inline-flex items-center justify-center min-h-[44px] hover:text-foreground hover:border-cedar/30 transition-colors duration-300"
  ```
  (Keeps the 11px / 0.22em from `.eyebrow` — the previous 0.18em was the only stray tracking value on the page. The `text-muted-foreground/75` overrides `.eyebrow`'s default cedar tone so chips read as quiet UI, not editorial accents.)
- **Pull-quote** L62–L64: lift legibility — `text-foreground/70` → `text-foreground/85`. Add a faint hairline above for separation: change wrapper `pt-6` → `mt-6 pt-8 hairline`.

## C. Work page per-project header (`src/pages/Work.tsx` L78–L89)

- Heading L80–L85: bespoke `font-serif text-3xl md:text-4xl text-foreground` → import `HEADLINE` from `@/lib/typography` and use `className={HEADLINE.section}`. (Matches every other section heading site-wide.)
- Meta line L86–L88: bespoke `text-[10px] tracking-[0.22em] uppercase text-muted-foreground/85 tabular-nums` → `eyebrow tabular-nums opacity-75 shrink-0`.
- The wrapping `<header>` keeps its `mb-6 pt-10 hairline flex …` layout.

## D. Homepage Services end-of-list footnote (`src/components/Services.tsx` L82–L90)

The "Don't see what you need? Ask anyway." closer uses bespoke `text-[12px] tracking-[0.18em] uppercase text-muted-foreground/70`. This is the only stray tracking value left in the homepage. Switch to:
```tsx
className="group flex items-center justify-between py-6 md:py-7 pl-3 md:pl-5 eyebrow opacity-70 hover:opacity-100 transition-opacity"
```
(Loses the inline cedar hover on the chevron — keep that bit: chevron stays `group-hover:text-cedar`.)

## E. SectionHeader numeral cleanup (`src/components/SectionHeader.tsx` L70–L72)

`<span className="text-cedar/55 tabular-nums mr-3">{numeral}</span>` — the explicit `text-cedar/55` overrides the `.eyebrow` color stamp on its parent `<p>`. Drop the color class so the numeral inherits the eyebrow color (cedar at the canonical opacity); keep `tabular-nums mr-3 opacity-55` to keep it dimmer than the label without naming a color.

## F. FaqAccordion numeral (`src/components/ui/faq-accordion.tsx` L44–L46)

Bespoke `text-[11px] tracking-[0.22em] text-cedar/55 tabular-nums shrink-0` → `eyebrow tabular-nums opacity-55 shrink-0`. (Matches the SectionHeader numeral cleanup in §E so all numerals on the site share one stamp.)

Also tighten the question type at L47: `font-serif text-lg md:text-xl tracking-[-0.01em]` is fine — keep — but drop the `group-hover:text-cedar` color flip so the only hover signal is the typographic + → × glyph, consistent with the new "hover lives in the marker, not the type" principle established for content rows.

## G. MidPageQuotePrompt (`src/components/MidPageQuotePrompt.tsx`)

- L26 wrapper: `rounded-r-[6px]` → `rounded-r-[2px]` (matches the site-wide 2px corner standard set in Pass 35).
- L30 eyebrow: bespoke `text-[10px] tracking-[0.25em] uppercase text-cedar/80` → `<p className="eyebrow mb-1.5">{eyebrow}</p>`.
- L33 heading: keep `font-serif text-2xl md:text-3xl …` (this is a card-scale headline, not a section headline — it's the right size).

## H. Verification
1. `/contact` direct-line aside: three rows, three identical eyebrow stamps, no `bg-secondary/40` competing with the cedar bar.
2. `/about`: city chips share the eyebrow stamp; pull-quote sits above a faint hairline with full-ink-ish copy.
3. `/work`: per-project heading sized identically to every other section heading; meta line is one calm eyebrow.
4. `/`: Services list closing footnote reads as a quiet eyebrow row, hover opacity ramps.
5. SectionHeader numerals across all pages render the same opacity (≈0.55) — including FAQ.
6. FAQ trigger no longer shifts color on hover — only the +/× glyph rotates.
7. MidPageQuotePrompt renders 2px corners.
8. 390 / 768 / 1280 / 1440 sweep on `/`, `/services`, `/work`, `/about`, `/contact` — no overflow, no layout drift.

## Files to touch
`src/pages/Contact.tsx`, `src/pages/About.tsx`, `src/pages/Work.tsx`, `src/components/Services.tsx`, `src/components/SectionHeader.tsx`, `src/components/ui/faq-accordion.tsx`, `src/components/MidPageQuotePrompt.tsx`.
