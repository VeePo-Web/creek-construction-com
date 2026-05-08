# Pass 21 — Sub-Page Hero Void (Final Fix) + Cross-Viewport Polish

Pass 20 closed most of the mobile sub-page issues, but a desktop screenshot at 1366×768 of `/services` exposes the true root cause of the lingering "black void above the hero photo" — and shows it's worst on desktop, not mobile.

```text
   /services at 1366×768 (current state)

   ┌──────────────────────────────────────────────────┐  cream chrome
   │  CREEK   HOME / SERVICES …   (780)   QUOTE   ☰   │
   ├──────────────────────────────────────────────────┤
   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← ~150 px of pure
   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     black above the
   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     triptych — the
   ├────────┬────────────┬────────────┬────────────┐  │     grid row collapses
   │ deck A │ man+wood B │  shed C    │  …        │  │     to its (zero-height)
   │        │            │            │           │  │     auto content.
```

The fix is one change in `HeroTriptych`, plus carry-on cleanup on tablet, and 4 more cross-viewport polish items.

Scope is presentational only. No data, schema, or business logic.

## A. Triptych grid no longer collapses (root cause of /services void)

**Diagnosis.** `HeroTriptych`'s outer `<div className="absolute inset-0 grid">` only declares `grid-template-columns`. With no `grid-template-rows` and no row-defining child (every column's media is `<img absolute inset-0>` which contributes 0 to flow height), the implicit row collapses. `TriptychColumn`'s `h-full` then resolves against that 0-height row, so the column box shrinks. The columns end up vertically centered inside the section because `flex items-end` on the section pulls everything bottom-anchored, leaving a tall void above the columns.

1. **Add `grid-template-rows: 1fr`** (or `grid-auto-rows: 1fr`) and `h-full` on the grid container in `src/components/media/HeroTriptych.tsx`. This guarantees the single grid row spans the full section height, and every `TriptychColumn` then truly fills `inset-0`.
2. **Belt-and-suspenders:** make `TriptychColumn`'s root `relative h-full min-h-full w-full` so any browser quirks can't shrink the cell below the grid row height.
3. **Mobile-only branch.** The `<div className="md:hidden absolute inset-0">` wrapper is fine (already `inset-0`), but its child `TriptychColumn` was inheriting `bg-secondary` and a `relative` box that was sized by the column's intrinsic 0 height. With change #2 applied universally, the mobile single-image branch will also fully fill the section — closing the residual ~40 px gap visible on `/services` mobile.
4. **Verify no ripple effect on the homepage** (`Hero.tsx` does NOT use HeroTriptych — it uses `architect-bleed`), so the change is scoped to the two sub-pages that consume it: `/services` and `/about`.

## B. Sub-page hero subtitle — final legibility pass

5. **`/work` subtitle** ("Selected projects across Calgary, Edmonton, and the towns in between.") is italic serif over a bright daylight photo. Pass 20 already added `not-italic md:italic font-sans md:font-serif text-balance` on mobile. Extend the `cinematicTop` scrim usage:
   - In `CinematicBleed`, swap the bottom-only scrim for a **two-stop scrim**: keep the bottom heavy gradient AND add `SCRIM.cinematicTop` over the upper 40% so eyebrow + headline read clean regardless of photo brightness.
   - Bump subtitle color from `text-evergreen-foreground/90` to `text-white/95` and add `text-shadow: 0 1px 6px hsl(0 0% 0% / 0.55)` (via inline style) for guaranteed contrast on bright photos.
6. **`/services` subtitle** sits over the deck-photo light wood — same prescription: ensure the bottom scrim h-[78%] applies on mobile (already added) and tighten subtitle to `font-sans md:font-serif text-base md:text-lg leading-snug`.

## C. Sub-bar / chip rail consistency

7. **`/work` chip rail** ("FEATURED · GALLERY · REVIEWS") and `/services` ("CATALOGUE · CONTRACT · FAQ") now display correctly thanks to the fade mask, but the active-chip auto-scroll uses `scrollIntoView({ inline: "center" })` which on iOS Safari can scroll the parent page instead of just the inner scroller. Wrap the call in `requestAnimationFrame` and pass an explicit `block: "nearest"` plus prefer `el.parentElement?.scrollTo({ left: el.offsetLeft - el.parentElement.clientWidth/2 + el.clientWidth/2, behavior: "smooth" })` so only the chip strip scrolls.
8. **Sub-bar parent route chevron.** "‹ SERVICES" / "‹ OUR WORK" should not duplicate the route the user is on. Change the back chip label semantics: use the parent's label (e.g. "‹ Home") on routes where the breadcrumb already reads as the current page. The `route-meta.ts` registry already supplies `parentLabel`; consume that here instead of `meta.label`.

## D. Tablet (820 × 1180) audit fixes

9. **Tablet sub-nav.** At 820, MobileSubNav still applies (it's `md:hidden`, where md=768). Tailwind's `md` is 768, so 820 is `md+`. That means at 820 we should see the desktop nav. Confirm and, if MobileSubNav appears at 820 due to a custom breakpoint, raise its hide threshold to `lg:hidden` so tablets get the proper desktop chrome.
10. **Hero on tablet.** ServicePortrait min-h tier `md:min-h-[78vh]` at 820×1180 = ~920 px hero — too tall for a portrait tablet. Add an `md:min-h-[640px] lg:min-h-[720px]` clamp so portrait tablets don't dedicate the entire fold to the hero photo.

## E. Cross-page micro-polish

11. **Footer mobile.** The footer link row (`Home · Services · Work · About · Contact`) is centered with `gap-x-7` at md+ but on mobile collapses to `gap-x-4`. At 360 px viewports the labels touch the edge. Wrap in `flex-wrap justify-center gap-y-2` and reduce mobile gap to `gap-x-5` for cleaner stacking.
12. **QuoteCloserCard mobile bottom padding.** The trust strip sits 32 px above the cream surface end; the card itself ends abruptly into the footer. Add `pb-12 md:pb-16 lg:pb-20` on the closer's outer wrapper so the card visually breathes before the footer rule.
13. **Body line-length cap on About / Services prose blocks.** Long paragraphs run to 90+ characters on tablet. Wrap prose with `max-w-[68ch]` on `<p>` to enforce editorial line-length.
14. **Service catalogue rows on `/services`.** "Check ✓" icons sit at `h-4 w-4` and use `text-cedar`; on mobile they overlap the row text vertical baseline. Add `mt-0.5 shrink-0` to align icons with the cap-height of the first text line.

## F. Files touched

- `src/components/media/HeroTriptych.tsx` — grid row sizing fix (#1, #2), no behavior change for callers.
- `src/components/ui/page-hero.tsx` — `CinematicBleed` two-stop scrim + subtitle text-shadow (#5), `ServicePortrait` subtitle leading (#6), `ServicePortrait` tablet min-h clamp (#10).
- `src/components/navigation/MobileSubNav.tsx` — local `scrollTo` math instead of `scrollIntoView` (#7), parent-label consumption (#8), tablet hide threshold check (#9 — likely no-op).
- `src/components/Footer.tsx` — link-row wrap (#11).
- `src/components/QuoteCloserCard.tsx` — bottom padding (#12).
- `src/pages/About.tsx`, `src/pages/Services.tsx` — prose `max-w-[68ch]` (#13), service row icon alignment (#14).

No new files. No deletions. No schema. No business logic.
