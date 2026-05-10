# Pass 42 — Caption & QuoteModal Token Normalization

After Passes 40–41 standardized navigation, GlobalMenu, and the inline quote form, the remaining offenders breaking the Fly4Me-grade calm are: **QuoteModal** (the modal still ships legacy 0.18em / 0.25em tracking, 11–12px eyebrows, and `rounded-sm` on its primary CTAs) and the **public media caption layer** (HomeProjectRecapStrip, MediaSlot overlay, ProvenanceCaption, ProgressiveImage placeholder) which still uses `tracking-[0.25em]` and inconsistent 9/10px sizing. This pass collapses every public-surface eyebrow to the canonical `text-[10px] tracking-[0.22em] uppercase font-medium` and every form/CTA corner to `rounded-[2px]`. Admin and shadcn primitives are explicitly out of scope.

## A. `src/components/quote/QuoteModal.tsx` — full sweep

Rules applied:
- Every `tracking-[0.18em]` → `tracking-[0.22em]`.
- Every `tracking-[0.25em]` → `tracking-[0.22em]`.
- Every `text-[9px]` eyebrow → `text-[10px]`.
- Every `text-[11px]` / `text-[12px]` uppercase eyebrow on body copy or pills → `text-[10px]`. (The single exception is the primary submit CTA, which stays `text-[11px]` to match `QuoteFormInline`'s submit.)
- Every `rounded-sm` on form controls and CTAs → `rounded-[2px]`.
- Add `font-medium` wherever the eyebrow currently lacks it (visual weight parity with nav + GlobalMenu).

Specific lines (current → target):

1. **Line 304** category eyebrow: `text-[10px] tracking-[0.25em] uppercase text-cedar/80` → `text-[10px] tracking-[0.22em] uppercase font-medium text-cedar/80`.
2. **Line 341** "selected" tag: `text-[9px] tracking-[0.25em] uppercase text-cedar/80` → `text-[10px] tracking-[0.22em] uppercase font-medium text-cedar/80`.
3. **Line 362** sub-section eyebrow: `text-[10px] tracking-[0.25em] uppercase text-cedar` → `text-[10px] tracking-[0.22em] uppercase font-medium text-cedar`.
4. **Line 389** chip caption: `text-[10px] tracking-[0.18em] uppercase text-cedar` → `text-[10px] tracking-[0.22em] uppercase font-medium text-cedar`.
5. **Line 464** field group label: `text-[11px] tracking-[0.18em] uppercase text-muted-foreground` → `text-[10px] tracking-[0.22em] uppercase font-medium text-muted-foreground`.
6. **Line 506** field group label (timeline): same change as #5.
7. **Line 580** trust micro-strip in modal footer: `text-[10px] tracking-[0.18em] uppercase text-muted-foreground` → `text-[10px] tracking-[0.22em] uppercase font-medium text-muted-foreground`.
8. **Line 602** primary submit CTA: `rounded-sm text-[12px] tracking-[0.18em]` → `rounded-[2px] text-[11px] tracking-[0.22em]` (height/padding unchanged → still 52px hit target).
9. **Line 722** floating "Get a quote" trigger: `rounded-sm text-[11px] tracking-[0.18em]` → `rounded-[2px] text-[11px] tracking-[0.22em]`.
10. **Line 730** evergreen secondary CTA: same change as #9 (rounded + tracking).
11. **Line 737** ghost cancel link: `text-[11px] tracking-[0.18em]` → `text-[11px] tracking-[0.22em]` (no rounding to change).
12. Sweep any remaining `rounded-sm` on form inputs / chip buttons inside this file (textarea, inputs, day pills) → `rounded-[2px]`. Verify with `rg "rounded-sm" src/components/quote/QuoteModal.tsx` post-edit returns zero.

## B. Media caption layer — public surfaces only

13. **`src/components/media/HomeProjectRecapStrip.tsx`** lines 55 & 67: `text-[10px] tracking-[0.25em] uppercase` → `text-[10px] tracking-[0.22em] uppercase font-medium` (preserve color tokens `text-cedar/70` and `text-muted-foreground/60 tabular-nums`).
14. **`src/components/media/MediaSlot.tsx`** line 125 caption overlay: `text-[10px] tracking-[0.25em] uppercase font-medium` → `text-[10px] tracking-[0.22em] uppercase font-medium`.
15. **`src/components/media/ProvenanceCaption.tsx`** line 42 small variant: `text-[9px] tracking-[0.22em]` → `text-[10px] tracking-[0.22em]` (font-medium already inherited from base; verify and add if missing). The default variant already at 10px stays put.
16. **`src/components/ProgressiveImage.tsx`** line 142 placeholder eyebrow: `text-[9px] tracking-[0.2em] uppercase text-white/30` → `text-[10px] tracking-[0.22em] uppercase font-medium text-white/30`.

## C. Mobile sub-nav micro-fix

17. **`src/components/navigation/MobileSubNav.tsx`** line 104 separator dot: `text-[9px]` → `text-[10px]` so the dot height matches the 10px caption rhythm of the items it separates. Color (`text-foreground/25`) unchanged.

## D. Out of scope (explicit)

- `src/pages/StyleGuide.tsx` — internal reference page; its 0.25em / 0.18em values are intentional documentation of legacy versus canonical tokens.
- `src/pages/admin/*` — operator UI, not customer-facing.
- `src/components/ui/*` (dialog, tabs, command, context-menu, resizable) — shadcn primitives whose `rounded-sm` is part of the library contract; they are not visible enough on public surfaces to justify forking.
- `src/components/QuickNav.tsx` line 186 — dev-only floating helper.

## E. Verification

- `rg "tracking-\[0\.(18|25)em\]|text-\[9px\]" src/components/quote src/components/media src/components/navigation` returns **zero** matches after the pass.
- `rg "rounded-sm" src/components/quote/QuoteModal.tsx` returns **zero** matches.
- Visual sweep at 390 / 768 / 1440:
  - Open `/contact`, click "Get a quote" → confirm modal eyebrows all read at the same weight & spacing as the inline form.
  - Scroll homepage past `HomeProjectRecapStrip` → captions and year tabular-nums sit on the same baseline rhythm as nav rail captions.
  - Hover any project tile w/ `MediaSlot` overlay caption → tracking matches the surrounding chrome.
- No layout drift: 10px at 0.22em is ~1px narrower per word vs 0.25em, well within existing padding budgets.

## Files touched

1. `src/components/quote/QuoteModal.tsx`
2. `src/components/media/HomeProjectRecapStrip.tsx`
3. `src/components/media/MediaSlot.tsx`
4. `src/components/media/ProvenanceCaption.tsx`
5. `src/components/ProgressiveImage.tsx`
6. `src/components/navigation/MobileSubNav.tsx`
