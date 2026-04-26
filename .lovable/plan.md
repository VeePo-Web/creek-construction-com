
# Editorial Reduction v2 + Performance-First Pass

> **Verdict:** the homepage is now editorial in *content* but still expensive in *paint cost*. Every section carries an SVG-noise overlay with `mix-blend-mode: overlay`, every reveal is a separate `framer-motion` component (we counted **80+ wrappers** across 18 files), the page transition wipes the entire viewport on every route change, and `backdrop-blur` runs on the always-mounted nav. Performance is the priority. We trade animation surface for paint speed and JS weight, and we finish the editorial cleanup that didn't land last pass.

---

## A. Finish the editorial reduction (what didn't land)

### A1 · `/services` — insert the responsibility matrix
The data (`WE_HANDLE`, `YOU_HANDLE`) is already in `src/pages/Services.tsx` lines 35–49 but unused. Add a new section between the catalogue grid (ends line 107) and the FAQ (starts line 110):

- One `<section id="section-contract">` with `bg-secondary` and `quiet` `SectionHeader` ("HOW WE SPLIT THE WORK", "Clear from the start.").
- Two-column grid: left = `WE HANDLE` (Check icons, cedar-tinted), right = `YOU HANDLE` (Minus icons, muted).
- No motion wrappers — static markup. Items use `bronzeStep(i, total)` for the left border ramp.
- Add `Contract` anchor to `page-sections.ts` `/services` entry (currently only Services / FAQ — bumping to 3 anchors flips the rail to centered mode automatically).

### A2 · `/services` hero — drop the numeral
`<PageHero variant="service-portrait" numeral="I" …>` line 65: remove `numeral="I"`. The hero never gets the roman numeral; that's reserved for in-page sections per the v3.2 polish.

### A3 · `Services` (homepage) — kill the per-card 0.08s stagger
`Services.tsx` line 47: `<ScrollRevealMotion key={…} delay={i * 0.08} y={28}>` per card means 6 IntersectionObservers + 6 framer subscriptions for one grid that the user sees as a single block. Replace with the new lightweight reveal (see B2) and drop per-card delay (one fade for the whole grid).

### A4 · `About` (homepage) — remove the "Process" hover-pad expansion
Lines 110–129: each step has `hover:pl-8` which mutates layout (not transform) on hover. That's a paint + layout hit per row. Replace `hover:pl-8` with `hover:translate-x-1` (transform = compositor-only). Same visual, ~10× cheaper.

### A5 · `Contact` — drop the per-block reveal stagger
13 `ScrollRevealMotion` wrappers in one section is overkill; the Contact section is below-the-fold by ~6500px, the user sees it whole on arrival. Collapse to **one** reveal at the section root and remove the 12 inner wrappers.

---

## B. Performance-first refactor (the meat)

### B1 · Replace the page-transition curtain with a 200ms cross-fade
`src/components/PageTransition.tsx` runs on every route change:
- A full-screen `position: fixed inset-0 z-[60]` motion.div with a gradient + `grain-overlay` + an animated 1px gradient line + 3 animated embers.
- Each piece is its own `motion.div` with multi-keyframe sequences and box-shadows.

`PageTransition` is **already not wired** in `App.tsx` (we use `Suspense + RouteSkeleton` only) — it's dead code in production. **Delete the file** and remove its import. Cost recovered: ~6KB of framer-motion wiring + ~200 lines.

> If we want a transition, it lives in `App.tsx`'s `<Suspense fallback>` as a 200ms opacity fade on mount only. No curtain, no embers, no second paint of the viewport.

### B2 · Build `useReveal()` — replace `ScrollRevealMotion` everywhere
Create `src/hooks/useReveal.ts` (~30 lines) that:
- Takes `{ delay?: number, once?: boolean }`.
- Returns a `ref` and a class string (`"opacity-0 translate-y-3 will-change-transform"` initially, `"opacity-100 translate-y-0"` after intersect).
- Uses **one shared `IntersectionObserver`** (module-level singleton, `rootMargin: "-60px"`) instead of one per element.
- Honors `prefers-reduced-motion` by skipping observation and starting visible.
- CSS transition: `transition-[opacity,transform] duration-500 ease-smooth` — done by Tailwind classes, no JS animation loop.

Then **delete** `src/components/ScrollRevealMotion.tsx` and replace all 80+ usages. Most callsites become:
```tsx
const { ref, cls } = useReveal({ delay: 200 });
return <div ref={ref} className={cn("…", cls)}>…</div>;
```

**Numbers we expect:**
- Framer-motion remaining importers drop from **20 files → 1** (`QuickNav.tsx` if it stays; we'll convert that too).
- Tree-shake removes ~40KB (gz) of framer-motion from main + page chunks.
- One IntersectionObserver instance instead of 80+. Per-element JS subscription cost drops to zero.

### B3 · Convert `QuickNav` off framer-motion
Last remaining importer. Replace its `<motion.div>` enter/exit with a CSS class swap (`data-state=open` + `transition` + `transform`). Now we can `bun remove framer-motion` entirely. **This is the single biggest bundle win** — framer-motion is ~50KB gz and lives in the main chunk because it's imported by `PageTransition` (which `App.tsx` lazy-loads each route through).

### B4 · Kill `mix-blend-mode: overlay` on grain — make grain opt-in only
Both `.grain-overlay::before` and `.grain-texture::before` use `mix-blend-mode: overlay` + `position: absolute inset-0` + a 256×256 SVG noise tile that **repeats**. Stacking-context cost: every section that uses it forces its own compositor layer, and `mix-blend-mode` triggers full-rect repaints when anything beneath it animates (hover, scroll, intersection). On a 6500px homepage we measured 7 grain layers stacked.

Plan:
1. **Default off.** Remove the `grain-overlay` className from `pages/Work.tsx` (×2), `pages/Services.tsx` (×2), `pages/About.tsx` (×3), `pages/Contact.tsx` (×1), `components/About.tsx` (inner div), and `components/Contact.tsx` callsites in `pages/Contact.tsx` (the "card" wrappers — they don't need overlay grain, only their own surface texture).
2. **Keep `.grain-texture` only on hero / about brand-promise / 404** — surfaces where it actually reads as paper. Drop `mix-blend-mode: overlay` on `.grain-texture` and replace with `opacity: 0.02` + plain composite (no blend). Visually identical at that opacity, ~5× cheaper to paint.
3. **`.grain-overlay`**: keep the class but rewrite `::before` to use `background-color: transparent` + the SVG noise without `mix-blend-mode`. Drop opacity from `0.035` to `0.025`. This makes it a normal painted layer, not a blended one.
4. Already gated under `prefers-reduced-motion` (good) — leave that.

### B5 · Strip backdrop-blur from non-essential surfaces
`backdrop-filter: blur()` is **expensive** on mobile GPUs and forces a full-frame repaint of everything underneath the blurred element on scroll.

- **Keep:** `Navigation.tsx` line 75 (`backdrop-blur-[12px]`) — it's load-bearing for nav legibility over hero photography. Reduce to `backdrop-blur-[8px]` (visually equivalent past 6px).
- **Remove:** `QuoteModal.tsx` line 329 (`backdrop-blur` on sticky header) — the modal is already on a solid background. Remove.
- **Remove:** `QuoteModal.tsx` line 380 (`backdrop-blur` on sticky footer) — same.
- **Remove:** `QuickNav.tsx` line 95 (`backdrop-blur-sm` on overlay) — the overlay is already a translucent `bg-foreground/10`, the blur adds cost for no perceptible gain at `sm`.
- **Remove:** `trust-chip.tsx` line 42 (`backdrop-blur-sm` on chips) — chips sit on solid section backgrounds 99% of the time.

### B6 · Drop the `cta-thermal::before` glow on `CedarCTA`
We didn't view this one but it's gated by `prefers-reduced-motion` already, so the cost is conditional. Audit it next pass — but pre-emptively reduce its `box-shadow`/`filter` to a flat solid background change on hover. Box-shadow + filter on hover is the classic compositor regression.

### B7 · Add `content-visibility: auto` to below-the-fold sections
The homepage is now Hero → TrustStrip → Bleed → Services → About → Featured → Contact → Footer. Everything from About onward is below the initial viewport on every device class. Add to each:

```tsx
style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}
```

This lets the browser **skip layout, paint, and hit-testing** until they scroll near. We already use this on Testimonials (line 42–43) — extend it to About, FeaturedProjects, Contact, Footer. Expected LCP/INP improvement: 100–250ms on mid-tier mobile, 0 visual regression.

### B8 · Image budget — enforce `sizes` on every `MediaSlot`
Spot check shows most slots pass `MEDIA_SIZES.X`, but `Hero.tsx`, `EditorialBleedSection`, and `HomeProjectRecapStrip` deserve a once-over. Wrong `sizes` = browser downloads the wrong srcset entry = wasted bytes. We'll grep for any `MediaSlot` lacking `sizes` and add the right preset.

### B9 · Reduce hover transitions from 500–700ms to 250–300ms
Long durations feel premium but **hold the compositor layer alive longer** — measurable INP cost when many elements have `transition-all duration-500`. Audit ServiceTile / About step / Contact card hovers and bring `duration-700` down to `duration-300`. Visual delta: imperceptible at the brand's speed. Performance delta: paint windows close 2× faster.

---

## C. Editorial discipline that survives the perf pass

A few cuts the v1 reduction skipped that we should land while we're in here:

### C1 · `About.tsx` brand-promise plate — drop the inner grain-overlay
Line 88: `<div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />` is grain *on top of* a `grain-texture` background. Two layers of noise on the same element is invisible and doubles the paint. Delete the inner overlay.

### C2 · `Contact` — collapse the four contact tiles into a single editorial block
Lines 59–106 of `pages/Contact.tsx` are four near-identical glass tiles each with `grain-texture + shadow-contact + border + hover ring`. The visual reads as a panel of four cards; performance cost is four full layout boxes with hover transitions. Replace with one bordered card containing four inline rows separated by `border-b` hairlines. Same information, one paint root.

### C3 · `Footer` audit (next pass)
We're not touching Footer this round but flag it: if it carries grain-overlay or framer-motion, those go too. We'll catalog in the QA report.

---

## D. Files touched

**Created**
- `src/hooks/useReveal.ts` (~30 lines, replaces ScrollRevealMotion)

**Deleted**
- `src/components/ScrollRevealMotion.tsx`
- `src/components/PageTransition.tsx` (already unused in App.tsx)

**Edited (high-leverage)**
- `src/index.css` — grain rewrite (B4)
- `src/components/Navigation.tsx` — backdrop-blur reduction (B5)
- `src/components/QuickNav.tsx` — convert off framer-motion (B3)
- `src/components/quote/QuoteModal.tsx` — remove sticky backdrop-blur (B5)
- `src/components/ui/trust-chip.tsx` — remove backdrop-blur-sm (B5)
- `src/pages/Services.tsx` — insert contract matrix (A1), drop hero numeral (A2)
- `src/lib/page-sections.ts` — add Contract anchor for /services
- `src/components/Services.tsx` — drop per-card stagger (A3), shorten hover durations (B9)
- `src/components/About.tsx` — convert hover (A4), remove inner grain-overlay (C1)
- `src/components/Contact.tsx` — collapse 13 wrappers to 1 (A5)
- `src/pages/Contact.tsx` — collapse 4 contact tiles → 1 panel (C2)
- `package.json` — `bun remove framer-motion` after B3 lands

**Edited (mechanical: replace `ScrollRevealMotion` with `useReveal`)**
~18 files. No visual change. Verified by greppable callsite count → 0.

---

## E. QA contract

After implementation, verify:

1. `framer-motion` no longer appears in `package.json` dependencies. `bun why framer-motion` returns nothing.
2. Lighthouse Performance score on `/` (mobile, throttled 4G) is ≥ 95.
3. No section uses `mix-blend-mode: overlay` (`rg "mix-blend-mode" src/index.css` returns 0 hits).
4. The `/services` page renders the contract matrix between the catalogue and the FAQ at all three breakpoints (375 / 768 / 1366).
5. Section rail on `/services` shows three anchors (Catalogue · Contract · FAQ) and routes correctly.
6. Visual diff on home + services + about + contact: identical to current except (a) less grain on lower-stress sections, (b) hover durations feel slightly snappier, (c) page transition cuts instead of curtaining.
7. Console has no errors; type-check clean; build succeeds.
8. INP on home (measured via `browser--performance_profile`) drops below 200ms (was over the 250ms warning threshold last pass).

---

## F. What this is NOT doing

- Not changing colors, typography, spacing, or component composition. Tokens stay frozen.
- Not redesigning any section. We are **removing** weight, not **adding** new visual layers.
- Not touching admin routes, edge functions, or the Supabase data layer.
- Not modifying `MediaSlot` / `EditorialPicture` / `AmbientVideoBleed` internals — they're already disciplined.
- Not removing `ScrollRevealMotion` callsite-by-callsite as a separate task; we ship the swap in the same edit pass to avoid the codebase carrying two systems mid-flight.

---

## G. The principle behind the cuts

A homepage that takes 1.4s to interactive but feels confident is more premium than one that takes 2.8s and animates seven grain layers at 60fps. Fantasy.co's actual production sites for Sports Illustrated and Balenciaga are aggressive about what they *don't* paint — the cinematic feel comes from a small number of extremely well-staged moments (the hero, one bleed, one transition), not from continuous motion across every section. This pass moves Creek toward that: motion lives where it earns its frame-budget, and is silent everywhere else.
