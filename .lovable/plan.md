
# Navigation v3 — Path-of-Least-Resistance Audit & Upgrade

I shipped v2 (registry + section rail + GlobalMenu) and then drove the live preview at four viewports and through the menu panel. **The architecture is right; the execution has 20 distinct friction points** that stop it from feeling Fantasy.co-grade. They cluster into four themes:

> 1. Header chrome reads as a pasted billboard, not as part of the brand surface
> 2. Wayfinding signals collide instead of layering (brand mark vs. section rail)
> 3. Mobile loses the conversion CTAs it most desperately needs
> 4. The GlobalMenu is hollow — a left-stack of links with empty space, not an editorial moment

This plan fixes every one of the 20 issues against named files and named pixels, in that priority order.

---

## The 20 audited issues, with evidence

| # | Where | What the user sees | Why it's wrong |
|---|---|---|---|
| 1 | Home, hero | Opaque cream header floats over a deep evergreen hero | Looks like a billboard pasted on top, not chrome belonging to the page |
| 2 | All pages, header | Brand mark + section rail share weight, color, tracking | "Where I am" and "what this is" compete for the same eye |
| 3 | Home, scrolled | Right cluster (phone + Quote) fades to 40% near footer | Primary CTA looks disabled exactly when conversion intent is highest |
| 4 | All pages, header | Border too soft (`border-border/50`) on cream surface | The chrome has no edge — it bleeds into the page below |
| 5 | All pages, header | Hamburger looks visually identical to a section anchor | Tier-2 entry point has no special affordance |
| 6 | GlobalMenu | Primary stack left-aligned, right 60% empty | Not "editorial three-column" — just a list with whitespace |
| 7 | GlobalMenu | No hero element, no logo, no warmth | Reads like an OS sheet, not a brand panel |
| 8 | GlobalMenu | "Services" appears in the primary stack AND as a column heading | Redundant — which one do I tap? |
| 9 | GlobalMenu | Service Areas is a flat 11-item list with no hierarchy | No "Calgary metro vs. Edmonton metro" grouping; no map cue |
| 10 | GlobalMenu | No active route indicator | User on `/` has no signal that "Home" is current |
| 11 | GlobalMenu | Phone in CTA bar has no padding/affordance | Reads as caption text, not a tappable phone link |
| 12 | GlobalMenu | Bronze rule under primary stack is ~80px wide, hugs left | Pretends to "underline" a column that isn't there |
| 13 | iPad 820px | Phone + brand stack + CTA + hamburger fight one row | Cramping the v1 audit already flagged |
| 14 | iPad 820px | Section rail hidden, no replacement | Tier-1 wayfinding evaporates between 768–1024px |
| 15 | Mobile 390px | Wordmark stack hidden by `compact` mode | First-time mobile visitor sees only logo crest, no brand name |
| 16 | Mobile 390px | Quote button is `hidden sm:inline-flex` (>640px only) | Mobile users have no in-chrome conversion CTA — measurable loss |
| 17 | Mobile 390px | Phone is `hidden md:inline-flex` (>768px only) | The device most likely to call has no tappable phone in chrome |
| 18 | /services, header | "CATALOGUE · FAQ" — two-item rail looks broken | Rail design was never meant for n=2; it looks unfinished |
| 19 | /services, hero | "HOME › SERVICES" breadcrumb hugs photo edge | Chrome and hero don't speak; breadcrumb is barely readable |
| 20 | All pages, brand | "CALGARY · EDMONTON" subtext duplicates hero eyebrow | Brand mark should say what the company *is*, not where it works |

---

## The fix — Nav v3

### A. Header chrome — commit to one philosophy (#1, #4)

**Decision: always-opaque cream chrome with a real edge,** not transparent-over-hero.
Reasoning: Creek's whole identity is editorial cream. Transparent chrome over the deep hero would cost us legibility and force a second light/dark color logic. We instead make the cream chrome *intentional* and architectural.

Concrete changes in `src/components/Navigation.tsx`:
- Default surface (above fold): `bg-background/95 backdrop-blur-[12px]` — strong but not flat.
- Scrolled state: same surface, but the bottom border deepens from `border-cedar/10` → `border-cedar/30` and a 1px shadow `shadow-[0_1px_0_0_rgba(0,0,0,0.04)]` appears underneath. So the user *feels* the threshold without a color flash.
- Replace `border-border/50` with `border-cedar/15` so the edge is always visible against cream.
- Add a 1px hairline at the *top* of the header in cedar — a tiny editorial cap that signals "this is the brand frame," same trick Royal uses with its gold rule.

### B. Wayfinding hierarchy — brand vs. rail vs. CTA (#2, #5, #20)

The three header zones get **distinct typographic identities** so the eye reads them in the right order:
1. **Brand mark (left)** — DM Serif Display "Creek Construction" at 18px, locale subtext replaced with a single italic eyebrow: *"Exterior Construction · est. 2019"*. Removes the city duplication (#20). Locale moves to the GlobalMenu where it belongs.
2. **Section rail (center)** — uppercase 10px tracked label switches from neutral gray to **cedar at 70% opacity** so it reads as "links" not "labels." Active state stays full cedar with the underline.
3. **Right cluster** — phone gets a 1px cedar dot before the digits (`· (780)…`); Quote CTA stays solid cedar; **hamburger gets a thin cedar border + label "MENU"** at 10px tracked text under the lines on `md+`. That gives Tier-2 a clear affordance distinct from anchors (#5).

### C. Footer fade — fix the disabled-CTA problem (#3)

Today: the entire right cluster fades to 40% near the footer.
**New behavior:** *only the section rail* fades. The phone, Quote CTA, and hamburger stay at 100% opacity all the way to the footer — they are conversion surfaces and must never look disabled. In `Navigation.tsx`, drop the `opacity-40` wrapper around the right cluster; keep `faded={isAtFooter}` only on `<SectionRail>`.

### D. Responsive — don't punish mobile (#13, #14, #15, #16, #17)

Three concrete breakpoint changes in `Navigation.tsx`:
- **Mobile (`<sm`)**: Show a compact "Quote" pill (`px-3 py-2 text-[10px]`) and a tap-to-call phone icon button (44x44, just the icon, no text) *before* the hamburger. So mobile chrome is: `[logo]   [📞] [Quote] [☰]`. Restores both conversion paths (#16, #17).
- **Mobile**: Bring back the wordmark — drop `compact` on `BrandMark`, just shrink it to `text-sm` on small screens. Visitors must always see the company name (#15).
- **Tablet (768–1023px)**: Introduce a **`md`-tier section rail** that shows up to 3 anchors as tight 11px tracked text, hidden behind a chevron disclosure if more. So /services (2 anchors) and /about (3 anchors) fit, /home (5 anchors) shows the first 3 + "more →" that opens the GlobalMenu pre-scrolled to a Sections section. Closes the wayfinding gap (#14) without cramming (#13).

### E. Two-anchor rail — treat n=2 with intention (#18)

Today: `SectionRail` renders any list ≥ 2. On `/services` that's "CATALOGUE · FAQ" — looks abandoned.

**Fix:** in `src/components/navigation/SectionRail.tsx`, when `sections.length === 2`, render a different layout: a small **left-anchored sub-route bar** below the main header with a leading "ON THIS PAGE →" eyebrow. Same anchors, same active logic, but visually framed as "this page has two stops" instead of pretending to be a 5-anchor rail. So:
- `n < 2` → renders nothing (current)
- `n == 2` → "ON THIS PAGE → CATALOGUE | FAQ" (left-anchored, lighter)
- `n >= 3` → centered editorial rail (current)

### F. Breadcrumb integration on sub-page heroes (#19)

The breadcrumb shouldn't be a separate floating layer over the hero photo. In `src/components/ui/page-hero.tsx` (the `cinematic-bleed` and `service-portrait` variants), move the breadcrumb up into the **header itself** as a left-anchored chip on routes that have one, sitting in the empty space the section rail would normally use when `n < 2`. So on `/services` the header center reads:
`[← Services] [section rail or "ON THIS PAGE → …"]`
The breadcrumb becomes part of the chrome, not the hero. Hero photo stays uncluttered.

### G. GlobalMenu redesign — make it an editorial moment (#6, #7, #8, #9, #10, #11, #12)

This is the largest change. Rebuild `src/components/navigation/GlobalMenu.tsx` as a **two-column editorial panel** instead of a full-width left stack.

```
┌───────────────────────────────────────────────────────────────────────┐
│  [✕ MENU]                                                              │
│                                                                        │
│  ┌─────────────────────────────────┬────────────────────────────────┐  │
│  │  PRIMARY ROUTES                 │  EDITORIAL HERO                │  │
│  │                                 │                                │  │
│  │  Home          ·  current       │  ┌──────────────────────────┐  │  │
│  │  Services                       │  │                          │  │  │
│  │  Our Work                       │  │   real project photo     │  │  │
│  │  About                          │  │   (random hero from db)  │  │  │
│  │  Contact                        │  │                          │  │  │
│  │                                 │  └──────────────────────────┘  │  │
│  │  ─── BRONZE RULE                │  "Calgary · 2025 · Cedar deck" │  │
│  │                                 │                                │  │
│  │  SERVICES                       │  ┌──────────────────────────┐  │  │
│  │  Decks · Fencing · Sheds · …    │  │  WHERE WE BUILD          │  │  │
│  │  (chips, not a list — opens     │  │                          │  │  │
│  │   QuoteModal pre-filtered)      │  │  CALGARY METRO           │  │  │
│  │                                 │  │  • Calgary  · home base  │  │  │
│  │                                 │  │  • Airdrie               │  │  │
│  │                                 │  │  • Cochrane · Okotoks    │  │  │
│  │                                 │  │                          │  │  │
│  │                                 │  │  EDMONTON METRO          │  │  │
│  │                                 │  │  • Edmonton              │  │  │
│  │                                 │  │  • St. Albert · Sherwood │  │  │
│  │                                 │  │    Park · Spruce Grove   │  │  │
│  │                                 │  └──────────────────────────┘  │  │
│  └─────────────────────────────────┴────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ✓ WCB · Insured · Locally owned    📞 (780) …    [Request Quote]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

Specifically:
- **Active route badge** on the matching primary link (`· current` in 10px cedar tracked text) — fixes #10.
- **Services** removed from the primary stack and moved to a chip cluster below the bronze rule — chips are visually distinct from routes, so no "which one do I tap?" confusion (#8).
- **Bronze rule** spans the column it lives in (full width inside the left column), no longer 80px orphan (#12).
- **Right column** holds the editorial hero: a real `MediaSlot` query for `shot_type: ['hero','wide']`, randomized per open. Reuses the `hero-provenance-card` pattern below it ("Calgary · 2025 · Cedar deck"). Solves #6, #7 in one move.
- **Service areas grouped** into Calgary Metro and Edmonton Metro, with Calgary tagged "home base" — gives a mental map (#9).
- **Bottom CTA bar redesigned**: trust strip on left, a real `<a href="tel:">` with phone icon and 44px hit area in the middle, cedar Quote button on the right. The phone is now obviously tappable (#11).
- Mobile (`<md`): the editorial right column collapses below the primary stack, and the service-areas grouping becomes a 2-column compact list. Trust bar wraps gracefully.

### H. Motion & accessibility polish

- The new "MENU" label fades in only after `isScrolled` so the header has *one extra signal* you've left the hero — subtle but premium.
- Chip cluster in the menu uses `--kinetic-delay` so the existing stagger orchestration applies.
- Active-route badge uses `aria-current="page"` (was missing).
- Footer fade now applies `aria-hidden="true"` to the rail when fully faded so screen readers don't read invisible links.
- The new `md`-tier rail respects `prefers-reduced-motion` (no chevron animation).

---

## File plan

### Edited
- `src/components/Navigation.tsx` — chrome philosophy (A), wayfinding hierarchy (B), footer fade scope (C), full responsive cluster rebuild (D), top hairline + bottom border treatment.
- `src/components/navigation/BrandMark.tsx` — replace city subtext with eyebrow (#20), keep wordmark on mobile (#15), remove `compact` prop usage in chrome.
- `src/components/navigation/SectionRail.tsx` — split renderer into n=2 vs n≥3 layouts (#18); add `md`-tier compact mode (#14); add `aria-hidden` when fully faded.
- `src/components/navigation/MenuTrigger.tsx` — add optional "MENU" label slot (#5), border treatment, a tiny cedar dot indicator that pulses 1× when a new GlobalMenu opens for the first time per session.
- `src/components/navigation/GlobalMenu.tsx` — full rewrite per section G; uses `MediaSlot` for the editorial hero, groups service areas, renders Services as chips, marks active route.
- `src/components/ui/page-hero.tsx` — move breadcrumb out of hero photo, into chrome (F). The `cinematic-bleed` and `service-portrait` variants drop their inline `BreadcrumbTrail`.
- `src/lib/page-sections.ts` — no schema change; just a comment documenting the n=2 vs n≥3 contract so future contributors don't add 2-anchor pages thinking they'll get the centered rail.
- `src/index.css` — top hairline `body::before` with cedar/40 1px line (or done in the header itself).

### New
- `src/components/navigation/HeaderBreadcrumb.tsx` — small chip-style breadcrumb that lives inside the header for routes that have one, drawn from React Router location.
- `src/components/navigation/SectionRailCompact.tsx` — the n=2 / md-tier compact variant. Kept separate from the editorial rail to avoid a god-component.

### Memory
- Update `mem://features/navigation-architecture.md` with the n=2 vs n≥3 contract, the "footer fade scope = rail only" rule, and the chrome-philosophy decision (always-opaque cream).
- Update `mem://index.md` core line to mention always-opaque chrome and mobile CTA persistence (the two rules with the highest blast radius).

---

## QA matrix (pre-merge)

| Viewport | Page | What I'll verify |
|---|---|---|
| 1920 | / | Centered 5-anchor rail; brand eyebrow shows; cedar hairline visible; hamburger has MENU label after scroll |
| 1920 | /services | "ON THIS PAGE →" left-anchored 2-stop bar; breadcrumb chip in header center area |
| 1366 | /about | 3-anchor centered rail still fits; no truncation |
| 820 (iPad) | / | 3-anchor compact rail with "more →"; phone + Quote + hamburger don't fight |
| 820 | /services | n=2 compact bar; everything has breathing room |
| 414 / 390 | / | `[logo+name]  [📞] [Quote] [☰]` — all four visible, all 44x44 |
| 390 | menu open | Two-column collapses to single column; service-areas grouped into 2-column compact list; trust bar wraps clean; bottom CTA full-width sticky |
| Reduced motion | all | No chevron, no stagger, no Ken Burns; instant chrome transitions |
| Keyboard only | all | Tab through chrome, Enter on hamburger opens menu, Tab cycles inside, Esc closes, focus returns to hamburger |
| Screen reader | menu open | "Site menu, dialog. Home — current page" reads correctly; faded rail does not announce stale links |
| Footer fade | all | Section rail fades; phone + CTA + hamburger stay at 100% opacity |

---

## Rollout sequence

1. Header chrome (A, B, C) — invisible architectural foundation
2. Responsive cluster (D) — restores mobile CTAs immediately
3. Section rail variants (E) — n=2 layout + md-tier compact
4. Breadcrumb relocation (F) — single PageHero edit
5. GlobalMenu rewrite (G) — the largest visual upgrade
6. Memory + QA pass

After approval I execute these in order in default mode and re-run the live audit at the same four viewports to verify each issue is closed.
