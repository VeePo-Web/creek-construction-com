# Contact form: Resend routing, voucher polish, perf hardening

## 1. Email routing via Resend → Creekproconstruction@gmail.com

- Connect the Resend connector (built-in connection picker) so `LOVABLE_API_KEY` + `RESEND_API_KEY` are injected as env vars into edge functions.
- Update `supabase/functions/submit-quote-request/index.ts`:
  - After the row is inserted into `quote_requests`, POST to the Resend gateway (`https://connector-gateway.lovable.dev/resend/emails`) with both auth headers.
  - From: `Creek Construction <onboarding@resend.dev>` (works immediately without verifying a domain — note: Resend's free sandbox only delivers to verified addresses; we'll use the Creek Gmail as both `to` and verified sender once user verifies, but `onboarding@resend.dev` → Gmail works out of the box).
  - To: `Creekproconstruction@gmail.com`. Reply-To: the lead's email if provided.
  - Subject: `New quote request — {name} ({services or "general"})`.
  - HTML + text body with name, phone (clickable `tel:`), email, city, services, timeline, project details, voucher.
  - Email send is fire-and-forget inside the function (already returns 200 fast); failures are logged but do NOT fail the insert.
- Re-deploy `submit-quote-request`.

## 2. Voucher field polish (`src/components/quote/QuoteFormInline.tsx`)

- Field label: change "Voucher or referral code" → **"Voucher or referral code (5% off)"**.
- Input value stays auto-filled to `pg2026` (already initialized) and remains fully editable + optional.
- Lighter, helper-text appearance: add `text-muted-foreground/60` + `italic` classes so `pg2026` reads like a placeholder hint rather than user input. On focus, color returns to `text-foreground` so edits are clearly visible.
- Remove the `placeholder="Optional"` (redundant with the new label).
- Apply identical change in `QuoteModal.tsx` if it has its own voucher input (verify; otherwise Modal already uses QuoteFormInline).

## 3. Submit-action performance + no-reflow / no-hydration

Already optimistic. Tighten the remaining bottlenecks:

- **Bundle**: dynamic-import `zod` only inside `handleSubmit` (`const { z } = await import("zod")`) — saves ~12kb from the initial Contact route chunk and the homepage's inlined form. Schema is built once and cached on a module-level lazy ref.
- **Avoid layout thrash on success**: the success state currently swaps the entire shell, causing a height jump. Reserve the form's measured min-height via a `ref` + inline `style={{ minHeight }}` so the success card occupies the same box → no scroll jump on desktop or mobile.
- **No hydration/SSR concern** (Vite SPA, fully client-rendered) — but ensure the `voucher: "pg2026"` initial value is set during `useState` initializer (already is) so the very first paint matches. Confirm no `useEffect`-driven value writes that could cause a 2nd render.
- **Input handlers**: wrap `update`, `toggleService`, `markTouched` in `useCallback` and memoize `SERVICE_GROUPS` mapping so chip rows don't re-render on every keystroke. Reduces input latency on mobile.
- **CSS containment**: add `contain: layout paint` to the form shell so a chip toggle doesn't trigger sibling reflows (TrustStrip below the form).
- **Preconnect** to `connector-gateway.lovable.dev` in `index.html` (we already preconnect to Supabase) — warms the TLS handshake before the background Resend POST.
- **Button state**: remove the unused `Loader2`/`submitting` branch entirely from the JSX (it's dead code now that the UI is optimistic) — shrinks the component and removes a never-true conditional from the render path.

## Files touched

- `supabase/functions/submit-quote-request/index.ts` — Resend email send
- `src/components/quote/QuoteFormInline.tsx` — voucher styling + label, perf, lazy zod, dead-code removal, min-height reservation
- `index.html` — preconnect to connector gateway
- (verify) `src/components/quote/QuoteModal.tsx` — only if it duplicates the voucher input

## Notes

- No DB schema changes.
- No design tokens added; uses existing `text-muted-foreground` + `italic`.
- Resend free tier sends from `onboarding@resend.dev` immediately; deliverability to a Gmail inbox is reliable. If you later want emails to come from `@creekproconstruction.com`, you'd verify that domain in Resend — happy to wire that on request.
