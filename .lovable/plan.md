## Goal
Make the voucher/referral code field explicitly visible in the contact-form email notification, with a fallback to "No voucher" when none is provided.

## Current State
- Both `QuoteFormInline` and `QuoteModal` collect a `voucher` field (default "pg2026").
- The voucher is currently concatenated into `projectDetails` as plain text before sending to the edge function.
- The `quote_requests` table has no dedicated `voucher` column.
- The email template renders `projectDetails` as a single block, so the voucher is buried inside the body text.

## Changes

### 1. Database — add `voucher` column to `quote_requests`
```sql
ALTER TABLE public.quote_requests ADD COLUMN voucher text;
```

### 2. Edge function — `supabase/functions/submit-quote-request/index.ts`
- Add `voucher?: string` to the `Payload` interface.
- Sanitize and insert the new field when saving the row.
- In the HTML email template, add a dedicated table row:
  - Label: **Voucher**
  - Value: the submitted voucher, or the literal text `"No voucher"` if blank.
- In the plain-text body, add a corresponding line.

### 3. Frontend — `QuoteFormInline.tsx` & `QuoteModal.tsx`
- Add `voucher` as an optional field in the Zod `quotePayloadSchema`.
- Send `voucher` as a top-level property in the POST payload.
- Stop appending the voucher string to `projectDetails`.

### 4. Verification
- Deploy the updated edge function.
- Run a test submission with a voucher and confirm the email shows the code.
- Run a test submission without a voucher and confirm the email shows "No voucher".
- Verify the `voucher` value is persisted in the database row.