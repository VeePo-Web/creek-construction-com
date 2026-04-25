# QuoteModal — General Inquiry path + UX upgrades

## Why this matters
Right now the modal forces every visitor down a service-selection funnel — they cannot continue Step 1 unless they pick at least one of the six services. That blocks legitimate leads: warranty questions, pricing-only enquiries, "I just want to talk", custom work that doesn't map to a tile, B2B / press / partnership requests. The fix is small surgically, but high-leverage.

## What stays the same
- Database schema (`quote_requests.services` is already `text[] not null default '{}'`)
- RLS policy (`Anyone can submit a quote request` — no change)
- The 3-step layout, brand panel, progress bar, and overall visual system
- Cedar / evergreen design tokens

## Steps

### 1. Add the seventh tile: "General inquiry / Something else"
In Step 1, render a 7th tile after the six SERVICES, visually distinct (full width on mobile, spanning the empty slot on desktop with `sm:col-span-2`). Icon: `MessageCircleQuestion`. Copy: *"Something else / General inquiry — pricing, warranty, custom work, or just questions."* Selecting it auto-deselects all service tiles (mutually exclusive); selecting any service tile auto-deselects "General inquiry". Internally tracked as the sentinel id `general` in `form.services`. Same `aria-pressed` pattern as the other tiles.

### 2. Make the modal mode-aware (Quote vs Inquiry)
Derive `mode = form.services.includes('general') ? 'inquiry' : 'quote'`. Header copy adapts:
- Step indicator: "Request a Quote" → "Send us a Message"
- Step 1 heading: "What are we building?" → "How can we help?"
- Step 2 heading: "Tell us about the project" → "Tell us a bit more (optional)"
- Step 3 heading unchanged
- Submit button: "Send Request" → "Send Message"
- Success headline: "Request received." → "Message received."

No new state — all derived from `mode`.

### 3. Skip the property-type field on the inquiry path
In Step 2, when `mode === 'inquiry'`:
- Replace "Project details" label with "How can we help?" + friendlier placeholder (*"e.g. Wondering about pricing for a 200 ft fence in Cochrane, or whether you do small repair jobs."*)
- Hide the Property Type select (irrelevant for inquiries)
- Keep Timeline but rename to "When do you need a reply?" with options: `["Today if possible", "Within a few days", "No rush"]`
- Add `(optional)` next to the body label

When `mode === 'quote'`, behavior is unchanged.

### 4. Inline validation + smart Continue/Send button states
Today the Continue/Submit buttons disable silently. Add:
- Subtle red-cedar `aria-invalid` ring on phone/email/address inputs once the user has interacted (per-field `touched` flag) and the value is invalid
- One-line helper text under invalid fields ("Looks like the phone is missing 3 digits", "Hmm — that email doesn't look right")
- Sr-only explanation on the disabled Send button ("Add your name, phone, and city to send")
- Step 1 Continue gate: any service OR `general` selected unlocks
- Step 3 validation surfaces in a small `role="status"` region above the footer for screen readers

### 5. Sticky footer + better mobile scroll behavior
On mobile the footer (Back / Continue) currently scrolls with content, so on a long Step 2 the action buttons sit below the fold. Change the right-pane layout so:
- Header is sticky to the top (`sticky top-0 z-10 bg-background/95 backdrop-blur` with the existing border-b)
- Footer is sticky to the bottom (`sticky bottom-0 z-10 bg-muted/80 backdrop-blur`, plus `pb-[env(safe-area-inset-bottom)]` for iOS)
- Middle scrolls between them

Desktop brand panel is untouched.

### 6. Keyboard + accessibility polish
- Auto-focus the first interactive element on each step (Step 1 → first tile; Step 2 → details textarea; Step 3 → name input) via a `useEffect` keyed on `step`
- `Enter` on Step 3 last input triggers Send when valid
- `Cmd/Ctrl + Enter` from anywhere advances: Continue if not on Step 3, Send if Step 3 and valid
- Update the `<fieldset> <legend>` per mode
- `aria-live="polite"` on the step heading so screen readers announce step changes
- Confirm tab order on each step

### 7. Submit handler + edge-function tolerance
**Client (`handleSubmit`):**
- If `mode === 'inquiry'`, send `services: ['General inquiry']` and prefix `projectDetails` with `[General Inquiry] ` so the inbox row is easy to scan
- Omit `propertyType` for inquiry mode

**Server (`supabase/functions/submit-quote-request/index.ts`):**
- Relax the validation gate from "services empty always fails" to "services empty AND projectDetails empty fails"
- Add a `console.log` line tagging inquiries vs quotes for the existing log stream

No schema migration needed.

### 8. Success panel: secondary action + inquiry-mode copy
Current SuccessPanel only offers "Close". Add:
- A primary "Done" button (replaces the close link, styled as a muted button) and a secondary "Send another" link that resets `step=1`, clears `form` to `INITIAL`, and `setSuccess(false)`
- Inquiry-mode copy: *"Message received. We'll reply within 24 hours — or call us now at {phone}."*
- Quote-mode copy unchanged
- Cedar check-circle illustration retained

### 9. Surface the General Inquiry path from outside the modal
- `src/components/Contact.tsx` (homepage section): add a quiet secondary link below the existing "Request a Quote" CTA: *"or send a general message →"* that calls `openModal(['general'])`
- `src/pages/Contact.tsx` (Contact route quote card): same secondary link beneath the main CTA

Nothing changes in the global navigation.

### 10. QA pass
After the refactor, manually walk through:
1. Quote path with 1 service → reaches Step 3 → submits → DB row has `services=['Decks']`
2. Quote path with 3 services → submit → DB row has all 3 titles
3. Inquiry path: select General inquiry, Continue → Step 2 has no Property Type, Timeline relabeled, body says "How can we help" → Continue → Step 3 → submit → DB row has `services=['General inquiry']` and `project_details` starts with `[General Inquiry]`
4. Mutual exclusion: pick Decks, then click General inquiry → Decks deselects. Pick General inquiry, then click Fencing → General deselects.
5. Inline validation: type a 3-digit phone → blur → red helper text appears. Fix to 10 digits → helper clears.
6. Mobile (375px): footer stays visible while scrolling Step 2.
7. Reduced motion: no progress-bar animation jank.
8. Tab through Step 3 from name to Send — all reachable, no traps.
9. `Cmd+Enter` on Step 3 with valid form → submits.
10. Success panel "Send another" resets cleanly.

## Files touched
- `src/components/quote/QuoteModal.tsx` — primary refactor (steps 1-8)
- `supabase/functions/submit-quote-request/index.ts` — relax validation, log tagging (step 7)
- `src/components/Contact.tsx` — secondary CTA (step 9)
- `src/pages/Contact.tsx` — secondary CTA (step 9)

No new dependencies, no migrations, no design-token changes.