## Goal

Push the site one notch closer to fantasy.co minimalism: strip every caption chip, breadcrumb, and decorative rail; saturate galleries with real cloud photography (Hero is the only AI image allowed); and make the contact form feel instant with a pre-filled, optional voucher code "pg2026".

---

## 1. Eliminate clutter elements (sitewide)

**Breadcrumbs — remove entirely**
- Delete the breadcrumb chip in the sticky header: `src/components/Navigation.tsx` (drop the `<HeaderBreadcrumb />` slot) and delete `src/components/navigation/HeaderBreadcrumb.tsx` + `src/lib/route-meta.ts`.
- Delete the in-hero breadcrumb trail. Remove the `BreadcrumbTrail` render in `src/components/ui/page-hero.tsx`, drop `src/components/ui/breadcrumb-trail.tsx`, and remove the `breadcrumb` prop from PageHero's type.
- Strip `breadcrumb={...}` props from `Hero.tsx`, `Work.tsx`, `Services.tsx`, `About.tsx`, `NotFound.tsx`.

**Caption / provenance chips on imagery**
- Delete `src/components/media/ProvenanceCaption.tsx` and any consumers (audit `EditorialBleedSection`, `MediaSlot`, `HeroTriptych`, `GalleryWall`, `HomeGalleryStrip`) — strip their caption/credit overlays. Galleries become pure image walls.

**Decorative rails / eyebrows that read as filler**
- Remove the "Recent work" eyebrow column on `HomeGalleryStrip.tsx` (keep the H2 only).
- Remove the "— pick any" italic micro-line and the `BronzeRule` eyebrow inside `QuoteFormInline.tsx` (services section title only).
- Audit `Services.tsx`, `About.tsx`, `Contact.tsx`, `MiniFaq.tsx`, `CrewMoment.tsx`, `BrandStatement.tsx`, `QuoteCloserCard.tsx`, `TestimonialStrip.tsx`, `NotFound.tsx`: drop any `eyebrow` label that sits alone above a heading purely as decoration. Keep only eyebrows that carry real wayfinding meaning (e.g. "FREE QUOTE" on /contact stays — it's the page H1 partner).
- Remove the `<HeroTriptych>` numeric "01/02/03" frame chrome if present, and any "Photographing this season" residue (already gone but re-verify).

**Acceptance:** ripgrep `breadcrumb|ProvenanceCaption|HeaderBreadcrumb` returns zero hits in `src/components` and `src/pages`. Visual sweep at desktop/tablet/mobile shows no floating labels over images and no breadcrumb chips anywhere.

---

## 2. Galleries: real cloud photos only

**Rules**
- The single permitted AI image is the homepage hero (`hero-architect-color.jpg` in `Hero.tsx`). Everything else must come from the approved cloud media library (`media_metadata` where `ai_review_status='approved'`).

**GalleryWall (`/work`)**
- Bump `useApprovedMedia` `limit` from 60 → 200 so the wall is dense.
- Drop the seeded `GALLERY` constant (3 shed photos) so the wall is 100% cloud-driven; if cloud returns zero, render nothing rather than a stub. (Keep `HOMEPAGE_GALLERY` export for the strip.)
- Render order: deterministic — sort by `taken_at` desc with hero/elevation/wide first.

**HomeGalleryStrip**
- Replace the hardcoded 3 `HOMEPAGE_GALLERY` images with a live `useApprovedMedia({ shot_type: ["hero","elevation","wide"], min_quality: "reference", kind: "image", limit: 3 })`. Fallback: keep current 3 real shed photos only if cloud returns nothing.

**MediaSlot consumers (About, Services)**
- Audit each `MediaSlot` query — confirm filters resolve to real cloud photos and not the deleted AI assets. No code changes if already pulling from cloud; just verify.

**Acceptance:** the only `import …jpg` referencing imagery is `hero-architect-color.jpg` in `Hero.tsx` plus the 3 shed gallery fallbacks. Every other `<img>` resolves through `useApprovedMedia` / `MediaSlot`.

---

## 3. Contact form — instant submit + auto-filled voucher

**Voucher behavior** (`QuoteFormInline.tsx` and `QuoteModal.tsx`)
- Initial state: `voucher: "pg2026"` (was `""`).
- Field label stays "Voucher or referral code" with the existing `optional` flag — user can clear or change it.
- Style hint: keep the field but make it visually unobtrusive (single line, no helper text).

**Instant submit (perceived latency = 0)**
- Switch `handleSubmit` to optimistic UI: on click, immediately set `success = true` and render the thank-you state. Fire `supabase.functions.invoke("submit-quote-request", …)` in the background without `await`-blocking the UI.
- On background failure, swap state back and `toast.error` with the phone fallback. On success, no extra UI noise.
- Remove the `submitting` spinner path from the button — it's no longer reached. Keep it in code as a safety fallback for slow validation only.
- Validation runs synchronously before optimistic flip; if invalid, behavior unchanged (focus first invalid field).
- Add `<link rel="preconnect">` to the Supabase functions origin in `index.html` so the network handshake is warm before submit.
- Same change applied to the modal variant (`QuoteModal.tsx`) for consistency.

**Acceptance:** clicking "Get my free quote" with a valid name+phone flips to the success card in <50ms regardless of network. Voucher field shows "pg2026" by default and is submitted unless cleared.

---

## Files touched

Edits: `src/components/Navigation.tsx`, `src/components/ui/page-hero.tsx`, `src/components/Hero.tsx`, `src/components/HomeGalleryStrip.tsx`, `src/components/GalleryWall.tsx`, `src/components/quote/QuoteFormInline.tsx`, `src/components/quote/QuoteModal.tsx`, `src/pages/{Index,Work,Services,About,Contact,NotFound}.tsx`, `src/config/gallery.ts`, `index.html`, plus eyebrow/caption sweeps in `BrandStatement.tsx`, `CrewMoment.tsx`, `MiniFaq.tsx`, `QuoteCloserCard.tsx`, `TestimonialStrip.tsx`.

Deletions: `src/components/navigation/HeaderBreadcrumb.tsx`, `src/components/ui/breadcrumb-trail.tsx`, `src/components/media/ProvenanceCaption.tsx`, `src/lib/route-meta.ts`.

## Out of scope

- No design-token changes (colors, typography, spacing untouched).
- No backend/edge function changes — only the client submit timing.
- Hero image stays as-is (the one allowed AI asset).
