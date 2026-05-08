# Pass 25 — Hero variant audit, gallery rhythm, mid-page polish

Each prior pass tightened global chrome and shared modules. Pass 25 walks the hero variants (the largest visual surface on every route), normalizes the project gallery, and resolves the small inconsistencies left in CedarCTA, the mid-page beats, and the form.

## A. PageHero variants — equalize the editorial scale

1. **`evergreen-typographic` subtitle** — `mt-5 md:mt-6 text-lg italic font-serif max-w-xl` doesn't match the `cinematic-bleed` / `service-portrait` standard set in Pass 22 (`mt-6 max-w-[44ch] … text-balance`). Unify on the cinematic spec; drop italic on mobile, keep on md+.
2. **`evergreen-typographic` content padding** — `py-24 md:py-32` is locked, but the section has `min-h-[68vh] md:min-h-[78vh]` plus `flex items-center` — the headline drifts off-center on tall viewports. Anchor with `pt-28 md:pt-36 pb-16 md:pb-24 lg:pb-28` (matches the other variants).
3. **`editorial-split` subtitle** — `text-lg md:text-xl` + `max-w-xl/2xl` is wider than cinematic peers. Cap to `max-w-[48ch]` with `text-base md:text-lg` for consistency.
4. **`cinematic-bleed` double top scrim** — line 506 (`linear-gradient … 0.55, transparent`) at `h-32 md:h-40` overlaps with `SCRIM.topNav` from the chrome. The Pass 22 cleanup says the upper scrim was *supposed* to be removed; the file still ships both. Delete the local top scrim — `SCRIM.topNav` already covers the chrome legibility budget.
5. **Hero `z-index` hierarchy** — content uses `z-10`, ambient clip uses `z-[6]`, spine uses `z-[5]`. Promote spine + ambient clip to `z-[8]`/`z-[9]` so they don't read as "behind a second layer of fog" when the scrim opacity stacks.
6. **`hero-rule-draw` margin variance** — `mb-6` in evergreen, `mb-6 md:mb-9 lg:mb-10` in cinematic/portrait. Standardize on the cinematic ladder across all three; the eyebrow→headline gap should match site-wide.

## B. ProjectGallery (Work page)

7. **Rounded radius drift** — uses `rounded-sm` everywhere (4px) which clashes with the editorial cinematic aspect. Bump to `rounded-[6px]` to match `EditorialPicture` defaults, with `overflow-hidden` retained.
8. **Gap consistency** — currently `gap-4 md:gap-5`. Unify with FeaturedProjects (`gap-6 md:gap-8`) so both galleries feel like one system.
9. **Single-photo cap** — `maxHeight: "80vh"` is fine on desktop but caps too aggressively on mobile portrait. Switch to `max-h-[72svh] md:max-h-[80vh]` (svh prevents iOS chrome jump).
10. **Masonry fallback (4+)** — `columns-1 md:columns-2 lg:columns-3` is fine, but `mb-4 md:mb-5` is set inline; mirror the new `gap-6 md:gap-8` for visual parity.

## C. CedarCTA polish

11. **Button padding ladder** — primary uses `px-10 py-5` always. On mobile (375px), this is too wide for the column; drop to `px-8 py-4 sm:px-10 sm:py-5`. Keeps min touch target (44px) with comfortable rhythm.
12. **Secondary variant** — animated underline `w-4 → w-10` is good, but the `gap-2` looks tight. Bump to `gap-3` for breath, and reduce underline target from `w-10` → `w-8` to feel less cartoony.
13. **Loading/disabled state** — no spinner or disabled affordance; if openModal is gated (auth, rate limit), nothing visible. Add `disabled:opacity-60 disabled:cursor-not-allowed` and accept an optional `loading?: boolean` prop that swaps the arrow for an inline spinner.

## D. Form (QuoteFormInline) — visited indirectly via Contact

14. Inputs likely use generic shadcn defaults. Audit `h`, focus rings, label tracking — should match the `ring-cedar/40 ring-offset-2`, `h-12`, label `tracking-[0.14em] uppercase` standard. (Read the file in implementation.)
15. Submit button — should reuse CedarCTA primary, not a custom shadcn Button.

## E. Homepage rhythm — the inter-section seam

16. **`CrewMoment topRule`** — currently `border-t border-cedar/8`. Replace with the same fading hairline gradient used in the closer card / footer to unify all section seams.
17. **`TestimonialStrip topRule`** — same. Currently `border-t border-cedar/8`.
18. **MiniFaq generous-top override** — Pass 23 removed `!important`. Verify the `pt-24 md:pt-28` actually wins given Tailwind class ordering with `SECTION_PADDING.default` ("py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32"). The base class includes `py-*` which sets both `pt` and `pb`; our extra `pt-24 md:pt-28` may lose specificity. Either keep `!important` OR switch the base to a `pb-*` only token + explicit `pt-*`.

## F. Services page — small calibration

19. **Catalogue heading "THE FULL MENU"** — eyebrow + headline is inside `MAX_WIDTH.content` (`max-w-[68ch]`) which is narrower than the catalogue itself; the headline reads cramped. Move just the heading to `max-w-3xl` while keeping the catalogue grid in content width.
20. **Group title border opacity ladder** — `bronzeStep(gIdx, len)` produces opacities `0.20 → 0.65` across 5 groups. Visually, the first group's underline is barely visible (0.20). Floor it at 0.30 for legibility.

## G. About page — closing italic + cities tile

21. **Cities tile contrast** — `text-muted-foreground` over a cedar-tinted hover background is fine, but the resting border is `Math.min(bronzeStep(...), 0.25)` — first cities get ~0.05 border which is invisible at 1px. Floor at 0.18.
22. **Closing italic line** — currently `text-sm text-muted-foreground/70 mt-6 pt-6 border-t border-cedar/8 italic`. Promote the typography to `font-serif italic text-base text-foreground/65`, center it, max-w-[48ch] with `text-balance`. Adds weight without adding noise.

## H. Work page — featured header

23. **`PROJECTS[0].title + "."`** — the heading appends a literal period. If the title already ends in punctuation this double-stops. Use `.replace(/\.$/, "") + "."` or simply trust the data and drop the appended dot.
24. **Project meta line** — `flex flex-col items-start gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6 flex-wrap` — `flex-wrap` on a `flex-col` does nothing. Drop it.

## I. Mobile-only fixes

25. **Hero `evergreen-typographic` mobile spine** — `hidden md:block` so spine is desktop-only. Confirmed; keep but verify the `top-1/2 -translate-y-1/2` doesn't intersect a tall mobile menu trigger when the menu is open. (Spine is hidden on `<md` so this is fine; just document.)
26. **`StickyMobileCTA` / MobileQuoteFAB** — exists per CedarCTA's `data-quote-cta` sentinel. Audit: currently appears? Z-index? Verify it never overlaps MobileSubNav (z-40). FAB should sit z-30 with `bottom-4 left-4 right-4` safe-area-inset padding, AND only render when no `[data-quote-cta]` is in the viewport.

## J. Token sweep

27. **`text-minimal`** — used in CedarCTA secondary, FeaturedProjects "See all work", responsibility matrix headers. Define this once in `src/lib/typography.ts` (likely already exists) and verify all callers pull from the same place — no inline reimplementations.
28. **Curly-quote rule** — `it's`, `we're`, `won't` etc. in JSX text. Quick `rg` for `'\w` inside `.tsx` and replace with `’` per the memory rule.

## K. QA checklist (no implementation)

29. After edits: screenshot Home, Services, Work, About, Contact at 375 / 768 / 1366. Verify hero subtitle width parity, gallery gap parity, no duplicate scrims on Work, MiniFaq top padding visibly larger when `topPad="generous"`, footer + closer + crew share the same fading hairline.

## Files to touch

`src/components/ui/page-hero.tsx`, `src/components/ProjectGallery.tsx`, `src/components/CedarCTA.tsx`, `src/components/quote/QuoteFormInline.tsx` (read first), `src/components/CrewMoment.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/MiniFaq.tsx`, `src/pages/Services.tsx`, `src/pages/About.tsx`, `src/pages/Work.tsx`, plus a possible touch-up to `src/lib/typography.ts` if `text-minimal` needs a home.

No schema, no business logic, no component deletions. Light-mode only, tokens-first.
