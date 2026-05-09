# Pass 36 — Editorial Calm: Quiet the Section Headers, Standardize Radii

Pass 35 flattened the buttons. The next-loudest element on every sub-page is the **section header rhythm**: every `<SectionHeader>` still ships a 40px cedar bar (`BronzeRule`) immediately before the eyebrow label, then an italic-serif subheading. On Apple/Fly4Me sub-pages, the eyebrow is the lightest possible whisper — never a decorative rule, never italic. Pass 36 quiets the sub-page rhythm to match the homepage (which already uses the lightweight `.eyebrow` utility), then sweeps remaining `rounded-[6px]` interactive surfaces into the canonical 2px corner.

## Principles
1. **The eyebrow is the rule.** A bronze bar before every label competes with the headline. The label itself, sized 11px / 0.22em, *is* the divider.
2. **Subheadings are sans, not italic-serif.** Italic-serif on every section reads like a magazine pull-quote — overused, it loses its weight. Reserve italic-serif for *one* genuine pull-quote per page (About story, Footer tagline, BrandStatement).
3. **One radius for interactive chrome:** `rounded-[2px]`. shadcn primitives (Dialog, Select, Card) keep their `rounded-md` — those are accessibility-tuned and live below the visual surface.
4. **PageHero keeps BronzeRule.** Over photography, the bar provides anchoring. Light-surface section headers don't need it.

---

## A. SectionHeader — drop the bar, drop the italic (`src/components/SectionHeader.tsx`)

### A1. Replace BronzeRule with `.eyebrow`
- Remove the `<BronzeRule numeral=… label=… />` block (L68–77).
- Replace with: `<p className={`eyebrow ${centered ? "text-center" : ""} mb-5`}>{label}</p>`.
- The numeral support drops with this change. (Currently unused on production pages — every callsite passes `label` only.)
- Drop the `BronzeRule` import.

### A2. Subheading: sans, not italic-serif
- L85: `text-subhead text-foreground/60 italic font-serif mb-8 text-balance max-w-[44ch]` → `text-base md:text-lg text-muted-foreground mb-6 text-pretty max-w-[56ch]`.
- Wider max-width (44ch → 56ch) keeps "Photography in progress — click any category to request a quote." on one line on `/work` desktop.

### A3. Counter badge variant
- The `showBadge` block (L91–95) uses `BronzeRule` too. Since A1 removes the import: rewrite as a flat eyebrow row: `<p className="eyebrow mt-2">{badge}</p>`. (Badge prop is currently used on a single hero card; verify visual.)

### A4. Heading bottom margin
- L80: `mb-4 [&:last-child]:mb-8` → `mb-3 [&:last-child]:mb-0`. Pages already control vertical rhythm via `mt-X` on the next block; the global `mb-8` was double-spacing.

## B. About page polish (`src/pages/About.tsx`)

- **L86 process row:** drop `hover:bg-cedar/[0.025]` (Apple rows just slide the indicator — no fill flicker on hover). Keep the left-bar marker.
- **L89 numeral column:** `w-9` → `w-7`, `mt-1` → `mt-1.5`. Tighter index column matches Services row grammar.
- **L116 city chips:** `rounded-[4px]` → `rounded-[2px]`; `border-cedar/12` → `border-cedar/15`; tighten `gap-2` → `gap-1.5` so the grid reads as a single calm field.
- **L62 pull-quote:** keep italic-serif (this is the *one* real pull-quote on the page, now that SectionHeader subheads have shed their italic — the contrast is restored).

## C. Work page polish (`src/pages/Work.tsx`)
- **L86:** the per-project meta strip currently uses `text-cedar/70` for `location · status · year`. Switch to `text-muted-foreground/85` and keep tracking — the cedar tint duplicates what the `.hairline` already signals.
- Verify featured project header (L79) uses the new `.hairline` consistently after SectionHeader changes.

## D. Sweep `rounded-[6px]` → `rounded-[2px]` on custom interactive surfaces
- `src/components/navigation/NavigationMinimal.tsx` L34 (phone CTA pill).
- `src/components/navigation/MenuTrigger.tsx` L47.
- `src/components/FeaturedProjects.tsx` L58 (focus ring radius on project link wrapper).
- **Skip:** `ProgressiveImage.tsx` (image surface — `rounded-[6px]` is a deliberate softening of photo corners; leave it; the wrapper already gets clipped by parent radius). Actually — for consistency with `ProjectTile` (`rounded-sm` = 2px) audit needed: change `ProgressiveImage` to `rounded-[2px]` so the photo and its frame share the same corner.

## E. PageHero subhead audit (`src/components/ui/page-hero.tsx`)
- L717: hero subhead `mt-4 text-lg italic font-serif max-w-xl text-evergreen-foreground/85` — keep italic here. Hero is the one place a pull-quote subhead earns its weight (large type, photographic context).
- No changes — documenting the carve-out so it doesn't get swept by a future pass.

## F. QuickNav + GlobalMenu BronzeRule (`src/components/QuickNav.tsx` L147, `src/components/navigation/GlobalMenu.tsx` L249)
- These render BronzeRule inside chrome (menus, side rails). Keep — they provide visual anchoring in dense menu real estate. Mark in plan only — no code change.

## G. Style-guide refresh (`src/pages/StyleGuide.tsx`)
- Update the SectionHeader demo to show the new flat eyebrow + sans subhead.
- Add a "Pass 36" note explaining the eyebrow-as-rule principle.

## H. Token doc updates (`src/lib/typography.ts` if present)
- If `EYEBROW.default` token is defined separately from the `.eyebrow` utility, leave both; mark `EYEBROW.default` as the canonical for inline use, `.eyebrow` for SectionHeader.

## I. Verification
1. `/about`, `/services`, `/work`, `/contact`, `/`: every `<SectionHeader>` renders a thin eyebrow only — no 40px cedar bar, no italic subhead.
2. `/about` process rows: hover slides the 2px cedar bar in, no row background change.
3. `/about` city grid: every chip renders at 2px radius with the tighter gap.
4. `/work` per-project meta strip: single neutral muted-foreground line, no cedar tint.
5. NavigationMinimal phone pill + MenuTrigger button render at 2px corners.
6. PageHero on `/about`, `/work`, `/services`: still ships the BronzeRule + italic hero subhead (carve-out preserved).
7. Reduced-motion + 390/768/1280 visual sweep: no overflow, no layout shift from removed BronzeRule height.

## Files to touch
`src/components/SectionHeader.tsx`, `src/pages/About.tsx`, `src/pages/Work.tsx`, `src/components/navigation/NavigationMinimal.tsx`, `src/components/navigation/MenuTrigger.tsx`, `src/components/FeaturedProjects.tsx`, `src/components/ProgressiveImage.tsx`, `src/pages/StyleGuide.tsx`.
