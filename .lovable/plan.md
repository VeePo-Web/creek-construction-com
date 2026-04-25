## Goal

A worldclass, private **Media Library** at `/admin/media` modeled on (and improved from) RoyalMechanical's storage manager. You drop in 200+ photos/videos at once — even 8 MB each — they upload to Lovable Cloud Storage in parallel, organized into folders. Then I (the AI) pull from that library when wiring photos into projects, instead of you uploading through chat.

This is **infrastructure**, not a public page. It will sit behind email/password auth + an `admin` role. The front-of-site editorial aesthetic remains untouched.

---

## Why this approach (vs. continuing chat uploads)

| Today (chat) | New (Media Library) |
|---|---|
| 10 files at a time | Hundreds at a time, parallelized |
| Files live in chat history | Files live in Cloud Storage with stable URLs |
| I have to copy/process each file | I `list` → pick → reference URLs directly |
| Hard to reuse, reorganize, delete | Drag-and-drop folder management, bulk ops |
| No video support over chat | Videos are first-class (MP4/WebM/MOV) |

Once this exists, your workflow becomes: **"Add the riverbend interior batch from the library to the Riverbend project."** I then read the library, pick the right files, and update `src/data/projects.ts` to reference the Cloud Storage URLs.

---

## Architecture

### 1. Storage bucket — `media-library`

A single public bucket, organized by folder = "category". Public read so the site can serve images via CDN; writes/moves/deletes are gated by an edge function using the service role key (clients never touch the service role).

**Why one bucket, many folders** (vs. many buckets): matches Royal's proven model, lets you re-organize without re-uploading, and one CDN base URL keeps the data registry clean.

**Initial folders** (seeded — you can add more from the UI):
- `riverbend-studio-shed` (current project)
- `decks`
- `fencing`
- `sheds`
- `painting`
- `siding`
- `pergolas`
- `process` (in-progress / behind-the-scenes shots)
- `hero` (atmospheric / cinematic plates)
- `team` (faces, crew at work)
- `videos` (clips, walkthroughs, time-lapses)
- `uncategorized` (auto-created landing zone for things uploaded without a folder)

### 2. Database — `profiles` + `user_roles` + RLS

Per Lovable's security rules, roles live in their own table — never on `profiles` — so I cannot accidentally introduce a privilege-escalation vector.

- `profiles(id uuid PK → auth.users, full_name, created_at)` — auto-populated by trigger on signup.
- `app_role` enum: `'admin' | 'user'`.
- `user_roles(id, user_id, role, unique(user_id, role))`.
- `has_role(_user_id, _role)` SECURITY DEFINER function — used by RLS and by the edge function to verify admin status.
- Storage access: the edge function checks `has_role(auth.uid(), 'admin')` before allowing upload/move/delete/rename. Listing is also admin-gated to keep the library private.

### 3. Auth

- **Email + password** sign-in (default, per Lovable Cloud guidelines).
- **Google sign-in** (default).
- New routes: `/admin/login` (sign-in / sign-up form) and `/admin/media` (library, gated).
- First user to sign up gets the `admin` role automatically (via a one-shot trigger that only fires when the `user_roles` table is empty). Subsequent users default to `user` and need to be promoted manually via a SQL migration.
- Email auto-confirm will be **enabled** for this admin flow only — you don't want to chase verification links to manage your own media. (If you'd rather verify, say so and I'll flip it.)
- A `<RequireAdmin />` route guard wraps `/admin/*`, redirects non-admins to `/admin/login`.

### 4. Edge function — `manage-media-library`

One function, multiple operations (matching Royal's clean pattern):

| Op | Purpose | Notes |
|---|---|---|
| `list` | Return all folders + files with public URLs, sizes, content types, dimensions where available | Scans top-level folders, lists each |
| `upload` | Multipart form upload | Streams file → bucket; sanitizes filename; supports `upsert` |
| `move` | Move single file to another folder | Copy → delete original |
| `bulkMove` | Move N files to a folder | Loops; returns per-file results |
| `rename` | Rename within folder | Used to apply our `{slug}-{NN}-{shot-type}.ext` convention |
| `delete` | Delete single | |
| `bulkDelete` | Delete N | |
| `createFolder` | Create empty folder marker | Drops a `.keep` file so empty folders persist |

Every op verifies the caller's JWT and that they have the `admin` role. CORS configured for the app origin + preview domain.

`verify_jwt = true` for this function (override from the project default) so unauthenticated callers are rejected at the edge before we even check roles.

### 5. Frontend — `/admin/media`

Visually consistent with Creek's editorial system (off-white surfaces, cedar accents, DM Serif Display headers, generous whitespace) but utilitarian — this is a tool, not a brochure page. No hero animation, no scroll choreography. Fast.

**Top bar**
- Page title "Media Library", subtitle showing "N files across M folders · X.X GB"
- "New folder" button (opens dialog → calls `createFolder`)
- "Refresh" button
- Sign-out

**Bulk-upload dropzone** (the centerpiece)
- Full-width drag-and-drop area
- Folder selector (defaults to `uncategorized`)
- Accepts `image/*` and `video/*` — explicit list: jpg, jpeg, png, webp, avif, heic, gif, mp4, webm, mov, m4v
- **Per-file 50 MB cap** (more than enough for 8 MB photos and short clips; matches Supabase Storage's default object limit)
- **Concurrency control**: uploads in batches of 4 in parallel (sweet spot — fast without saturating residential upload bandwidth or hitting edge function timeouts)
- **Resilient queue**: each file gets its own row showing thumbnail, name, target folder, progress bar, status (`queued`, `uploading`, `done`, `failed`). Failures are retryable individually. Successful files persist in the queue list until you "Clear completed".
- **Auto-rename on collision**: if `riverbend-01.jpg` exists, new file becomes `riverbend-01-2.jpg` (with a small toggle to overwrite instead).
- **Heavy-duty support**: chunked reads via `File.stream()` so 8 MB+ files don't spike memory; FormData upload through the edge function (signed-URL upgrade path noted below).

**Folder grid** (mirrors Royal's pattern, refined)
- Each folder = a card with title, count badge, total size
- Inside: 96×96 thumbnails in a wrap grid; videos show a film-strip overlay + duration; images lazy-load
- Click thumbnail = select; shift-click = range select; cmd/ctrl-click = toggle
- Right-click any image → context menu: "Move to → [folders]", "Rename…", "Copy URL", "Open in new tab", "Delete"
- Drag-and-drop between folder cards (Royal's `@dnd-kit` pattern — proven, accessible, keyboard-supported)
- Selection action bar appears at top when ≥1 selected: count + "Move to ▾", "Delete", "Copy URLs", "Clear"
- Empty folder shows a dashed dropzone

**Detail drawer** (right-side `<Sheet>`)
- Click a file → opens drawer with: large preview (or `<video controls>`), filename, folder, dimensions (for images), duration (for videos), size, content type, full public URL with copy button, "alt text" input (saved to a `media_metadata` table — see "Metadata" below), "Delete" button.

### 6. Optional but high-value: `media_metadata` table

The bucket only stores files. To attach editorial information that follows the file (alt text, capture date, location, project slug, shot type), we add:

```
media_metadata(
  id uuid PK,
  storage_path text UNIQUE,    -- e.g. "riverbend-studio-shed/riverbend-01-hero.jpg"
  alt text,
  caption text,
  project_slug text,
  shot_type text,
  width int,
  height int,
  duration_seconds int,        -- for video
  taken_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

RLS: admins read/write all; nobody else can touch it.

**Why this matters**: when I later wire a photo into `src/data/projects.ts`, I read `media_metadata` to pull the alt text *you* wrote — guaranteeing SEO-quality descriptive alts without me guessing. It also unlocks future features (filter library by project, "show me everything I tagged 'fencing'", etc.).

### 7. AI ↔ Library handoff (the key payoff)

After this ships, our content workflow looks like this:

1. You: "Upload these 40 photos to the `decks` folder." → drag-drop into the library.
2. You (in chat): "Add the new decks photos to a project called Westwood Estate."
3. Me: I call `list` → see the 40 new files in `decks/` → pick the best 6 in editorial sequence → write a new entry in `src/data/projects.ts` referencing the Cloud Storage public URLs (no more `import` statements for these — they live in storage, served via CDN, with proper `width`/`height` from `media_metadata`).

`ProgressiveImage` and `ProjectGallery` already accept any `src` string, so they'll work unchanged with cloud URLs.

### 8. Performance / scale guardrails

- **Public CDN cache** (Supabase Storage default 1 hour, we'll bump to 1 year via `Cache-Control: public, max-age=31536000, immutable`) — image requests will be near-instant after first hit.
- **`<img loading="lazy" decoding="async">`** on all library thumbnails so opening a folder of 100 doesn't stall the page.
- **`content-visibility: auto`** on each folder card so off-screen folders skip layout/paint (matches your existing perf-rendering memory).
- **Pagination fallback**: if any folder exceeds 200 files, we show first 200 + "Load more" instead of all-at-once.
- **`sharp`-style server resize**: out of scope for v1 (Supabase doesn't run sharp). Library shows originals; the front-of-site continues to use the manually optimized JPEGs in `src/assets/` for the few hand-curated hero images, and Cloud-served originals for the long tail. If image weight becomes a problem we add Cloudflare Image Resizing or a transform edge function in v2.

### 9. Future v2 (not building now, just leaving room)
- **Signed-URL direct uploads** — bypass the edge function for 100 MB+ video files, removing the function's CPU/memory from the path. (Worth it once we have actual video volume.)
- **Video thumbnail extraction** via an edge function that grabs frame 1.
- **Search** (filename, alt text, project_slug) — trivial once `media_metadata` exists.
- **Bulk-tag** UI (select N → assign project_slug + shot_type to all).

---

## Files / migrations to be created

**Database migrations**
- `profiles` table + insert trigger on `auth.users`
- `app_role` enum + `user_roles` table + `has_role()` SECURITY DEFINER fn
- One-shot "first user becomes admin" trigger
- `media_metadata` table + RLS
- Storage bucket `media-library` (public read, restricted write)
- Storage RLS policies (write/delete/update gated to `has_role(auth.uid(), 'admin')`)

**Edge function**
- `supabase/functions/manage-media-library/index.ts`
- `supabase/config.toml` block: `[functions.manage-media-library] verify_jwt = true`

**Frontend — admin shell**
- `src/lib/api/media-library.ts` — typed client (mirrors Royal's `storageApi` shape, plus `uploadMany` with concurrency control)
- `src/hooks/useAuth.tsx` — Supabase auth state hook (`onAuthStateChange` set up before `getSession`, per the auth knowledge file)
- `src/hooks/useIsAdmin.tsx` — checks `has_role` via RPC
- `src/components/admin/RequireAdmin.tsx` — route guard
- `src/pages/admin/Login.tsx` — email/password + Google sign-in
- `src/pages/admin/MediaLibrary.tsx` — page shell
- `src/components/admin/media/UploadDropzone.tsx` — drag-drop + queue
- `src/components/admin/media/UploadQueueItem.tsx` — per-file row
- `src/components/admin/media/FolderGrid.tsx` — droppable folder cards
- `src/components/admin/media/MediaCard.tsx` — draggable thumbnail (image OR video)
- `src/components/admin/media/MediaDetailDrawer.tsx` — right-side `<Sheet>` with metadata editor
- `src/components/admin/media/AddFolderDialog.tsx`
- `src/components/admin/media/SelectionActionBar.tsx`

**Routing**
- Update `src/App.tsx`: lazy-load `Login` and `MediaLibrary`, wrap admin routes in `<RequireAdmin>`. Routes added **above** the `*` catch-all.
- Add `noindex` meta on admin routes so Google never sees them.

**Dependencies to add**
- `@dnd-kit/core` and `@dnd-kit/utilities` (for drag-and-drop)
- (Auth, supabase-js, etc. already present via Lovable Cloud)

**Memory file updates**
- New `mem://architecture/admin-media-library` describing the bucket name, folder convention, and the rule "always read alt text from `media_metadata` when wiring images into projects".
- Update `mem://design/logo-asset-map.md` to note that **logos** stay in `src/assets` (hand-curated), and **project photography** flows through the Media Library.

---

## What you'll do once after I build it

1. Sign up at `/admin/login` (you become the admin automatically as the first user).
2. Drop your ~200 photos and videos into the dropzone, choosing folders as you go (or dump everything into `uncategorized` and sort later — both work).
3. Tell me "wire X folder into Y project" and I take it from there.

---

## Open questions before I build (one quick decision)

Just one. Everything else I have a strong default for.

**Auth model**: I'm planning **email/password + Google sign-in**, with **email auto-confirm enabled** so you don't need to click a verification link to manage your own admin tool. Confirm — or say "require email verification" and I'll flip it.

Also worth flagging: **first signup = admin** is convenient but means anyone who finds `/admin/login` *before* you sign up could claim the role. Mitigations:
- I'll deploy this and you sign up immediately (60-second window).
- Or I can hard-code your email as the only allowed signup. Say the word and tell me the email.

I'll proceed with the convenient default unless you say otherwise.