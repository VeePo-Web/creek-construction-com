# Pass 51 — Visual rhythm audit: zero text-only sections

## Audit results

I walked every public route and flagged each block by image density. Anything that renders only type, hairlines, or icons is a candidate.

### Findings

| Page | Block | Currently | Verdict |
|---|---|---|---|
| `/` Index | Hero | Full-bleed image | ✅ |
| `/` Index | **BrandStatement** ("How we work shows up…") | Type + hairlines only | ⚠️ user's example |
| `/` Index | Services list | Type only (intentional editorial list) | ⚠️ flank with image |
| `/` Index | HomeGalleryStrip | Images | ✅ |
| `/` Index | CrewMoment | Photo + copy | ✅ |
| `/` Index | TestimonialStrip | Type only | ⚠️ |
| `/` Index | QuoteCloserCard | Solid evergreen plate | ✅ (intentional brand block) |
| `/about` | PageHero (evergreen-typographic) | Triptych | ✅ |
| `/about` | **section-story** | Type + hairline quote | ⚠️ |
| `/about` | **section-process** (5 numbered steps) | Type + numerals | ⚠️ |
| `/about` | **section-areas** (city tags) | Tag grid | ⚠️ |
| `/services` | PageHero (service-portrait) | Triptych | ✅ |
| `/services` | section-catalogue (16 services) | Type list | ⚠️ flank with image |
| `/services` | **section-contract** (We/You handle) | Type only | ⚠️ |
| `/services` | MiniFaq | Type | ⚠️ |
| `/contact` | Whole page | Form + info card, **zero photography** | ⚠️ |
| `/work` | Hero + GalleryWall | Images | ✅ |

Every ⚠️ row is a Pass 51 target.

## Approach

One reusable primitive does most of the heavy lifting. Two surgical conversions handle the rest.

### 1. New component: `src/components/media/EditorialImageBreak.tsx`

A restrained Creek-toned answer to Hickory & Rose's `EditorialImageBreak`. Full-bleed photography, no overlay copy, cedar-tinted edge gradients, gentle parallax via `useReveal` + `transform: translateY()` on scroll. **No caption. No "&" diamond. No letterbox bars on hover** — those belong to the wedding brand. Creek's version is quieter.

Props:
```ts
{
  src: string;                     // imported asset path
  alt: string;                     // descriptive
  aspect?: "21/9" | "16/9" | "3/2"; // default 21/9 desktop, 4/3 mobile
  intensity?: "calm" | "cinematic"; // edge-gradient strength
  topBlend?: boolean;              // gradient bleed into bg above
  bottomBlend?: boolean;
  priority?: boolean;              // eager-load when above the fold
}
```

Behavior:
- Aspect: `aspect-[4/3] md:aspect-[21/9]` — phones get a closer crop so the bleed never feels stretched.
- Image rendered at 110% height with subtle `translateY` parallax (-3% → +3% across viewport scroll). Honors `prefers-reduced-motion`.
- Cedar-tinted radial vignette at 8% opacity (uses existing `--cedar` token via `hsl(var(--cedar) / …)`).
- Optional top/bottom `bg-gradient-to-b from-background to-transparent` blends so image dissolves into the cream surround instead of ending in a hard edge.
- Hover: image scales to 1.02 over 700ms (`transition-transform`), no filter shifts.
- `loading={priority ? "eager" : "lazy"}`, `decoding="async"`, explicit `width`/`height` to lock CLS.

### 2. Insertions — drop the bleed into every text-only zone

Pull from existing `src/assets/` library — no new asset generation needed.

| Page | Position | Image | Aspect | Intensity |
|---|---|---|---|---|
| `/` Index | After **BrandStatement**, before Services | `hero-architect-color.jpg` (re-uses hero asset, fine — it's a different crop emphasis) **or** `sauna-backyard-premium.jpg` | 21/9 | cinematic |
| `/` Index | After TestimonialStrip, before Closer | `sauna-mountain-premium.jpg` | 21/9 | calm |
| `/about` | After section-story, before section-process | `sauna-interior-editorial.jpg` (process/detail mood) | 21/9 | calm |
| `/about` | After section-process, before section-areas | `sauna-acreage-premium.jpg` (Alberta horizon) | 21/9 | cinematic |
| `/services` | After section-catalogue, before section-contract | `sauna-stones-premium.jpg` (material/detail) | 21/9 | calm |
| `/services` | After MiniFaq, before Closer | `hero-architecture.jpg` | 16/9 | calm |

### 3. `/contact` — single funnel-friendly bleed

Contact is intentionally stripped (`NavigationMinimal`, no rail). Inserting a 21:9 break above the form would steal conversion focus. Instead, add a **slim 32vh photo band ABOVE the headline strip** using `sauna-interior-detail.jpg` — sets tone without competing with the form. Edges blend into background. No copy overlay.

### 4. About `section-story` — convert to 2-column

Currently centered prose. Convert to `grid lg:grid-cols-[6fr_5fr]` with the prose on the left and a portrait-aspect (`aspect-[3/4]`) image on the right (`sauna-backyard-premium.jpg` cropped portrait). The pull-quote stays centered below the row, full-width. This gives the page its first photograph before users hit `section-process`.

### 5. Services `section-contract` — anchor with a side image

Currently a 2-column "What we handle / What you handle" grid. Wrap it in a 12-column outer grid: image (col-span-4, aspect-[4/5], `cedar-texture-premium.jpg`) + matrix (col-span-8). On mobile the image stacks above the matrix with `aspect-[16/9]`. Subtle, doesn't change the matrix mechanics.

## What stays text-only on purpose

- **QuoteCloserCard** — flat evergreen plate is the canonical CTA brand block. Adding imagery dilutes it.
- **The service catalogue list** — the typographic list IS the editorial statement. The new bleed below it is the relief.
- **MiniFaq** — also intentional negative space; the bleeds we add on either side of it provide the rhythm.
- **TestimonialStrip** — same reasoning; bleeds adjacent to it give the breathing room.

## Technical details

- All inserted images already exist in `src/assets/` (no AI gen, no new asset budget).
- `EditorialImageBreak` is lazy by default; mark the homepage's first insertion `priority` only if it lands above the fold on common viewports (likely lazy is fine — Hero + BrandStatement push it well below).
- Reuse `useReveal` for fade-in to match site-wide motion language.
- Honor `motion.ts` reduced-motion guard for the parallax.
- No changes to `tailwind.config.ts`, design tokens, or fonts. Strictly cream + cedar palette.
- No changes to navigation, gallery config, services config, or any CTA flow.

## File changes

1. **NEW** `src/components/media/EditorialImageBreak.tsx`
2. `src/pages/Index.tsx` — import + insert two breaks
3. `src/pages/About.tsx` — convert story to 2-col + insert two breaks
4. `src/pages/Services.tsx` — wrap contract in image+matrix grid + insert two breaks
5. `src/pages/Contact.tsx` — slim photo band above headline

## Verification

1. Visit `/`, `/about`, `/services`, `/contact`, `/work` and confirm no consecutive text-only sections remain.
2. Mobile (375px), tablet (768px), desktop (1280px+) — bleeds adapt aspect, no horizontal scroll.
3. Lighthouse: CLS unchanged (explicit width/height on every new img); LCP unaffected (Hero is still the LCP, all bleeds lazy).
4. Screen reader: every new image has descriptive alt; sections retain `aria-label` where needed.
5. `prefers-reduced-motion`: parallax + scale transitions disabled.
