## Goal

Transform the existing B&P Sauna template into **Creek Construction** — a residential exterior construction company serving Calgary and Edmonton areas. Keep the editorial, premium aesthetic of the current site (which you like), but reflect Creek's brand identity: **integrity, pride, and excellence in the work itself — no gimmicks**.

Every CTA on the site will open the same multi-step quote modal (inspired by VeePo / Royal Mechanical), and submissions will be stored in Lovable Cloud and routed to your phone/email.

---

## 1. Brand foundation

**Logo & assets**
- Save the uploaded Creek Construction logo to `src/assets/creek-construction-logo.png`.
- Replace all references to B&P Sauna assets (cedar textures, sauna images) with the new logo + neutral placeholders for now (clean, dark gradient cards). You'll swap real project photos in later — I'll structure the components so it's a one-line image swap per service.

**Colors (deep evergreen + bronze)** — updated in `src/index.css` and `tailwind.config.ts`:
- Primary `--evergreen`: deep forest green (~ HSL 150 25% 18%) — used for headings, primary buttons, navigation
- Accent `--bronze`: warm bronze/copper (~ HSL 28 55% 45%) — replaces all `--cedar` references for CTAs, dividers, section numerals
- Background: warm cream (~ HSL 38 30% 97%) instead of current off-white
- Foreground: near-black with green undertone
- The existing "thermal crescendo" border opacity pattern (15% / 40% / 80%) carries over using bronze instead of cedar.

**Typography** — keep DM Serif Display + sans body (already premium, fits the brand).

**Tagline / brand voice**
- Hero headline: *"Excellence in the Work. Pride in Every Detail."*
- Sub: *"Residential exterior construction across Calgary, Edmonton, and surrounding Alberta. Decks, fencing, sheds, painting, siding — built to last, finished with care."*
- Throughout: replace "ritual / sauna / Alberta winter" copy with messaging about craftsmanship, integrity, getting the work right, no shortcuts.

---

## 2. Services (replaces current sauna offerings)

Six services, each with a card on the home `Services` section and a detail entry:
1. **Decks** — custom builds and rebuilds
2. **Fencing** — wood, vinyl, chain link
3. **Sheds** — custom storage and outbuildings
4. **Exterior Painting** — homes, trim, fences, decks
5. **Siding & Exterior Repair** — siding, soffit, fascia, eaves
6. **Pergolas & Gazebos** — outdoor structures

Each card will have: icon (lucide), one-line value prop, "Request a Quote" CTA that opens the modal with that service preselected.

A trailing note: *"Need something else exterior? We do that too — just ask."* (covers your "anything exterior residential they want" point).

---

## 3. Quote modal (the conversion centerpiece)

A new `QuoteModal` component, opened from a global `QuoteModalProvider` context so any button anywhere on the site can trigger it (replaces all current "START YOUR PLAN" / "GET MY SAUNA PLAN" buttons).

**Structure** (multi-step, similar to VeePo / Royal Mechanical):

- **Step 1 — Service selection**: multi-select cards for the 6 services. Pre-selectable via context (clicking a service card preselects that one).
- **Step 2 — Project details**: short textarea ("Tell us about the project"), property type (residential / acreage), preferred timeline.
- **Step 3 — Contact**: name, phone (auto-formatted), email (optional), service area (Calgary / Edmonton / Other), preferred contact method (call / text / email).
- **Success state**: confirmation screen with phone number for urgent calls + a thank-you message.

**Modal shell**:
- Built on shadcn `Dialog` for accessibility (focus trap, ESC close, scroll lock).
- Left side: brand identity stack (logo, "Creek Construction", tagline, NAP info, trust line "Locally owned · Calgary & Edmonton") — matches the layout you described.
- Right side: the active step.
- Progress indicator (1 / 2 / 3) at top of right panel.
- Mobile: stacks vertically, brand identity collapses to a slim header.

**Submission flow**:
- Posts to a Lovable Cloud edge function `submit-quote-request`.
- Stores row in `quote_requests` table (see backend below).
- Sends an email notification to `Creekproconstruction@gmail.com` via the edge function (using Resend or the built-in Lovable Cloud email).
- On success → success state → modal can be closed.

---

## 4. Backend (Lovable Cloud)

Enable Lovable Cloud and create:

**Table `quote_requests`** with RLS:
- `id` (uuid, pk)
- `created_at` (timestamptz, default now)
- `name`, `phone`, `email`, `address_or_area`
- `services` (text[])
- `property_type`, `timeline`, `contact_preference`
- `message` (text)
- `status` (enum: new / contacted / quoted / closed; default 'new')
- RLS: public **insert** allowed (so the form works without auth), no public select (only admins later).

**Edge function `submit-quote-request`**:
- Validates payload server-side.
- Inserts into `quote_requests`.
- Sends notification email to `Creekproconstruction@gmail.com` with all submission details and a "reply directly to the customer" link.
- Returns `{ ok: true }` on success.

**Centralized contact info** — `src/config/contact.ts`:
```
phone: "780-777-5178" (tel:7807775178)
email: "Creekproconstruction@gmail.com"
serviceAreas: ["Calgary & area", "Edmonton & area"]
```
Used by the modal, footer, contact section, JSON-LD, and `mailto:` / `tel:` links everywhere.

---

## 5. Page-by-page transformation

**Navigation** (`src/components/Navigation.tsx`)
- Logo swap → Creek Construction
- Routes simplified: Home / Services / About / Work / Contact (drop blog if not needed — confirm or I'll keep it as a placeholder).
- Primary nav CTA "Request a Quote" → opens modal.
- Phone number visible on desktop nav (click-to-call).

**Hero** (`src/components/Hero.tsx`)
- Background: dark evergreen gradient + subtle texture (no sauna image).
- Headline: *"Excellence in the Work."*
- Sub: *"Residential exterior construction. Calgary, Edmonton, and surrounding Alberta."*
- Two CTAs: "Request a Quote" (opens modal) + "See Our Services" (scrolls down).
- Removes parallax sauna image; keeps the cinematic clip-path text reveal.

**Identity / "The Work" section** (replaces `RitualIdentity`)
- New name: `OurStandard.tsx`
- Three "truths" rewritten around craftsmanship:
  1. *"If you've been burned by a contractor who cut corners — we don't."*
  2. *"If quotes feel like a sales pitch — ours don't."*
  3. *"If you want the work done right the first time — that's the only way we do it."*
- Pull-quote: *"We don't market gimmicks. We market the work itself."*

**Services** (`src/components/Services.tsx`) — 6-card grid as listed above.

**About** (`src/components/About.tsx`)
- Story rewritten: locally owned, serving Alberta homeowners, focused on doing fewer projects exceptionally well.
- Stats: years in business / projects completed / service-area communities (placeholders you can update — I'll comment them clearly).

**Portfolio / Work** (`src/components/Portfolio.tsx` + `/work` page)
- Grid of project cards with neutral dark placeholders + caption ("Custom cedar deck — Calgary NW"). Easy to swap real photos into.

**Testimonials** — three placeholder editorial-style testimonials about quality and integrity (clearly marked as placeholder copy in comments, you'll swap in real ones).

**LifeAfterFirstHeat** → renamed `WhyItMatters` — sustained value of doing it right (longevity, lower maintenance, curb appeal).

**Contact** (`src/components/Contact.tsx`)
- Service areas: Calgary & area, Edmonton & area, with a few city tags (Airdrie, Cochrane, Okotoks, Sherwood Park, St. Albert, Spruce Grove, Leduc).
- Big "Request a Quote" CTA → modal.
- Phone, email, response-time stats.

**Footer** — updated NAP, social placeholders removed (or left blank for you to fill), simple sitemap.

**Sub-pages** (`/services`, `/about`, `/work`, `/contact`) — same template treatment, copy swapped, hero images replaced with evergreen gradients.

**Blog** (`/resources`) — I recommend **removing** unless you want it. Easier to add back later than maintain empty. Confirm in your reply or I'll remove the route + nav link.

---

## 6. SEO & metadata

- `index.html` title + meta description → Creek Construction
- `useDocumentTitle` base → "Creek Construction"
- `JsonLd.tsx` → `LocalBusiness` schema with new NAP, service areas (Calgary, Edmonton + suburbs), services list, opening hours placeholder.
- Favicon → derived from the new logo (square crop of the creek/bridge mark).
- `robots.txt` and `<meta>` social cards updated.

---

## 7. Performance & polish

- All current performance patterns preserved: `content-visibility: auto`, lazy hero animations, `prefers-reduced-motion` respect, 44px touch targets, focus-visible rings (now in bronze).
- New images saved as optimized JPG/WebP in `src/assets/`.
- Modal code-split (lazy-loaded) so it doesn't bloat the initial bundle — only loads when first triggered.
- Single shared `QuoteModal` instance via context (not duplicated per CTA).

---

## 8. What stays vs. what goes

**Stays**: editorial layout, scroll reveals, section numerals/dividers, `SectionHeader` / `SubPageHero` / `CedarCTA` (renamed `BronzeCTA`) primitives, premium typography, accessibility patterns, route structure, performance strategy.

**Goes**: all sauna-specific copy, cedar-themed imagery, `TemperatureTicker`, `useAlbertaTemp`, `useSeason`, `LifeAfterFirstHeat` (replaced), all "ritual" / "löyly" / "winter sauna" language, the static contact form (replaced by modal flow).

---

## Out of scope (flag for later)

- Real project photos → you'll provide; I'll add them with a clear swap pattern.
- Real testimonials → you'll provide.
- Custom domain + publishing → after you approve the build.
- Admin dashboard to view submitted quotes → can add in a follow-up if you want a backend view rather than just email.

---

## Deliverable

After approval: a fully rebranded Creek Construction site with a working multi-step quote modal that submits to Lovable Cloud and emails `Creekproconstruction@gmail.com`, with all copy, colors, and structure reflecting your brand of *excellence and integrity in the work*.