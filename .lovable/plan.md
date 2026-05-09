# Pass 27 — Footer presence, QuoteFormInline editorial uplift, and the conversion-surface radius/typography sweep

Pass 26 cleaned NotFound, FeaturedProjects, MidPageQuotePrompt, and the Contact info card. The two highest-value surfaces still reading as "stock" rather than "world-class" are the **Footer** and **QuoteFormInline**. Both are conversion-critical (Footer carries the last impression; QuoteFormInline IS the conversion). FlexServices' equivalents are quietly cinematic; ours are functional. We close that gap, then sweep the remaining cards.

## A. Footer (`src/components/Footer.tsx`) — give it editorial weight

The footer is currently a single 12px-tall bar of links. On a long-scroll editorial site that lands as anticlimax. FlexServices uses a 3-zone footer: identity column, navigation column, contact column, each separated by hairlines, on a generous py-20 evergreen plate.

1. **Vertical rhythm** — `py-12 md:py-14` → `pt-20 pb-10 md:pt-24 md:pb-12` (use `SECTION_PADDING.footer`). The footer should breathe, not crowd the QuoteCloserCard above it.
2. **Three-zone grid layout (lg+)** — Replace the single horizontal flex with a `grid lg:grid-cols-12 gap-12`:
    - **Cols 1–4**: Brand identity. Logo + serif wordmark + a one-line italic promise: `"Built well, on time, on time again."`
    - **Cols 5–8**: Sitemap. Eyebrow `"NAVIGATE"` + vertical link list, sans, `text-sm`, `space-y-2`. Each link gets a `→` chevron on hover that translates 4px right (matches the rest of the editorial system).
    - **Cols 9–12**: Direct line. Eyebrow `"DIRECT LINE"` + serif phone (the same `font-serif text-lg tabular-nums` we used on Contact), email below in sans, then the three service cities as a single muted line.
3. **Fading hairline column dividers** on lg+ — `lg:divide-x lg:divide-cedar/15` is too flat; instead use a custom `:nth-child(2)` and `:nth-child(3)` `border-l border-transparent` with the standard cedar-fading `borderImage` running vertical (rotate gradient 180deg, top 0% → 50% 0.20 → 100% 0%).
4. **Bronze rule eyebrow above the © line** — already a fading hairline (good). Add a small bronze numeral `"//"` or numeric year on the left, copyright centered, a "Made in Alberta" caption on the right (justify-between on md+, stacked on mobile). All `text-evergreen-foreground/55`, `text-[11px]`, `tracking-[0.18em]`.
5. **Background warmth** — solid `bg-evergreen` reads as a flat plate. Add an **inset radial accent** at top-center: `style={{ background: "radial-gradient(ellipse at top, hsl(150 25% 18%) 0%, hsl(var(--evergreen)) 60%)" }}` so the footer fades up into the page rather than hard-cutting.
6. **Mobile collapse** — on `<lg`, stack the three zones with a fading hairline between each (same borderImage horizontal). Order: Identity → Navigate → Direct Line. Center the brand block, left-align the link/contact lists.
7. **Logo treatment** — currently `h-9 w-9`. Bump to `h-10 w-10` on lg+, add `opacity-90 group-hover:opacity-100 transition-opacity` so it feels editorial, not iconic.
8. **Footer link hover** — currently `hover:text-cedar`. Add a `before:` underline draw: `relative before:absolute before:bottom-0 before:left-0 before:h-px before:w-0 before:bg-cedar before:transition-all before:duration-300 hover:before:w-full` for an editorial underline animation.

## B. QuoteFormInline (`src/components/quote/QuoteFormInline.tsx`) — promote to editorial form

The form is functionally complete and trust-strip is good, but visually it's a **shadcn-default rectangle** sitting in a designed page. Three high-impact upgrades, no logic changes.

9. **Shell radius + bronze edge** — `rounded-sm` → `rounded-[6px]`. Add the canonical bronze left-bar (matches Contact info card and the other editorial cards site-wide): change `border border-cedar/15` to `border border-cedar/15 border-l-[3px] border-l-cedar/40`. Keeps the form anchored as part of the same family.
10. **Field labels** — currently `text-[11px] tracking-[0.15em] uppercase text-muted-foreground` (good). Add `font-medium` so they sit above body text in weight, not just position. Tracking from `0.15em` → `0.18em` to match every other eyebrow on the site.
11. **Input radius** — every input is `rounded-sm`; promote to `rounded-[4px]` (slightly tighter than card radius for a hierarchy: card 6 → input 4). Same for service chips and timeline radio buttons.
12. **Service chip refinement** — current `border-cedar bg-cedar/[0.08]` selected state reads as "highlighted box". Switch selected to `border-cedar/60 bg-cedar/[0.06] text-foreground shadow-[inset_0_-2px_0_hsl(var(--cedar))]` — a bronze underline INSIDE the chip rather than a halo. More editorial, less form-builder.
13. **Timeline radio** — same treatment as chips. The three-button row currently `border border-border` — add `divide-x divide-border/40` on the wrapper and a single shared `rounded-[4px]` outer border so the three options read as a single segmented control. Selected state same shadow-inset cedar underline.
14. **CTA button** — the submit `bg-cedar text-cedar-foreground rounded-sm` matches CedarCTA but isn't actually CedarCTA. Reuse the same primary look: `rounded-[6px]`, `tracking-[0.2em]`, add a hairline shadow `shadow-[0_1px_2px_hsl(var(--cedar)/0.20),0_8px_24px_-8px_hsl(var(--cedar)/0.30)]` for editorial lift. Keep the `min-h-[52px]` (good for thumb).
15. **Trust micro-strip** — currently `bg-muted/40` flat tint. Replace with `bg-cedar/[0.03] border-t border-transparent` + the cedar-fading borderImage. Replaces a hard divider with the same hairline language as section seams.
16. **Section title above the chips** — `"What do you need?"` is sitting in regular eyebrow. Add the standard SubLabel pattern: `<BronzeRule width="short" label="WHAT DO YOU NEED?" />` so the form internally uses the same micro-rhythm as the page.
17. **Success state card** — `rounded-sm`, `bg-secondary/40`, plain green check. Promote to `rounded-[6px]`, add the bronze left-bar, swap the check circle for a serif numeral `"01"` in cedar above `"We've got it."` for editorial cohesion. Keep the call CTA below.
18. **Field gap** — `space-y-5` is generous but the two `grid sm:grid-cols-2 gap-3` rows feel pinched at md. Change inner grid gap to `gap-3 sm:gap-4`, outer spacing to `space-y-6` for a slightly more editorial pace.

## C. Remaining radius sweep (from Pass 26 leftovers)

19. **TestimonialStrip cards** — `rounded-sm` → `rounded-[6px]` (line 60). Cards are media-bearing — must match new radius family.
20. **QuoteCloserCard** — `rounded-sm` → `rounded-[6px]` on the outer wrapper (line 40); pseudo-element bronze bar already in place.
21. **Navigation pills** (`MenuTrigger`, `NavigationMinimal`, `MobileSubNav`, `HeaderBreadcrumb`, `GlobalMenu`) — these are tap targets, not media surfaces. Keep them at `rounded-sm` (intentional — pills should be tighter than cards). No change. Document this in a comment so future sweeps don't break it.

## D. Curly-quote + tabular-nums micro-sweep

22. **`rg "[a-zA-Z]'[a-zA-Z]" src/{components,pages} -n`** — find any remaining straight apostrophes inside JSX text and convert to `'`. From session memory, hot spots are likely in QuoteFormInline labels, Footer (none currently), MiniFaq, and admin (skip admin). Audit & replace.
23. **Phone numbers** — every visible phone string should ship `tabular-nums`. Footer (already has it), QuoteFormInline success-state CTA copy ("Or call …" — verify), Contact direct row (added in Pass 26), Hero/CTA buttons that surface the phone — confirm.

## E. Light QA

24. After edits: viewport screenshots at 375 / 768 / 1366 of `/contact` (form), `/` bottom (footer), and `/contact` success state (form-submit confirmation). Verify the form's bronze left-bar lines up with the Contact info card on the left, the trust strip uses fading hairline, the segmented timeline reads as one control, and the footer's three-zone grid breathes on desktop and stacks cleanly on mobile.

## Files to touch

- `src/components/Footer.tsx` (full rewrite of the layout, no API changes)
- `src/components/quote/QuoteFormInline.tsx` (shell + chips + button + success)
- `src/components/TestimonialStrip.tsx` (radius)
- `src/components/QuoteCloserCard.tsx` (radius)

No schema, no business logic, no validation changes, no auth/RLS, light-mode only, tokens-first.
