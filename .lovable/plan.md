# Fantasy.co Simplification — Phase 2 (Continuation)

Phase 1 already removed: hero `service · location` caption rail, triptych column captions, all `sectionLabel` eyebrows, per-page section rails, dead anchors, FloatingQuoteCTA, About italic helper, Services item counters, FieldClipsStrip badge, CrewMoment caption, HomeGallery footer link.

This plan finishes the job in two passes.

---

## Pass A — Remaining clutter sweep

Forensic search targets (rg patterns) and removals:

1. **TestimonialStrip** (`src/components/TestimonialStrip.tsx`)
   - Collapse from multi-quote grid to a single rotating quote (one `<blockquote>` + name/role line). Drop counter dots, source chips, "Read more" links, and any "Verified · Google" badge.

2. **EditorialImageBreak** (`src/components/media/EditorialImageBreak.tsx`)
   - Remove any caption/credit overlay props and JSX. Image-only, no text.

3. **Services catalogue** (`src/pages/Services.tsx`)
   - Drop "Don't see what you need?" footer (already), plus any remaining "starting at", "from $X", or duration chips on cards.
   - Mobile: truncate to top 6 items behind a single "View all" hairline link to `/work`.

4. **About** (`src/pages/About.tsx`)
   - Trim story to 2 paragraphs max. Process list `line-clamp-2` per item. Remove any stat chips ("12 yrs · 40 builds") if still present.

5. **Contact** (`src/pages/Contact.tsx`)
   - Remove the photo band's caption if any. Strip "Response within 24h" / "Based in Calgary" pill chips above form. Form labels only — no helper microcopy beneath inputs unless validation.

6. **Global sweep** — rg for and remove stragglers:
   - `·\s+[A-Z][a-z]+` in JSX (caption-style middots)
   - `aria-label=".*caption"`, `<figcaption`, `provenance=`, `caption=`, `eyebrow=`, `kicker=`
   - Decorative `BronzeRule` instances inside hero/section headers (keep only between major sections, not inside them)
   - Any remaining `<Badge>` / chip components in hero, brand-statement, testimonial, contact, about — delete.
   - Footer: remove tagline line, social row labels ("Follow"), keep logo + nav + copyright only.

7. **Header** (`src/components/SiteHeader.tsx`)
   - Confirm only: logo · nav · phone · Quote · MENU. Remove any "Open today" / hours pill, location pill, or breadcrumb on root pages.

---

## Pass B — One section, one viewport

Use the spacing tokens already added in Phase 1 (`SECTION_HEIGHT.fullScreen`, `SECTION_LAYOUT.centered`).

**Apply `min-h-[100svh] flex flex-col justify-center` to every top-level `<section>` on:**

- `/` Index — Hero, BrandStatement, EditorialImageBreak (×2), TestimonialStrip, HomeGalleryStrip, CrewMoment, QuoteCloserCard
- `/about` — Hero, Story, Process, Crew, Closer
- `/services` — Hero, Matrix, Catalogue, Contract, FAQ, Closer
- `/work` — keep GalleryWall scrolling exempt; hero + closer get full-svh
- `/contact` — Photo band (40svh), Form section (60svh) → together = 100svh on desktop; mobile stacks to 100svh each

**Per-viewport rules**

| Viewport | Rule |
|---|---|
| ≥1280 (desktop) | every section exactly `100svh`, content vertically centered, no internal scroll |
| 768–1279 (tablet) | `100svh`, allow up to 110svh only if H1 + sub + CTA + 1 supporting element |
| <768 (mobile) | `100svh`, hard-truncate lists to fit; long lists become "View all →" |

**Overflow strategy** for content-heavy sections (Services Matrix, FAQ, Process):
- Desktop: 2-col grid to fit in viewport.
- Tablet: 2-col, condensed.
- Mobile: show first N items + hairline "View all" link to dedicated route. No internal scroll containers (they create the clutter we're killing).

**Exemptions** (documented in code comments):
- `/work` GalleryWall (intentional scroll)
- Auth/legal pages (rare, low-traffic)

---

## Verification

After edits, screenshot every page at **375×812, 768×1024, 1280×800, 1920×1080** and confirm:
1. No section exceeds 105svh.
2. No middot-caption strings, no chip/badge components in hero/section headers.
3. CLS ≤ 0.05, LCP element is hero image.
4. rg sweep returns zero hits for: `caption=`, `eyebrow=`, `kicker=`, `provenance=`, `fallbackCaptions`, `sectionLabel`, `<Badge`, `· [A-Z][a-z]+ ·` in JSX.

---

## Technical notes

- Use `100svh` (small viewport height) everywhere — excludes mobile browser chrome so sections don't get clipped behind URL bar.
- Keep all `aria-labelledby` / `aria-label` intact for a11y.
- No new components. Pure deletion + token application.
- No design-token changes; this is purely composition cleanup.
