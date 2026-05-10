# Pass 37 — Cross-Component Consistency: Eyebrow Grammar, Row Pattern, Closer Calm

Pass 36 quieted the section-header rhythm. With every `<SectionHeader>` now whispering a single `.eyebrow`, the next visible inconsistencies are at the **component-grammar layer**: interactive rows behave differently on Services vs About vs the homepage; eyebrows are hand-rolled with bespoke tracking values in the Footer and Services responsibility matrix; and the QuoteCloserCard headline currently outshouts the hero. Pass 37 enforces a single grammar across these surfaces.

## Principles
1. **One row pattern across the site.** Every interactive content row uses: `border-b border-cedar/12` divider, hidden 2px cedar left-bar that slides in on hover, no row background fill on hover, optional right chevron that nudges 4px on hover. About already follows this. Homepage Services already follows this. Services page catalogue does not — it still hovers a cedar tint and rounds to 4px.
2. **One eyebrow utility, applied everywhere.** Every uppercase tracking-[0.22em] label uses the `.eyebrow` utility — no more hand-rolled `text-[10px/11px] tracking-[0.18em/0.20em/0.22em] uppercase text-cedar/55|70|80` strings. Counters use `.eyebrow tabular-nums`. The deprecated `EYEBROW.*` token strings continue to live for legacy components but are not introduced anywhere new.
3. **The closer never out-shouts the hero.** `QuoteCloserCard` sized at 56px outpaints the hero on shorter pages (Services, About). Cap at 48px / `HEADLINE.section` token.
4. **Captions don't duplicate themselves.** When a MediaSlot already prints a fallback caption, the section that wraps it does not re-print the same string below.

---

## A. Services page — catalogue rows match the canonical pattern (`src/pages/Services.tsx`)

Replace the catalogue button (L95–L110) with the canonical row grammar:
- Drop `border-b border-cedar/8` per-row → group container gets a `hairline` top, rows divided by `border-b border-cedar/12`.
- Drop `hover:bg-cedar/[0.035] rounded-[4px] px-3 sm:px-4 -mx-3 sm:-mx-4` (negative-bleed background fill — competes with the .hairline).
- Add hidden left-bar marker: `<span aria-hidden className="absolute left-0 top-3 bottom-3 w-0 bg-cedar transition-all duration-300 group-hover:w-[2px]" />`.
- Add right chevron on md+: `<ArrowUpRight className="hidden sm:block h-4 w-4 text-cedar/45 group-hover:text-cedar transition-colors opacity-0 group-hover:opacity-100" />`.
- Wrap the row in `relative pl-3 sm:pl-4` so the marker positions cleanly.
- Title color stays `text-foreground` (drop `group-hover:text-cedar` so the hover signal lives in the bar + chevron, not the type).
- Group heading L85–L90 uses bespoke sizing → use `HEADLINE.sub` token + keep the `01/02/03…` eyebrow numeral inline.

## B. Services page — responsibility matrix eyebrows (`src/pages/Services.tsx` L142–L169)
- L142 `text-minimal text-cedar` → `<p className="eyebrow">WE HANDLE</p>` (cedar is already the eyebrow color).
- L166 `text-minimal text-muted-foreground` → `<p className="eyebrow opacity-65">YOU HANDLE</p>` (use opacity to dim against the same eyebrow stamp instead of a different color token).
- L143 + L167 right-side counters: bespoke `text-[10px] tracking-[0.2em]` → `<span className="eyebrow tabular-nums opacity-60">{N} ITEMS</span>`.

## C. Footer — switch to `.eyebrow` utility (`src/components/Footer.tsx`)
- L50, L76 column titles: bespoke `text-[11px] tracking-[0.22em] uppercase text-cedar/70` → `<p className="eyebrow mb-4 text-center lg:text-left">…</p>`.
- L101 © line: bespoke `text-[11px] tracking-[0.18em] uppercase text-evergreen-foreground/55` → `eyebrow opacity-55` (keeps the cedar tint consistent across the page bottom; `0.18em` was the only stray tracking value in the file). Adjust spacing: `mt-14 pt-6` → `mt-16 pt-8` for breathing room.
- L40 italic-serif tagline: keep — this is one of the protected pull-quote carve-outs.

## D. TestimonialStrip — collapse author + meta into one eyebrow row (`src/components/TestimonialStrip.tsx`)
- L62 quote class: switch to `${HEADLINE.card} text-foreground/90 leading-snug flex-1` and import HEADLINE — keeps card-sized serif consistent across the site.
- L65–L68 author/meta: collapse to a single line with bullet:
  ```tsx
  <div className="mt-6 hairline pt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
    <p className="text-sm text-foreground">{t.firstName}</p>
    <span className="eyebrow opacity-50">·</span>
    <p className="eyebrow">{t.city} · {t.service}</p>
  </div>
  ```

## E. QuoteCloserCard — cap headline + tighten chrome (`src/components/QuoteCloserCard.tsx`)
- L31: `eyebrow text-cedar/80` → `eyebrow` (eyebrow utility already lands a cedar tone — `/80` was double-tinting on the dark evergreen plate; if contrast suffers, use `eyebrow text-cedar` instead).
- L32 headline: replace bespoke `text-3xl sm:text-4xl md:text-[40px] lg:text-5xl xl:text-[56px] leading-[1.1] tracking-[-0.02em]` with: `font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.022em]` (matches `HEADLINE.section` tokens, never larger than the hero).
- L41 trust line: `text-[11px] tracking-[0.22em] uppercase text-evergreen-foreground/55` → `eyebrow opacity-55` (shares the global eyebrow stamp).

## F. BrandStatement — solid foreground + calmer dots (`src/components/BrandStatement.tsx`)
- L27: `text-foreground/90` → `text-foreground`. Reduce noise: tonal opacity in this size implies "sub-headline" — but this is the philosophy plate, the calmest text on the page deserves full ink.
- L29 + L31 middle dots: `text-cedar/55` → `text-cedar/40` (the dot is a separator, not a feature).

## G. CrewMoment — caption deduplication (`src/components/CrewMoment.tsx`)
- L58: drop `fallbackCaption="On the boards · Alberta"` from the MediaSlot — the eyebrow below the image (L60) already prints this caption, and showing it twice when the photo fails to load looks like a render bug.

## H. MiniFaq — clean stray whitespace (`src/components/MiniFaq.tsx` L60)
- Remove the blank line inside the `<p className="hairline …">…` so the rendered paragraph doesn't ship a stray text node before the "Have more questions?" copy. (Cosmetic — no visible regression, but it's one of the dangling sloppy bits.)

## I. Hero ghost call link — slight visibility bump (`src/components/Hero.tsx` L32)
- `border-white/30 hover:border-white hover:bg-white/[0.06]` → `border-white/40 hover:border-white hover:bg-white/[0.08]`.
- `text-white/85 hover:text-white` → `text-white/90 hover:text-white`. Ghost over photography needs a touch more weight to match the primary CedarCTA visually.

## J. Verification
1. `/services` catalogue: every row hovers identically to `/about` process rows — left bar slides in, no fill flicker, chevron fades in on the right (md+).
2. `/services` responsibility matrix: WE HANDLE / YOU HANDLE eyebrows + counters render in the single eyebrow stamp.
3. Footer: column titles, © line, "Made in Alberta" all share the eyebrow stamp; no stray tracking values.
4. `/`: TestimonialStrip cards show one-line author+meta separated by a faint dot; quote sized like a card title.
5. `/`, `/services`, `/about`, `/work`: QuoteCloserCard headline is no larger than the hero on the same page.
6. `/`: BrandStatement reads as full-ink type with calmer separators.
7. CrewMoment: image fallback no longer prints duplicate caption.
8. Hero: ghost call CTA reads as visually equal in weight to the primary.
9. 390/768/1280/1440 sweep: no overflow, no layout drift.

## Files to touch
`src/pages/Services.tsx`, `src/components/Footer.tsx`, `src/components/TestimonialStrip.tsx`, `src/components/QuoteCloserCard.tsx`, `src/components/BrandStatement.tsx`, `src/components/CrewMoment.tsx`, `src/components/MiniFaq.tsx`, `src/components/Hero.tsx`.
