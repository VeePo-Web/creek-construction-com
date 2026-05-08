# Pass 22 — Final Hero Scrim Calibration + Editorial Polish Sweep

Pass 21 fixed the structural collapse of the triptych grid (the columns now fully fill the section). The remaining visual "band" at the top of `/services` and `/about` is **scrim density**, not a layout bug — the topNav gradient is too opaque (0.55 → 0 over 96 px) and visually competes with the bright photographs below it, creating a hard horizon line. This pass tunes that scrim, plus carries out a longer list of pixel-level polish that has been queued.

```text
Current /services 1366×768 (post-Pass 21):

  ┌─────────────────────────────────────────────┐  cream chrome (y 0–80)
  ├─────────────────────────────────────────────┤
  │█████████████ topNav gradient ███████████████│  ← y 80–176, 0.55 → 0
  │░░░░░░░░░ photo visible but dimmed ░░░░░░░░░░│  ← stops abruptly at 176,
  │  bright deck / man / shed photographs       │     creating a horizon line
```

Scope is presentational only.

## A. Scrim recalibration (the real "void" cause)

1. **Soften `SCRIM.topNav`** in `src/lib/colors.ts` from `0.55 → transparent` to a two-stop gradient `0.42 → 0.18 @ 60% → transparent @ 100%`. Reduces the perceived "black band" by ~35% while still keeping the cream chrome edge legible.
2. **Reduce HeroTriptych top scrim height** from `h-24` to `h-16 md:h-20`. Combined with #1 the band visually disappears against the photography.
3. **Add a 1 px hairline cedar rule** under the chrome at the section's top edge (`absolute inset-x-0 top-0 h-px bg-cedar/35`) so the boundary between cream chrome and photo is intentional, editorial, and not just gradient mush.
4. **Cinematic-bleed (Work) — drop the new upper-stop scrim** added in Pass 21. With the softer topNav (#1), the redundant `cinematicTop` layer over-darkens the upper sky in the Work hero photo. Keep only `topNav` + `bottom`.

## B. Headline & subtitle calibration on photographic heroes

5. **Headline drop-shadow.** `KineticHeadline` on `onDark` already has a text-shadow but it is single-stop. Switch to a two-stop shadow `0 1px 0 rgba(0,0,0,.45), 0 12px 28px rgba(0,0,0,.35)` — gives the type a crisp edge against busy photography without looking like a halo.
6. **Subtitle width on Services / Work.** Subtitle currently `max-w-xl` (576 px). On 1366+ this leaves the line orphaning awkwardly under the headline. Bump to `max-w-[44ch]` (~ 460 px optical) with `text-balance` so the line breaks land against the optical center of the headline column.
7. **BronzeRule eyebrow on photographic heroes** uses `mb-5 md:mb-7`. Under the new soft scrim it sits too close to the chrome. Bump to `mb-6 md:mb-9 lg:mb-10`.

## C. Section-by-section pass

For each route, audit padding / type scale / divider rhythm at 1920, 1366, 1024, 820, 414, 360.

8. **Home (`/`)**
   - `TrustStrip`: at 1024 the 3 stats wrap awkwardly into 2-up + 1-up. Force `lg:grid-cols-3 md:grid-cols-3 grid-cols-1` (drop the 2-up tier) and reduce padding `py-10 md:py-12` instead of `py-14 md:py-20`.
   - `FeaturedProjects`: lead card label "FEATURED · CALGARY · 2024" letter-spacing tightened from `0.32em` → `0.22em`; on 360 px viewports the spacing breaks the line.
   - `HomeProjectRecapStrip` (3-up): add `gap-y-8` between the cards on `< md` so the stack isn't cramped.
   - `MiniFaq`: chevron currently rotates 90° on open — change to 180° + soften the divider color to `border-cedar/12` so it reads less heavy on cream.

9. **Services (`/services`)**
   - "THE FULL MENU" intro band: width currently `max-w-2xl mx-auto`. Centered eyebrow + headline reads loose; switch to left-aligned at `lg:max-w-[680px]` to match the editorial tone of the rest of the site.
   - "WE HANDLE / WE DO NOT" two-up grid: at 820 px, the divider between columns is a 1 px vertical rule that disappears against cream. Replace with a 32 px gap + cedar/8 background tile under each list, no rule.
   - Catalogue rows: numerals (`01`, `02`, …) currently set in DM Sans. Switch to DM Serif Display `font-serif text-cedar/55 text-xs tracking-[0.2em]` so they sing against the body type.

10. **Work (`/work`)**
    - `FEATURED` strip: card aspect ratios mixed `4/5` and `5/4`. Lock to a single `4/5` for the lead and `1/1` for the supporting tiles — gives a clear hierarchy.
    - `GALLERY` masonry: gaps currently `gap-2 md:gap-3`. Bump to `gap-3 md:gap-4 lg:gap-5` to give each photo more breathing room.
    - `REVIEWS` (TestimonialStrip): quote marks rendered as straight `"` in 2 spots — switch to typographic curly `“ ”` per project memory.

11. **About (`/about`)**
    - "OUR STORY" prose: increase paragraph spacing from `space-y-6` to `space-y-7` and bump the lead paragraph to `text-lg leading-[1.55]`.
    - Crew portrait grid: portrait images currently `aspect-[4/5]`. Add `rounded-[6px]` and a 1 px `cedar/12` outline to match the FeaturedProjects card treatment.
    - Closing italic line `mt-6 pt-6` reads too floaty — change to `mt-10 pt-7 border-t border-cedar/12`.

12. **Contact (`/contact`)**
    - Form labels currently `text-[10px] tracking-[0.22em] uppercase`. Switch to `text-[11px] tracking-[0.18em]` for slightly more readable forms without losing the editorial micro-type tone.
    - Inputs: focus state currently `ring-2 ring-cedar`. Change to `ring-1 ring-cedar/70 ring-offset-2 ring-offset-background` — keeps the cream surface clean.
    - "Phone · (780) 777-5178" caption: bump cedar opacity from `/70` to `/85` and switch to tabular-nums.

## D. Footer & shared chrome

13. **Footer top rule**: currently a flat `border-t border-cedar/15`. Replace with a hairline cedar-fading rule (CSS gradient: cedar/0 → cedar/35 → cedar/0) that aligns with the editorial vocabulary used inside `BronzeRule`.
14. **Footer copyright line**: tabular-nums, set the year via `new Date().getFullYear()` if not already, and ensure `© 2026` is preceded by a real `·` (interpunct) not `-`.
15. **Navigation phone link**: currently `(780) 777-5178` rendered in DM Sans. Wrap the digits in `tabular-nums` so they monospace in the chrome.
16. **GlobalMenu close affordance**: ESC key already closes; add visible `Esc to close` micro-caption bottom-right of the overlay in `text-[10px] tracking-[0.24em] text-foreground/40`.

## E. Performance & accessibility

17. **`<main>` landmark**: confirm every page wraps body content in a single `<main>` with `id="main"` so the SkipLink target resolves consistently.
18. **Focus rings**: audit interactive components for `focus-visible:ring-cedar` (per memory). Spot-check `ServiceTile`, `ProjectCard`, `TestimonialCard`.
19. **Image `alt` audit**: ensure no decorative photo carries alt text (HeroTriptych imgs already use `alt=""` — verify FeaturedProjects, HomeProjectRecapStrip, CrewMoment).
20. **CLS guard on photographic heroes**: confirm every `<img>` in `page-hero.tsx` carries `width`/`height` attrs. Cinematic and architect already do; verify ServicePortrait fallback chain.

## F. Files touched (estimate)

- `src/lib/colors.ts` (#1)
- `src/components/media/HeroTriptych.tsx` (#2, #3, #19)
- `src/components/ui/page-hero.tsx` (#4, #6, #7, #20)
- `src/components/ui/kinetic-headline.tsx` (#5)
- `src/components/TrustStrip.tsx`, `FeaturedProjects.tsx`, `HomeProjectRecapStrip.tsx`, `MiniFaq.tsx` (#8)
- `src/pages/Services.tsx` (#9)
- `src/pages/Work.tsx` + work strip components (#10)
- `src/pages/About.tsx` (#11)
- `src/pages/Contact.tsx` + Contact form components (#12)
- `src/components/Footer.tsx` (#13, #14)
- `src/components/Navigation.tsx`, `src/components/navigation/GlobalMenu.tsx` (#15, #16)
- Cards / tiles for focus-ring audit (#18)

No new files. No deletions. No schema. No business logic. Light-mode only (per memory).
