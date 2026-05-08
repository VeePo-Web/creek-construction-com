# Pass 19 — Critical Hero Headline Clip Fix + Desktop/Tablet Audit

Pass 18 fixed mobile but a desktop pass at 1280×720 and tablet at 820×1180 surfaces a **critical regression in the architect-bleed hero**: the kinetic headline ("Excellence in the Work.") is clipping at the right edge across both viewports — "Excelle…", "Worl…" — because the `max-w-[Nch]` constraint applied to the heading wrapper resolves `ch` against the *parent's body font* (~16px DM Sans), not the heading's own ~108px serif. At md the constraint is ~320px wide while the rendered headline word "Excellence" is ~590px. With `wordBreak: keep-all` plus the section's `overflow-hidden`, the word just gets sliced off. This is a stop-everything bug.

Pass 19 fixes that and audits the remaining desktop/tablet issues this exposed.

Scope: presentational only. No schema, data, or business logic.

## A. Architect-bleed headline (CRITICAL)

1. **Remove the `max-w-[Nch]` wrapper** around `<h1>` in `ArchitectBleed` (`src/components/ui/page-hero.tsx` ~line 869). Replace with a wrapper that uses viewport-relative width: `className="max-w-[18ch] sm:max-w-none"` *only on mobile* (where ch correctly matches the small heading), and at sm+ rely on the heading's natural width with a generous safety net (`md:max-w-[80vw] lg:max-w-[68vw] xl:max-w-[60vw]`).
2. **Headline font scale narrowing.** Current clamp `clamp(2.125rem, 8.5vw, 8.25rem)` peaks at 132px which is right at the edge of fitting "Excellence" comfortably in the column. Tighten the top of the clamp to `clamp(2rem, 7.6vw, 7.25rem)` so the desktop headline sits at ~97px — still hero-scale, but with breathing room before any padding constraint.
3. **Permit soft hyphenation as a safety valve.** Switch `wordBreak: "keep-all"` → `wordBreak: "normal"` and `hyphens: "manual"` → `hyphens: "auto"` *only at the smallest viewport* via responsive style — but keep `keep-all` semantics at md+ where the column is wide enough. Practically: drop `wordBreak: keep-all` entirely; the new max-width strategy makes it unnecessary.
4. **Vertical centering of the kinetic block at desktop.** With the headline now a single tight block, the middle row (`flex-1 flex items-center`) reads correctly. Add `justify-start` so the headline anchors to the container's left edge regardless of column collapse. (Currently `items-center` only handles vertical.)

## B. Architect-bleed bottom rail (tablet)

5. **CTA row collision at tablet.** At 820px the bottom row renders `[GET MY FREE QUOTE] [OR CALL …] [hairline] [SHEDS · A CALGARY DRIVEWAY]` — the captionLine on `md:col-span-4` lands directly under the CTA at the right edge with `md:text-right`. The hairline before the caption visually attaches to the CTA group, not the caption text. Increase `gap-y` to `gap-y-12` at md and add a `mt-2` to the caption block so caption + CTA never bleed into each other; also restrict `md:col-span-4` → `md:col-span-5 lg:col-span-5` to give the caption breathing room and let the subtitle column shrink to `md:col-span-7 lg:col-span-7`.
6. **Caption wrap.** "SHEDS · A CALGARY DRIVEWAY" wraps to two lines at tablet. Add `whitespace-nowrap` on the caption span — this is a single editorial mark that should never break.

## C. Tablet nav (820)

7. **Section rail collapse marker (`+4 →`).** The condensed rail label "+4 →" shows at 820 to indicate truncated section links. The character is rendering but the chevron has no spacing breathing — set `gap-1.5` between `+4` and `→`, and reduce font weight from inherit to `font-normal`. Verify the rail click target on the `+4` chip meets 44px height.
8. **Logo wordmark hidden at md.** The "Creek Construction" wordmark + tagline disappear at 820px, leaving just the badge. This is by design (CTA prominence) but the badge alone reads as orphaned. Add `md:hidden lg:inline-block` for the wordmark so it returns at lg (1024px+); current rule keeps it hidden until xl.

## D. Cross-page desktop polish

9. **Container max-width.** The site uses Tailwind's default `container` utility which has no `max-width` configured beyond `lg:1024px / xl:1280px / 2xl:1536px`. At 1920px+ monitors the editorial grid floats with huge side padding. Cap explicitly via a `max-w-[1440px]` on the container in `Hero`, `Services`, `FeaturedProjects`, `QuoteCloserCard`, `Footer`, `Navigation` — locks the editorial rhythm at our intended baseline.
10. **Hero section minimum height at desktop.** `min-h-screen` on the architect hero leaves a giant black slab on 27" monitors (1440×900+) where the photograph stretches and the bottom rail floats too far below the headline. Cap at `lg:min-h-[760px] xl:min-h-[820px] 2xl:min-h-[900px]` instead of `min-h-screen` — the hero should feel anchored, not endless.
11. **HeroProofBand container width.** Stats currently sit in `container mx-auto px-5 sm:px-6` — this leaves them spreading across the full container on large screens. Constrain to `max-w-5xl mx-auto` so the three stats stay readable at desktop scale.

## E. Closer & Footer desktop

12. **QuoteCloserCard heading clamp.** At 2xl (1536+), the heading "Tell us about your project." renders at `text-[44px]` which feels small relative to the surrounding section padding. Bump the clamp by adding `2xl:text-5xl` to keep editorial weight on wide monitors.
13. **Footer link spacing at desktop.** The `gap-x-5` between footer nav links is too tight at lg+. Bump to `lg:gap-x-7 xl:gap-x-8` so the link list reads as architecture, not a strip.

## F. Featured Projects desktop layout

14. **Asymmetric row 1 at lg (1280).** The `md:col-span-3` lead + `md:col-span-2` stack uses gap-8. At 1280 this leaves the lead photo at ~672px wide and the stacked photos at ~432px wide — visually fine. But the `aspect-editorial` (4:5) on the lead vs `aspect-detail` on stacked (4:3) creates a height mismatch where the stacked column ends ~80px short of the lead. Tighten to `aspect-[4/5]` on the lead and `aspect-[5/4]` on stacked so both columns terminate within ~20px.
15. **Lead project text size.** `text-2xl md:text-3xl` for the lead title vs `text-xl md:text-2xl` for stack — at lg+ the lead deserves more weight: bump to `lg:text-[32px] xl:text-[36px]` for the lead.

## G. Files touched

`src/components/ui/page-hero.tsx` (headline max-width + clamp + bottom rail grid), `src/components/Hero.tsx` (HeroProofBand width cap), `src/components/Services.tsx`, `src/components/FeaturedProjects.tsx` (lead aspect/size), `src/components/QuoteCloserCard.tsx` (2xl heading bump), `src/components/Footer.tsx` (link gap), `src/components/Navigation.tsx` (wordmark visibility, +N chip spacing).

No new files. No deletions. No schema. No business logic.
