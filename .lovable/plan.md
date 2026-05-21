Add `cc: ["parker@veepo.ca"]` to the Resend email payload in `supabase/functions/submit-quote-request/index.ts` so every quote/inquiry notification CCs Parker alongside the existing `Creekproconstruction@gmail.com` recipient. Then redeploy the edge function.

No other files affected.