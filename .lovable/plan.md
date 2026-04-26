
## UX Audit — what's failing right now

I traced every nav touchpoint on Creek and compared it to the RoyalMechanical reference (which uses a clean two-tier system: per-page section anchors in the header, and a fullscreen hamburger panel for global navigation). Here is what is creating friction today:

| # | Friction point | Why it hurts | Evidence |
|---|---|---|---|
| 1 | **No section wayfinding.** Home has 8 scrollable sections; nav only shows 5 page links. | Visitor scrolls 4,000 px without ever knowing how far they are or how to jump back. Violates IDEO's "where am I" heuristic. | `src/pages/Index.tsx` renders Hero → TrustStrip → EditorialBleed → Services → About → Testimonials → FeaturedProjects → Portfolio → FieldClips → Contact, but `Navigation.tsx` is route-only. |
| 2 | **Sub-pages have no jump targets.** `/services` has FAQ at the bottom; `/work` has Gallery; users must scroll the entire page. | Highest-intent users (FAQ, Gallery) get punished. | `Services.tsx` lines 63 & 92 — sections exist but no anchor in the header. |
| 3 | **Inconsistent section IDs.** Home sections use `id="section-services"`. Sub-pages use `aria-labelledby` with no scrollable ID. | An anchor rail can't latch on. | `About.tsx` lines 42/73/108, `Services.tsx` lines 63/92, `Work.tsx` lines 72/120, `Contact.tsx` line 38. |
| 4 | **Mobile menu is a flat list.** Just 5 links + a CTA. No services catalog, no service-area cities, no proof. | Royal's fullscreen menu surfaces 5 services × 7 cities × 5 company pages in one tap. Creek surfaces 5. | `Navigation.tsx` lines 100–134. |
| 5 | **Cramped tablet (768–1023 px).** Logo + 5 links + phone + CTA + hamburger contend for one 64 px row. | Below `lg` the desktop nav hides (good), but phone + CTA + brand stack still wrap at 820 px. | `Navigation.tsx` `hidden lg:flex` — there is no md-tier compromise. |
| 6 | **Subtle active state.** `after:w-6` is a 24 px underline — invisible during peripheral scan. | Royal uses a full-width `scale-x-100` line that draws clearly on hover/active. | `Navigation.tsx` line 64. |
| 7 | **No "scroll progress" awareness.** Header is opaque from frame 1; never reacts to where the user is. | Royal fades chrome away near the footer to give the gold CTA room. | `Navigation.tsx` line 41 — `bg-background/85` is static. |

---

## Design — Creek's two-tier nav, world-class build

The pattern: the **header becomes a per-page section rail** (like Royal), and a **fullscreen panel behind a hamburger** holds the full global IA. The brand mark and the conversion CTA stay constant. Everything else adapts to context.

### Tier 1 — Sticky header (always visible, 64–80 px)

Layout, left → right:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [▣ Creek Construction]   Services · About · Reviews · Work · Contact   ☎  Quote  ☰ │
│   ↑ logo + locale         ↑ section rail (changes per page)        ↑ persistent │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Brand mark (left).** Same logo + "Calgary · Edmonton" subtext. Always links to `/`. Min-height 44 px touch target preserved.
- **Section rail (center).** New. Renders the in-page section anchors for the current route, pulled from a single registry. Active section gets a full-width cedar underline that scales in (`scale-x-100 origin-left transition-transform duration-500`). Hover scales the same line in from `scale-x-0`. Hidden below `lg`.
- **Right cluster.** Phone number (md+), "Request a Quote" CTA (sm+), hamburger (always visible — even on desktop, mirroring Royal's pattern). The hamburger is what unlocks the global menu, even when the section rail is busy.
- **Scroll-reactive chrome.** Above the fold the header is `bg-background/0`; after `scrollY > 32` it transitions to `bg-background/85 backdrop-blur` with a hairline border. Smooth `transition: background-color 400ms`.
- **Footer fade.** When the footer enters view (`IntersectionObserver` on `#siteFooter`), the section rail and phone link fade to `opacity: 0` to give the footer's own conversion moment full focus. Same trick Royal uses.

### Tier 2 — Fullscreen menu (behind ☰)

A modal `dialog` that takes the full viewport with `bg-background backdrop-blur-xl`. Editorial three-column grid on `md+`, single column with disclosure groups on mobile. Composition top-down:

1. **Top bar** — close button (animated hamburger ↔ X), top-right, 48 × 48 px.
2. **Primary route** — "Home" rendered as a 56 px DM Serif Display oversized link, italic cedar underline draws on focus/hover. (Royal uses this single primary anchor at the top of the panel.)
3. **Hairline cedar divider** at `bg-cedar/15`.
4. **Three columns** (md+):
   - **Services** — Decks · Fencing · Sheds · Painting · Siding · Pergolas (drawn from `src/config/services.ts`, each link opens the QuoteModal pre-filtered to that service via `openModal([service.id])` for a one-tap conversion path).
   - **Service Areas** — Calgary · Edmonton · Airdrie · Cochrane · Okotoks · Red Deer · "Other Alberta" (drawn from `CONTACT.cities` in `src/config/contact.ts`). Calgary gets a "Home Base" badge.
   - **Company** — Our Work · About · Style Guide (admin only) · Contact · FAQ.
5. **Footer of panel** — left: WCB / Insured trust chip + "Established 2019". Right: "Request a Quote" cedar CTA + tel link. `padding-bottom: max(2rem, env(safe-area-inset-bottom))` for iPhone notch safety.
6. **Stagger reveal** — each row uses `animation-delay: 100ms + index * 30ms` for a calm 600 ms cascade. Respects `prefers-reduced-motion: reduce`.

### Information architecture (the section registry)

A single `src/lib/page-sections.ts` file becomes the source of truth — the same pattern Royal uses in `src/lib/navigation.ts`:

```ts
// Per-route section anchors. Add a route, you get a rail.
export const PAGE_SECTIONS: Record<string, PageSection[]> = {
  '/': [
    { name: 'Services',  anchor: 'section-services' },
    { name: 'About',     anchor: 'section-about' },
    { name: 'Reviews',   anchor: 'section-testimonials' },
    { name: 'Work',      anchor: 'section-featured' },
    { name: 'Contact',   anchor: 'section-contact' },
  ],
  '/services': [
    { name: 'Catalogue', anchor: 'section-catalogue' },
    { name: 'Process',   anchor: 'section-process' },
    { name: 'FAQ',       anchor: 'section-faq' },
  ],
  '/work': [
    { name: 'Featured',  anchor: 'section-featured' },
    { name: 'Gallery',   anchor: 'section-gallery' },
    { name: 'Recap',     anchor: 'section-recap' },
  ],
  '/about': [
    { name: 'Story',     anchor: 'section-story' },
    { name: 'Process',   anchor: 'section-process' },
    { name: 'Areas',     anchor: 'section-areas' },
  ],
  '/contact': [
    { name: 'Form',      anchor: 'section-contact' },
    { name: 'Visit',     anchor: 'section-visit' },
  ],
};
```

Pages with fewer than 2 anchors return `[]` and the header center collapses gracefully (logo + CTA still anchor the layout).

---

## File plan

### New files
- **`src/lib/page-sections.ts`** — registry above + `getPageSections(pathname)` helper.
- **`src/hooks/useActiveSection.ts`** — `IntersectionObserver` (threshold 0.3, rootMargin `-72px 0 0 0`) returning the topmost visible anchor. Mirrors Royal's hook but tuned for Creek's 80 px desktop header.
- **`src/hooks/useScrollChrome.ts`** — returns `{ isScrolled, isAtFooter }`. `isScrolled` flips at `scrollY > 32`, throttled with `requestAnimationFrame`. `isAtFooter` watches `#siteFooter` via IO.
- **`src/components/navigation/SectionRail.tsx`** — desktop center rail. Renders `PageSection[]`, smooth-scrolls on click with `-72px` offset, sets `aria-current="location"` on active.
- **`src/components/navigation/GlobalMenu.tsx`** — fullscreen dialog. Three-column editorial layout, focus trap via existing focus-management pattern, ESC + backdrop close, body-scroll lock.
- **`src/components/navigation/MenuTrigger.tsx`** — animated hamburger ↔ X, 48 × 48 px touch target, `aria-expanded` + `aria-controls`.
- **`src/components/navigation/BrandMark.tsx`** — extracted from current `Navigation.tsx` so the header stays declarative.

### Edited files
- **`src/components/Navigation.tsx`** — rewritten as a thin shell: `<header><BrandMark /><SectionRail /><RightCluster /></header><GlobalMenu />`. Drops the inline mobile drawer (replaced by `GlobalMenu`).
- **`src/components/Services.tsx`** — already has `id="section-services"`; verify offset works.
- **`src/components/About.tsx`, `Testimonials.tsx`, `FeaturedProjects.tsx`, `Contact.tsx`** — already have `id="section-*"`. No change.
- **`src/pages/Services.tsx`** — wrap the catalogue, process strip, and FAQ blocks with `id="section-catalogue"`, `id="section-process"`, `id="section-faq"` on the existing `<section>` elements (lines 63, 92, plus a new process anchor).
- **`src/pages/Work.tsx`** — add `id="section-featured"`, `id="section-gallery"`, `id="section-recap"` to the existing sections (lines 72, 120, plus recap strip).
- **`src/pages/About.tsx`** — add `id="section-story"`, `id="section-process"`, `id="section-areas"` (lines 42, 73, 108).
- **`src/pages/Contact.tsx`** — add `id="section-contact"` and `id="section-visit"` to existing blocks.
- **`src/index.css`** — add `scroll-margin-top: 80px` to all `[id^="section-"]` so anchor jumps land below the sticky header. Add `@media (max-width: 640px) { scroll-margin-top: 64px; }`.

### Memory updates
- **`mem://design/navigation-architecture.md`** (new) — documents the two-tier system, the registry contract, the offset math, and "do not add a third nav layer" constraint.
- **`mem://index.md`** — add core line: "Two-tier nav — section rail per page + fullscreen global menu. Section IDs follow `section-*` and live in `src/lib/page-sections.ts`."

---

## Motion & interaction spec

| Element | Trigger | Animation | Duration / easing |
|---|---|---|---|
| Header background | `scrollY > 32` | bg `0%` → `85%`, `backdrop-blur 0 → 8px` | 400 ms `ease-out` |
| Section rail underline | hover / active | `scale-x: 0 → 1`, origin-left | 500 ms `cubic-bezier(0.16, 1, 0.3, 1)` |
| Hamburger ↔ X | click | three lines morph (rotate + translate) | 350 ms `ease-out` |
| Global menu open | click hamburger | backdrop fade-in (200 ms) → panel scale-in (`scale 0.98 → 1`, opacity 0 → 1) (350 ms) | staged |
| Menu rows | open | stagger 30 ms, `translateY 8 → 0`, `opacity 0 → 1` | 300 ms each |
| Section rail at footer | `#siteFooter` IO ratio > 0.3 | `opacity 1 → 0`, `pointer-events: none` | 500 ms ease |
| All animations | `prefers-reduced-motion: reduce` | clamped to 50 ms or removed | n/a |

---

## Accessibility contract

- **Touch targets** — every interactive element ≥ 44 × 44 px (WCAG 2.5.8). Hamburger and close are 48 × 48 px.
- **Focus management** — opening menu moves focus to close button. Closing returns focus to hamburger. Focus trapped inside menu via existing pattern.
- **Keyboard** — `Esc` closes menu; `Tab` cycles inside; section rail anchors are real `<a href="#…">` so `Enter` works.
- **ARIA** — section rail is `<nav aria-label="Page sections">` with `aria-current="location"` on active. Menu is `role="dialog" aria-modal="true" aria-label="Site navigation"`.
- **Contrast** — section labels at `text-foreground/70` resolve to ≥ 4.5:1 on `bg-background`; active state at `text-cedar` ≥ 4.5:1.
- **Reduced motion** — every animation listed above gates on `prefers-reduced-motion`. The chrome fade and stagger become instant.
- **Screen reader** — hamburger reads "Open site menu, 5 sections available". Active section announced as "Current section: About".

---

## Performance contract

- **JS budget** — new code ≈ 6 KB gzipped (registry + 2 hooks + 4 components). Within `< 200 KB JS` budget.
- **No layout shift** — header reserves 80 px desktop / 64 px mobile from frame 1 (already true, preserved).
- **Throttled scroll** — `useScrollChrome` uses one `requestAnimationFrame` loop, not a per-frame React re-render. `useActiveSection` uses IO (no scroll listener).
- **Lazy menu content** — `GlobalMenu` renders nothing when closed (`if (!isOpen) return null`) so the staggered children never mount until needed.
- **Body-scroll lock** — uses a refcounted helper so the QuoteModal and the menu can coexist without stranding `overflow: hidden`.

---

## QA matrix (pre-launch)

| Viewport | Check |
|---|---|
| 1920 × 1080 | Section rail centers; underline animates; phone + CTA + hamburger all visible. |
| 1366 × 768 | Section rail still fits without truncation. |
| 1024 × 768 | Section rail still shown (lg breakpoint). |
| 820 × 1180 (iPad) | Section rail collapses; hamburger + CTA only; no overlap. |
| 414 × 896 (iPhone XR) | Header 64 px; hamburger 48 × 48; menu fills viewport; safe-area respected. |
| 360 × 800 (Android) | Same as above; tap-target spacing verified. |
| Reduced motion | All animations clamped. |
| Keyboard only | Tab order: skip-link → logo → section rail → phone → CTA → hamburger. ESC closes menu. |
| Screen reader (VO + NVDA) | Active section announced; menu trap announced. |

---

## Out of scope (intentionally not in this pass)

- A QuickNav slash-launcher (existing `QuickNav.tsx` is dead code; flag for removal in a separate cleanup pass).
- Mega-menu hover panels on desktop (Royal pattern is hamburger-only and we want to preserve the editorial hush).
- Breadcrumbs in the header (already handled inside hero variants by `BreadcrumbTrail`).

---

## Rollout sequence (single approval, multiple commits)

1. Land the registry + hooks + section IDs (no UI change yet — invisible foundation).
2. Land `BrandMark`, `MenuTrigger`, `SectionRail`, `GlobalMenu` components.
3. Rewrite `Navigation.tsx` to compose them. Remove the inline mobile drawer.
4. Add `scroll-margin-top` to `index.css`.
5. Update memory files.
6. Manual QA against the matrix above; verify every existing route still navigates.

After approval I will execute these in order in default mode.
