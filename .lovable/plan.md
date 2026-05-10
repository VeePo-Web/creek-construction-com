# Pass 43 — Collapse the eyebrow utility (single source of truth)

Pass 42 normalized every public-surface eyebrow literal to `text-[10px] tracking-[0.22em] uppercase font-medium`. But the project already ships a `.eyebrow` utility class in `src/index.css` that resolves to **11px** at 0.22em. That means two parallel systems now coexist:

- **`.eyebrow` utility (11px)** → used by `Footer.tsx`, `QuoteFormInline.tsx` (Pass 41).
- **Literal 10px string** → used by `QuoteModal.tsx`, every nav surface, every media caption (Pass 40–42).

The Footer eyebrow is visibly 1px taller than the nav rail eyebrow today — exactly the inconsistency this audit is meant to eliminate. Pass 43 collapses both into one.

## A. Promote `.eyebrow` to the canonical 10px tier

**`src/index.css`** lines 504–511:

```
.eyebrow {
  font-size: 10px;          /* was 11px */
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: hsl(var(--cedar) / 0.65);
  font-weight: 500;
}
```

Add a sibling utility for surfaces that override the cedar color (so consumers can write `eyebrow-base text-muted-foreground/70` without re-specifying the cedar color and then fighting it):

```
.eyebrow-base {
  font-size: 10px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-weight: 500;
  /* color inherited / set by caller */
}
```

Rationale: 10px at 0.22em is the rhythm chosen for the dense chrome (nav rail, GlobalMenu, modal eyebrows, media captions). The Footer and inline form are equally chrome, not body — they should match, not stand a pixel taller.

## B. Migrate high-value literal eyebrows to the utility

Replace the literal string `text-[10px] tracking-[0.22em] uppercase font-medium` with `eyebrow-base` (keeping any explicit color class) in the highest-traffic files. This is a mechanical sweep: where the caller passes its own color (e.g. `text-cedar/80`, `text-muted-foreground`, `text-white/30`), use `eyebrow-base`; where the caller wants the default cedar/65, use `eyebrow`.

Files & expected counts (from `rg`):

| File | Literal occurrences | Action |
|---|---|---|
| `src/components/quote/QuoteModal.tsx` | 9 | Replace each → `eyebrow-base <color-class>` |
| `src/components/navigation/GlobalMenu.tsx` | 9 | Replace each → `eyebrow-base <color-class>` |
| `src/components/navigation/SectionRail.tsx` | 3 | Replace each → `eyebrow-base <color-class>` |
| `src/components/navigation/SectionRailCompact.tsx` | 2 | Replace each |
| `src/components/navigation/MobileSubNav.tsx` | 2 | Replace each |
| `src/components/media/HomeProjectRecapStrip.tsx` | 2 | Replace each |
| `src/components/media/MediaSlot.tsx` | 1 | Replace |
| `src/components/media/EditorialBleedSection.tsx` | 1 | Replace |
| `src/components/media/ProvenanceCaption.tsx` | (built dynamically) | Refactor sizeClass → `"eyebrow-base"` |
| `src/components/ProgressiveImage.tsx` | 1 + line 138 | Replace + see §C |
| `src/components/ui/hero-provenance-card.tsx` | 1 | Replace |
| `src/components/navigation/NavigationMinimal.tsx` | 1 | Replace |
| `src/components/navigation/MenuTrigger.tsx` | 1 | Replace |
| `src/components/navigation/HeaderBreadcrumb.tsx` | 1 | Replace |
| `src/components/quote/QuoteFormInline.tsx` | 1 stray literal | Replace |
| `src/components/QuickNav.tsx` | 1 | Skip (dev helper) |

For each match, the rewrite is:
```
text-[10px] tracking-[0.22em] uppercase font-medium  →  eyebrow-base
```
…leaving the explicit color/opacity utility untouched. Result: one font-size, one tracking, one weight defined in CSS — every consumer inherits.

## C. Address the last 11px / 0.2em outlier on a public surface

**`src/components/ProgressiveImage.tsx`** line 138 still reads `text-[11px] tracking-[0.2em] uppercase text-white/60`. Normalize to:
```
eyebrow-base text-white/60
```
(10px / 0.22em / weight 500). The placeholder counter on line 142 was already fixed in Pass 42.

## D. Two-tier rule (codify going forward)

After this pass the system has exactly two uppercase-caption tiers — document them in a one-line comment above `.eyebrow` in `index.css`:

```
/* Caption tier:   .eyebrow / .eyebrow-base   → 10px / 0.22em / 500
   CTA tier:       text-[11px] tracking-[0.22em] uppercase font-medium
                   → reserved for primary/secondary CTAs only           */
```

`Hero.tsx` ghost CTA, `QuoteFormInline` submit, `QuoteModal` submit + SuccessPanel buttons, `Navigation` phone link — all already conform to the CTA tier. No action needed there.

## E. Out of scope (explicit)

- `src/pages/StyleGuide.tsx` — internal reference (must continue to display legacy values for documentation).
- `src/pages/admin/*` — operator UI.
- `src/components/ui/*` shadcn primitives.
- `src/pages/About.tsx` line 89 mono numeral (`font-mono text-[11px] tracking-[0.22em] tabular-nums`) — intentionally a numeric column tag, not an eyebrow caption. Leave at 11px to keep tabular-nums alignment with adjacent prose.

## F. Verification

1. `rg "text-\[10px\] tracking-\[0\.22em\] uppercase font-medium" src/components` returns **zero** matches outside `QuickNav.tsx` and `StyleGuide.tsx` after the sweep.
2. `rg "text-\[11px\] tracking-\[0\.2em\]" src/components` returns **zero** matches.
3. Visual sweep at 390 / 768 / 1440:
   - Footer "Navigate" / "Direct Line" eyebrows now render at the same height as the nav rail captions above them.
   - QuoteFormInline labels match QuoteModal labels exactly (same font-size, same tracking, same weight).
   - GlobalMenu open: every cedar caption inherits identical metrics.
   - HomeProjectRecapStrip "Field Notes" / "04 Frames" sit on the same baseline as the nav rail eyebrow on the page above them.
4. No layout drift: 11px → 10px reduces line height by 1px in the Footer and inline form — both have generous padding (`py-3`, `mt-5`, `mb-4`) so no realignment is needed.

## Files touched

1. `src/index.css` (utility definition + rule comment)
2. `src/components/quote/QuoteModal.tsx`
3. `src/components/quote/QuoteFormInline.tsx`
4. `src/components/navigation/GlobalMenu.tsx`
5. `src/components/navigation/SectionRail.tsx`
6. `src/components/navigation/SectionRailCompact.tsx`
7. `src/components/navigation/MobileSubNav.tsx`
8. `src/components/navigation/NavigationMinimal.tsx`
9. `src/components/navigation/MenuTrigger.tsx`
10. `src/components/navigation/HeaderBreadcrumb.tsx`
11. `src/components/media/HomeProjectRecapStrip.tsx`
12. `src/components/media/MediaSlot.tsx`
13. `src/components/media/EditorialBleedSection.tsx`
14. `src/components/media/ProvenanceCaption.tsx`
15. `src/components/ui/hero-provenance-card.tsx`
16. `src/components/ProgressiveImage.tsx`
