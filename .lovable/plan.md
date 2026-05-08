# Pass 20 — Sub-Page Mobile Hero Cleanup + Wayfinding Affordance

A 390×844 audit across `/services`, `/work`, `/about`, `/contact` surfaces three classes of friction that together break the "simple, clean, minimalistic" promise on every sub-page hero. Pass 20 is a focused presentation pass that fixes them.

```text
   What the audit shows on /services and /work (mobile, top of page)

   ┌────────────────────────────────────┐  ← header chrome (h-14)
   │  CREEK   QUOTE  ☰                  │
   ├────────────────────────────────────┤  ← MobileSubNav (h-10)
   │  ‹ SERVICES   CATALOGUE · CONTRACT · F…│  REVIEWS / FAQ truncated, no fade
   ├────────────────────────────────────┤
   │                                    │
   │                                    │  ← ~150px of dead black void
   │                                    │     (hero scrim with no content)
   │                                    │
   ├────────────────────────────────────┤
   │  [hero photograph begins here]     │
   │  …                                 │
```

Scope is presentational only. No data, schema, or business logic.

## A. Sub-page hero — remove the dead black void above the photo

**Root cause.** `ServicePortrait` (`/services`) and `CinematicBleed` (`/work`) reserve `min-h-[78–82vh] / 620px+` and use `flex items-end` so content sticks to the bottom. The chrome (h-14) + sub-nav (h-10) overlay the top 96px of the section, but the hero composition (`HeroTriptych` for `/services`, single photo for `/work`) doesn't extend to the very top — leaving a long black gap below the sub-nav before the imagery starts. On `/about` (`evergreen-typographic`) the photograph fills the section so the bug doesn't appear there.

1. **Pull the hero photo to true full-bleed** in `ServicePortrait` and `CinematicBleed`. Add `top: 0` / `inset-0` confirmation and verify the `<HeroTriptych>` and `<img>` elements are explicitly `absolute inset-0 w-full h-full object-cover` with no parent that pads the top.
2. **Add a top scrim band** (`<div className="absolute inset-x-0 top-0 h-32 md:h-40 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 0% / 0.55), transparent)" }} />`) so the chrome + sub-nav sits over a graded photo wash instead of a void. This matches the architect-bleed treatment.
3. **Cap mobile hero height** on these variants to `min-h-[68vh]` (was 78vh / 620px+) so the photo dominates the fold without forcing the user to scroll past dead space. Tablet stays `md:min-h-[78vh]`, desktop `lg:min-h-[720px]`.
4. **Apply the same `max-w-[1440px]`** container cap inside both variants for parity with Pass 19's site-wide editorial baseline.

## B. MobileSubNav — fix the right-edge clipping

**Root cause.** The right-side anchor list uses `overflow-x-auto no-scrollbar -mr-1` so longer chip-sets ("FEATURED · GALLERY · REVIEWS", "CATALOGUE · CONTRACT · FAQ") visibly truncate without any fade or scroll affordance — users see "REVIE…" or "F…" and assume it's broken layout, not scrollable.

5. **Add a fade mask** on the right edge of the scroll container: `mask-image: linear-gradient(to right, black calc(100% - 24px), transparent)` (with `WebkitMaskImage` fallback). The fade signals "more content here" without adding chrome.
6. **Increase right padding** to `pr-3` on the scroll container so the last chip can breathe past the fade boundary.
7. **Snap-scroll** the chip strip with `scroll-snap-type: x proximity` and `scroll-snap-align: end` per chip so a swipe lands cleanly on the next chip.
8. **Honor active section.** When `useActiveSection` returns an anchor that's outside the visible scroll window, programmatically scroll the active chip into view (`scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })`) inside a `useEffect` keyed on `active`.

## C. Hero subtitle legibility on bright photos

**Root cause.** `CinematicBleed` and `ServicePortrait` render the subtitle as `text-lg italic font-serif text-evergreen-foreground/90` with only `TEXT.onDark.legibleShadow`. On `/work` ("Selected projects across Calgary…") the italic serif against a sun-lit photograph reads as visual noise — the editorial italic was conceived against the architect's deep scrim, not a bright daylight image.

9. **Strengthen the bottom scrim** in `CinematicBleed` from `h-[68%]` → `h-[78%] md:h-[72%]` and bump the gradient bottom-stop opacity from current to `0.66` so subtitles ride on a denser dark wash.
10. **Subtitle treatment** stays italic serif on desktop, but on mobile drop italic and switch to `font-sans text-base/relaxed text-white/85 not-italic` so legibility wins over flourish at small sizes. Implement via `class="italic md:italic font-serif"` + responsive override.
11. **Add `text-balance`** to the subtitle so the line break is centered rather than orphaning a single word ("between." on /work currently dangles alone visually).

## D. Sub-page hero — shared rhythm with the homepage architect

12. **Section padding parity.** `/services` uses `pb-20 md:pb-24 pt-24 md:pt-28 lg:pt-32` while `/work` uses `pb-14 md:pb-20 lg:pb-24`. Standardize both to `pt-28 md:pt-36 pb-16 md:pb-24 lg:pb-28` so the hero rhythm is identical across sub-pages.
13. **BronzeRule + headline gap.** The `mb-6` between BronzeRule and KineticHeadline reads tight on mobile where the rule is narrow. Bump to `mb-5 md:mb-7`.
14. **Caption rail (CinematicBleed).** The bottom caption sits at `mt-10 pt-6 border-t` — on a 390 viewport this caption stacks below already-tight CTA stack and feels disconnected. Switch to `mt-8 pt-5` and reduce border opacity to `border-evergreen-foreground/10` for a quieter mark.

## E. Homepage mobile hero — micro-pass

15. **Eyebrow rule width.** "EXTERIOR CONSTRUCTION" sits next to a `w-10 md:w-16` rule. At 390 the rule is ~32% of the eyebrow width — visually balanced. Keep, but lift the eyebrow's letter-spacing slightly (`0.22em` → `0.24em`) for editorial precision at large clamps.
16. **Sub-photo caption position.** "SHEDS · A CALGARY DRIVEWAY" sits centered at the bottom of the hero on mobile. Right-align it (`text-right`) so it mirrors the desktop layout and reads as provenance metadata instead of as a centered marketing tagline.

## F. Files touched

- `src/components/ui/page-hero.tsx` — `CinematicBleed`, `ServicePortrait` (top scrim, full-bleed verification, height cap, padding parity, container cap, subtitle responsive treatment, caption-rail tightening, BronzeRule gap), `ArchitectBleed` (eyebrow letter-spacing tweak, mobile caption alignment).
- `src/components/navigation/MobileSubNav.tsx` — fade mask, scroll-snap, active-chip scrollIntoView, padding.

No new files. No deletions. No schema. No business logic.
