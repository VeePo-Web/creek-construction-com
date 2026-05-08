# Pass 17 — Page-Level Cohesion & Editorial Friction

Pass 16 polished primitives. Pass 17 zooms back out: walks each route end-to-end on a 390px viewport (the user's current preview) and a 1440px desktop, and removes the **friction points** that survive between sections — the small jolts a designer feels but can't articulate. Plus the page-level micro-fixes that didn't fit Pass 16's primitive scope.

Strict scope: presentational + page-level. No schema, no data, no new components, no logic.

## A. Homepage `/` — section-to-section seams

The homepage sequence is `Hero → Services → CrewMoment(secondary) → Featured(background) → Testimonials(secondary) → MiniFaq(background) → Closer(secondary) → Footer(evergreen)`. Seven background flips. That's three too many.

1. **Background rhythm collapse.** Two adjacent `bg-secondary` blocks across the whole page is fine; alternating every section creates a zebra. Re-paint to: `Hero → Services(background) → CrewMoment(background, no flip) → Featured(secondary) → Testimonials(secondary, no flip) → MiniFaq(background) → Closer(secondary) → Footer`. Net: 4 transitions instead of 7. Where two adjacent sections share a background, add a **hairline separator** (`border-t border-cedar/8`) to the second so the eye still feels the boundary.
2. **HeroProofBand** sits between the architect-bleed hero and Services. Right now its border is `border-y border-cedar/12` — symmetric. The top edge collides visually with the hero's bottom scrim (which is already a dark-to-light gradient). Change to `border-b border-cedar/12` only, and let the hero's gradient do the top edge.
3. **Services 5th-tile orphan rule** — `sm:[&>*:nth-child(5)]:col-span-2 sm:[&>*:nth-child(5)]:max-w-[calc(50%-1rem)] sm:[&>*:nth-child(5)]:mx-auto`. At 640–1023px, this centers the orphan, which is correct, but `col-span-2` + `max-w-[calc(50%-1rem)]` overlaps the gap math. At 768px the tile is visibly narrower than the row above. Drop `col-span-2`; keep the max-width + mx-auto. Simpler, identical visual.
4. **Featured `mb-16` between header and grid** — too large at mobile (cuts the eye). Switch to `mb-12 md:mb-16`. Same pattern at the closing "See all work" link (`mt-16` → `mt-12 md:mt-16`).
5. **Featured "See all work" pill** — currently text-link with `gap-3`. Pad it like a real link button: `inline-flex items-center gap-3 px-4 py-3 border border-cedar/15 rounded-sm hover:border-cedar/30 hover:bg-cedar/[0.04]`. It's the page's lone secondary CTA — give it presence.
6. **CrewMoment image aspect** — currently `aspect-[4/5] md:aspect-[3/4] lg:aspect-portrait`. On a 390px viewport, 4/5 with the heading column stacked below creates a long, dominant image. Add `sm:aspect-[5/4]` so the small-mobile composition is wider-than-tall (better for "neighbor's deck" feel).
7. **TestimonialStrip → MiniFaq seam** — both quiet, both background-flat. Add 1 row of breathing — `pt-24 md:pt-28` only on the MiniFaq section to create a deliberate "objection-handling" beat. Done by passing a className override or by tweaking SECTION_PADDING for this single instance.

## B. `/services` — page choreography

8. **Catalogue group spacing** — `space-y-16` between the five groups. At 390px that's 64px of empty space between two adjacent menu cards — too much. Make it `space-y-12 md:space-y-16`.
9. **Group header bar** — currently `pb-4 mb-6 border-b` with a per-group bronze opacity. Change to `pb-3 mb-5 md:pb-4 md:mb-6` so the eyebrow row tightens against the items.
10. **Catalogue items `py-4`** — too tight on touch and too tight against the 0.5px hairline. Bump to `py-5` and the hairline to `border-cedar/15` (in our consolidated 4-step ramp).
11. **Responsibility matrix** — `gap-6 lg:gap-4` is unusual (gap *shrinks* at lg). Make it `gap-6 lg:gap-8` so the lg+ split has the same breathing as the cards' own padding (`md:p-10`).
12. **WE HANDLE / YOU HANDLE eyebrows** — `text-minimal text-cedar` (left) vs `text-minimal text-muted-foreground` (right). The contrast difference reads as "left is more important" — which is intentional. But **the count badge on the right** (`tabular-nums text-muted-foreground/40`) is so faint it's invisible in low light. Bump to `/55`.

## C. `/work` — projects + placeholder grid

13. **PLACEHOLDER orphan rule** — `md:[&>*:nth-child(5)]:hidden lg:[&>*:nth-child(5)]:block lg:[&>*:nth-child(5)]:col-start-2`. This hides the 5th tile at md (768–1023). On a tablet you literally see 4 tiles where 6 exist. Either: (a) keep all six visible at md by making the grid 2-column and dropping the hide rule, or (b) only hide at md if total is exactly 5. Since `PLACEHOLDERS` is a fixed set, audit count and pick option (a) — `sm:grid-cols-2 lg:grid-cols-3` with no hide.
14. **"More projects added each month"** — center microcopy is fine, but the spacing `mt-12` is too generous; tighten to `mt-10 md:mt-12`.

## D. `/about` — story page

15. **Story stat trio** — three custom-rendered `<div>` blocks instead of `StatTrio` primitive. Reduces consistency. Refactor to `<StatTrio variant="inline" items={STATS_TRIO} />`. (StatTrio.inline was just bumped to `text-[10px]` in Pass 16 — perfect alignment.)
16. **Process step row `pl-4 sm:pl-6 py-4 sm:py-5`** — combined with the numeric eyebrow at `text-xs`, the numeral feels lost. Bump numeral to `text-[13px]` and add `mr-1` so the gap reads.
17. **Process step `hover:translate-x-1`** — translate causes a 4px reflow against the next item (which has `space-y-4`). Switch to `hover:pl-5 sm:hover:pl-7` (same visual, no transform). Already doing similar on ProjectTile description.
18. **City chips grid** — `grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`. The duplicated `sm:grid-cols-3` is a no-op. Drop. Add `xl:grid-cols-6` for the 1440+ desktop.
19. **City chip hover** — `hover:bg-cedar/[0.04]` is great, but the chip already has a per-chip border opacity. On hover the border swaps to `hover:border-cedar/30`, which looks fine for the first chip (which already has a low opacity) but visually *darkens* mid-list chips (e.g. chip 4 of 12). Cap the bronze step at 0.25 so the hover state is always brighter than rest.
20. **"Not on the list?" italic line** — `mt-6 italic`. Add `pt-6 border-t border-cedar/8` for an editorial-rail feel that matches the other "footer of section" lines on the page.

## E. `/contact` — single-screen funnel

21. **Eyebrow renames** (carry-forward from Pass 16 #12):
    - `GET A FREE QUOTE` → `FREE QUOTE`
    - `DIRECT` → `DIRECT LINE`
    - `OR FILL THIS OUT` → `THE FORM`
22. **Headline `text-[32px] sm:text-4xl lg:text-[56px]`** — at 390px, 32px is correct, but `sm:text-4xl` (36px) at 640–1023px is cramped against `lg:text-[56px]` (56px). Add `md:text-[44px]` step. Also tighten leading at the largest size: add `lg:leading-[1.02]` so the two-line wrap of "Tell us what you're building" reads as one breath.
23. **Direct contact card row icons** — `w-9 h-9` boxes at `bg-cedar/10`. The 14px Phone icon inside a 36px box has too much air. Either reduce box to `w-8 h-8` or bump icon to `h-4 w-4`. Pick the latter — the row is the page's primary trust signal.
24. **Form column SectionHeader subhead** — "Phone and name are all we strictly need." reads slightly defensive. Reword to "Just your phone and name to start." (Affirmative, removes "strictly".)
25. **Form column container** — `mt-8` after the header. The form card itself has `p-6 sm:p-8` internal padding. Reduce mt to `mt-6 md:mt-8`.

## F. Cross-page chrome

26. **`SkipToContent` order** — in `Index.tsx`, `SkipToContent` precedes `Navigation`. The skip link should render **before** the nav so it's the first focusable. Already correct in Index. Verify Services/Work/About/Contact match (Services + Work currently have `<Navigation />` before `<SkipToContent />` — flip).
27. **`<main>` aria-label vs id** — every page has `aria-label="..."` but no `id`. Add `id="main-content"` to all five pages so the skip link can also fall back to the main element if its primary target is hidden.
28. **`PageHero` `breadcrumb` prop on Services** — passes `breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}`. The service-portrait variant doesn't render breadcrumbs (handled by HeaderBreadcrumb in chrome). The dead prop is harmless but misleading. Remove from Services, Work, About hero calls.
29. **`PageHero` Services `sectionLabel="EXTERIOR CONSTRUCTION"`** vs Hero `sectionLabel="Exterior Construction"`. One is uppercase'd at the source, the other relies on the eyebrow's `uppercase` class. The eyebrow class always uppercases, so the stored string should always be sentence case. Lowercase Services + Work + About to match Hero.

## G. Closing card + footer transition

30. **QuoteCloserCard heading default** — `"Send us your project details."` is functional but could be warmer. Change default to `"Tell us about your project."` Match the contact page voice. (Pages that override stay overridden.)
31. **QuoteCloserCard body default `"It takes 30 seconds — just your name and phone..."` ** — now contradicts the contact page's "Just your phone and name". Align: `"It takes about 30 seconds — your phone and name to start. We reply within 24–48 hours."`
32. **Closer → Footer seam** — closer ends with cedar accents on evergreen, footer starts with evergreen. The user sees evergreen → evergreen with no edge. Add a `pt-px bg-evergreen-foreground/5` 1-line top wash to the footer first row, OR add `mb-0 pb-0` discipline to the closer when followed by footer. Simpler: in `Footer.tsx`, change the existing `xl:border-t` to **always render** as a faint hairline (`border-t border-evergreen-foreground/8`) on the inner content row.
33. **Footer link list** — currently `flex flex-wrap gap-x-6 gap-y-2`. At 320px those five links wrap to two rows uneven. Switch to `gap-x-5 gap-y-1.5` and add `justify-center xl:justify-start` so the wrap balances.

## H. Image seams + media polish

34. **Hero LQIP cleared via `onLoad`** — works, but the `transition-opacity duration-700` on the LQIP fades over the same 700ms as the photo. They cross-fade in opposite directions and produce a subtle grey middle frame. Stagger: LQIP `duration-500` (faster fadeout), photo `duration-900` (slower fadein) so the photo is fully present when the LQIP finishes leaving.
35. **MediaSlot service tile fallback caption** — `"${group.title} · new work coming"` is honest but reads like a placeholder marker on a finished site. Change to `"${group.title} · Alberta"` so the fallback feels location-anchored instead of WIP.

## I. Sitewide micro-fixes

36. **`text-balance` overuse** — the heading on every section uses it. On 1-line headings it's a no-op (cost nothing). On 3+-line wrapped headings it occasionally yanks "in" or "the" to a top line, breaking visual hierarchy. Audit Hero subtitle, MiniFaq heading, QuoteCloserCard heading, Contact h1. Keep `text-balance`, but where the heading is intentionally rhythmic (e.g. "Tell us what you're building.") add `text-pretty` instead — gives the browser permission to leave a longer last line.
37. **Smart-quote audit pass** — sweep `'` → `’` in `src/data/projects.ts`, `src/config/testimonials.ts`, `src/config/faqs.ts`, `src/config/services.ts`, `src/config/process.ts`, `src/config/trust-signals.ts`. (Pass 16 listed but didn't execute — execute now.)

## Files touched

`src/pages/Index.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`, `src/components/Hero.tsx`, `src/components/Services.tsx`, `src/components/CrewMoment.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/MiniFaq.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/Footer.tsx`, `src/components/ui/page-hero.tsx` (LQIP timing only), `src/components/Services.tsx` (5th-tile rule), `src/data/projects.ts`, `src/config/testimonials.ts`, `src/config/faqs.ts`, `src/config/services.ts`, `src/config/process.ts`.

No new files. No deletions. No schema. No business logic.
