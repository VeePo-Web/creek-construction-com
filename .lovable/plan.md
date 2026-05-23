## Goal
Verify the live `submit-quote-request` edge function sends a real email via Resend with the correct envelope:
- **From:** `Creek Construction <quotes@creek-construction.com>`
- **To:** `Creekproconstruction@gmail.com`
- **CC:** `parker@veepo.ca`
- **Reply-To:** the submitter's email

## Steps
1. POST a realistic test payload to the deployed `submit-quote-request` function via `supabase--curl_edge_functions` (name "E2E Test", phone, reply-to email like `e2e-test@creek-construction.com`, a service + project details).
2. Confirm HTTP 200 + row inserted (`id` returned).
3. Pull `supabase--edge_function_logs` for `submit-quote-request` and verify:
   - No `resend failed` / `resend error` lines
   - INQUIRY/QUOTE log line present
4. Report the message envelope back and ask the user to confirm receipt in both `Creekproconstruction@gmail.com` and `parker@veepo.ca` (including spam), and that **Reply** goes to the submitter's address.

## Notes
- No code changes. Read-only verification.
- If logs show a Resend failure, I'll surface the exact error and propose a fix in a follow-up plan.