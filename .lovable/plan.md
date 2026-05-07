# Pass 16 — Micro-Typography, Motion Choreography & Primitive Harmonization

Pass 15 fixed structural rhythm. This pass targets the **smaller half** of "world-class" — the things you only notice at 200% zoom or in a Loom recording: orphan words, heading optical balance, hero variant consistency, motion rest states across breakpoints, primitive shadows, and the seven remaining FlexServices-grade nits.

Strict scope: presentational + primitive-level. No schema, no data, no new components, no logic. Every change is reversible from a single search-replace.

## A. Hero variants — internal consistency sweep

The site uses 4 PageHero variants. Each has its own scrim weight, padding, eyebrow style, and headline scale. Right now they look cousins, not siblings.

1. **Container padding** — every variant still hard-codes `container mx-auto px-6` (6 occurrences across `page-hero.tsx`). Switch to `px-5 sm:px-6 md:px-10` so heroes match the new site-wide gutter token.
2. **EvergreenTypographic subtitle** — uses `text-lg italic font-serif` while CinematicBleed uses `text-lg md:text-xl italic font-serif`. Unify to `text-base md:text-lg italic font-serif text-evergreen-foreground/85` across all variants. Italic serif subtitle is a Creek signature; size variance breaks the family.
3. **ServicePortrait pt-32** — top padding is set to `pt-32` (128px). On a 640px-tall viewport the eyebrow sits below the fold. Reduce to `pt-24 md:pt-28 lg:pt-32`.
4. **CinematicBleed `pb-16 md:pb-20`** — bumps to `pb-14 md:pb-20 lg:pb-24` so the caption rail clears the iOS safe-area inset.
5. **ArchitectBleed bottom row** — `gap-y-10 gap-x-8` between subtitle column and caption rail. At `md` (where the layout becomes 12-col), `gap-x-8` collides with the long phone CTA. Bump to `gap-x-10 lg:gap-x-12`.
6. **Architect headline `clamp(2.125rem, 8.5vw, 8.25rem)`** — at the floor (340px viewport ≈ 29px) the line "Excellence in" still wraps to "Ex‑cellence". Add `hyphens: manual` and a soft hyphen via `-webkit-hyphens: none; word-break: keep-all` so the wrap point is always between words.
7. **Architect subtitle font-size `clamp(0.95rem, 1.05vw, 1.0625rem)`** — at lg+ desktop this is barely larger than the eyebrow (11px). Bump max to `1.125rem` so the hierarchy reads from across the room.

## B. Micro-typography polish (sitewide)

The brand memory mandates curly quotes and DM Serif. Current state is 95% compliant; the last 5% is what separates editorial from "edited".

8. **Hanging punctuation** — testimonial cards open with `&ldquo;` as a separate `<span>` block above the quote. Move to `text-indent: -0.55em` on the `<p>` itself so the quote optically aligns with the rest of the card edge (real hanging punctuation, not a shoulder-mark). Adjust both `TestimonialStrip.tsx` and any other quote consumer.
9. **Soft hyphens in long city names** — "Sherwood Park", "Strathcona County" wrap awkwardly in 2-col mobile chip grid. Add `hyphens-auto` to the chip span and `lang="en-CA"` on the chips container so browsers know which dictionary to use.
10. **Tabular numerals on stats + numerals** — already on stat values, missing on the project index numerals (`01`, `02`, …) in `FeaturedProjects.tsx` lead/stack/row meta lines. Add `tabular-nums` everywhere a `padStart(2, "0")` count appears. Audit: `FeaturedProjects.tsx`, `Work.tsx` headers, `services` matrix counts, `Process` step numbers in `About.tsx`. Already tabular in some — confirm uniform.
11. **Drop `font-light` on small body** — `FaqAccordion.tsx` trigger uses `font-light text-foreground` at 16px. DM Sans light at 16px is the worst rendering weight for Windows ClearType. Switch to `font-normal`.
12. **Title-case to sentence-case audit** — eyebrow labels are inconsistently cased: `WHAT WE BUILD`, `THE FULL MENU`, `HOW WE WORK`, `WE HANDLE`, `YOU HANDLE`, `OR FILL THIS OUT`, `DIRECT`, `GET A FREE QUOTE`. Three of these (`OR FILL THIS OUT`, `DIRECT`, `GET A FREE QUOTE`) read like UI labels, not editorial eyebrows. Rename: `OR FILL THIS OUT` → `THE FORM`; `DIRECT` → `DIRECT LINE`; `GET A FREE QUOTE` → `FREE QUOTE`.
13. **Curly-quote audit** — `data/projects.ts`, `config/testimonials.ts`, `config/faqs.ts`, `config/services.ts` all hand-write copy. Run a one-shot `'` → `’`, `"…"` → `“…”` sweep. Limit scope to those four files plus `src/pages/About.tsx` paragraph content.

## C. Motion choreography across breakpoints

Motion currently fires at the same speed regardless of viewport. On mobile the user is reading at 1.5× their face-distance and the framer slides feel laggy.

14. **`useReveal` duration scaling** — currently fixed `0.6s`. Switch to `0.45s` on mobile (`< sm`), `0.6s` on `sm-md`, `0.75s` on `lg+`. Implement via a CSS variable `--reveal-duration: 450ms; @media (min-width: 640px) { 600ms } @media (min-width: 1024px) { 750ms }` consumed by the existing reveal classes.
15. **`prefers-reduced-motion`** — confirm every `transition-*` token in `src/lib/motion.ts` has a reduced-motion override. Add a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }` to `src/index.css` — if missing.
16. **Hover-scale on touch** — `transition-transform group-hover:scale-[1.04]` fires on iOS as soon as the user taps. Add `@media (hover: hover) { ... }` gate via Tailwind's `hover:` modifier already does this — confirm `group-hover:` in `Services.tsx`, `FeaturedProjects.tsx`, `ProjectTile.tsx`, `MediaSlot` is using `hover:` not `:hover` raw. Tailwind handles it; just audit.
17. **Hero Ken Burns — pause on `prefers-reduced-motion`** — `hero-kenburns` class in `index.css` runs an infinite scale animation. Add `@media (prefers-reduced-motion: reduce)` block that sets `animation: none`.

## D. Shadow + border token cleanup (carry-forward from Pass 14)

18. Remaining `shadow-contact` references that don't earn the elevation:
    - `src/components/ui/faq-accordion.tsx` line 34 — accordions are flat in FlexServices style. Drop.
    - `src/components/ui/project-tile.tsx` line 183 — description plate. Drop, keep only on hover via `group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]`.
    - `src/components/ui/stat-trio.tsx` line 73 — `card` variant. Keep (cards earn elevation).
    - `src/components/quote/QuoteFormInline.tsx` lines 202/225 — form shells. Keep — the form is the page's primary action surface.
    - `src/components/ui/card-premium.tsx` — keep, primitive name says "premium".
19. **`shadow-elevated` on `ProjectTile`** — the hover-elevation `group-hover:shadow-elevated` jumps the tile in z. Replace with a softer `group-hover:shadow-[0_8px_24px_-12px_hsl(var(--cedar)/0.18)]` (a cedar-tinted shadow, not generic black).
20. **Border opacity audit** — sitewide we use `/40`, `/30`, `/20`, `/15`, `/12`, `/[0.04]`. Six steps is too many and creates the "almost-but-not-quite" feel. Consolidate to a 4-step ramp: `/8` (whisper), `/15` (rule), `/30` (active), `/50` (focus). Files affected: `Services.tsx` (tile borders), `TestimonialStrip.tsx` (cards), `Footer.tsx` (hairlines), `MiniFaq.tsx` (phone fallback rule), `About.tsx` (process cards), `Contact.tsx` (info card rows).

## E. Primitive-level

21. **`BronzeRule`** — currently the rule has fixed widths via a `width` variant ("short" | "long"). On a 320px viewport the "long" width can overflow when paired with a numeral. Add a `clamp()` upper bound and switch the underlying span to `width: clamp(2rem, 12vw, 4rem)` for short, `clamp(3rem, 18vw, 6rem)` for long.
22. **`SectionHeader` h2 `mb-4`** — too tight when there's no subheading underneath (heading sits directly on the body). Change to `mb-4 [&:last-child]:mb-8` so a subhead-less header still gets breathing room.
23. **`StatTrio.inline`** — label uses `text-[9px] tracking-[0.18em]` — sub-10px tracked-out text fails WCAG AAA legibility. Bump to `text-[10px] tracking-[0.2em]`.
24. **`KineticHeadline`** — uses `clip-path: inset()` reveal. On Safari 14- the clip-path animation triggers a full-section repaint each frame. Add `will-change: clip-path` to the `.kinetic-line` class only during animation (clear afterward via `animationend`). If too invasive, accept and move on.
25. **`FaqAccordion` plus icon** — Pass 14 added a custom + → − transition. Confirm rotation origin is `transform-origin: center center` (default — correct). Confirm the vertical bar's transform timing matches the parent's data-state transition (currently 300ms — bump to 400ms to match Creek's standard easing).

## F. Image art-direction

26. **`MediaSlot` `aspect-hero`** on Services tiles — the photo is letterboxed because tile container forces `aspect-hero` (16:9-ish) regardless of source. Switch to `aspect-[5/4]` (more editorial) on tiles, keep `aspect-hero` on the homepage Featured grid.
27. **EditorialPicture `cedarHover`** — fires a cedar tint on hover. The tint amount (`mix-blend-mode: multiply, opacity: 0.15`) is too strong on dark photos. Switch to `opacity: 0.08` and add `mix-blend-mode: soft-light` for warmer interaction.
28. **LQIP fallback** — `ArchitectBleed` paints a 24px-blurred LQIP. On Chromium-mobile the blur radius creates a grey halo around the image after fade-in. Reduce blur to `18px` and add `transform: scale(1.04)` (currently 1.06) so edges don't peek post-fade.

## G. Accessibility rounding

29. **Focus rings** — `focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2` is correct, but `ring-offset-color` defaults to white. On `bg-secondary` (cream) the offset shows as a tiny halo. Add `focus-visible:ring-offset-background` to every focusable that sits on `bg-secondary` (Services tiles, About city chips, About process cards, FAQ triggers).
30. **Skip-to-content** — currently styled `focus:bg-cedar focus:text-cedar-foreground`. Confirm tab-stop is the very first interactive in every page. Audit `Index.tsx`, `About.tsx`, `Services.tsx`, `Work.tsx`, `Contact.tsx` — Pass 13 standardized the targets, Pass 16 verifies focus order isn't intercepted by `Navigation.tsx` (which now renders before SkipToContent in most pages — should be after).
31. **`aria-current="page"`** — `Navigation.tsx` SectionRail / GlobalMenu — add `aria-current="page"` to the active route link so screen-reader users know where they are.
32. **`<main>` landmarks** — every page wraps in `<main>` (good). Add `id="main-content"` to each so SkipLink can target it as a fallback.

## H. Sitewide micro-fixes

33. **404 page** — `NotFound.tsx` (58 lines) hasn't been touched in this audit cycle. Confirm it inherits the same chrome (Navigation + Footer) and uses `PageHero` (or at least `EYEBROW + HEADLINE.display`). Apply a one-shot polish.
34. **StyleGuide page** — 2022-line monster. Don't touch UX; just confirm it still builds after the token changes (the page references many tokens directly).
35. **Container `px-3 sm:px-4 md:px-6` in `Navigation.tsx`** — out of step with the new `px-5 sm:px-6 md:px-10` site standard. Change to `px-4 sm:px-5 md:px-8` (nav stays slightly tighter than body — the chrome reads as a ribbon).
36. **`SECTION_PADDING.default = "py-16 sm:py-20 md:py-24 lg:py-28"`** — at `lg` (1024px), 28 (112px) is right; at `xl` (1440), it's too cramped against the wider headlines. Add an `xl:py-32` step.

## Files touched

`src/components/ui/page-hero.tsx`, `src/components/ui/faq-accordion.tsx`, `src/components/ui/project-tile.tsx`, `src/components/ui/stat-trio.tsx`, `src/components/ui/bronze-rule.tsx`, `src/components/SectionHeader.tsx`, `src/components/Navigation.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/MiniFaq.tsx`, `src/components/Footer.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/CrewMoment.tsx`, `src/components/Services.tsx`, `src/components/Hero.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/media/EditorialPicture.tsx` (cedar-hover only), `src/lib/spacing.ts` (xl step), `src/lib/typography.ts` (StatTrio inline), `src/lib/motion.ts` (reduced-motion guard), `src/index.css` (Ken Burns reduced-motion guard, kinetic will-change), `src/pages/About.tsx`, `src/pages/Services.tsx`, `src/pages/Work.tsx`, `src/pages/Contact.tsx`, `src/pages/Index.tsx`, `src/pages/NotFound.tsx`, `src/data/projects.ts`, `src/config/testimonials.ts`, `src/config/faqs.ts`, `src/config/services.ts`.

No new files. No deletions. No schema changes. No business-logic edits.
