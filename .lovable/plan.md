# Pass 49 — Add optional "Voucher / referral code" field to lead forms

Add a final, optional, single-line text field labelled **"Voucher or referral code"** as the last input above the submit CTA on both the QuoteModal and the inline contact form. No validation beyond a length cap. The value rides along on submit and gets appended to `projectDetails` so it lands in the existing email + DB row without a schema change.

## Why append to `projectDetails` (not a new DB column)

The edge function (`supabase/functions/submit-quote-request/index.ts`) already accepts `projectDetails` and writes it to `quote_requests.project_details`. Adding a dedicated `voucher` column means a migration + edge-function edit + types regeneration for one optional string. Appending `\n\nVoucher / referral: <value>` to `projectDetails` on the client gives the owner the info immediately in the same email body and DB row, with zero backend churn. Easy to promote to a real column later if it becomes high-volume.

## Files touched

### 1. `src/components/quote/QuoteFormInline.tsx`
- Add `voucher: ""` to `INITIAL` `FormState` and the interface.
- After the existing "Anything we should know?" textarea (≈ line 398), add a new `<Field label="Voucher or referral code" htmlFor="qfi-voucher" optional>` with a single-line `<Input id="qfi-voucher" maxLength={80} placeholder="Optional" autoComplete="off" />` bound to `form.voucher`.
- In `handleSubmit`, build the final `projectDetails` as:
  ```ts
  const baseDetails = form.projectDetails.trim();
  const voucher = form.voucher.trim();
  const combinedDetails = [
    baseDetails || undefined,
    voucher ? `Voucher / referral: ${voucher}` : undefined,
  ].filter(Boolean).join("\n\n") || undefined;
  ```
  and pass `projectDetails: combinedDetails` in the payload.

### 2. `src/components/quote/QuoteModal.tsx`
- Same `voucher` addition to `INITIAL`, `FormState`, and the reset path in the `useEffect(open)`.
- Add the same `<Field>` immediately below the existing project-details textarea (≈ line 545) so it's the very last input before the trust strip + CTA.
- In `handleSubmit`, fold `voucher` into the `projectDetails` string the same way (preserves the existing `[General Inquiry]` prefix when in inquiry mode — voucher line appended after).

### 3. No schema, edge-function, or memory changes
- `quote_requests.project_details` already accommodates 2000 chars.
- Edge function passes `projectDetails` straight through.
- No design tokens or rules affected — reuses the existing `Field` + `Input` primitives, so styling matches the rest of the form automatically.

## Verification

1. Open QuoteModal: scroll to bottom of the form — voucher field is the last input above the trust micro-strip and "Get my free quote" CTA.
2. Submit with a voucher value: confirm the email + Supabase row contain `Voucher / referral: <value>` appended to project details.
3. Submit without a voucher: row reads exactly as it did before — no trailing whitespace or empty label.
4. Inline form (anywhere `QuoteFormInline` is mounted) shows the same field in the same position with identical behaviour.
