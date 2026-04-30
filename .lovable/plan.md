## Align the website to the actual service catalogue

You sent the real list of work Creek offers. Today's site advertises six broad services; the real catalogue is fifteen. The plan: rebuild the catalogue as a single source of truth, group it for clarity (the home grid would look chaotic with fifteen tiles), wire the QuoteModal to the new list, and tighten the form for friction-free conversion. No new pages, no scope creep — every change consolidates onto existing components so credit cost stays minimal.

### The catalogue, as you described it

Fifteen services, grouped into five "categories" so the homepage reads as a confident grid (5 cards) and the /services page reads as the full menu (15 line items inside the 5 groups). The QuoteModal exposes all 15 as individual checkboxes.

```text
1. Decks & Outdoor Structures
   · Decks      · Platforms      · Pergolas / fireplaces      · Sheds      · Garage builds

2. Roofing & Exterior Envelope
   · Roof repairs      · New roof builds      · Siding      · Exterior fixtures (lights, vents, mounts)

3. Painting & Surface Restoration
   · Exterior paint      · Sanding & prep

4. Fences & Hardscape
   · Fences      · Walkways      · Pressure cleaning of driveways

5. Landscaping & Grounds
   · Landscaping      · Backyard gardens      · Gutter cleaning
```

### What changes, file by file

**1. `src/config/services.ts` — rewrite as the single source of truth**

   Replace the six-item flat list with a typed structure:
   ```text
   ServiceItem  { id, title, parentId }                 // 15 items
   ServiceGroup { id, title, short, description, icon } //  5 groups
   ```
   Two exported arrays: `SERVICE_GROUPS` (for homepage grid + /services page sections) and `SERVICE_ITEMS` (for QuoteModal Step 1 + matrix lookups). A helper `getItemsForGroup(groupId)` and `findService(id)` keep call-sites tidy.

   Icon assignments use existing lucide-react icons already imported in the project (Hammer, Home, Paintbrush, Fence, Trees) — no new icon weight added.

**2. `src/lib/api/public-media.ts` — extend `ServiceCategory`**

   The DB column is free-text but the TS union narrows what photo queries accept. Extend the union to include the new ids: `roofing`, `landscaping`, `walkways`, `garage`, `gutters`, `walkways`, `pressure-wash`, `gardens`, `platforms`, `fixtures`, `fireplaces`. Existing approved photos keep working because the DB lookup is by string. Photo fallback (warm stone plate + caption) renders for groups that have no shots yet — already designed for this.

**3. `src/components/Services.tsx` (homepage section) — render 5 groups, not 6 services**

   Same tile component, same MediaSlot query, same bronze-step border opacity. Each tile now shows the group title + a one-line summary listing the items inside (e.g. *"Decks · platforms · pergolas · sheds · garages"*). Click opens the QuoteModal with **no preselection**, since one tile maps to multiple services — let the user pick. Heading copy updated to "Five categories. Fifteen services." (still typographically tight).

**4. `src/pages/Services.tsx` — reformat the catalogue section**

   Replace the 2-column `ServiceTile` grid with five group sections, each with: group heading + short, then a 2-column grid of the items in that group. Each item is a small clickable row → opens QuoteModal with that one service preselected (express mode). Hero italic line changes from *"Six services. One crew."* to *"Fifteen services. One crew."*. Subtitle copy unchanged.

**5. `src/components/quote/QuoteModal.tsx` — Step 1 grouped list, Step 2 untouched**

   - Step 1 renders services grouped under their category headers (Decks & Outdoor Structures, Roofing & Exterior Envelope, etc.). Same multi-select tile pattern, just with subtle group dividers.
   - "General inquiry" tile remains at the bottom — unchanged behavior.
   - Express-mode preselection still works: clicking a single item from /services opens directly on Step 2 with that service chip.
   - Submission payload uses item titles (the human-readable strings that go in the email/CRM), not group titles — no schema change needed in the edge function or `quote_requests` table.

**6. Frictionless / performance polish (small, surgical)**

   - **Step 1 → Step 2 keyboard flow.** Already wired. Confirm Cmd/Ctrl+Enter on Step 1 advances when a service is picked.
   - **Required fields.** Already minimal: name + 10-digit phone. Email optional. Don't widen.
   - **Inline validation copy.** Already in place via `submitDisabledReason`. Verified.
   - **Input validation hardening.** Add a zod schema on the client matching what the edge function accepts (name ≤ 120, phone ≤ 40, email ≤ 255, addressOrArea ≤ 255, projectDetails ≤ 2000, services length ≤ 20, each service id ≤ 80). Validate on submit; surface errors per field. The edge function already sanitizes server-side — this just stops bad payloads at the door and gives users immediate feedback.
   - **No console logging of form data** — verified (existing code logs only error objects).
   - **Lazy-load remains correct.** QuoteModal stays lazy via `QuoteModalProvider` — no change to bundle behavior.

**7. Edge function (`supabase/functions/submit-quote-request/index.ts`)**

   No code change needed — payload shape is the same (string services array of human-readable titles, max 20 items, each clipped to 80 chars). The new catalogue fits inside the existing limits.

**8. Memory update**

   - Append one line to `mem://features/editorial-media-system` noting that the canonical service set is now the five groups in `SERVICE_GROUPS` (and 15 items in `SERVICE_ITEMS`), so future copy ("Six services" / "Fifteen services") stays in sync. No new memory file.

### What does not change

- Visual design system. Cream + bronze tokens, DM Serif Display headers, hairline rules — all preserved.
- Architect-bleed homepage hero, HeroTriptych, all editorial primitives.
- `quote_requests` DB schema — service titles are stored as a text array today.
- Lead-routing edge function logic.
- Project gallery / `src/data/projects.ts` (built work). The `ServiceCategory` union there only needs an additive extension; existing project entries stay valid.
- Auth, RLS, storage, CDN.

### Why this scope is right

You asked for "professional, simple, frictionless, performance-optimized." The fastest path is: one config file becomes the truth, every UI surface reads from it, the form already converts well — we tighten validation rather than redesign it. Five tiles on the homepage instead of fifteen keeps the editorial cadence. The /services page becomes the menu. Net file edits: ~5. No new dependencies.
