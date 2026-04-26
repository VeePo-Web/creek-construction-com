
# Plan — Fantasy.co-grade Hero System for every page

## Why this matters now

I audited every hero on the site. Three structural problems are blocking world-class work:

1. **Homepage Hero photo is invisible.** `Hero.tsx` queries `min_quality: "hero"` but the database has zero `hero`-tier images — only `portfolio` and `reference`. The two-column layout silently collapses to type-only on every load.
2. **Every sub-page (Services, Work, About, Contact) renders the flat `evergreen` PageHero variant** — same radial gradient, same paragraph. No photography, no motion, no service-specific texture. This is the *opposite* of Fantasy.co's "every screen earns its frame" principle.
3. **The `cinematic` PageHero variant exists but is dead code** — it takes a single static `image` prop (not a database query), has no video support, no foreground composition, no sequenced reveal.

We have 24 portfolio-grade photos and 7 approved videos sitting unused. This plan turns the hero layer into the brand's strongest weapon.

---

## What "Fantasy.co quality" means here

Filtering through your three values:

- **Elevate the human experience** → heroes load fast, never CLS, respect `prefers-reduced-motion`, surface a single clear CTA, work flawlessly on a 360px phone.
- **Embody brand truth** → every hero photograph is an actual Creek build (zero stock), warmth comes from cedar tones, type is DM Serif Display with hanging punctuation.
- **Innovate responsibly** → motion serves comprehension (Ken Burns ≤ 1.06× scale, clip-reveal ≤ 700ms), video is decorative-only with a still poster fallback, no autoplay sound — ever.

---

## Architecture — one canonical hero, four expressive variants

Rebuild `src/components/ui/page-hero.tsx` so a single component drives every hero on the site, choosing layout intelligently from props + live media:

| Variant | Used on | Composition |
|---|---|---|
| `editorial-split` | **Homepage** (replaces current `Hero.tsx`) | Two-column: typographic stack left, full-bleed photo + floating stat card right. Photo + stats both adapt based on what's actually in the library. |
| `cinematic-bleed` | **/work** | Full-viewport photo OR looping muted video, reveal-clip headline staggered in 3 lines, bronze rule as a horizon, scroll-bound parallax (≤6%). |
| `service-portrait` | **/services**, future per-service detail | Right-side portrait photo of an actual deck/fence/shed, left-side service-aware kicker that swaps based on most-photographed service in DB. |
| `evergreen-typographic` | **/about**, **/contact** | Current type-only treatment, but with bronze numeral set in a wider grid, animated underline on first paint, optional grain texture intensity slider. |

All four share: BreadcrumbTrail → BronzeRule → headline → subtitle → description → children CTA stack. The *only* thing that changes is the background layer and the column geometry. This keeps the system honest.

---

## Step 1 — Promote real photography to `hero` tier

The library has 9 strong `portfolio` elevations. Pick the 5 most editorial (deck framing, charcoal shed, horizontal-slat fence, cedar storage shed, wood-deck rail) and promote them to `ai_quality = 'hero'` so the existing query starts returning data. This is a one-line SQL migration — instant fix for the invisible homepage photo.

I'll also relax the homepage hero query to `min_quality: 'portfolio'` as a safety net so this never silently fails again.

## Step 2 — Add a `cinematic-bleed` `PageHero` variant that takes a query

Rewrite `PageHero` so the `cinematic` variant accepts either:
- `image: string` (static, current behavior), **or**
- `query: MediaQuery` (live database lookup), **or**
- `videoQuery: MediaQuery` (looping muted background video, with poster fallback)

When `videoQuery` resolves to an approved `.mp4`/`.webm`, render `<video autoplay muted loop playsinline preload="metadata" poster={firstFramePoster}>`. When it resolves to `.mov` or nothing, fall back to the still hero. Fully `prefers-reduced-motion` aware: motion-reduced users get the still poster only.

## Step 3 — Cinematic motion choreography

Add a sequenced reveal director on hero mount, using the existing `reveal-clip` keyframe + a new `hero-stagger` orchestrator:

1. **0ms** — image/video crossfades in from `opacity 0 → 1` over 600ms, easing `cubic-bezier(.2,.8,.2,1)`.
2. **180ms** — bronze rule scales `scaleX(0) → scaleX(1)` from left, 500ms.
3. **300ms** — headline lines clip-reveal in sequence (each 80ms behind the previous). Three-line max.
4. **560ms** — subtitle fades + lifts `translateY(8px) → 0`, 500ms.
5. **720ms** — CTA + tel link fade in, 400ms.

Total choreography under 1.2s — enough to feel intentional, fast enough to not block interaction. Reduced-motion users get all of it instantly with `opacity` only.

## Step 4 — Per-page hero programming

| Page | Variant | Media query | Headline copy (kept) |
|---|---|---|---|
| `/` (Index) | `editorial-split` | `shot_type: ['hero','elevation','wide']`, `min_quality: 'portfolio'` | "Excellence in the Work." |
| `/work` | `cinematic-bleed` | `videoQuery` first (any approved video), fallback to `shot_type: 'wide'` portfolio image | "The work speaks first." |
| `/services` | `service-portrait` | Top-photographed service's best `elevation` shot | "Built right. Built once." (NEW — replaces flat) |
| `/about` | `evergreen-typographic` (enhanced) | none — keep typographic | "Local crews. Real work." |
| `/contact` | `evergreen-typographic` (enhanced) | none — keep typographic | "Tell us about the project." |

## Step 5 — Headline kinetic typography

Today the `<h1>` is a single block. Upgrade to a `<KineticHeadline>` primitive that splits the title at sentence boundaries and animates each line independently:

```
<span class="reveal-clip" style="--delay: 0ms">Excellence in the Work.</span>
<span class="reveal-clip italic text-cedar" style="--delay: 80ms">Pride in every detail.</span>
```

The italic accent line uses the cedar accent at `0.62em` (already tokenized) but now lifts in a beat *after* the main statement — exactly the Pentagram cadence.

## Step 6 — Foreground depth — the floating provenance card

Add a `HeroProvenanceCard` that floats over the bottom-left of cinematic heroes:
- `Numeral · location · year · service` in micro-uppercase
- One-sentence narrative caption pulled from `media_metadata.alt`
- Subtle backdrop-blur on a 95%-opaque cedar-tinted surface

This is what gives Fantasy heroes their "this is real, here's the receipt" feel. It also doubles as ProvenanceCaption for SEO.

## Step 7 — Mobile-first behaviour

- Heroes drop from `min-h-screen` → `min-h-[78vh]` on `<sm` and `<md` to prevent thumb fatigue.
- Two-column layouts collapse to *photo first, type second* on `<lg` — the photo is the hook.
- Video heroes never autoplay over cellular: detect `navigator.connection.saveData` / `effectiveType === '2g' | '3g'` and fall back to poster.
- Floating cards re-flow inline (not absolute) below `lg`.

## Step 8 — Performance contract

Hard budgets for every hero:
- LCP image ≤ 180KB after `?width=1920&quality=82` Supabase transform; preloaded with `<link rel="preload" as="image" fetchpriority="high">` injected by a new `useHeroPreload(query)` hook so we hit LCP before the React tree mounts.
- `content-visibility: auto` on every section *below* the hero.
- `contain: layout style paint` on the hero section itself (already there for cinematic — extend to all variants).
- Video poster generated server-side at upload time (already wired in `auto-classify-batch`); we just consume the `poster_path` column.

## Step 9 — Accessibility contract

- `<h1>` is exactly one per page, lives inside `<section aria-label>`.
- All hero photographs use the database `alt` text — already authored.
- Skip-to-content link already implemented; verify focus ring is `focus-visible:ring-cedar` on both light and dark hero backgrounds (currently inconsistent on `/about` evergreen).
- All animations respect `@media (prefers-reduced-motion: reduce)` via the existing global override in `index.css`.
- Color contrast: validate every headline against its hero photo's bottom-third luminance. Apply `TEXT.onDark.legibleShadow` automatically on `cinematic-bleed`.

## Step 10 — Documentation + governance

- Update `mem://design/component-primitive-map` with the four hero variants and which pages use which.
- Add a `/style-guide#heroes` section that renders all four variants live with annotated overlays — so the next contributor cannot drift.
- Add JSDoc on `PageHero` listing the four variants, motion timing constants, and the performance budget so it appears on hover in IDE.

---

## Files this will touch

**Edit**
- `src/components/ui/page-hero.tsx` — add `editorial-split`, `service-portrait` variants, query support, video support, sequenced reveal
- `src/components/Hero.tsx` — refactor to delegate to `<PageHero variant="editorial-split">`, eliminating duplicated layout logic
- `src/pages/Work.tsx` — switch to `cinematic-bleed` with videoQuery
- `src/pages/Services.tsx` — switch to `service-portrait`
- `src/pages/About.tsx`, `src/pages/Contact.tsx` — adopt enhanced `evergreen-typographic`
- `src/index.css` — add `hero-stagger` keyframes + delay variables
- `src/lib/motion.ts` — add `HERO_TIMINGS` constants (one source of truth)
- `src/pages/StyleGuide.tsx` — new "Heroes" section

**Create**
- `src/components/ui/kinetic-headline.tsx` — line-split + per-line clip-reveal
- `src/components/ui/hero-provenance-card.tsx` — floating bottom-left receipt
- `src/hooks/useHeroPreload.ts` — injects `<link rel=preload>` for LCP image
- `supabase/migrations/<ts>_promote_hero_quality.sql` — promote 5 best portfolio elevations to `hero`

**Memory**
- Update `mem://design/component-primitive-map`
- New `mem://features/hero-system-v7` documenting the four variants, timings, query patterns

---

## What "done" looks like

Open every page in turn. Every hero feels *inevitable* — like it could not have been designed any other way. Photography on the homepage is real Calgary work, animated in with the discipline of a Pentagram opener. `/work` opens with a video of a deck being built, headline clip-revealing line by line. `/services` lands on a portrait of a finished cedar fence. `/about` and `/contact` stay typographic but feel intentional, not empty. Nothing janks. LCP under 2.0s on a throttled 4G connection. Reduced-motion users get the same composition, instantly.

That is Fantasy.co quality.
