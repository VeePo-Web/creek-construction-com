# Pass 47 — Section-intro rhythm: gaps, subhead voice, body token discipline

After Pass 45 (one H2 ladder) and Pass 46 (one container), the rhythm *inside* a section intro still drifts: the gaps between eyebrow → H2 → subhead are wrong order of magnitude, and the subhead reads in a heavier voice than the body that follows it. Apple, Stripe, and Fly4Me all keep one calm voice from intro to body. This pass codifies that. GET RID OF THE EYEBROWS THEY CAUSE CLUTTER

## Audit — current `SectionHeader` rhythm

```text
eyebrow              ← font-medium 10px cedar/65
   ↕ mb-5  (20px)
H2 (HEADLINE.section)
   ↕ mb-3  (12px)    ← TOO TIGHT — undercuts the H2's gravity
subhead (literal)    ← text-muted-foreground (heavy), text-base md:text-lg
   ↕ mb-6  (24px)
content
```

Two problems:

1. **H2→subhead gap (12px)** is *narrower* than eyebrow→H2 gap (20px). The relationship is inverted — the H2 deserves the bigger downstream gap so the subhead reads as a continuation, not a label. Apple/Fly4Me both use ~24–32px here.
2. **Subhead voice** uses `text-muted-foreground` (full mute) and `text-base md:text-lg` (16→18px). The body paragraphs that follow use `BODY.lead` (`text-foreground/75`, 15→16px, 1.65 leading). So the *introductory* line is louder, larger, and grayer than the actual content. Backwards.

## A. Fix the rhythm in `src/components/SectionHeader.tsx`


| Element                                                             | Before                                                                             | After                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eyebrow `<p>` margin                                                | `mb-5` (20px)                                                                      | `mb-4` (16px) — Apple-typical eyebrow-to-headline pull                                                                                                                                                                                                                                |
| H2 `mb-3` baked into `${HEADLINE.section} mb-3 [&:last-child]:mb-0` | `mb-3`                                                                             | `mb-6 md:mb-7` (24→28px) — gives the H2 its breath                                                                                                                                                                                                                                    |
| Subhead `<p>` className                                             | literal `text-base md:text-lg text-muted-foreground mb-6 text-pretty max-w-[56ch]` | `${BODY.lead} mb-2 text-pretty max-w-[56ch]` — calmer voice, native lead leading (1.65), keeps the bottom margin only because most call-sites add their own `mt-*` on the next block. Net rhythm below the subhead: subhead `mb-2` + content's `mt-6/8/10` = unchanged effective gap. |
| Badge `<p>` margin                                                  | `mt-2`                                                                             | `mt-2` — unchanged                                                                                                                                                                                                                                                                    |


Gap sequence becomes:

```
eyebrow → mb-4 (16) → H2 → mb-6/7 (24-28) → subhead → mb-2 + (caller mt) → content
```

Doubles the H2's downstream breath; the subhead becomes a true sub-line, not a competing label.

## B. Token import in SectionHeader

Add `BODY` to the existing import: `import { HEADLINE, BODY } from "@/lib/typography";`

## C. QuoteCloserCard body — migrate literal to `BODY.lead` pattern

`src/components/QuoteCloserCard.tsx` line 37:

```
text-evergreen-foreground/70 leading-relaxed mb-8 max-w-[52ch]
```

→

```
font-sans text-evergreen-foreground/75 text-[15px] sm:text-base leading-[1.65] text-balance mb-8 max-w-[52ch]
```

This is `BODY.lead`'s computed CSS with the `text-foreground/75` color swapped for `text-evergreen-foreground/75` (since `BODY.lead` itself is a string, we can't override one class — we inline the equivalent). Same calm voice as every other lead paragraph on the site, only re-tinted for the dark plate.

Reads identically to CrewMoment / About lead paragraphs; only the surface changes.

## D. Verification

1. Visual sweep at 360 / 768 / 1440 on Home:
  - **FeaturedProjects** (uses SectionHeader): H2 → subhead gap doubles. The "Featured projects" subhead now reads at 15→16px (was 16→18px) in `text-foreground/75` (was full-muted). The eye reads the H2 as the headline, the subhead as a beat under it, then the project grid — three clear tiers.
  - **TestimonialStrip** (uses SectionHeader): same rhythm correction, same calmer subhead voice.
  - **MiniFaq** (uses SectionHeader on Services / Contact pages): same.
  - **CrewMoment** (uses SectionHeader with `subheading` empty most places): unchanged where no subhead exists; cleaner where present.
  - **QuoteCloserCard**: body paragraph reads at the same scale as lead paragraphs across the rest of the site.
2. `rg "text-base md:text-lg text-muted-foreground" src/components` → **zero matches** (the SectionHeader literal was the only one).
3. Lighthouse a11y: contrast ratios verified for `text-foreground/75` on `bg-background` (≥7:1) and `text-evergreen-foreground/75` on `bg-evergreen` (≥4.5:1).
4. No regression in Hero, Services, BrandStatement (bespoke editorial typography — out of scope).

## E. Out of scope

- **Hero subtitle** (`src/components/ui/page-hero.tsx` architect-bleed) — uses bespoke `clamp(0.95rem, 1.05vw, 1.125rem)` for cinematic legibility on the hero photo. Stays.
- **Services row descriptions** (line 69) — `<p className="hidden md:block md:col-span-5 text-base text-muted-foreground/85 leading-relaxed text-pretty">`. This sits in a 12-column row, not a section intro. Different rhythm contract, untouched.
- **BrandStatement single-line statement** — already on `HEADLINE.section`, no separate subhead. Untouched.
- **FeaturedProjects card descriptions** (line 101 — `text-sm`) — card-tier copy, not section intro. Untouched.
- `**BODY.default` token** — kept as-is for any future call-site that genuinely wants the louder voice; just nothing on Home uses it after this pass.

## Files touched

1. `src/components/SectionHeader.tsx` (4-line edit: eyebrow margin, H2 margin, subhead className, import)
2. `src/components/QuoteCloserCard.tsx` (1-line className swap)