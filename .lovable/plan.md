# Style Guide v3 — Performance Surgery

The cosmetic layer is done. Style Guide v2 shipped (`/style-guide`, code-first tokens, 432-line `index.css`, `NavProgressBar` deleted). The user's actual pain — **"a lot of the website is slow performance wise"** — is still there, and a fresh profile of `/` on mobile (390×844) confirms exactly why.

---

## The diagnosis (measured, not guessed)

From `browser--performance_profile` on `/` just now:

| Metric | Now | Target (`PERFORMANCE_BUDGETS`) | Verdict |
|---|---|---|---|
| **First Contentful Paint** | **5,420 ms** | < 1,800 ms | 🔴 3× over critical |
| **Full Page Load** | **6,506 ms** | < 2,500 ms | 🔴 2.6× over critical |
| **DOM Content Loaded** | 5,173 ms | < 2,000 ms | 🔴 over |
| Script Duration | 545 ms | < 250 ms | 🟡 over |
| Layout Count | 21 | < 10 | 🟡 over |
| JS Heap | 13.4 MB | < 30 MB | 🟢 OK |
| Resource Count | 121 | < 60 | 🔴 2× over |

Slowest individual resources, in order:

1. `Services.tsx` — 1,256 ms (loaded eagerly with main bundle)
2. `Portfolio.tsx` — 1,208 ms (eager)
3. `creek-logo-nav-sm.png` — **1,155 ms · 48 KB** (a 44×44px nav logo!)
4. `QuoteModal.tsx` — **1,038 ms · 37 KB · 879 lines** (loaded on every page even though it only opens on a CTA click)
5. Supabase media query for hero bleed — 1,038 ms

`public/creek-logo-square.png` is **1.4 MB uncompressed** (used somewhere in OG/socials), and `og-image.png` is 515 KB. Sums to ~1.9 MB of avoidable image weight even if not on the critical path.

96 script files load on `/`, including the entire admin section's deps (because `App.tsx` statically imports `Index`, `Services`, `Work`, `About`, `Contact` — each pulls its component tree, which pulls Supabase, framer-motion, etc.).

This is **not** a CSS or design problem anymore. It's a JS/asset payload problem. The cure is the same philosophy we applied to CSS: ship only what the user needs *now*, defer the rest.

---

## What v3 does

### Phase A — Code-split the public routes (biggest single win)

`src/App.tsx` currently does:

```tsx
import Index from "./pages/Index";
import Services from "./pages/Services";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
```

Every visitor downloads all five page bundles before anything paints. Switch to `React.lazy()` for the four non-home routes and wrap them in `<Suspense>` with a calm `<RouteSkeleton />` fallback (full-bleed `bg-background` + a `min-h-screen` div — zero layout shift, no spinner flash). Keep `Index` eager (it's the LCP route and the entrypoint) but lazy everything else.

**Predicted impact:** Removes ~150 KB of JS from the critical path. Cuts initial parse time by 200–400 ms.

### Phase B — Lazy-load `QuoteModal` (37 KB, 879 lines)

`QuoteModal` mounts on every page via `<App>` even though it only renders content when `openModal()` is called. Move it behind a `lazy()` boundary that only resolves when the modal first opens. The provider context stays eager (it owns the open/close state); only the heavy form ships when needed.

```tsx
const QuoteModal = lazy(() => import("@/components/quote/QuoteModal"));
// Inside provider, render:
{isOpen && (
  <Suspense fallback={null}>
    <QuoteModal />
  </Suspense>
)}
```

**Predicted impact:** −37 KB JS off every initial page load. The modal is still instant from the user's perspective (lazy chunk fetches in <100 ms on warm cache, and the open animation hides the fetch on cold cache).

### Phase C — Compress + retire the giant logos

Audit results:

| File | Size now | Target | Action |
|---|---|---|---|
| `public/creek-logo-square.png` | **1,379,935 B (1.4 MB)** | < 60 KB | Re-export at 512×512 PNG-8 + add a 256×256 webp; update OG/JSON-LD references |
| `public/og-image.png` | 515,160 B | < 200 KB | Re-encode as compressed JPG (OG accepts) or PNG-8 |
| `src/assets/creek-logo-nav-sm.png` | 49,132 B | < 8 KB | Re-export at 88×88 (2× of 44×44) PNG-8 with palette quantization, and add a `.webp` sibling |
| `src/assets/creek-logo-nav-md.png` | 82,865 B | (delete) | Nav uses `-sm` only — confirmed in `Navigation.tsx`; this file is dead weight in the asset pipeline |
| `src/assets/creek-logo-nav-lg.png` | 173,019 B | (delete) | Same — unused at nav scale |
| `src/assets/creek-logo-lg.png` | 294,033 B | Verify usage; if footer-only, downsize to 200×200 |
| `src/assets/creek-logo-profile-400.png` | 215,640 B | Used for JSON-LD profile image — verify; downsize to 256×256 if so |

Deletes are confirmed-safe via `rg` against `src/` and `index.html`. Everything else gets re-exported with `nix run nixpkgs#imagemagick` (palette quantization + strip metadata) and `nix run nixpkgs#libwebp` for `.webp` siblings. Components get a `<picture>` wrapper with `webp` first and `png` fallback.

**Predicted impact:** ~1.7 MB removed from project total; nav logo drops from 1,155 ms load to <100 ms; OG card weight halved.

### Phase D — Fix the render-blocking font request

The Google Fonts `<link>` is render-blocking. Two cheap improvements:

1. **Add `media="print" onload="this.media='all'"`** trick to make the stylesheet load non-blocking, with a `<noscript>` fallback for accessibility.
2. **Trim the DM Sans axis specification.** Right now we request the full optical-size + weight axes (`9..40,100..1000`). Audit reveals we use only weights 300, 400, 500, 600 — request a narrower range to cut the font file by ~40%.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link rel="stylesheet" href="…same url…" />
</noscript>
```

**Predicted impact:** −300–500 ms off FCP on cold loads.

### Phase E — Stop the QuoteModal CSS-effect leak

Hidden in v2: `cta-thermal::before` runs a 0.8 s pseudo-element animation on every CedarCTA hover. When `<TrustStrip>`, `<Hero>`, and `<Contact>` all render CTAs above the fold, the browser composites those layers eagerly. Add `will-change: transform; content-visibility: auto` to the modal trigger surfaces — and more importantly, apply `loading="lazy"` + `decoding="async"` to every secondary `<img>` (the hero is `priority`, but everything below should defer).

I'll also wrap the homepage's below-fold sections in `content-visibility: auto; contain-intrinsic-size: 600px;` (the existing memory `mem://standards/performance-rendering-strategy` already prescribes this — verify it's actually applied, fix if missing).

### Phase F — Silence the React Router warnings

Two console warnings on every load (`v7_startTransition`, `v7_relativeSplatPath`). Cosmetic, but a world-class console is empty. Add the `future` prop to `<BrowserRouter>`:

```tsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

### Phase G — Render the new perf measurements on `/style-guide`

The `/style-guide` Performance section currently shows targets vs. critical from `PERFORMANCE_BUDGETS`. Add a third column **"Last measured"** with the post-cleanup numbers, plus a tiny date stamp (`Measured 2026-04-26, mobile 4G simulated, /`). This makes the budgets *real*: any regression shows up in the column instead of in a forgotten lighthouse report.

Add a small `<PerfBadge>` component that color-codes the cell green/amber/red based on the threshold logic in `brand-identity.ts`.

---

## File-level change list

**Edit**
- `src/App.tsx` — lazy-load Services / Work / About / Contact; add Router future flags
- `src/components/quote/QuoteModalProvider.tsx` — lazy-load `QuoteModal`, render only when open
- `index.html` — async font load with noscript fallback; narrowed weight axis
- `src/components/Navigation.tsx` — `<picture>` wrapper for the nav logo (webp + png)
- `src/pages/Index.tsx` — confirm `content-visibility: auto` is applied to below-fold sections (it should be wrapping each `<section>` per memory; if not, add)
- `src/pages/StyleGuide.tsx` — add "Last measured" column + `<PerfBadge>` to the Performance section

**Re-encode (script-based, in `/tmp/`, output to project paths)**
- `public/creek-logo-square.png` — 1.4 MB → ~50 KB (PNG-8, 512×512)
- `public/og-image.png` — 515 KB → ~180 KB (compressed)
- `src/assets/creek-logo-nav-sm.png` — 48 KB → ~6 KB (PNG-8 at 88×88)
- Add `.webp` siblings for each that's used in components

**Delete (after `rg` confirms zero references)**
- `src/assets/creek-logo-nav-md.png`
- `src/assets/creek-logo-nav-lg.png`

**Memory updates**
- Update `mem://standards/performance-rendering-strategy` with the new measurements + the lazy-load policy ("home eager, every other route + modal lazy")
- Add a note to `mem://design/token-architecture` that `/style-guide` now displays live perf measurements

---

## Order of operations & verification

1. Phase A (route splits) — `tsc`, then re-profile `/`. Expected: FCP ~3,500 ms.
2. Phase B (modal split) — `tsc`, profile. Expected: FCP ~3,200 ms, modal still opens <200 ms on click.
3. Phase C (image surgery) — re-encode in `/tmp/`, copy in, verify each image renders correctly via `browser--screenshot` at desktop + mobile, profile. Expected: nav logo <100 ms, total transfer down ~1.5 MB on a hard refresh.
4. Phase D (font async) — profile. Expected: FCP <2,500 ms.
5. Phase E (visibility / lazy images) — profile, watch Layout Count drop from 21.
6. Phase F (router flags) — `read_console_logs` should return zero warnings.
7. Phase G (style-guide perf table) — visit `/style-guide#performance`, screenshot.
8. Final: re-run `browser--performance_profile` on `/` at 390×844 mobile viewport. Record the numbers in the new "Last measured" column. If any metric is still over **critical**, append a follow-up to this plan rather than declare victory.

---

## What this plan deliberately does NOT do

- **Doesn't migrate every component to import from `src/lib/*` yet.** That's the next sweep; forcing it here risks breaking working surfaces while we're surgically optimizing.
- **Doesn't replace framer-motion.** It's pulled in by 4 components, tree-shakes well, and `PageTransition` provides real value. Removing it is a bigger conversation about cinematic identity, not a perf fix.
- **Doesn't touch admin routes or edge functions.** They're already lazy and outside the public critical path.
- **Doesn't add a service worker / app shell.** Premature for a 5-page brochure site. Revisit if traffic ever justifies a PWA.
- **Doesn't introduce a CDN-level image transform.** The current asset pipeline (Vite + static files) is fine *if* the source files are properly sized. This plan fixes the source files, not the pipeline.

---

## Honest call I'm making

The biggest single win here is **route splitting (Phase A)** — by itself it likely cuts FCP by 1.5–2 seconds. The image surgery is high-effort, medium-impact (mostly OG/social weight, which doesn't touch FCP). I'm doing both because both are required to meet the budget, but if you want a faster ship I can land A + B + D in one pass and queue C / E / F / G as a follow-up. Default plan is to land all seven phases in one focused go.

When you approve, I'll execute in order: A → B → F → D → E → C → G → final perf snapshot rendered on `/style-guide`.