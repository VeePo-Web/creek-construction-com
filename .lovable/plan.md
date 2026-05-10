# Pass 44 — Codify the CTA caption tier (`.cta-label`) and migrate

After Pass 43 collapsed every eyebrow to one utility, the **CTA tier** is still expressed as a hand-rolled string `text-[11px] tracking-[0.22em] uppercase font-medium` in **8 places**. The Pass 43 comment in `index.css` documents the tier, but doesn't enforce it — any future drift (e.g. a designer using 0.18em) will go uncaught. This pass turns the documented rule into a real CSS utility and migrates every consumer. AND UPGRADE THE HERO DESIGN ASWELL IT LOOKS CHEAP. REPLACE THE IMAGE THAT IS THERE WITH AN AI CREATED IMAGE AND DONT USE THE BLACK AND WHITE

## A. New utility — `.cta-label`

Add directly under `.eyebrow-base` in `src/index.css` (so the two tiers sit side by side and are visually obvious to the next reader):

```css
.cta-label {
  font-size: 11px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-weight: 500;
  /* color inherited / set by caller (cedar-foreground, white, muted-foreground) */
}
```

This is the **one and only** caption-style for buttons, links-acting-as-buttons, and ghost-CTAs. Body buttons (filled cedar, ghost border, ghost text) all share this typography; they differ only in background + padding.

## B. Migrate the 8 literal CTA-tier strings

For each occurrence, replace `text-[11px] tracking-[0.22em] uppercase font-medium` (and `text-[11px] tracking-[0.22em] uppercase` where `font-medium` is missing) with `cta-label`. Keep all other classes (color, padding, hover, `tabular-nums`, `whitespace-nowrap`, `min-h-[44px]`, `rounded-[2px]`) untouched.


| File                                       | Line | Where                                    |
| ------------------------------------------ | ---- | ---------------------------------------- |
| `src/components/Navigation.tsx`            | 125  | Desktop phone-link in topbar             |
| `src/components/Hero.tsx`                  | 32   | Hero ghost CTA (white/40 border)         |
| `src/components/quote/QuoteFormInline.tsx` | 214  | Inline form mode-toggle pill             |
| `src/components/quote/QuoteFormInline.tsx` | 424  | Inline form primary submit               |
| `src/components/quote/QuoteModal.tsx`      | 602  | Modal primary submit                     |
| `src/components/quote/QuoteModal.tsx`      | 722  | SuccessPanel "Call us now" CTA           |
| `src/components/quote/QuoteModal.tsx`      | 730  | SuccessPanel "Done" CTA                  |
| `src/components/quote/QuoteModal.tsx`      | 737  | SuccessPanel ghost "Send another →" link |


Mechanical sweep:

```
text-[11px] tracking-[0.22em] uppercase font-medium  →  cta-label
text-[11px] tracking-[0.22em] uppercase              →  cta-label   (only Hero.tsx ghost — re-add font-medium via the utility, fixes that ghost CTA which today is missing the weight class)
```

The Hero.tsx ghost CTA currently lacks `font-medium`, rendering it 400-weight while every other CTA renders 500. The migration silently corrects this — a real visual fix, not just a refactor.

## C. Verification

1. `rg "text-\[11px\] tracking-\[0\.22em\]" src/components` returns **zero** matches outside `src/pages/StyleGuide.tsx` and `src/components/QuickNav.tsx` after the sweep.
2. `rg "cta-label" src/components` returns exactly **8** matches.
3. Visual sweep at 390 / 768 / 1440:
  - Hero ghost CTA: weight now matches the cedar primary CTA below it (Hero today is visibly lighter — fix lands).
  - QuoteFormInline submit + QuoteModal submit + SuccessPanel CTAs: identical typography.
  - Navigation phone link: unchanged metrics (already had font-medium).
4. Open `/contact`, click "Get a quote" → submit form → SuccessPanel renders. All three buttons share identical caption metrics.
5. No layout drift expected — utility produces the exact same computed CSS as the literals it replaces (except Hero gains `font-weight: 500`, which was the bug).

## D. Documentation update in `index.css`

Update the existing Pass 43 comment block to reference both utilities concretely:

```
/* ─────────────────────────────────────────────────────────────
   EDITORIAL ATOMICS — eyebrow + cta-label + hairline
   Caption tier:  .eyebrow / .eyebrow-base  → 10px / 0.22em / 500
   CTA tier:      .cta-label                → 11px / 0.22em / 500
   ───────────────────────────────────────────────────────────── */
```

## E. Out of scope

- `BronzeRule` line 47 (`text-[11px] tracking-[0.2em] font-light tabular-nums`) — numeric tag, not a caption. Stays.
- `About.tsx` line 89 mono numeral — same reason, stays at 11px / mono.
- StyleGuide / admin / shadcn primitives — unchanged.

## Files touched

1. `src/index.css` (new utility + comment)
2. `src/components/Navigation.tsx`
3. `src/components/Hero.tsx`
4. `src/components/quote/QuoteFormInline.tsx`
5. `src/components/quote/QuoteModal.tsx`