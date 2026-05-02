## Site-wide funnel & consistency pass

**Goal**: every page is a clean runway from "I landed" → "I tapped Get my free quote." Five descriptors: professional, minimalistic, sleek, performance-optimized, easy-to-use. CTA wording, trust signals, and visual rhythm must be identical across all five public pages — Fantasy.co-level consistency.

I read every public page, every shared component, and every CTA call site. Here is what is inconsistent and exactly what to do.

---

### What's already strong (don't touch)

- `QuoteModal` — single-screen, phone-first, dynamic CTA copy.
- `MobileQuoteFAB` — sticky pill, hides inside `#section-contact`, respects safe area.
- `Navigation` — always-opaque cream chrome with persistent Quote button.
- `SERVICE_GROUPS` / `SERVICE_ITEMS` — single source of truth.
- Lazy-loading topology (only Home is eager).

### Funnel & consistency problems found

**1. CTA copy is fractured.** The QuoteModal says **"Get my free quote"** but every CedarCTA across the site still says **"Request a Quote."** Three different phrasings (`Request a Quote`, `Free quote`, `Get my free quote`) for one action. Fantasy.co uses one phrase everywhere. Fix.

**2. Hero CTA is styled as a ghost button.** `Hero.tsx` overrides CedarCTA to `!bg-transparent !border-white/70`. On the dark architect hero this reads as the *secondary* style. The single most important conversion button on the site looks secondary. Fix: solid cedar pill on the architect hero (cedar reads cleanly against B/W).

**3. Trust signals appear three times in the first 800px of the homepage.** Hero internal trust chips (inside PageHero) → `HeroTrustStrip` (post-hero icon row) → `TrustStrip` (`bg-secondary`, byline). Three trust bands stacked. **Delete `TrustStrip`** — it duplicates words already in `HeroTrustStrip`.

**4. The homepage `Contact` section is the weakest closer on the site.** The `/contact` page has a stunning evergreen "What's next" card (cedar border, bullet list, primary CedarCTA). The homepage — the page guaranteed to be seen — uses a weaker side-by-side text + contact panel layout. The strongest closer should live on the homepage too.

**5. Service tile CTAs disagree with the modal they open.** `Services.tsx` line 96 says **"Request a Quote →"** but clicking the tile opens the modal with **no preselection** (`openModal([])`) — the user has to pick a service inside the modal anyway. One tap should equal "modal open with this group's services preselected."

**6. `/work` page has no real inline funnel.** The "Quote a similar build" link below each project is hairline text — looks like a footnote, not a CTA. Should be a proper CedarCTA.

**7. `/services` catalogue takes ~1400px of scroll before the next CTA appears.** Inject one CedarCTA strip mid-catalogue (after group 3) so the user never has to scroll to find the funnel entry.

**8. `/about` PageHero has no primary CTA.** Compare with `/services` (which passes `<CedarCTA>` as `children`). Every public PageHero on the site should carry the primary CTA — that is the funnel rule.

**9. `EditorialBleedSection` on the homepage silently renders nothing if no approved hero photo exists.** That's a silent fail that breaks rhythm. Add a quiet bronze-rule + eyebrow fallback so the slot always anchors visually.

**10. Footer CTA copy ("Ready to start? Tell us about your project.") doesn't match anywhere else.** Standardize.

**11. Mobile FAB only hides on `#section-contact`** — on `/services` it stacks on top of the page-bottom CedarCTA. Fix by observing `[data-quote-cta]` (added to every CedarCTA wrapper) so the FAB hides whenever any in-page primary CTA is on screen.

### The consistency contract (Fantasy.co-style standardization)

- **One CTA phrase**, everywhere: **`Get my free quote`** (matches the modal it opens).
- **One CTA visual**: solid cedar pill (`CedarCTA` default). The ghost variant is removed entirely.
- **One trust line**: `WCB Covered · Fully Insured · 24-hour reply · No obligation` — used in (a) below-hero strip, (b) modal footer, (c) footer rail. Single source `src/config/trust-signals.ts`.
- **One closer pattern**: the evergreen "What's next" card from `/contact` becomes a shared `<QuoteCloserCard />` used on Home, Services (bottom), About (bottom), Work (bottom), and Contact.
- **Every public PageHero gets a CTA**: enforced by passing `<CedarCTA>` as children on About (currently missing).
- **Every page = same five-band rhythm**: `Hero → trust strip → page-unique content → photo bleed → page-unique content → QuoteCloserCard → Footer`.

### Files to change

```text
NEW   src/config/trust-signals.ts          single source for trust copy
NEW   src/components/QuoteCloserCard.tsx   extracted from /contact's evergreen card

EDIT  src/components/CedarCTA.tsx          default label → "Get my free quote";
                                            wrap root in [data-quote-cta] for FAB
EDIT  src/components/Hero.tsx              remove ghost override; combine the two
                                            post-hero strips into one section
EDIT  src/components/TrustStrip.tsx        delete (or no-op) — replaced by HeroTrustStrip
EDIT  src/components/Contact.tsx           homepage closer → <QuoteCloserCard />
EDIT  src/components/Services.tsx          tile click preselects that group's items;
                                            tile copy → "Quote this →"
EDIT  src/components/Footer.tsx            italic closer line standardized
EDIT  src/components/MobileQuoteFAB.tsx    observe [data-quote-cta] not #section-contact
EDIT  src/components/media/EditorialBleedSection.tsx
                                            add fallback prop (bronze rule + eyebrow)

EDIT  src/pages/Index.tsx                  remove <TrustStrip />; pass fallback
                                            to <EditorialBleedSection>
EDIT  src/pages/Contact.tsx                use <QuoteCloserCard /> for right column
EDIT  src/pages/About.tsx                  add CedarCTA to PageHero children;
                                            replace bottom CedarCTA with closer card
EDIT  src/pages/Services.tsx               <QuoteCloserCard /> after FAQ;
                                            mid-catalogue CedarCTA strip after group 3
EDIT  src/pages/Work.tsx                   per-project: hairline link → CedarCTA;
                                            bottom CedarCTA → <QuoteCloserCard />
```

### Cheap perf cleanups (while we're in the files)

- `src/components/About.tsx` and `src/pages/About.tsx` — drop `box-shadow` from `transition-[…,box-shadow]` on step rows. Animating shadow is one of the most expensive properties; it's not worth the visual delta.
- `src/components/Hero.tsx` — combine `HeroStatsStrip` + `HeroTrustStrip` into a single `<section>` with an internal hairline. One paint root instead of two; tightens post-hero rhythm.
- Add `contentVisibility: auto` + `containIntrinsicSize` to the new `<QuoteCloserCard />` so off-screen closers skip layout.

### What this delivers (against the five descriptors)

- **Professional** — one phrase, one button style, one trust line, one closer card across every page.
- **Minimalistic** — three trust bands collapse to one; homepage closer becomes a single high-conversion card; `TrustStrip` removed.
- **Sleek** — every PageHero carries a primary CTA; every CTA list uses the same rhythm; expensive shadow transitions removed.
- **Performance-optimized** — fewer paint roots in Hero; `content-visibility` extended; FAB observer is more precise; no animated `box-shadow`.
- **Easy to use** — one tap from any service tile lands you in the modal with that service preselected; no page is more than ~100vh from a primary CTA; modal CTA copy matches the page CTA that opened it.

### Out of scope (intentionally)

- The `QuoteModal` itself (just rebuilt — leave it).
- The five-group services taxonomy.
- Routing, lazy-loading topology, admin pages, brand tokens, fonts, colors, the architect-hero treatment, `/style-guide`.
- Any DB or edge-function work.

**Total**: ~13 file edits + 2 new files. One focused pass. No new dependencies.
