# Pass 41 — Quote Form Inline + GlobalMenu Lockup Standardization

The two highest-traffic interactive surfaces still ship in legacy tracking grammar: **QuoteFormInline** (the Contact-page conversion engine — 0.18em / 0.20em / 0.22em mixed across labels, chips, trust strip, CTA) and **GlobalMenu** (fullscreen menu — 0.25em on every cedar caption, 0.22em on a few, 4 different rounded-radius values). Pass 40 closed the chrome at 10px/0.22em; this pass extends that lockup into the conversion form and the menu so a user moving from header → menu → form sees a single consistent tracking density everywhere they look.

QuoteModal stays out of scope (separate pass — it has form parity logic with QuoteFormInline that needs aligned changes, deserves its own focused sweep).

## Principles
- All eyebrow labels: `text-[10px] tracking-[0.22em] uppercase font-medium` (cedar/65 default via `.eyebrow`, or explicit `text-cedar/{55|70|80}` / `text-foreground/{45|65}` when a different mute level is needed).
- All form-control corners: `rounded-[2px]`. No `rounded-[4px]`, no `rounded-sm` (which is 2px in default Tailwind v3 but reads as a different token in code review).
- Field labels stay at 10px (was bouncing between 10px and 11px). The "*" required marker stays cedar; the "(optional)" tag drops to text-[9px] and stays normal-case (already correct).
- Trust strips below CTAs: 10px / 0.22em (was 0.18em).

---

## A. QuoteFormInline (`src/components/quote/QuoteFormInline.tsx`)

### A.1 Phone-ready adornment (L244)
`text-[10px] tracking-[0.18em] uppercase text-cedar` → `eyebrow text-cedar` (the cedar override stays — this is a "go" badge, not a quiet caption).

### A.2 Service group titles (L326)
`text-[10px] tracking-[0.22em] uppercase text-cedar/70 mb-1.5` → `eyebrow opacity-90 mb-1.5` (the cedar/70 maps cleanly onto the cedar/65 default at opacity-100; opacity-90 keeps the slightly stronger reading without naming a color).

### A.3 Service chips (L338)
`rounded-[4px]` → `rounded-[2px]`. (The selected chip's `shadow-[inset_0_-2px_0_hsl(var(--cedar))]` already provides the brand mark — the chip corners read cleaner at 2px against the form's 2px shell.)

### A.4 Timeline label (L358)
`text-[11px] tracking-[0.2em] uppercase font-medium text-muted-foreground` → `eyebrow text-muted-foreground`. Unifies size 11 → 10 with the rest of the form's labels.

### A.5 Timeline radiogroup container (L362)
`rounded-[4px]` → `rounded-[2px]`.

### A.6 Project-details textarea (L396)
`rounded-[4px]` → `rounded-[2px]`.

### A.7 Trust micro-strip (L404)
`text-[10px] tracking-[0.18em] uppercase text-muted-foreground` → `eyebrow text-muted-foreground`. The strip currently reads slightly tighter than its CTA — fixing this aligns it.

### A.8 Submit CTA (L424)
`text-[12px] tracking-[0.22em]` → `text-[11px] tracking-[0.22em]` (keeps tracking, drops 12 → 11 to match every other CTA on the site, including `BUTTON.primary.base` which is the canonical 11px). Min-height stays 52px for thumb tap.

### A.9 Field label (L464)
`text-[11px] tracking-[0.18em] uppercase font-medium text-muted-foreground` → `text-[10px] tracking-[0.22em] uppercase font-medium text-muted-foreground` (matches the form's own service-group titles in §A.2).

### A.10 Optional marker (L469)
Already correct (text-[10px] normal-case tracking-normal). No-op.

### A.11 Input shell (L501)
`rounded-[4px]` → `rounded-[2px]`. (Field <Input/> shared shell.)

### A.12 "pick any" inline note (L319)
Currently `text-[11px] text-muted-foreground/70` (lowercase, italic feel). Drop to `text-[10px] text-muted-foreground/70 italic` for a cleaner subordinate note next to the BronzeRule label. (Italic is reserved for inline asides per the design system.)

## B. GlobalMenu (`src/components/navigation/GlobalMenu.tsx`)

### B.1 Close button (L181, L190)
- L181 `rounded-sm` → `rounded-[2px]` (consistency tag).
- L190 already correct (`text-[10px] tracking-[0.22em] uppercase font-medium`). No-op.

### B.2 "current" marker on active route (L237)
`text-[10px] tracking-[0.25em] uppercase text-cedar/80 font-medium` → `text-[10px] tracking-[0.22em] uppercase text-cedar/80 font-medium`.

### B.3 "Quote a service" caption (L257)
`tracking-[0.25em]` → `tracking-[0.22em]`.

### B.4 Hero photo fallback caption (L327)
`tracking-[0.25em]` → `tracking-[0.22em]`.

### B.5 Hero provenance line (L342)
Already at 0.22em — verify no-op.

### B.6 "Where we build" caption (L353)
`tracking-[0.25em]` → `tracking-[0.22em]`.

### B.7 Metro group labels (L359)
Already at 0.22em — verify no-op.

### B.8 "Home base" inline tag (L375)
`text-[9px] tracking-[0.22em]` → `text-[10px] tracking-[0.22em]` (drops the only 9px label in the menu — hairlines at 1.25× DPR like the NavigationMinimal phone caption did before Pass 40).

### B.9 Bottom trust line (L413)
`text-[11px] tracking-[0.18em] uppercase text-muted-foreground` → `text-[10px] tracking-[0.22em] uppercase font-medium text-muted-foreground` (matches every other label in the menu).

### B.10 Phone link in bottom bar (L424)
`rounded-sm` → `rounded-[2px]`. The `<span className="tracking-[0.06em]">{CONTACT.phone}</span>` at L432 stays — that's the phone-number tracking, not a label.

## C. Verification
1. `/contact` form: every label, chip, timeline button, trust strip, and CTA reads at 0.22em — measured by `letter-spacing` in DevTools across 10+ elements.
2. All form inputs and chip buttons render at 2px corners (sweep DevTools — no `rounded-[4px]` or `rounded-sm` left in the form).
3. Open GlobalMenu (☰) on `/`: every cedar caption ("Quote a service", "Where we build", "current", "Home base", trust line, fallback caption) reads at 0.22em.
4. "Home base" tag renders crisp at 10px (was 9px hairline).
5. Bottom-bar phone pill in the menu has the same 2px corners as the close button at the top.
6. Tab through the form on Contact: focus rings still 2px cedar; field labels haven't visually moved (size shift is 1px so layout is stable).
7. 390 / 768 / 928 (current) / 1440 sweep on `/contact` and on `/` with menu open — no overflow, no layout drift.

## Files to touch
`src/components/quote/QuoteFormInline.tsx`, `src/components/navigation/GlobalMenu.tsx`.
