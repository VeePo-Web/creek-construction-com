# Pass 12 — Editorial Crispness (FlexServices-Grade Audit, Round 2)

Pass 11 deduplicated trust language and stripped editorial garnish. Pass 12 is the next reduction layer: delete dead code, drop default subheadings, fix the few remaining spots where the page introduces itself twice, and tighten section padding by one notch so the homepage scrolls in fewer screen-fulls. No new files; pure subtraction with one rename.

---

## 1. Delete dead component — `src/components/About.tsx`

The homepage `<About />` block was removed from `src/pages/Index.tsx` in Pass 10. The component file (~130 lines) is now orphaned — nothing imports it. Delete it. The /about route already uses `src/pages/About.tsx`, which is the live one.

Verification: `rg "from \"@/components/About\"" src/` after delete must return zero hits.

---

## 2. Trim `SECTION_PADDING.default` one step

Currently `py-24 md:py-32` (96px → 128px). FlexServices runs `py-20` (80px). Set:

```ts
default: "py-20 md:py-28",  // was py-24 md:py-32
```

This single token change ripples through every section on every page. The site loses ~32px between sections at desktop and ~16px at mobile — measurable, not invisible, and a more confident editorial cadence.

---

## 3. Default-strip subheadings that the heading already covers

In `TestimonialStrip.tsx` the default subheading "Real words from real homes across Alberta." restates the heading "Quiet recommendations." Drop the default (`subheading?: string` becomes truly optional with no default); pages can still pass one if they need it.

In `src/components/Services.tsx` (homepage tile section) the subheading "Residential exterior construction across Alberta — one crew, end to end." is redundant of the headline "Five categories. Fifteen services." Remove the `subheading` prop from the call.

In `src/pages/Services.tsx` "Responsibility matrix" section already had its subheading dropped in Pass 11. Confirmed — no action.

In `src/components/About.tsx` (the homepage one we're deleting in step 1) — n/a.

---

## 4. /work PageHero — drop the duplicated caption

`src/pages/Work.tsx` PageHero passes `caption={{ service, location, year }}`. The caption renders as a small chip near the headline. The breadcrumb already says "Home → Our Work" and the headline already says "The work speaks first." The caption is decorative noise. Remove the `caption` prop from the PageHero call.

---

## 5. /about PageHero — drop the `numeral="I"`

PageHero on /about renders `numeral="I"`. It's the only sub-page that does this, and there is no "II" anywhere because Pass 11 stripped in-body numerals. A lone "I" reads as orphaned. Remove it.

---

## 6. CrewMoment — make headline carry the beat alone

After Pass 11, CrewMoment is one short paragraph. Drop the eyebrow `OUR CREW` (it duplicates the heading "The crew on-site is the crew you meet."). Pass `eyebrow=""` is awkward — instead change `SectionHeader` to skip rendering BronzeRule when `label` is empty/undefined, and call `<CrewMoment />` with no `eyebrow` so the section opens straight on the serif headline.

Implementation: in `SectionHeader.tsx`, wrap the BronzeRule block in `{label && (...)}`. Then in `CrewMoment.tsx`, remove the default `eyebrow = "OUR CREW"` so it's truly optional.

---

## 7. Footer — make middle nav slightly louder

The Pass-11 footer reduced the link colors to `text-evergreen-foreground/65`. On evergreen at /65, the contrast is borderline. Bump to `/80` for default and keep `/65` for the © line. Pure quality-of-life — matches FlexServices' "Licensed & Insured" line which sits at high-contrast on white.

---

## 8. Homepage rhythm — strip CrewMoment default background

Pass 10 set Index.tsx alternation: `Hero → Quote(secondary) → Services(bg) → CrewMoment(secondary) → Featured(bg) → Testimonials(secondary) → MiniFaq(bg) → Closer(secondary)`. Solid. No change to the section list. But verify after step 2 (smaller padding) that the rhythm still reads — no anchor changes.

---

## 9. Style guide page — leave alone

`/style-guide` uses these primitives indirectly. With the SectionHeader change (label optional) it'll render fine — only behavior change is that an empty label hides the rule. No call sites pass empty by accident.

---

## Verification checklist

- `rg "from \"@/components/About\"" src/` → zero hits.
- `rg "py-24 md:py-32" src/` → zero hits (token replaced).
- `rg "<CedarCTA" src/` count remains: 2 per page route (hero + closer).
- `/about` PageHero shows no numeral.
- `/work` PageHero shows no caption chip.
- `MiniFaq`, `TestimonialStrip`, `CrewMoment` render with NO subheading by default.

---

## Expected outcome

- Homepage scrolls one full viewport shorter on a 14" laptop.
- Two more sub-headlines stop talking over their own H2.
- One dead 130-line file disappears.
- The lone "I" on /about no longer reads like the start of a numbered series that never arrives.
