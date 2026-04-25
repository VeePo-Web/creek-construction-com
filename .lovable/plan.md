## What this batch actually adds (after audit)

Of the 10 files, **6 are pure duplicates** of artwork I already have installed (same image content, different filenames). The remaining 4 add genuinely new value:

1. `creek-logo-nav-small.png` — tightest crop, optimized for tiny header renders (sharper at 32–44px than the current `creek-logo-sm.png` because there's less wasted padding)
2. `creek-logo-nav-medium.png` — mid nav crop, retina source for header at desktop sizes
3. `creek-logo-nav-large.png` — full-resolution nav crop
4. `creek-logo-instagram-1080.png` — 1080×1080 transparent, ideal source for a proper OG/social share image (current `og-image.jpg` is a generic stock photo — needs to be replaced)
5. `creek-construction-transparent-master.png` — high-res master, archived as the canonical source

The other 5 (`creek-logo-small/medium/large.png`, `creek-construction-original.jpeg`) are duplicates of art I already have or are JPEGs with white backgrounds we don't want. **I'll skip them** rather than bloat `src/assets/` with redundant files.

## Changes

### 1. Save new nav-cropped logos to `src/assets/`
- `creek-logo-nav-small.png` → `src/assets/creek-logo-nav-sm.png`
- `creek-logo-nav-medium.png` → `src/assets/creek-logo-nav-md.png`
- `creek-logo-nav-large.png` → `src/assets/creek-logo-nav-lg.png`

### 2. Swap header/footer to the tighter nav crops
The "nav" crops have less surrounding whitespace, so they render visually larger inside the same 40–48px box — sharper, more brand-present. Update three import sites:
- `src/components/Navigation.tsx` line 6 → `import logo from "@/assets/creek-logo-nav-sm.png"`
- `src/components/Footer.tsx` line 4 → `import logo from "@/assets/creek-logo-nav-md.png"`
- `src/components/quote/QuoteModal.tsx` line 14 → `import logo from "@/assets/creek-logo-nav-sm.png"`

The old `creek-logo-sm.png` / `creek-logo-md.png` / `creek-logo-lg.png` will become unused. I'll delete `creek-logo-sm.png` and `creek-logo-md.png` (clearly superseded), but **keep `creek-logo-lg.png`** as the high-resolution full-circle variant for any future hero/marketing surface that wants the full composition with breathing room.

### 3. Replace the generic OG image with brand-correct logo
- Save `creek-logo-instagram-1080.png` → `public/og-image.png`
- Delete the current `public/og-image.jpg` (generic stock)
- Update `index.html` `<meta property="og:image">` and `<meta name="twitter:image">` to point at `/og-image.png` and set dimensions to `1080×1080`

Note: 1080×1080 is square. Most platforms (Facebook, LinkedIn, Twitter) prefer 1200×630 landscape. Square will still work — it just gets center-cropped on some surfaces. If you want a tuned 1200×630 banner, flag it and I'll compose one (logo + tagline on evergreen background).

### 4. Archive the master
- Save `creek-construction-transparent-master.png` → `src/assets/creek-construction-master.png` (not imported anywhere — sits as the canonical high-res source for any future export work)

### 5. Skip these (duplicate / wrong format)
- `creek-logo-small.png`, `creek-logo-medium.png`, `creek-logo-large.png` — same artwork I already saved as `creek-logo-sm/md/lg.png` from batch 2
- `creek-logo-hero.png` — duplicate of existing `creek-logo-lg.png` artwork
- `creek-construction-original.jpeg` — JPEG with hard white background; we use transparent PNGs everywhere

## Final logo asset map (after this batch)

| Asset | Where it's used | Triggered by |
|---|---|---|
| `src/assets/creek-logo-nav-sm.png` | Header (`Navigation.tsx`), Quote modal | Every page render — sticky header + quote dialog |
| `src/assets/creek-logo-nav-md.png` | Footer (`Footer.tsx`) | Every page render — site footer |
| `src/assets/creek-logo-nav-lg.png` | Reserved | Future retina footer surfaces, large badges |
| `src/assets/creek-logo-lg.png` | Reserved | Future hero/marketing surface where full circular composition + padding is desired |
| `src/assets/creek-construction-master.png` | Archived | Source-of-truth high-res master, not bundled into runtime |
| `public/og-image.png` | Social shares (FB, LinkedIn, Twitter, iMessage) | When someone shares a Creek Construction URL |
| `public/favicon-*.png` (full set, batches 1+2) | Browser tab, taskbar, bookmarks | Browser chrome on every visit |
| `public/apple-touch-icon.png` | iOS home screen | "Add to Home Screen" on iPhone/iPad |
| `public/android-chrome-*.png` | Android home screen + PWA splash | Install via Chrome Android |
| `public/favicon.ico` | Legacy fallback | Old browsers, default `/favicon.ico` request |

## What this still does NOT do

- **Tuned 1200×630 OG banner**: square logo will work but isn't optimal. Flag if you want a designed landscape version.
- **No PWA service worker** (deliberate — would break Lovable preview reloads).
