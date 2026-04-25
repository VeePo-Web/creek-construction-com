# B&P Sauna — World-Class Design System & UX Engineering Style Guide

*Version 2.0 — Crafted with the rigor of Fantasy.co, Igloo.inc, Frog, and Pentagram*

---

## I. Brand DNA & Design Philosophy

### Mission
B&P Sauna builds outdoor-only, cedar-interior, turnkey-installed saunas for Alberta homeowners. The brand embodies **ritual over novelty** — positioning the sauna not as a luxury purchase but as a permanent infrastructure for daily recovery.

### Design Philosophy: "Warm Minimalism"
The site follows a **warm minimalist** aesthetic — editorial restraint with thermal undertones. Every visual decision reinforces the metaphor of **heat building gradually**: from cool neutrals to cedar warmth, from silence to ritual.

**Core Metaphor:** The website *is* the sauna experience. You enter cool (Hero), warm up (RitualIdentity → Services), reach peak heat (Testimonials → Portfolio), and emerge transformed (LifeAfterFirstHeat → Contact).

### Three Design Filters
Every decision passes through:
1. **Elevate the Human Experience** — Does this serve the user's emotional journey from curiosity to commitment?
2. **Embody Brand Truth with Excellence** — Does this pixel, transition, or word authentically represent the cedar-and-ritual identity?
3. **Innovate Responsibly for Impact** — Does this interaction earn its complexity, or is it decoration?

---

## II. Color System

### Foundation Palette

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `30 20% 97%` | Page canvas — warm off-white, never pure white |
| `--foreground` | `20 10% 12%` | Primary text — warm near-black, never pure black |
| `--secondary` | `30 15% 93%` | Alternating section backgrounds |
| `--muted` | `25 10% 93%` | Subdued backgrounds (Portfolio section) |
| `--muted-foreground` | `25 8% 45%` | Secondary text, captions, descriptions |
| `--cedar` | `28 50% 52%` | Brand accent — CTAs, borders, highlights |
| `--cedar-hover` | `28 50% 45%` | Cedar darkened for hover states |
| `--border` | `25 12% 88%` | Structural borders — warm gray, never cool |

### Color Rules
- **Never use pure white (`#fff`) or pure black (`#000`)** — all neutrals carry warm undertones (hue 20–30)
- **Cedar is the only accent** — no secondary colors, no blue, no green, no red
- **Opacity as expression** — cedar at varying opacities (0.04–1.0) creates the entire emotional range
- **Background alternation** — sections alternate between `--background` (97% lightness) and `--secondary` (93% lightness) to create subtle visual rhythm without hard borders

### The Cedar Opacity Scale
Cedar at different opacities serves different emotional purposes:

| Opacity | Emotional Register | Usage |
|---------|-------------------|-------|
| 0.02–0.04 | Ambient warmth | Background tints, hover card fills |
| 0.06–0.12 | Gentle presence | Gradient veils, radial backgrounds |
| 0.15 | Whisper | First item in thermal crescendo, divider start |
| 0.20–0.30 | Awareness | Tag borders, subtle separators |
| 0.40 | Building warmth | Mid-crescendo borders |
| 0.50–0.60 | Confident presence | Cedar divider lines at mid-opacity |
| 0.70–0.80 | Full warmth | Final crescendo items, strong borders |
| 1.0 | Full commitment | CTA buttons, active states, divider lines |

### Dark Mode Considerations
The site intentionally does **not** implement a dark mode toggle. The warm minimalist palette is the brand identity — a dark mode would undermine the "warm off-white canvas" that mimics the feeling of entering a cedar-lit space. The hero and footer already provide dark contrast within the thermal narrative arc.

---

## III. Typography

### Font Stack

| Role | Font | Fallbacks | CSS Class |
|------|------|-----------|-----------|
| **Display / Headlines** | DM Serif Display | Georgia, serif | `.text-architectural` / `font-serif` |
| **Body / UI** | DM Sans | system-ui, sans-serif | Default `font-sans` |
| **Labels / Metadata** | DM Sans (uppercase) | system-ui, sans-serif | `.text-minimal` |

### Typography Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Tracking | Leading |
|---------|---------------|---------------|--------|----------|---------|
| H1 (Hero) | `text-8xl` (6rem) | `text-5xl` (3rem) | 300 (light) | `-0.02em` | `1.1` |
| H2 (Section Title) | `text-6xl` (3.75rem) | `text-4xl` (2.25rem) | 300 (light) | `-0.02em` | `1.1` |
| H3 (Sub-heading) | `text-2xl` (1.5rem) | `text-2xl` | 300 (light) | `-0.02em` | `1.1` |
| Body | `text-lg` (1.125rem) | `text-lg` | 400 (regular) | Normal | `1.75` (relaxed) |
| Caption / Label | `text-xs` (0.75rem) | `text-xs` | 500 (medium) | `0.15em` | Normal |
| Stat Number | `text-4xl` (2.25rem) | `text-3xl` | 300 (light) | `-0.02em` | `1.1` |
| Signature Line | `text-lg` (1.125rem) | `text-lg` | 300 (light) | Normal | `1.6` |

### Typography Rules
- **Headlines always use DM Serif Display** via `.text-architectural` — this is the brand's "signature" typeface
- **Labels always use `.text-minimal`** — uppercase, `0.15em` tracking, `text-xs`, `font-medium`
- **Body text uses DM Sans** at `text-lg` with `leading-relaxed` for comfortable reading
- **Never bold body text** — use `font-medium` (500) at most; the brand voice is confident, not aggressive
- **Quotes use `.text-architectural`** at `text-xl md:text-2xl` with `font-light` — editorial, not decorative
- **Numbers/stats use `.text-architectural`** — the serif font gives figures gravitas
- **Signature lines** — italic serif phrases beneath section titles that distill emotional intent. Always `text-foreground/60 italic font-serif`

### Custom Typography Classes
```css
.text-architectural {
  tracking: -0.02em;
  line-height: 1.1;
  font-family: 'DM Serif Display', Georgia, serif;
}

.text-minimal {
  tracking: 0.15em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: 'DM Sans', system-ui, sans-serif;
}
```

---

## IV. Spacing System

### Section Rhythm
- **Section padding:** `py-32` (8rem / 128px) — generous vertical breathing room
- **Container max-width:** `max-w-7xl` (80rem) with `px-6` horizontal padding
- **Content max-width:** `max-w-4xl` for single-column narrative sections (RitualIdentity, LifeAfterFirstHeat)
- **Grid gap:** `gap-20` (5rem) for 2-column layouts, `gap-12` for 3-column grids

### Internal Spacing
- **Section label → Title:** `mb-4` to `mb-6` (1–1.5rem)
- **Title → Signature line:** `mb-4` (1rem) — tight coupling
- **Signature line → Body:** `mb-12` to `mb-16` (3–4rem)
- **Title → Body (no signature):** `mb-12` to `mb-16` (3–4rem)
- **Body → Content grid:** `mb-16` to `mb-20` (4–5rem)
- **Between list items:** `space-y-6` to `space-y-8` (1.5–2rem)
- **Between major content blocks:** `space-y-24` (6rem) — portfolio projects

### The Breathing Rule
Every section ends with enough whitespace to let the content "exhale" before the next section begins. This is non-negotiable — compressed sections feel cheap. The `py-32` baseline ensures each section commands its own viewport territory.

---

## V. The Thermal Crescendo Pattern

The site's signature visual motif. Sequential content uses **progressive cedar border opacities** to create a sense of building intensity.

### Standard Three-Step Crescendo
Used when content has 3 items:
- Item 1: `hsl(28 50% 52% / 0.15)` — whisper
- Item 2: `hsl(28 50% 52% / 0.40)` — building
- Item 3: `hsl(28 50% 52% / 0.80)` — full warmth

**Applied in:** RitualIdentity, Portfolio, LifeAfterFirstHeat, Contact steps

### Four-Step Crescendo
Used for 4-item content:
- `0.15 → 0.30 → 0.55 → 0.80`

**Applied in:** Services

### Five-Step Crescendo
Used for 5-item content:
- `0.20 → 0.40 → 0.60 → 0.80 → 1.00`

**Applied in:** About (First Heat Process)

### Implementation
Always use inline styles with template literals — Tailwind arbitrary values are less readable for progressive opacity:
```tsx
style={{ borderLeft: `2px solid hsl(28 50% 52% / ${opacityValue})` }}
```

### Rule
**Every ordered list on the homepage must use the thermal crescendo.** If items are visually similar and sequentially ordered, they get progressive cedar borders. No exceptions.

---

## VI. Interaction Design

### The Warmth Principle
> "Attention creates warmth."

Every interactive element responds to user proximity with cedar-tinted feedback. The hover state is a "warming" — the element acknowledges the user's presence.

### Hover States by Element Type

| Element | Default | Hover | Transition |
|---------|---------|-------|------------|
| **CTA Button** | `bg-cedar` | `bg-cedar-hover` + `shadow-[0_0_20px_hsl(28_50%_52%/0.3)]` | `duration-500` |
| **Service Card** | Transparent | `bg-cedar/[0.04]` | `duration-500` |
| **Service Title** | `text-foreground` | `text-cedar` | `duration-500` |
| **Testimonial Card** | `bg-background/40` | `bg-background/60` + border intensifies | `duration-500` |
| **Portfolio Image** | Static | `scale-105` + cedar gradient overlay slides up | `duration-700` |
| **Community Tag** | `border-cedar/[opacity]` | `border-cedar/50` + `bg-cedar/5` | `duration-500` |
| **Footer Link** | `text-primary-foreground/70` | `text-primary-foreground` + `text-shadow` | `duration-300` |
| **Nav Link** | Static | `letter-spacing: 0.18em` + cedar underline slides in + `text-shadow` glow | `duration-300` |
| **Interior Image** | Static | `scale-105` + cedar gradient overlay fades in | `duration-700` |
| **ImageDivider** | Static | Cedar warmth layer fades in + center line expands to `w-24` | `duration-1000` |
| **List Items** | `pl-4` | `pl-6` or `pl-8` + `bg-accent/5` | `duration-500` |

### Transition Timing
- **300ms** — Quick responses: borders, colors, small elements
- **500ms** — Standard interactions: cards, backgrounds, titles
- **700ms** — Cinematic: images, overlays, large-scale transforms
- **1000–1200ms** — Scroll reveals, entrance animations

### Easing Function
All custom animations use: `cubic-bezier(0.16, 1, 0.3, 1)` — a smooth, decelerating curve that feels organic and unhurried. This is the brand's "breathing" easing.

---

## VII. Scroll Reveal System

### useScrollReveal Hook
The primary entrance animation system. Wraps sections in an IntersectionObserver that triggers staggered child reveals.

### Parent Container
- Initial state: `opacity: 0; translateY(40px)`
- Revealed state: `opacity: 1; translateY(0)`
- Transition: `1s cubic-bezier(0.16, 1, 0.3, 1)`
- Trigger: `threshold: 0.15` (15% visible)

### Child Elements (`data-reveal-child`)
- Initial state: `opacity: 0; translateY(30px)`
- Auto-stagger: Each child delays by `i * 0.1s`
- Custom delay: `data-reveal-delay="0.5"` overrides auto-stagger
- Transition: `0.8s cubic-bezier(0.16, 1, 0.3, 1)`

### Scale Reveal (Portfolio)
Used for portfolio project images:
- Initial: `opacity: 0; scale(0.96)`
- Revealed: `opacity: 1; scale(1)`
- Transition: `1.2s cubic-bezier(0.16, 1, 0.3, 1)`

### Rules
- **Every section on the homepage uses useScrollReveal** — no section appears without an entrance animation
- **Stagger delays should feel intentional** — label appears first, then title, then signature line, then body, then interactive elements
- **prefers-reduced-motion is always respected** — all animations are disabled for users who prefer reduced motion

---

## VIII. Section Architecture

### Section Anatomy
Every content section follows this structure:
```
┌─────────────────────────────────────┐
│ Gradient veil (optional)            │ ← Visual continuity from previous section
├─────────────────────────────────────┤
│ py-32 padding-top                   │
│                                     │
│ ┌─ container mx-auto px-6 ────────┐ │
│ │ ┌─ max-w-7xl ─────────────────┐ │ │
│ │ │                             │ │ │
│ │ │ LABEL (.text-minimal)       │ │ │ ← Always uppercase, always first
│ │ │ mb-4                        │ │ │
│ │ │ TITLE (.text-architectural) │ │ │ ← DM Serif Display, font-light
│ │ │ mb-4                        │ │ │
│ │ │ SIGNATURE LINE (italic)     │ │ │ ← Optional: italic serif phrase
│ │ │ mb-12 to mb-20              │ │ │
│ │ │ CONTENT                     │ │ │ ← Body text, grids, lists
│ │ │                             │ │ │
│ │ │ SECTION CTA (optional)      │ │ │ ← Contextual cedar button
│ │ │                             │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ py-32 padding-bottom                │
│ Gradient bleed (bottom, optional)   │ ← Smooth transition to next section
└─────────────────────────────────────┘
```

### Section Background Pattern
```
Hero            → Dark image with gradient overlay
RitualIdentity  → --background (warm off-white) + gradient veil from hero
ImageDivider    → Cedar texture image with parallax
Services        → --background + gradient bleed to --secondary
About           → --secondary (slightly darker warm gray)
ImageDivider    → Sauna stones image with parallax
Testimonials    → Gradient blend (secondary → muted → secondary)
Portfolio       → --muted + top bleed from secondary + bottom bleed to dark
ImageDivider    → Winter steam image with parallax
LifeAfterFirstHeat → Background image with secondary overlay
Contact         → --background + gradient veils top and bottom
Footer          → --primary (dark charcoal, inverted)
```

### Gradient Veils
Sections use gradient veils at their edges to bleed visual tone from adjacent sections:
- **Top veil (from dark section):** `h-40`, `hsl(20 10% 8% / 0.12) → transparent`
- **Bottom veil (to dark section):** `h-24–32`, `transparent → hsl(20 10% 8% / 0.06–0.08)`
- **Bottom veil (to footer):** `transparent → hsl(var(--primary) / 0.06)`
- **Bottom veil (to lighter section):** `transparent → hsl(var(--secondary))`

**Rule:** No section should have a hard color break with its neighbor. Every transition must be bridged with a gradient bleed.

---

## IX. Component Patterns

### CTA Button
```tsx
<Link
  to="/plan"
  className="inline-block text-minimal bg-cedar text-cedar-foreground px-8 py-4 rounded-sm hover:bg-cedar-hover transition-all duration-500 hover:shadow-[0_0_20px_hsl(28_50%_52%/0.3),0_4px_12px_hsl(28_50%_52%/0.15)]"
>
  GET MY SAUNA PLAN
</Link>
```
- Always uses `.text-minimal` (uppercase, tracked)
- Always `rounded-sm` — not `rounded-md` or `rounded-lg`
- Always links to `/plan`
- Hover includes warm glow shadow
- Copy is always "GET MY SAUNA PLAN" (homepage) or contextual variant
- Footer CTA may display "START YOUR RITUAL" after 60% scroll (ritual timer sync)

### CTA with Arrow (Directional)
```tsx
<Link
  to="/plan"
  className="inline-flex items-center gap-3 text-minimal bg-cedar text-cedar-foreground px-8 py-4 rounded-sm hover:bg-cedar-hover transition-all duration-500 hover:shadow-[...] group"
>
  GET MY SAUNA PLAN
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
</Link>
```
Used in Contact section where directional emphasis is appropriate.

### Cedar Divider Line
```tsx
<div className="divider-line mx-auto" /> // 64px wide, 1px tall, cedar color, centered
```
Used between major content blocks. **Always centered** with `mx-auto` when between sections or between projects.

### Service/Feature Item
```tsx
<div
  className="pl-4 py-6 transition-all duration-500 group-hover:bg-cedar/[0.04]"
  style={{ borderLeft: `2px solid hsl(28 50% 52% / ${opacity})` }}
>
  <span className="text-minimal text-cedar">{number}</span>
  <h4 className="text-architectural group-hover:text-cedar transition-colors duration-500">{title}</h4>
  <p className="text-muted-foreground leading-relaxed">{description}</p>
</div>
```

### Testimonial Card
- Top border with progressive cedar opacity (0.1 → 0.2 → 0.35)
- Background transitions from `bg-background/40` to `bg-background/60` on hover
- Expanding cedar line at top (width increases on hover from 8/12/20px → 16/24/full)
- Serif quotation mark at `text-5xl cedar/60` — decorative, editorial
- Anxiety tag in bordered pill with cedar hover

### Community/Service Area Tag
```tsx
<span
  className="text-sm text-muted-foreground border px-4 py-2 transition-all duration-500 cursor-default hover:text-foreground hover:bg-accent/5"
  style={{ borderColor: `hsl(28 50% 52% / ${baseOpacity})` }}
  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'hsl(28 50% 52% / 0.5)')}
  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `hsl(28 50% 52% / ${baseOpacity})`)}
>
  {city}
</span>
```
Tags use progressive cedar opacity based on index: `0.08 + i * 0.06`

### Signature Line Pattern
Italic serif phrase beneath a section title that distills the emotional intent:
```tsx
<p className="text-lg text-foreground/60 italic font-serif" data-reveal-child>
  The foundation of your daily ritual.
</p>
```
Every section should have one. It bridges the gap between the structural title and the explanatory body text.

### Editorial Provenance Signature
A closing mark at the bottom of each page that anchors the brand's editorial voice. Always italic serif at near-invisible opacity:
```tsx
<p className="text-sm font-serif italic text-foreground/25 mt-10">
  — The B&P Standard · Alberta-Built Since Day One
</p>
```

**Page-specific signatures:**
| Page | Signature |
|------|-----------|
| Home (Footer) | `Est. Alberta · Crafted with Cedar & Intention` |
| Signature 8×8 | `The Signature Standard · Est. Alberta · B&P` |
| Custom Builds | `Bespoke But Controlled · Est. Alberta` |
| Our Standard | `The B&P Standard · Alberta-Built Since Day One` + `Six Non-Negotiables · Every Sauna · Every Time` |
| Resources | `Knowledge Before Commitment` |
| Blog Post | `Cedar & Intention` |
| Plan (Contact) | `Est. Alberta · Crafted with Cedar & Intention` |

**Rules:**
- Always `text-foreground/25` or `text-foreground/15` — provenance is felt, not read
- Always italic serif (`.font-serif .italic`)
- Always positioned after the final CTA, with `mt-10` spacing
- Never duplicates the page title — distills a different facet of brand truth

---

## X. Image Treatment

### Hero Image
- Full viewport height (`h-screen`)
- Ken Burns drift animation: `scale(1.15)` with slow translate, 25s loop
- Parallax on scroll: `translateY(offset) scale(1.15)`
- Gradient overlay: `from-black/70 via-black/40 to-black/60`
- Bottom cedar veil: gradient from transparent to `hsl(28 50% 52% / 0.12)`
- Content fades out on scroll with opacity + translateY
- Progressive darkening overlay: separate div that increases opacity as user scrolls away — "the cooling"
- Alt text: empty (`alt=""`) with `role="presentation" aria-hidden="true"` — decorative

### Image Divider (Cedar Texture / Sauna Scenes)
- `h-[45vh]` — shorter than hero, acts as visual punctuation
- Parallax with `scale(1.15)` and clamped vertical offset (±60px)
- Cinematic vignette overlay: foreground color at varying opacities (30% edges, 3% center)
- Cedar warmth layer on hover: fades in at 8% opacity over 1000ms
- Centered cedar divider line that fades in on intersection, expands to `w-24` on hover
- Always `lazy` loaded
- Alt text: empty — decorative dividers

### Portfolio Images
- Full-width: `h-[70vh]` (first project), `h-[50vh]` (split layout + final)
- Scale reveal entrance: `scale(0.96) → scale(1)` on intersection
- Hover: `scale(1.05)` + cedar gradient overlay slides up from bottom
- Always `lazy` loaded
- Alt text: project description — meaningful for accessibility

### Interior Photo (About)
- `h-96` with `object-cover`
- Hover: `scale(1.05)` with `duration-700`
- Dark gradient at bottom for depth
- Cedar warmth gradient appears on hover — bottom-up, 12% opacity
- No decorative overlay at rest — lets the cedar interior speak for itself

---

## XI. Navigation UX Engineering

The navigation bar is the most engineered component on the site. It contains 45+ micro-interactions that collectively create a "living" progress system.

### Core Behaviors
1. **Scroll Progress Bar** — Cedar-colored bar tracks scroll position on homepage
2. **Section Dots** — Mark major section positions on the progress bar
3. **Steam Trail** — Current section name appears as label
4. **Hide on Scroll Down / Show on Scroll Up** — Standard smart-hide pattern
5. **Transparent → Solid** — Starts transparent on hero, solidifies on scroll

### Advanced Micro-Interactions (Selection)
- **The Breath (#6)** — Progress bar subtly pulses when scrolling stops for 3s
- **The Threshold (#7)** — Cedar pulse sweeps the bar when user scrolls past the hero
- **The Ember Trail (#9)** — Radial gradient follows cursor across nav bar
- **The Cedar Grain (#13)** — Texture scrolls across progress bar border, direction-synced
- **The Stone Count (#14)** — Milestone dots appear at 25/50/75/100% scroll
- **The Tideline (#22)** — Faint marker shows highest scroll point reached
- **The Patina (#27)** — Nav surface subtly "wears" over multiple visits
- **The Vapour (#30)** — Steam wisps rise from idle cursor position
- **The Kindling (#41)** — First-ever scroll creates a spark streak
- **The Sisu (#42)** — Sustained scrolling triggers a brief endurance glow
- **The Rekka (#45)** — Rapid scrolling emits ember particles

### Rule
All navigation micro-interactions must:
- Respect `prefers-reduced-motion`
- Be imperceptible on first glance — they reward attention, not demand it
- Use cedar color exclusively — no other accent colors
- Clean up their timers and observers on unmount

---

## XII. Motion Choreography

### Page Load Sequence (Hero)
```
0.0s — Image begins Ken Burns drift
0.2s — First headline line clip-reveals from bottom
0.5s — Second headline line clip-reveals
0.8s — Third headline line clip-reveals
1.1s — Subtitle fades up
1.3s — Cedar divider line fades in
1.5s — CTA button fades up
1.8s — Scroll indicator (heat drip) fades in
```

### Scroll Reveal Choreography
Each section reveals its children in this order:
1. Section label (`.text-minimal`) — 0s delay
2. Section title (`.text-architectural`) — 0.1s delay
3. Signature line (italic serif) — 0.2s delay (if present)
4. Body text — 0.2–0.3s delay
5. Content elements — 0.3s+ with incremental stagger
6. CTA — last element, highest delay

### The Heat Drip (Scroll Indicator)
```css
@keyframes heat-drip {
  0% { transform: translateY(-100%); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(250%); opacity: 0; }
}
```
A cedar-colored gradient drops down a thin vertical line on loop — suggesting heat rising, inverted. 2.4s cycle.

---

## XIII. Accessibility Standards

### Non-Negotiable Requirements
- **Color Contrast:** All text meets WCAG AA (4.5:1 for body text, 3:1 for large text and UI components)
- **Focus Visible:** Custom focus ring uses cedar color: `outline-color: hsl(var(--cedar))`, `outline-offset: 2px`
- **Semantic HTML:** Proper heading hierarchy (single H1 in Hero, H2 for section labels, H3 for titles)
- **Alt Text:** All meaningful images have descriptive alt text; decorative images use `alt="" role="presentation" aria-hidden="true"`
- **Keyboard Navigation:** Quick Nav (`/` key), all interactive elements focusable, Tab order follows visual order
- **Reduced Motion:** Complete reduced-motion support — all animations disabled, instant state application, global `transition-duration: 0.01ms` override
- **Landmark Roles:** `<nav>`, `<main>`, `<footer>`, `<section>` used semantically
- **ARIA:** Testimonial blockquotes use `cite` attribute, navigation uses `aria-label`, scroll indicator uses `aria-label`
- **Touch Targets:** All interactive elements minimum 44×44px on mobile
- **Skip Link:** Consider adding a "Skip to content" link for keyboard users (future enhancement)

### Contrast Validation
| Pair | Ratio | Pass? |
|------|-------|-------|
| `--foreground` on `--background` | ~14:1 | ✅ AAA |
| `--muted-foreground` on `--background` | ~4.7:1 | ✅ AA |
| `--cedar` on `--background` | ~3.5:1 | ✅ AA Large |
| `--cedar-foreground` on `--cedar` | ~6:1 | ✅ AA |
| White on hero overlay | ~7:1+ | ✅ AAA |
| `--primary-foreground` on `--primary` | ~14:1 | ✅ AAA |

### Decorative vs. Meaningful Images
- **Decorative (alt=""):** Hero background, ImageDivider textures, LifeAfterFirstHeat background
- **Meaningful:** Portfolio project images (use project description), About interior photo (describe scene), blog post thumbnails

---

## XIV. Performance Guidelines

### Image Optimization
- All below-fold images use `loading="lazy"`
- Hero image loads eagerly (it's above the fold)
- Images use `object-cover` to prevent distortion
- Parallax uses `will-change: transform` only when active, removed when out of viewport

### Animation Performance
- All scroll-driven animations use `requestAnimationFrame` with ticking guards
- IntersectionObserver for visibility detection — no scroll position polling
- `will-change` is applied dynamically, not permanently
- CSS transforms preferred over layout-triggering properties
- GPU-composited properties only: `transform`, `opacity`, `filter`

### JavaScript Hygiene
- All event listeners cleaned up in useEffect return functions
- Timers cleaned up on unmount
- Observers disconnected on unmount
- No memory leaks from abandoned intervals
- Navigation component manages 45+ refs and timers — all properly cleaned up

### Bundle Considerations
- No external animation libraries — all motion is CSS + vanilla JS
- Images imported as ES modules for tree-shaking and Vite optimization
- Component code-splitting via React Router lazy loading (future enhancement)

---

## XV. Responsive Behavior

### Breakpoints
- **Mobile:** Default (< 768px)
- **Tablet/Desktop:** `md:` prefix (≥ 768px)
- **Large Desktop:** `lg:` prefix (≥ 1024px)

### Mobile Adaptations
- Headlines scale down: `text-5xl → text-4xl` (hero: `text-8xl → text-5xl`)
- Single column layouts replace 2/3-column grids
- Touch targets minimum 44×44px
- Portfolio images reduce to `h-[50vh]` consistently
- Navigation collapses to hamburger menu with "Kiuas Door" thermal animation
- Community tags wrap naturally with `flex-wrap`
- Footer CTA stretches to `w-full` on mobile for easy tapping
- Section padding maintains `py-32` — no reduction on mobile (breathing room is sacred)

### Desktop-Only Features
- Navigation ember trail (cursor-dependent)
- Vapour wisps (cursor-dependent)
- CTA magnetic pull (cursor-dependent)
- Undertow echo (too subtle for touch)
- Condensation droplets (scroll-pause dependent)

---

## XVI. SEO & Meta

### HTML Structure
- Single `<h1>` in Hero: "Traditional Heat. Outdoor-Only. Installed Turnkey."
- `<h2>` for section labels (THE RITUAL, THE BUILD, etc.)
- `<h3>` for section titles
- `<h4>` for sub-sections within a section
- Semantic `<section>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<blockquote>`

### Meta Tags
- Title: Under 60 characters with primary keyword
- Description: Under 160 characters with value proposition
- Viewport: Responsive with `width=device-width, initial-scale=1`
- Canonical tags on all pages
- JSON-LD structured data for LocalBusiness (future enhancement)

### Image SEO
- Meaningful alt text on portfolio images with location + description
- Lazy loading on all below-fold images
- Image dimensions inferred from CSS — no explicit width/height attributes needed for responsive images

---

## XVII. Copy & Content Guidelines

### Voice
- **Confident, not aggressive** — "We handle everything" not "We're the best"
- **Specific, not vague** — "Under 40 minutes at -28°C" not "Fast heating"
- **Second person** — "Your ritual" not "Our customers' rituals"
- **Active voice** — "We install" not "Installation is provided"
- **Evocative, not flowery** — "The day turns off" not "Experience ultimate relaxation"

### Section Label Convention
Always uppercase, always `.text-minimal`, always 2-4 words:
- THE RITUAL, THE BUILD, THE ALBERTA STANDARD, FROM ALBERTA HOMEOWNERS, INSTALLED ACROSS ALBERTA, AFTER FIRST HEAT, START HERE, SERVICE AREAS

### CTA Hierarchy
1. **Primary:** "GET MY SAUNA PLAN" — cedar button, used once per viewport
2. **Secondary:** Section-specific actions — text links with arrows
3. **Tertiary:** Navigation links — underlined on hover

### Signature Line Convention
Every section includes an italic serif line beneath the title:
- RitualIdentity: *"Discipline fades. Infrastructure doesn't."*
- Services: *"Every detail engineered for Alberta conditions."*
- About: *"The foundation of your daily ritual."*
- Testimonials: *"What Alberta homeowners say after first heat."*
- Portfolio: *"Selected from our Alberta installations."*
- LifeAfterFirstHeat: *"Not a product. A turning point."*
- Contact: *"From first call to first session — handled."*

---

## XVIII. Footer Architecture

### Structure
```
┌────────────────────────────────────────┐
│ Top gradient bleed from Contact        │
├────────────────────────────────────────┤
│                                        │
│         ↑ BACK TO TOP                  │
│                                        │
│  ┌──────────┬──────────┬──────────┐    │
│  │ BRAND    │ NAVIGATE │ SERVICE  │    │
│  │ Column   │ Column   │ AREAS    │    │
│  │          │          │          │    │
│  │ [CTA]    │ Links    │ Tags     │    │
│  └──────────┴──────────┴──────────┘    │
│                                        │
│   "Your ritual starts the day          │
│    we install." (italic serif)         │
│                                        │
│  ──────── ◆ ────────                   │ ← Cedar-centered divider
│                                        │
│  © 2026 B&P Sauna                      │
└────────────────────────────────────────┘
```

### Footer Rules
- Background: `bg-primary` (dark charcoal) — inverted color scheme
- Text: `text-primary-foreground` at varying opacities (50% → 70% → 100%)
- CTA button: Same cedar styling, no `rounded-sm` — matches homepage buttons
- "Back to Top" button: Cedar hover color, icon translates up on hover
- Closing ritual line: Serif italic at `text-2xl md:text-3xl`, `primary-foreground/60`
- Cedar-centered divider: Full-width faint line with cedar center segment
- Service area tags: Match Contact section pattern with cedar border hover
- Instagram link: Icon + text, cedar hover

---

## XIX. Design System Governance

### Adding New Components
1. Must use existing design tokens — no custom colors
2. Must include hover state following the warmth principle
3. Must support scroll reveal animation
4. Must respect reduced motion
5. Must be responsive (mobile-first)
6. Must have appropriate alt text on images
7. Must use semantic HTML

### Adding New Sections
1. Follow the section anatomy template
2. Choose appropriate background from the alternation pattern
3. Include gradient veil/bleed for seamless transitions
4. Use thermal crescendo for any sequential content
5. Include at least one cedar accent element
6. Add a signature line beneath the section title
7. Register section ID in Navigation SECTION_LABELS

### Prohibited Patterns
- ❌ Pure white or pure black anywhere
- ❌ Colors outside the cedar palette
- ❌ Rounded corners larger than `rounded-sm` on interactive elements
- ❌ Bold body text (use `font-medium` maximum)
- ❌ Generic stock imagery
- ❌ Animations without reduced-motion fallback
- ❌ Hard background-color transitions between sections
- ❌ Flat/uniform opacity on sequential bordered lists
- ❌ Custom color classes in components — use design tokens
- ❌ External animation libraries — all motion is CSS + vanilla JS
- ❌ Dark mode toggle — the warm palette is the brand identity
- ❌ Inter, Poppins, or other generic AI fonts
- ❌ Purple gradients or any non-cedar accent colors

---

*This style guide is a living document. It evolves with the brand but never compromises on warmth, craft, or the thermal crescendo.*
