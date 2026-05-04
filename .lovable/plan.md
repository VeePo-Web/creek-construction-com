# Pass 6 — two remaining funnel & a11y leaks

Pass 5 unified the closer copy, the Creek Process, and the footer trust line. Re-scanning the four public pages for anything one route does that the others should copy turned up two more inconsistencies — both small, both worth fixing in the same sweep.

## Findings

### 1. `/contact` hero is the only page hero without a primary CTA

Every `PageHero` on the site carries `<CedarCTA />` as its child:

| Route | Hero CTA |
|---|---|
| `/` | ✅ CedarCTA + phone link |
| `/services` | ✅ CedarCTA |
| `/work` | ✅ CedarCTA + sister-studios footnote |
| `/about` | ✅ CedarCTA |
| `/contact` | ❌ **no CTA** — hero just renders the headline |

The /contact hero ends with the subtitle, then the user has to scroll to find the form. On mobile that's a wasted ~640px of viewport. The funnel contract from the brief — "frictionless funnel from A to B" — wants the primary CTA above the fold on every entry route.

**Fix:** add `<CedarCTA />` as the hero child on /contact, same as the other four pages. The phone-anchor row from the homepage hero is also a good copy candidate here since direct call is literally the page's purpose.

### 2. Skip-to-content link only exists on `/`

`src/pages/Index.tsx` line 35 renders an accessible skip link styled as a focus-only cedar pill. The other four routes (`/services`, `/work`, `/about`, `/contact`) have no skip link — keyboard users have to tab through Navigation + every CTA in the chrome before they reach the page body.

**Fix:** lift the skip link into a tiny `<SkipToContent target="…" />` component and render it as the first child on every page `<main>`. Each route passes the id of its first content section (`section-catalogue`, `section-featured`, `section-story`, `section-contact`).

## Files to touch

```text
src/components/ui/skip-to-content.tsx   NEW — single accessible primitive
src/pages/Index.tsx                     replace inline <a> with <SkipToContent target="section-services" />
src/pages/Services.tsx                  add <SkipToContent target="section-catalogue" />
src/pages/Work.tsx                      add <SkipToContent target="section-featured" />  (fallback "section-gallery" if no projects)
src/pages/About.tsx                     add <SkipToContent target="section-story" />
src/pages/Contact.tsx                   add <SkipToContent target="section-contact" /> AND add <CedarCTA /> as the PageHero child
```

## What this is NOT doing

- Not touching Pass 4 mobile fixes or Pass 5 closer/process unification.
- Not changing hero variants, copy, or imagery on any route.
- Not adding new sections, only one inline CTA on /contact.

After this pass: every public page has the same skip-link affordance, and every page hero on the site has the primary conversion button in the same slot.
