# Pass 28 — QuickNav route fix, homepage Services tile uplift, and the hairline harmony sweep

Pass 27 closed Footer + QuoteFormInline. Walking the homepage end-to-end at 390 / 768 / 1366 surfaces three remaining "stock" beats and one outright **bug** that breaks the slash command. We fix them and finish unifying the section-seam hairline language so every divider in the site speaks the same dialect.

## A. CRITICAL BUG — `src/components/QuickNav.tsx` ships sauna template routes

Pressing `/` opens a command palette listing routes that **do not exist** in this project:

```
Home              /
Signature 8×8     /signature        ← 404
Custom Builds     /custom           ← 404
Our Standard      /standard         ← 404
Resources         /resources        ← 404
Get My Sauna Plan /plan             ← 404
```

Real routes (per `App.tsx`): `/`, `/services`, `/work`, `/about`, `/contact`. Anyone power-user enough to hit `/` lands on dead links. Embarrassing for a "world-class" site.

1. **Replace `NAV_ITEMS`** with the real five routes:
    ```
    Home → /
    Services → /services
    Work → /work
    About → /about
    Contact → /contact
    ```
   Add a sixth synthetic action: `Get a Quote → opens QuoteModal` (use `useQuoteModal().openModal([])`, branch `go()` to call it instead of navigate when the item has no path).
2. **Visual uplift** — palette currently uses `rounded-sm` on items (intentional, keep as pills) but the **shell** wraps in `bg-background/97 border-b border-cedar/20`. Promote the shell border to the cedar-fading hairline (`borderImage` linear gradient at 0.20 opacity) for visual consistency with the rest of the site.
3. **Eyebrow row** — `tracking-[0.3em]` is louder than the canonical `0.22em` cedar eyebrow. Drop to `0.22em`. Replace inline `w-6 h-px bg-cedar/15` with a real `BronzeRule width="short"` for token consistency.
4. **Active item background** — `bg-cedar/10` → `bg-cedar/[0.06]` and add `shadow-[inset_0_-2px_0_hsl(var(--cedar))]` matching the segmented-control pattern from QuoteFormInline. Consistency.
5. **Path label** — switch from raw path to a meaningful `→ press Enter` micro-hint when the row is active (today the path is shown in `text-[9px]` regardless). The path is only useful when the row isn't active.
6. **Aria correctness** — `aria-expanded="true"` is always true on the open palette. That's fine. But `role="combobox"` requires `aria-controls="quicknav-list"` which is present — verify after edit.

## B. Homepage Services tile (`src/components/Services.tsx`) — promote to editorial card

The 5-tile grid currently renders each group as a card with `rounded-sm` corners and image filling the top — same surface family as our refined cards but stuck at the old radius and missing the hairline language.

7. **Outer radius** — `rounded-sm` → `rounded-[6px]` (line 53). Matches FeaturedProjects, TestimonialStrip, QuoteFormInline.
8. **Hover micro-interaction** — currently `hover:bg-cedar/[0.03]` only. Add a hairline shadow on hover: `hover:shadow-[0_1px_2px_hsl(var(--cedar)/0.08),0_8px_24px_-12px_hsl(var(--cedar)/0.20)]` for editorial lift. Mirrors the QuoteFormInline CTA shadow at lower opacity.
9. **Image crossfade vs scale** — currently `group-hover:scale-[1.025]` only. Add a `before:` cedar wash `before:absolute before:inset-0 before:bg-cedar/0 group-hover:before:bg-cedar/[0.05] before:transition-colors before:duration-500` to the MediaSlot wrapper for a Vogue-style warm hover.
10. **Card body padding** — `p-5 md:p-6` is fine but the icon → heading gap `mb-3` reads tight against the 24px serif heading. Bump to `mb-4`. Body copy gets `mt-1` lift.
11. **Heading transition** — `group-hover:text-cedar` on the title is heavy. Split: title stays `text-foreground`, the icon and a subtle 1px bottom-border on the title underline cedar on hover (`relative pb-1 after:h-px after:bg-cedar/0 after:absolute after:left-0 after:bottom-0 after:w-8 group-hover:after:bg-cedar/40 after:transition-colors`). Editorial restraint.
12. **Last-child odd-count layout fragility** — the `[&>*:last-child:nth-child(odd)]:col-span-2 ... :max-w-[calc(50%-1rem)] :mx-auto` chain is brittle and mixes Tailwind arbitrary selectors. With 5 groups it works (5 → 1 trailing), but it's a maintainability landmine. Replace with a clean `lg:[&>*:nth-child(4)]:col-span-1 lg:[&>*:nth-child(5)]:col-span-1` if the grid auto-fills correctly, OR keep behavior but extract the chain into a single class via `cn()` for readability. Document with a comment.

## C. HeroProofBand (`src/components/Hero.tsx`) — fading hairline + tabular-nums

13. **Bottom border** — `border-b border-cedar/12` is a flat 1px line that hard-cuts into the next section. Replace with the canonical fading borderImage so the proof band floats off the hero rather than slamming into Services.
14. **"or call" link** — currently `text-white/90 hover:text-white` but the CedarCTA is on a dark hero plate, so the white text works only on the architect-bleed variant. On other heroes it'd break. The Hero only uses architect-bleed (good), so leave as-is. But add `whitespace-nowrap` so the phone number never wraps mid-string at narrow viewports.

## D. CrewMoment stat divider (`src/components/CrewMoment.tsx`)

15. **`border-t border-cedar/15`** on the stat row (line 77) → fading borderImage. Same hairline language as section seams.
16. **Stat row label** — `text-[9px] tracking-[0.18em]` is sub-eyebrow. Promote to `text-[10px] tracking-[0.22em]` to match the Footer eyebrows for site-wide eyebrow consistency.

## E. MiniFaq phone fallback (`src/components/MiniFaq.tsx`)

17. **`border-t border-cedar/12`** on the phone fallback row (line 60) → fading borderImage with a wider opacity (0.22). Make it match the Footer copyright line treatment so users perceive both as "soft endings."
18. **Spacing** — `mt-8 pt-6` is asymmetric. Promote to `mt-10 pt-7`.
19. **Phone link** — add `tabular-nums` (consistent with Footer/Contact/QuoteForm).

## F. SectionHeader subhead (`src/components/SectionHeader.tsx`)

20. **Italic subhead** — `text-subhead text-foreground/60 italic font-serif mb-8 text-balance`. Add `max-w-[44ch]` so subheads don't sprawl across full container widths on lg+ — same constraint we applied to Contact in Pass 26. Editorial subheads should never run wider than ~44ch.
21. **Heading default bottom margin** — `mb-4 [&:last-child]:mb-8`. When the subhead exists this is `mb-4`, when it doesn't it's `mb-8`. That's correct. No change.

## G. Section anchor sweep (verify, no edits expected)

22. **`rg "<section" src/pages src/components -n | rg -v "section-"`** — confirm every section element has an `id="section-*"` per the registry rule from memory. Fix any stragglers.

## H. Curly-quote sweep (low-risk safety pass)

23. **`rg "[a-zA-Z]'[a-zA-Z]" src/{pages,components} -n`** — find any remaining straight apostrophes inside JSX text (not inside string attribute values) and convert to `'`. Excludes admin pages.

## I. Light QA

24. After edits: viewport screenshots at 375 / 768 / 1366 of the homepage `/`, focusing on (a) Services 5-tile grid hover, (b) Hero proof band → Services seam, (c) press `/` and confirm the palette lists the 5 real routes plus the Quote action. Verify QuickNav routes navigate correctly.

## Files to touch

- `src/components/QuickNav.tsx` (route fix + shell hairline + active-row inset)
- `src/components/Services.tsx` (homepage tiles — radius, lift, hover wash)
- `src/components/Hero.tsx` (HeroProofBand fading hairline + nowrap)
- `src/components/CrewMoment.tsx` (stat divider, eyebrow scale)
- `src/components/MiniFaq.tsx` (phone fallback hairline + tabular-nums)
- `src/components/SectionHeader.tsx` (subhead width constraint)

No schema, no business logic, no auth/RLS, light-mode only, tokens-first, no behavior change other than the QuickNav route correction.
