# Pass 11 — FlexServices-Grade Reduction (Deep Audit)

Pass 10 cut the section count. Pass 11 cuts the **chrome inside what remains**. The pages are now structurally clean but each section still wears too much editorial garnish (numerals, subheadings, badges, quote bullets, trust strips repeated three times). FlexServices wins by saying things **once**, with confidence, in plain voice — never twice in two registers.

This pass executes 11 surgical edits across components and pages. Zero new files. Zero new tokens. Pure subtraction.

---

## 1. Footer — collapse from 3-col to one editorial line

`src/components/Footer.tsx` currently carries: 3-col grid (Brand / Navigate / Service Areas), tertiary `<CedarCTA>`, full `TRUST_SIGNALS` strip, copyright, and an "Excellence in the Work" tagline. The `QuoteCloserCard` directly above already carries the same CTA + the same trust strip. The footer therefore renders the conversion ask **twice in the same visual breath**.

Rewrite `Footer.tsx` to a single row:

```text
[brand mark + name]    Home · Services · Work · About · Contact    [phone] [email]
                            © 2026 Creek Construction · Calgary · Edmonton
```

- Remove the tertiary `<CedarCTA>` block entirely.
- Remove the `TRUST_SIGNALS` strip (it lives in the closer 100px above).
- Remove the service-area chips (they live on About).
- Remove the "Excellence in the Work · Pride in Every Detail" tagline.
- Result: one centered, two-row footer that reads like FlexServices' "© Flex • Licensed & Insured" line.

Net: ~80 lines → ~30 lines.

---

## 2. Hero proof band — stats only

`src/components/Hero.tsx` renders `<StatTrio>` over a hairline over `<TrustChips>`. The trust chips reappear in the QuoteCloserCard's trust strip (4 signals, identical labels). Drop the trust-chips half of the band. The stats stay because numbers are not repeated anywhere else above the closer.

Single-section band becomes:

```tsx
<section className="border-b border-cedar/15 bg-background">
  <div className="container mx-auto px-6 py-8 md:py-10">
    <StatTrio items={STATS} variant="inline" />
  </div>
</section>
```

---

## 3. Hero subtitle — one sentence

Drop the second sentence ("Our crew owns the work from quote to final nail."). The closer already owns that voice. Hero subtitle becomes:

> "Decks, fencing, sheds, painting and siding — built to last across Alberta."

---

## 4. SectionHeader — promote `quiet` to the default

The numeral + counter-badge editorial garnish (Roman I/II/III, "05 Steps") suits a single PageHero per route, not in-body sections. Currently many in-body uses pass `numeral` + `badge`. Two changes:

- In `src/components/SectionHeader.tsx`, flip the `variant` default from `"default"` to `"quiet"`. Pages that genuinely need the editorial treatment (PageHero captions on sub-pages) opt in with `variant="default"`.
- Sweep all `<SectionHeader numeral=… badge=… />` calls in `About.tsx`, `Services.tsx`, `Work.tsx`, `Contact.tsx` and drop the `numeral` + `badge` props. The `label` + `heading` carry the section.

This kills the "academic textbook" feel in one move.

---

## 5. InlineQuoteSection — drop the trust bullets

The 3 trust bullets ("Free, written, no obligation" / "We quote what we'll actually charge" / cities) duplicate the closer card's bullets word-for-word. Strip them. The left column becomes eyebrow + serif headline alone, the form sits right and dominates.

```tsx
<div>
  <p className="...eyebrow">{eyebrow}</p>
  <h2 id={headingId} className="font-serif text-3xl md:text-4xl ...">{heading}</h2>
</div>
<QuoteFormInline surface={background} />
```

---

## 6. QuoteCloserCard — drop the bullets, keep the trust strip

Same dedup logic in reverse. The `bullets` prop renders 3 lines that repeat the trust strip immediately below. Remove the bullets block; let the trust strip carry the proof. Body text + CTA + trust strip = enough.

Also: remove the `bullets` prop from the public API since nothing else uses it.

---

## 7. Services homepage tile — strip to icon + title + short

`src/components/Services.tsx` group tiles currently render: image, icon, "01" tabular index, serif title, uppercase short, full description, "Quote this →" line *(already removed)*. Still too dense for the homepage cadence.

Trim to: image, icon, serif title, one-line `short`. Drop the `01/02/03` index (homepage doesn't number elsewhere) and drop the long `description` paragraph (it lives on /services).

---

## 8. Services /services page — clean catalogue rows

`src/pages/Services.tsx` group catalogue:

- Per-item button currently has title + short + a "Quote →" suffix chip. The whole row is the button — the suffix is decorative. Drop it.
- Group header shows the icon + group title. Already lost the "01 / 05" badge in Pass 10. Now also drop the `Icon` from the group header (the homepage already showed icons; here we want catalogue clarity, not visual repetition).
- The "Click any service to start a quote with it pre-selected." subheading reads as instruction. Soften to a single short line, or drop it — the rows obviously open quotes via cursor + hover affordance.

---

## 9. About page — center the Story column

`src/pages/About.tsx` Story section uses `max-w-3xl` left-aligned inside a wide container, leaving a big empty right gutter. Center the column (`mx-auto`) and increase the leading. The inline stat trio aligns under it as a centered 3-up.

Process and Areas sections already use `MAX_WIDTH.content mx-auto`. Story should match.

---

## 10. CrewMoment — tighten paragraphs

Two paragraphs read as wall-of-text on a section that wants quiet. Cut to one short paragraph + one short pull line:

> "We don't subcontract. The crew you meet at the quote is the crew on-site. That's how we keep quality consistent — and it's why we'd rather do fewer projects exceptionally well than chase volume."

Remove the second paragraph entirely.

---

## 11. MiniFaq — drop the subheading

Subheading "If we don't address yours, ask on the call — we always pick up." duplicates the phone fallback row directly below it. Drop the subheading; let the eyebrow + heading + accordion + phone fallback do the work.

---

## Verification & registry

- `rg "<CedarCTA"` should still resolve to **two pills per route** (hero + closer), with `MidPageQuotePrompt` and `Footer` no longer contributing.
- `src/lib/page-sections.ts` — no changes; section IDs are unchanged.
- `mem://index.md` — no changes; aesthetic still cream + cedar, light-only, DM Serif/Sans.

---

## Expected outcome

- **Footer** reads in 2 lines instead of 9.
- **Hero** band shows 3 stats and that's it.
- **In-body sections** stop numbering themselves (no more I/II/III/IV/V).
- **Trust language** (free / no-obligation / 24h reply / cities) appears **exactly once per page** — in the closer trust strip — instead of three times.
- **Catalogue and tile components** reduce to title + one-liner.
- Net: ~250 fewer lines, every page reads quieter, the cedar pill is the only conversion shape the eye remembers.
