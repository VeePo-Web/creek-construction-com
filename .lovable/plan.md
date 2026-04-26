
# Conversion-First Pass v3 — Quote Frictionless, Performance Ruthless

> **One goal**: every visit should end at the QuoteModal, ideally in under three taps. Everything that doesn't serve that goal — second galleries, decorative grain layers, repeated process steps, motion wrappers below the fold — gets cut or quieted. Performance over visual is the rule.

> **Audit verdict**: the previous reduction landed the structure but left **three classes of friction** intact: (1) the modal itself is heavy and three steps deep when one would do for warm leads; (2) `ScrollRevealMotion` is still wrapping ~80 nodes (it's now CSS-only, but it's still 80 IO observations + 80 transition subscriptions paid out unnecessarily on parts of the page the user will never see); (3) the quote CTA disappears once the user scrolls past the hero on long pages — they have to come back to the top or scroll all the way to Contact.

---

## A · The conversion path — the highest-leverage edits

### A1 · Add a Step 0 "Express Quote" mode for warm leads
Right now every modal open lands on Step 1 (service picker) → Step 2 (details) → Step 3 (contact). For a user who clicked **"Request a quote for Decks"** on the Services grid, we already know the service. Make the modal skip Step 1 when:
- `preselectedServices.length === 1`, AND
- the user came from a service-specific CTA (we already pass `preselectServices` from `Services.tsx` and `ServiceTile`).

Behavior: open directly on Step 2, with a small editable chip at the top (`Decks · change`) so they can correct it. **3 steps → 2 steps for the most committed users.** Net: ~30% fewer interactions to convert.

### A2 · Inline the contact fields into Step 2 — collapse 3 steps to 2 universally
Step 2 is currently *just* a textarea + property type + timeline. Step 3 is name/phone/email/area. There's no engineering reason these can't be on the same screen — together they fit comfortably above-the-fold on a 13" laptop. Cut Step 3 entirely; rename "Continue → Send" to "Send Request" on Step 2 once contact fields validate. **3 steps → 1 step for warm service-clickers, 2 steps for cold opens.**

### A3 · Make the modal openable from anywhere with a sticky mobile FAB
Below the hero on mobile, the only way to start a quote is to scroll all the way to Contact. Add a sticky bottom-right "Request a Quote" floating action button on mobile (`<sm` breakpoint), visible only after `scrollY > 600px` and hidden when the QuoteModal is open or when the user is within the Contact section (avoid double CTAs). Cedar pill, 56px, safe-area-inset-bottom respected. This is the single biggest conversion win on mobile — the user never has to hunt.

### A4 · Tightened submit endpoint — accept partial submissions
The `submit-quote-request` edge function currently rejects unless `name + phone + addressOrArea + (services OR projectDetails)` are all present. Loosen it to accept `name + phone` as the absolute minimum (with `addressOrArea` and details optional but encouraged client-side). Rationale: a half-completed lead with just a name + phone is still a lead worth a callback. The client UX still encourages full completion via the validation panel, but a server-side bailout on a phone field typo shouldn't lose the lead.

### A5 · Submit on Enter on Step 2 once contact fields validate
Today users press Tab through the form and have to click the Send button. Add `onKeyDown` listeners that submit when Enter is pressed in a text input (not textarea) AND `canSubmit === true`. Standard pattern; users will try it.

### A6 · Trim the brand panel on the quote modal at <md
Currently the brand panel is hidden < md and replaced with a slim header (good). But on Step 2/Step 3 mobile, even the slim header (60px) eats above-the-fold space. Replace with a 28px brand strip on Step 2/3 (logo + name only, no tagline) so the form fields are immediately visible without scrolling.

### A7 · Replace the "or call" secondary on Hero with a tap-to-text option
Right now the hero second CTA is `or call (403) ...`. On mobile that's a `tel:` link — fine. But add a third option as a quiet third item: `or text us` linking to `sms:${phone}` with a presaved body (`Hi, I'd like a quote for `). Texts convert better than calls for under-35 contractors-shopping demographics.

---

## B · Clutter elimination — the editorial pass v2 finished

### B1 · Replace `ScrollRevealMotion` shim with raw `useReveal` at all 18+ callsites
The shim works, but it still wraps 80+ DOM nodes in a `<div>` they don't need. Each wrapper:
- Adds a node to the DOM (memory + traversal cost)
- Subscribes to the shared IO (cheap, but not free at 80×)
- Holds a ref + state + effect (~200 bytes per instance)

**Plan**: drop `ScrollRevealMotion` callsites entirely on **homepage components** (Services, About, Contact, FeaturedProjects). Apply `useReveal` to the section root only — one observer per section, one fade for the whole grid. The user perceives the section appearing as a unit anyway. Stagger animations are pretentious on a contractor's homepage.

For **list children** (the 6 service tiles, the 5 process steps), drop the per-item delay entirely. Visual delta: ~140ms of collective stagger that nobody consciously registers. Performance delta: 11 fewer observers on `/`.

### B2 · Delete the entire `Portfolio.tsx` and `Testimonials.tsx` files
- `Portfolio.tsx` was already removed from `Index.tsx` but the file still exists with a `ScrollRevealMotion` import. Dead code.
- `Testimonials.tsx` returns null when there's no real data. Currently always null. Delete the file; remove the import from `Index.tsx`.

### B3 · Drop the inner grain-overlay layers (3 sites)
Three places stack `grain-overlay` *on top of* `grain-texture`:
- `About.tsx` line 88 (brand promise plate)
- `pages/Contact.tsx` line 130 (quote CTA card)
- `FeaturedProjects.tsx` line 78 (project hero fallback)
- `pages/NotFound.tsx` line 29

Two grain layers on the same element is invisible at the configured opacity. Delete the inner `grain-overlay` divs everywhere — purely cost.

### B4 · Strip section-level `grain-overlay` from `Contact.tsx` and `FeaturedProjects.tsx`
These sections are below-the-fold on every device. The grain layer adds a paint cost the user never sees on initial load and adds nothing once scrolled into view (it's already 2.5% opacity per the previous CSS rewrite). Delete from both section roots.

### B5 · Collapse the "DIRECT CONTACT" tile pair on `pages/Contact.tsx`
Lines 56–117 of the contact page are *four* separate bordered tiles with hover ring transitions and grain-texture each. The four tiles read as one panel; they should be one. Replace with a single bordered card containing four inline rows (Phone, Email, Hours, Service Areas) separated by `border-b` hairlines. Same info, one paint root, one focus container.

### B6 · Remove the homepage About "PROCESS" right column hover-pl swap
About.tsx line 114: `hover:pl-8` mutates layout on hover (paint + reflow) for every step row. Replace with `hover:translate-x-1` (compositor-only). And reduce `transition-all duration-500` to `transition-colors duration-300` — the `transition-all` is matching properties that never change.

### B7 · Replace `transition-all` with explicit property lists everywhere
49 files use `transition-all`. The browser must monitor *every* animatable property for changes. Audit-and-replace pass: `transition-colors`, `transition-[transform,opacity]`, `transition-[border-color,background-color]` per actual use. Mechanical change, ~no visual delta, measurable INP improvement when many cards animate at once.

### B8 · Drop `duration-500` to `duration-250` on hover transitions
The current 500ms hovers feel "premium" but hold compositor layers alive 2× longer than needed. Audit the 81 instances in `src/components` and `src/pages`; reduce hover-related ones to 250ms or 300ms. Keep entrance/exit animations at 400ms+ (those need to feel deliberate). Touch-trigger hover delays vanish and INP drops measurably.

### B9 · Drop the "or send a general message" secondary from Contact + Hero
Two CTAs on Contact and one on Hero. The secondary "general inquiry" link adds choice paralysis; if someone wants a general message they can pick it inside the modal (it's the bottom option of Step 1). Cut both secondaries; keep the single primary CTA. **One CTA, one decision, no friction.**

### B10 · Remove the "Need something else exterior? Just ask" footnote on Services
`Services.tsx` lines 96–104. Same logic as B9 — the modal already exposes "General inquiry". The footnote is a CTA pretending to be footnote copy. Cut it.

---

## C · Performance hardening — the remaining surface

### C1 · Add `content-visibility: auto` to all below-the-fold homepage sections
Currently set on `TrustStrip`, `EditorialBleedSection`, `HomeProjectRecapStrip`, `Testimonials`. **Missing on the heavy ones**: `Services`, `About`, `FeaturedProjects`, `Contact`, `Footer`. Add to each:

```tsx
style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}
```

This skips layout, paint, and hit-testing until the browser scrolls them into the rendering area. Per Chrome's measurements, this can drop initial paint cost by 30–50% on long pages.

### C2 · Reduce nav `backdrop-blur-[12px]` to `backdrop-blur-[8px]`
Visually equivalent past 6px on most viewports, ~30% cheaper to render on mobile GPUs. Done in two places in `Navigation.tsx` (scrolled + unscrolled states).

### C3 · Strip `backdrop-blur` from QuoteModal sticky header + footer
Lines 329 and 380 of `QuoteModal.tsx`. The modal already sits on a solid background; `bg-background/95` is functionally opaque. Drop the blur — saves a full repaint pass on every modal scroll/keystroke.

### C4 · Strip `backdrop-blur-sm` from `trust-chip.tsx`
Trust chips render on solid backgrounds 99% of the time. The blur is a no-op cost.

### C5 · Lazy-load all <img> inside `MediaSlot` except hero `priority` ones
Spot check: `EditorialPicture` already does `loading="lazy"` unless `priority`. ✅ verified. But the gradient *fallback* placeholders in `FeaturedProjects.tsx` render even when there's no project data — gate them on actual content.

### C6 · Defer `useApprovedMedia` for `/about`, `/contact`, `/work` until they're navigated to
React Query already caches them; the issue is the homepage triggers fetches for these on initial load via the prefetch pattern in some hooks. Verify and gate. (Inspection step in the implementation pass — only act if a fetch is firing for a non-current page.)

### C7 · Remove the hover `scale-110` icon transition on Contact tiles
Lines 75 and 88 of `Contact.tsx`: `group-hover/contact:scale-110 transition-transform duration-500` on the icons. A scaling 16px icon in the corner of a tile is noise. Delete.

### C8 · Drop `translate-y-[-3px]` lift on Service tile hover
Services.tsx line 53. The card's existing shadow change (`shadow-contact → shadow-elevated`) is enough. The translate-y forces a 3px reflow trigger on hover. Cut.

### C9 · Audit `cta-thermal::before` glow gating
The class is in `index.css` but might fire its filter/box-shadow keyframes outside `prefers-reduced-motion`. Inspect, ensure flat solid hover state, no filter or box-shadow animation. (Read-only inspection in plan; rewrite in default mode.)

---

## D · UX deep audit — friction points the user will never report

### D1 · The Hero "Request a Quote" CTA falls below the fold on iPhone SE (375×667)
Verified via screenshots in earlier passes. Move the CTA pair up by tightening the hero subtitle line-height from `leading-relaxed` to `leading-snug` on `<sm`, and reduce the `mb-10` on TrustChips to `mb-6`. The CTA must be visible without scroll.

### D2 · Quote modal doesn't trap focus in success state
After successful submission, `SuccessPanel` renders but doesn't move focus to the close button. Screen reader users get stuck at the bottom of the form. Add focus management: on success, focus the "Close" button.

### D3 · Phone number auto-formatter eats keystrokes when pasting
`formatPhone()` slices to 10 digits. If a user pastes `+1 (403) 555-0123` the `+1` gets sliced off and they're confused. Strip leading `1` digit before slicing.

### D4 · Service tile on Services.tsx is a `<button>` inside a list — but doesn't have keyboard contract for "selected"
The button click opens the modal. Fine. But the focus-visible ring is `ring-cedar` which on the cream background is fine; verify contrast. Also ensure Enter and Space both fire (default for `<button>` ✅).

### D5 · `MobileSubNav` covers the top of the hero on /work, /services, /about, /contact
Verified: the mobile sub-nav adds 40px to the document offset (hence the `h-[6.5rem]` spacer in Navigation.tsx). Verify the hero isn't getting clipped at the top edge on mobile sub-pages.

### D6 · The Footer doesn't have a tertiary "Quote" CTA
The user has scrolled all the way to the bottom — they've consumed everything we offered. Add a final "Request a Quote" line above the legal row in Footer.tsx. One last conversion attempt before they leave.

### D7 · Modal closes on backdrop click — losing form data
Radix Dialog default. Already a concern. Add a confirm-discard step IF Step 2 has any text content AND user clicks backdrop. Don't trap them, but warn. Optional — only if it doesn't add modal-lib complexity.

---

## E · Files touched

### Created
- `src/components/MobileQuoteFAB.tsx` (~60 lines, sticky FAB for `<sm`)

### Deleted
- `src/components/Portfolio.tsx` (already orphaned)
- `src/components/Testimonials.tsx` (always returns null)

### Edited (high-leverage)
- `src/components/quote/QuoteModal.tsx` — A1 (Express mode), A2 (collapse Step 3 into Step 2), A5 (Enter to submit), A6 (mobile brand strip), C3 (drop sticky backdrop-blur), D2 (focus on success), D3 (phone paste fix)
- `supabase/functions/submit-quote-request/index.ts` — A4 (looser server validation)
- `src/components/Hero.tsx` — A7 (tap-to-text), D1 (mobile fold tightening)
- `src/components/Contact.tsx` — B5 (collapse to single panel), B9 (drop secondary CTA), C7 (drop icon scale)
- `src/pages/Contact.tsx` — B5, B3 (drop inner grain-overlay)
- `src/components/Services.tsx` — B1 (single section reveal), B10 (drop footnote), C8 (drop translate-y lift)
- `src/components/About.tsx` — B1, B6 (translate-x), B3 (drop inner grain)
- `src/components/FeaturedProjects.tsx` — B1, B3, B4 (drop section grain)
- `src/components/Navigation.tsx` — C2 (backdrop-blur reduction)
- `src/components/ui/trust-chip.tsx` — C4 (drop backdrop-blur-sm)
- `src/components/Footer.tsx` — D6 (final Quote CTA)
- `src/pages/Index.tsx` — remove Testimonials/Portfolio imports; mount `MobileQuoteFAB`
- `src/pages/About.tsx`, `src/pages/Work.tsx`, `src/pages/NotFound.tsx` — mechanical `transition-all → explicit` swap, drop inner grain layers

### Mechanical pass (no visual change)
- `transition-all` → explicit property list across `src/components` and `src/pages` (49 sites)
- `duration-500/700` → `duration-250/300` on hover-trigger transitions only (~50 sites)

---

## F · QA contract

After implementation:

1. **Quote conversion path**:
   - Service tile click → modal opens on Step 1 with that service preselected, then advances to Step 2 if Express mode triggers — but new behavior is Step 2 directly with service chip editable.
   - Cold modal open → lands on Step 1 (services), then Step 2 (details + contact combined), then Send.
   - Total clicks: warm = 2 (preselect → fill → send), cold = 3 (pick → fill → send).
2. **Mobile FAB** appears below 600px scroll on `<sm`, hides inside Contact section, hides when modal open. Tap target ≥ 56×56, no overlap with iOS home indicator.
3. **Lighthouse Performance ≥ 96** mobile, 4G throttled. Initial JS chunk under 90KB gz.
4. **Layout shift from MobileSubNav** verified — hero not clipped on `<md`.
5. **Submit accepts** `{ name: 'Test', phone: '4035550123' }` only (no service, no area, no details) and creates a row.
6. **Enter on Step 2** submits when valid, focuses first invalid field when not.
7. **Phone paste** of `+1 (403) 555-0123` formats correctly to `(403) 555-0123`.
8. **Type-check** clean; **build** succeeds; **no console errors** on `/`, `/services`, `/about`, `/contact`, `/work`.
9. **Visual diff**: identical hero, identical service grid, calmer About (no per-step stagger), single-card Contact, single CTA in each section.
10. **Reduced-motion** still skips all reveals and transitions.

---

## G · What this is NOT doing

- Not redesigning the hero, the section structure, the typography, or the color tokens. Tokens are frozen at v3.
- Not adding new visual effects, new sections, or new pages.
- Not modifying the auth, the admin routes, the media library, or the design system files (`src/lib/*`).
- Not changing the database schema or RLS policies.
- Not touching the `EditorialPicture` / `MediaSlot` / `AmbientVideoBleed` primitives — they're disciplined.

---

## H · The principle

A residential exterior contractor's website has exactly one job: get the homeowner to ask for a quote. Every pixel that doesn't serve that job is decoration, and decoration is friction in disguise. Fantasy.co's premium feel doesn't come from animating eight things at once — it comes from staging one extremely well-considered moment (the hero) and letting the rest of the site get out of the way. This pass moves Creek the rest of the way there: aggressive about what we *don't* render, generous about what gets attention (the quote button, always visible; the form, two screens deep at most).
