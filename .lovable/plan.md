# Pass 40 — Navigation Lockup Typographic Standardization

The chrome (top header + section rails + breadcrumb chip + mobile sub-nav + minimal nav) is the only remaining surface where eyebrow-style labels still ship in **four different tracking values**: 0.18em on the desktop Quote CTA + phone link, 0.20em on the compact rail and mobile sub-rail, 0.22em on most labels, 0.24em on the centered editorial rail. On a sweeping eye-test the chrome reads "almost-but-not-quite uniform" — and that is the precise visual nick that separates a site that *feels* design-system-driven from one that *is*.

This pass collapses every nav label to the single canonical pair already proven on cream surfaces and shipping in `BUTTON.primary.base`: **10px uppercase, letter-spacing 0.22em, font-medium**. Phone link and Quote CTA both already have the right base — they just need their tracking overrides removed. Section rails, breadcrumb chip, mobile sub-nav, and MenuTrigger label all collapse to the same numbers.

Out of scope: GlobalMenu and QuoteModal (over-photo / fullscreen surfaces — separate pass).

## Principles
- Nav labels: `text-[10px] tracking-[0.22em] uppercase font-medium`. No exceptions on the chrome.
- Phone link is the one exception in *size only* — it stays `text-[11px]` to keep tabular-nums readable, but tracking drops to 0.22em.
- Active-state cedar underline animation is the visual thread; the type itself never changes weight or tracking on hover/active.

---

## A. Navigation top bar (`src/components/Navigation.tsx`)

- L67 `desktopCta` — drop the bespoke `tracking-[0.18em]`. The `BUTTON.primary.base` token already ships 0.22em; remove the override, becomes:
  ```ts
  "px-4 py-2.5 text-[11px] gap-2"
  ```
- L125 desktop phone link — `text-[11px] tracking-[0.18em] uppercase text-foreground/75 …` → `text-[11px] tracking-[0.22em] uppercase font-medium text-foreground/75 …`. Adds `font-medium` so the phone matches the CTA weight (currently reads 100 units lighter than the CTA next to it).

## B. SectionRail centered editorial variant (`src/components/navigation/SectionRail.tsx` L146)

`text-[10px] tracking-[0.24em] uppercase font-medium` → `text-[10px] tracking-[0.22em] uppercase font-medium`.

(The 0.24em was meant to "feel more editorial" against the cream chrome, but it visually fights the BUTTON tracking on the right cluster. Unifying to 0.22em is the single biggest legibility win on desktop.)

## C. SectionRail n=2 sub-bar (`src/components/navigation/SectionRail.tsx` L77, L103)

- L77 "On this page" caption: already 0.22em — add `font-medium` for consistency with the other rail labels (currently bare).
- L103 sub-bar items: already 0.22em — add `font-medium`.

## D. SectionRailCompact (tablet) (`src/components/navigation/SectionRailCompact.tsx` L66, L87)

- L66 active item: `text-[10px] tracking-[0.2em] uppercase font-medium` → `text-[10px] tracking-[0.22em] uppercase font-medium`.
- L87 overflow trigger: `text-[10px] tracking-[0.2em] uppercase font-normal` → `text-[10px] tracking-[0.22em] uppercase font-medium` (drops the lone `font-normal` that makes the overflow chip look orphaned).

## E. HeaderBreadcrumb chip (`src/components/navigation/HeaderBreadcrumb.tsx` L30)

Already 0.22em / font-medium — verify and confirm no override needed. (Listed for completeness; expected to be a no-op.)

## F. MobileSubNav (`src/components/navigation/MobileSubNav.tsx` L77, L119)

- L77 caption: already 0.22em / font-medium — no-op.
- L119 nav items: `text-[10px] tracking-[0.2em] uppercase font-medium` → `text-[10px] tracking-[0.22em] uppercase font-medium`.

## G. MenuTrigger label (`src/components/navigation/MenuTrigger.tsx` L83)

Already 0.22em / font-medium — no-op. Listed for completeness.

## H. NavigationMinimal phone label (`src/components/navigation/NavigationMinimal.tsx` L42, L45)

- L42 phone number: `text-[13px] md:text-sm font-medium text-foreground tracking-tight` — keep (this is the *value*, not a label).
- L45 caption "CALL OR TEXT": `text-[9px] tracking-[0.22em] uppercase text-muted-foreground/70 mt-1` → bump to `text-[10px] tracking-[0.22em] uppercase font-medium text-muted-foreground/70 mt-1`. The 9px size is the only sub-10px tracked label in the project and it hairlines at 1.25× DPR.

## I. Verification
1. Header at 1440 / 1280 / 1024 / 768 / 390: every uppercase label in the chrome (CTA, phone, section rail, breadcrumb, mobile sub-rail, MENU) renders at exactly 0.22em — measured by inspecting `letter-spacing` in DevTools across all elements.
2. Active section in the centered rail still gets the cedar underline; underline width unchanged.
3. CTA + phone visual weight match (font-medium on both); no more "the phone reads lighter" effect.
4. Contact-page minimal nav phone caption renders at 10px (not 9px) — crisp at 1.25× DPR.
5. Sub-page wayfinding compact rail (tablet) and mobile sub-nav both read at the same tracking as the desktop rail — proven by switching viewports in the preview without any visual jump in tracking density.

## Files to touch
`src/components/Navigation.tsx`, `src/components/navigation/SectionRail.tsx`, `src/components/navigation/SectionRailCompact.tsx`, `src/components/navigation/MobileSubNav.tsx`, `src/components/navigation/NavigationMinimal.tsx`.
