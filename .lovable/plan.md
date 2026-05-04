# Pass 5 — sitewide consistency sweep

The collapsed-page bug from Pass 4 is fixed and verified at 390×844. Now an in-depth scan for **anything one page does that other pages should copy** — the brief is "looks like fantasy.co", which means the page-to-page rhythm has to feel like the same hand wrote every screen.

Three real leaks. All small, all mechanical, all worth fixing in one pass.

## What's inconsistent today

### 1. The closer ask changes copy on three pages
Every page ends with `<QuoteCloserCard />`, which is the right pattern. But three pages override the canonical copy with bespoke wording:

| Page | Heading | Body |
|---|---|---|
| `/` (Index) | "Let's build something right." | "Tell us about your project — size, timing…" |
| `/work` | "Want work like this?" | "Tell us what you have in mind. 30 seconds…" |
| `/about` | "Ready to start the conversation?" | "Tell us what you're building. It takes 30 seconds…" |
| `/services` | *(default)* "Send us your project details." | *(default)* |
| `/contact` | *(default, inline)* | *(default)* |

Three different headlines for the same ask breaks the funnel's muscle memory. Fantasy.co's strength is that the closing ask reads identically every time you scroll to it.

**Fix:** keep ONE canonical headline + body site-wide. Use `eyebrow` overrides only (e.g. "Up next", "What's next", "Quote a similar build") so each page still has a thread of context, but the big serif line and supporting paragraph stay locked.

### 2. The Creek Process is duplicated in two files with different copy

- `src/components/About.tsx` (homepage section) — 5 steps, terse copy ("Tell us what you're building. Takes two minutes.")
- `src/pages/About.tsx` (About page) — 5 steps, longer copy ("Tell us what you're building. Online form, a call, or a text…")

Two sources of truth means they will drift further. They already have.

**Fix:** extract to `src/config/process.ts` as the single source. Both renderers import from it. Use the longer, more confident copy from `/about` everywhere — it sells better.

### 3. The dark footer closer has no trust signals
`QuoteCloserCard` renders four trust chips (WCB Covered · Fully Insured · 24-hour reply · No obligation) under its CTA. The hero band shows the same chips. The footer's tertiary CTA strip ("Free quote in 30 seconds. No obligation.") shows none — it's the only conversion surface on the site without the trust line.

**Fix:** add the same `TRUST_SIGNALS` row above (or beside) the footer's `<CedarCTA />`, dark-mode tinted. Same icons, same labels, same order.

## Files to touch

```text
src/config/process.ts          NEW — single source for the 5 steps
src/components/About.tsx       import STEPS from config; delete local copy
src/pages/About.tsx            import STEPS from config; delete local copy
src/components/Contact.tsx     remove heading/body overrides
src/pages/Work.tsx             remove heading/body overrides on closer
src/pages/About.tsx            remove heading/body overrides on closer
src/components/Footer.tsx      add TRUST_SIGNALS strip above tertiary CTA
```

No new dependencies. No layout shift. No behavioural changes to the funnel — only copy and visual unification.

## What this is explicitly NOT doing

- Not redesigning any hero. The four hero variants (`architect-bleed`, `cinematic-bleed`, `evergreen-typographic`, `service-portrait`) are intentional editorial signatures per route — leaving them.
- Not touching Pass 4's mobile fixes.
- Not adding new sections. The page count and section count stay identical.
- Not changing the QuoteModal, the Navigation, or the FAB.

After this pass the site will have: one closer headline, one process definition, one trust line — repeated everywhere the user might convert.
