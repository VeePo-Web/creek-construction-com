## Pass 3 — legibility & funnel completeness on photographic heroes

I walked all five public routes on iPhone (390px). Hero pass was clean (pass 2 fixed it). Three real defects on the inner pages, all hurting conversion:

---

### 1. The italic brand-promise line is illegible on warm-photo heroes

`KineticHeadline` renders the italic in `text-cedar/95` whenever `onDark`. Bronze on warm-toned photographs (wood, sun-lit decks) has near-zero contrast. Confirmed broken on:

- `/services` — "Fifteen services. One crew." disappears into the wood deck photo.
- `/work` — "Alberta-built. Crew-owned." disappears into the cedar shed.
- `/contact` — "Free quote. Honest answers." disappears into the wood siding.

The white headline reads fine because it uses `text-evergreen-foreground` (cream) plus the `text-on-dark-legible` shadow utility. The italic gets neither.

`/about` reads fine only because its photo is cool-green forest — a coincidence, not a fix.

**Fix in `src/components/ui/kinetic-headline.tsx`:**

Change the `onDark` italic class from `"text-cedar/95"` to `"text-cedar-foreground/95 text-on-dark-legible"`. `--cedar-foreground` is the warm cream that's already in the design system (`38 30% 97%`), used as the on-bronze foreground. It keeps the italic warm (it's not a cold white) but pushes contrast above WCAG AA on every photo. Adds the same legibility shadow the headline uses.

Light-mode (`onDark = false`) stays `text-cedar` — bronze on cream is fine and on-brand.

### 2. /work hero subtitle is illegible

Same root cause — `cinematic-bleed` puts the subtitle in `text-evergreen-foreground/90 text-on-dark-legible`, which *should* work, but the cinematic scrim's bottom band only covers the lower 68% and the subtitle on /work sits where the scrim transitions to lighter alpha. Pass 1 fix #1 already resolves it for the italic; the subtitle stays as-is and reads fine once the italic stops competing with the photo.

No code change here — verifying after #1 ships.

### 3. /work hero is missing its primary CTA

Pass 1 contract: every PageHero carries a primary CTA so the funnel never dead-ends at the top of a page. /work passed only the "Sister studios" editorial footnote into `children`. Add `<CedarCTA />` above the footnote so the conversion path is one tap from landing.

`CedarCTA` is already imported in `src/pages/Work.tsx` — no new import needed.

### Files

```text
EDIT  src/components/ui/kinetic-headline.tsx   onDark italic → cream + legibility shadow
EDIT  src/pages/Work.tsx                       add CedarCTA above sister-studios footnote
```

2 file edits. No tokens added (uses existing `--cedar-foreground` + `text-on-dark-legible`). No layout shift expected — same font, same size, same position; only color + shadow change.

### What this delivers

- The brand-promise italic ("Honest answers", "Crew-owned", "One crew") is finally readable on every photo.
- /work has a primary CTA in the hero, matching the rest of the site.
- Same conversion path one tap from landing, every page.

### Out of scope

- Anything that requires re-shooting hero photographs.
- Eyebrow text size / letter-spacing (current spec reads fine on iPhone after pass 2).
- The cinematic-bleed scrim density (legibility is solved by changing the text, not the scrim).
