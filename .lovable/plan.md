# Install the Creek Construction icon package

You uploaded 10 files in one batch — that's exactly the full standard favicon/PWA set. Here's where each one goes and why.

## The mapping (every file gets a job)

| File | Destination | Used for |
|---|---|---|
| `favicon.ico` | `public/favicon.ico` | Legacy browser tab icon, default `/favicon.ico` request, bookmarks |
| `favicon-16x16.png` | `public/favicon-16x16.png` | Browser tab at 1× DPI |
| `favicon-32x32.png` | `public/favicon-32x32.png` | Browser tab at 2× DPI / taskbar |
| `favicon-48x48.png` | `public/favicon-48x48.png` | Windows site tile / pin-to-taskbar |
| `favicon-64x64.png` | `public/favicon-64x64.png` | High-DPI tab fallback |
| `favicon-96x96.png` | `public/favicon-96x96.png` | Android shortcut / mid-tier surfaces |
| `favicon-128x128.png` | `public/favicon-128x128.png` | Chrome Web Store / macOS shortcut |
| `apple-touch-icon.png` (180×180) | `public/apple-touch-icon.png` | iOS "Add to Home Screen" |
| `android-chrome-192x192.png` | `public/android-chrome-192x192.png` | Android home screen / PWA |
| `android-chrome-512x512.png` | `public/android-chrome-512x512.png` | Android splash, PWA install — **also replaces in-site logo** |

## Steps

1. **Copy all 10 files into `public/`** using `code--copy` (one per file). Overwrite the existing `public/favicon.ico`.

2. **Replace the in-site logo asset.** The 512×512 PNG is the cleanest, highest-res version of the new mark — copy it to `src/assets/creek-construction-logo.png`, overwriting the old logo. `Navigation.tsx` and `Footer.tsx` already import `@/assets/creek-construction-logo.png`, so they automatically pick up the new circular Creek mark — no component edits needed.

3. **Update `index.html` `<head>`** to wire up the full icon set:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico" />
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
   <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
   <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
   <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   ```
   Browsers pick the best size automatically — no JS, no perf cost.

4. **Create `public/site.webmanifest`** so the site is installable as a PWA on Android (and Chrome desktop shows the proper icon when pinned):
   ```json
   {
     "name": "Creek Construction",
     "short_name": "Creek",
     "icons": [
       { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
     ],
     "theme_color": "#2a4233",
     "background_color": "#f5f1ea",
     "display": "standalone",
     "start_url": "/"
   }
   ```
   Theme color matches the existing `<meta name="theme-color" content="#2a4233">` already in `index.html`.

5. **Verify** by viewing `index.html` after edits and confirming all 10 files exist in `public/` plus the updated logo in `src/assets/`. The header/footer logo updates visually on next preview render.

## A note on terminology

You said "add into the backend" — to be precise, the icon package isn't user data, so it doesn't belong in Lovable Cloud (database/storage). It belongs in the site's static asset layer (`public/`) where browsers, iOS, Android, and Windows can request it directly by well-known filenames. That's the correct, performance-optimized home for it.

## What this does NOT do

- **No OG image change.** The existing `public/og-image.jpg` (social sharing preview on Facebook/LinkedIn/iMessage) is untouched. The round logo on transparent isn't ideal for OG — that needs a 1200×630 landscape banner. Flag if you want me to generate a branded OG image as a follow-up.
- **No edge-function or database work** for this task.