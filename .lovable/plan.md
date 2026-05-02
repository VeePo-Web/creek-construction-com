## Pass 2 — visual & interaction polish (real issues found in preview)

I scanned the live preview at 390×844 (iPhone) plus the full codebase against the consistency contract from pass 1. Found four concrete defects that contradict "professional · sleek · easy to use." Each fix is mechanical and isolated.

---

### 1. Mobile hero headline is being clipped — highest priority

At 390px the homepage hero shows `Excellenc` cut off on the right (screenshot confirmed). The brand promise is literally severed. Cause: `fontSize: clamp(3.25rem, 8vw, 8.25rem)` floors at **52px**, but the container is only ~358px wide and the word "Excellence" (10 chars) needs ~280px alone — and the surrounding `max-w-[18ch]` gives the wrapper headroom that doesn't actually exist on a phone.

**Fix in `src/components/ui/page-hero.tsx`** (architect-bleed variant only):

- Lower clamp floor: `clamp(2.5rem, 9vw, 8.25rem)` — 40px on small phones, scales identically on desktop.
- Tighten container ladder: `max-w-[14ch] sm:max-w-[18ch] md:max-w-[20ch]` so the wrapper never reserves more horizontal room than the viewport actually gives.

No other page is affected (only the homepage uses architect-bleed).

### 2. Trust label casing disagrees across surfaces

The user sees three different versions of the same trust line:

- `Hero.tsx` post-hero band: `"WCB covered"`, `"Fully insured"` (sentence case)
- `trust-signals.ts` / `QuoteCloserCard` / `StyleGuide`: `"WCB Covered"`, `"Fully Insured"` (Title Case)
- `GlobalMenu.tsx` bottom CTA bar: `"WCB covered · Fully insured · Locally owned"` (sentence case + wrong third item)

**Fix:**

- `src/components/Hero.tsx` — delete the local `TRUST_ITEMS` array; map over `TRUST_SIGNALS` from `@/config/trust-signals` (drops the first 3 for the hero band — `Locally owned` was a brand attribute, not a trust signal, and is already covered by the footer).
- `src/components/navigation/GlobalMenu.tsx` line 414 — replace the hand-written string with `TRUST_LINE` from `@/config/trust-signals`.

Result: one casing, one source of truth, three surfaces in sync.

### 3. Animated `box-shadow` still on five public-facing components

Pass 1 only stripped it from About step rows. These also animate shadow on hover, which is one of the most expensive CSS properties (forces full repaints):

- `src/components/ui/project-tile.tsx:183` — every project tile on `/work`
- `src/components/ui/service-tile.tsx:54` — service tiles
- `src/components/ui/stat-trio.tsx:72` — `card` variant in proof bands
- `src/components/ui/faq-accordion.tsx:34` — every FAQ row on `/services`
- `src/components/ui/card-premium.tsx:11` (foundation, interactive variants)
- `src/lib/motion.ts:74` (`HOVER.cardLift` token)
- `src/lib/colors.ts:275` (`BUTTON.primary.transition` — animates the thermal CTA shadow on every primary button)

**Fix pattern (same in all six files):**

- Remove `box-shadow` from the `transition-[…]` list.
- Replace `hover:shadow-elevated` with `hover:border-cedar/30` (or keep an existing border-color hover; effect is similar but compositor-only).
- Keep the resting `shadow-contact` — that's static, no repaint cost.

For the CTA button token, drop the animated `box-shadow` from the transition; the thermal shimmer (`.cta-thermal` CSS gradient) carries the visual hover affordance. The shadow stays static.

Net effect: ~6 fewer style recalcs per scroll on long pages with many tiles, no visible change in resting state.

### 4. PageHero variant audit — no change required

Each public page uses a different PageHero variant (`architect-bleed` home, `service-portrait` services, `cinematic-bleed` work, `evergreen-typographic` about + contact). This *looks* inconsistent in the source, but in practice each variant carries the same five-element vocabulary (eyebrow → headline → italic → subtitle → CTA row) and the same brand tokens. They give each page a distinct cinematic identity, not a visual mismatch. **Leave as-is.**

### Files

```text
EDIT  src/components/ui/page-hero.tsx        architect-bleed: clamp floor + container ladder
EDIT  src/components/Hero.tsx                pull trust items from TRUST_SIGNALS
EDIT  src/components/navigation/GlobalMenu.tsx  pull trust line from TRUST_LINE
EDIT  src/components/ui/project-tile.tsx     drop animated box-shadow
EDIT  src/components/ui/service-tile.tsx     drop animated box-shadow
EDIT  src/components/ui/stat-trio.tsx        drop animated box-shadow
EDIT  src/components/ui/faq-accordion.tsx    drop animated box-shadow
EDIT  src/components/ui/card-premium.tsx     drop animated box-shadow (2 variants)
EDIT  src/lib/motion.ts                      HOVER.cardLift token: drop animated box-shadow
EDIT  src/lib/colors.ts                      BUTTON.primary.transition: drop animated box-shadow
```

10 file edits. No new files, no deps, no DB.

### What this delivers

- The hero headline reads cleanly on every iPhone (no more severed brand promise).
- Same trust line in the same casing on the hero band, the QuoteCloserCard, the GlobalMenu, the Footer, and the StyleGuide.
- Smoother scroll on `/services` and `/work` (the longest pages) — primary bottleneck is the FAQ accordion + project tile shadow animations.

### Out of scope (intentionally)

- PageHero variant unification (each variant earns its keep — see §4).
- The QuoteModal, services taxonomy, brand tokens, fonts, colors, routing, lazy-loading topology.
