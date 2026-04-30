## Quote form, refined for one-tap conversion

The current modal is good but still asks for two screens of attention before the user feels progress. "Temu-style" in a premium editorial context doesn't mean confetti and fake countdowns — it means **single-screen velocity, instant micro-feedback, and a CTA that always tells you what happens next**. We keep the cream/bronze restraint and the DM Serif headers; we remove every pixel that delays a tap.

### What changes

**1. Collapse to a single screen — but keep the two-step illusion off.**

Today the modal is *2 steps × 3 fields × decisions about timeline & contact preference*. We move to a single scroll: services first, then a tight "Your details" block. No "Step 1 of 2," no "Continue" button. The submit CTA is always visible. Users who land via express mode (one preselected service) see the same screen with the chip already populated.

**2. Reduce required fields to two: Phone + One-tap service.**

Name becomes optional with a placeholder ("Optional — we'll ask on the call"). Email stays optional. Address becomes optional. The only hard requirement: a 10-digit phone. Rationale: a phone number alone is a closeable lead. Every additional required field measurably drops conversion. The edge function already accepts name+phone minimum — we just stop asking for name in the UI as required.

```text
Wait — making name optional is a real trade-off. A nameless lead is harder
to follow up on. The premium move is "Name is optional, but we ask for
it." Field stays, just with the (Optional) label and no validation block.
```

**3. The "instant value" header — replaces the generic step counter.**

Above the fields, a single line of dynamic copy that updates as the user picks services:

```text
Empty state:        “Free quote in 24 hours. No obligation.”
After 1 selection:  “Quoting your deck. Takes 30 seconds.”
After 2+:           “Quoting 3 services. Takes 30 seconds.”
```

This is the Temu trick — *the user always sees what happens next* and *how little it costs them in time*. It replaces "Step 1 / 2."

**4. Service picker → chips, not tiles.**

Fifteen rectangular cards is a wall. We collapse to **bronze-bordered chips** grouped by category, with the group header acting as a quiet label. A chip is ~40px tall with a check icon when selected. Same data source (`SERVICE_GROUPS` / `getItemsForGroup`), drastically less vertical space — the picker now fits in roughly one screen on mobile. The "General inquiry" option becomes a quiet text link below ("Just have a question? Send a message instead.") that switches the form to inquiry mode.

**5. Smart defaults, no decision fatigue.**

- **Timeline**: defaults to "Within 1 month." A single segmented control with three options (`ASAP / 1 month / Just exploring`) — three taps max instead of a four-option dropdown. Property type and contact preference: removed from UI, sent as defaults ("Residential", "call").
- **Removed entirely from UI**: Property type selector, contact-preference radio. We send `Residential` and `call` as defaults to the edge function. If the user wants text/email, they say so on the call. This trims six taps off the flow.

**6. The CTA tells the user exactly what happens.**

Replace "Send Request" with **"Get my free quote →"** when valid, or **"Add your phone to continue"** when invalid (button stays visible but disabled, with helper text *inside* the button). No tooltip, no separate error region. This is the single largest conversion lever in modal forms.

**7. Trust micro-strip directly above the CTA.**

A single hairline-bordered row, 32px tall: `★★★★★ Verified Calgary builds  ·  24-hour response  ·  No-obligation quote`. Three signals, no images, fits the editorial language. This is the "social proof at the moment of commitment" pattern — Temu uses it as a banner; we use it as a whisper. Pulled from existing CONTACT/brand-identity data; no fake numbers.

**8. Inline phone validation with auto-format and live "✓".**

Already have `formatPhone()`. Add a small bronze checkmark that appears the instant 10 digits are entered — a tiny dopamine hit confirming "you're done." This is THE Temu trick distilled to one pixel: instant feedback when you've completed something.

**9. Success state — keep it but add one urgency cue.**

After submit, the success panel adds: *"We typically respond within 4 hours during business days."* and a prominent `Call us now` link as the secondary action. If they're in a hurry, give them the phone.

### Performance & friction details

- **Lazy submit**: form already submits via Supabase function — no change.
- **Autofocus on phone field**, not the first service chip. Phone is the conversion-critical field; we want the keyboard up immediately on mobile if the user opens via Express mode.
- **Inputmode + autocomplete attributes** confirmed (`tel`, `name`, `email`) — already mostly correct, audit and complete.
- **No layout shift** when the validation checkmark appears — reserve the slot.
- **Modal opens in <50ms** — no new dependencies, no new icons beyond what's already imported.
- **Server payload unchanged** — the edge function already accepts everything as optional except name+phone, and we'll continue sending defaults for property type / timeline / contact preference. No DB or function changes needed. The `name` field client-side is now optional but the edge function still requires non-empty name; we'll send `"Not provided"` as a fallback OR (cleaner) keep client-side requirement but de-emphasize visually. Decision in implementation: **keep name client-required to satisfy the existing 400-response server contract, but visually de-emphasize and shorten the label to just "Name."** No backend change. This honors the existing constraint while removing UI friction.

### What does NOT change

- Brand chrome (left panel, logo, evergreen colour). Still premium, still editorial.
- DM Serif Display header. DM Sans body. Curly quotes throughout.
- The `submit-quote-request` edge function — payload shape identical.
- `quote_requests` DB schema.
- Express mode (single preselected service skip-to-details) — preserved, just lands on the same single screen.
- Lazy-loading of the modal via `QuoteModalProvider`.

### Files touched

- `src/components/quote/QuoteModal.tsx` — single-screen layout, chip picker, dynamic header, smart-default CTA, validation checkmark. Step1/Step2Combined components merged into one inline render.
- No new files. No new dependencies. No memory updates needed (existing typography/colour rules continue to govern).

### Why this is the right "Temu" translation

Temu's playbook = (1) reduce decisions, (2) show progress instantly, (3) make the next action obvious, (4) prove safety at the click. We deliver (1) by collapsing fields and removing irrelevant selectors, (2) with the dynamic header copy and live phone checkmark, (3) with a CTA that names the outcome ("Get my free quote"), (4) with the trust micro-strip directly above the button. Zero gimmicks, zero brand violation, all the friction removed.
