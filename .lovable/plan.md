# Wire batch 4 logo exports — proper social cards & high-res JSON-LD logo

## What this batch actually adds (after audit)

These four files are **purpose-built export sizes** for specific surfaces — not new artwork. Three of them solve real, visible problems on the current site.

| File | Real value | Decision |
|---|---|---|
| `creek-logo-og-1200x630.png` | **Properly framed 1200×630 OG banner.** The current `og-image.jpg` was hand-composited last batch (logo flattened on an evergreen background). This one is the designer's intended crop with proper margins on a clean canvas — sharper and on-brand. | **Adopt** as the new OG image |
| `creek-logo-twitter-1200x600.png` | Twitter's `summary_large_image` card prefers ~1.91:1 (≈1200×628). 1200×600 is close enough and Twitter accepts it. Currently we point Twitter at the same image as Facebook OG. Giving Twitter its own correctly-proportioned card is the right move. | **Adopt** as a dedicated Twitter card |
| `creek-logo-square-1024.png` | 1024×1024 transparent square. Useful for: iMessage rich link previews (which strongly prefer square), WhatsApp shares, and as the canonical Schema.org `logo` property in JSON-LD. Higher fidelity than what's currently referenced. | **Adopt** as the JSON-LD logo + iMessage fallback |
| `creek-logo-profile-400.png` | 400×400 — same artwork as the square 1024, just smaller. Sized for social profile pictures (Instagram, Facebook page, LinkedIn company page). Not currently rendered on the site. | **Archive only** in `src/assets/`. No code wiring. |

## Changes

### 1. Save assets

- `creek-logo-og-1200x630.png` → `public/og-image.png`  *(new format — PNG with transparency)*
- `creek-logo-twitter-1200x600.png` → `public/twitter-card.png`
- `creek-logo-square-1024.png` → `public/creek-logo-square.png`  *(public so JSON-LD can reference it via absolute URL)*
- `creek-logo-profile-400.png` → `src/assets/creek-logo-profile-400.png`  *(archive — for team's manual social profile uploads, not bundled into runtime UI)*

### 2. Update `index.html` social tags

Three concrete edits:

**a. OG image** — swap `og-image.jpg` → `og-image.png`, keep dimensions 1200×630, update alt copy to match the actual artwork (it shows the full creek/bridge mark on transparent, not a colored banner):

```html
<meta property="og:image" content="https://creekconstruction.ca/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="Creek Construction — bridge over a mountain creek" />
```

**b. Twitter card** — point at the dedicated 1200×600 export:

```html
<meta name="twitter:image" content="https://creekconstruction.ca/twitter-card.png" />
<meta name="twitter:image:alt" content="Creek Construction" />
```

**c. Delete the old `public/og-image.jpg`** — it's now superseded.

### 3. Add Schema.org `logo` to JSON-LD

I'll read `src/components/JsonLd.tsx` first. If it already declares an `Organization` or `LocalBusiness` node, I'll add a `logo` property pointing at `https://creekconstruction.ca/creek-logo-square.png` (Google requires the logo URL to be absolute and ideally square — 1024×1024 is exactly what they want for Knowledge Panel display). If the structure doesn't naturally accommodate it, I'll skip rather than invent a new schema block just to hold a URL.

### 4. No changes to favicons, header, footer, or quote modal

This batch doesn't supersede any in-UI logo. `creek-logo-nav-sm/md/lg.png` remain correct for the header/footer/modal at 40–48px. No churn.

## Final social-share asset map (after this batch)

| Surface | Asset served | Source |
|---|---|---|
| Facebook, LinkedIn, iMessage rich preview | `/og-image.png` (1200×630, transparent PNG) | `og:image` meta |
| Twitter / X | `/twitter-card.png` (1200×600) | `twitter:image` meta |
| Google Knowledge Panel, Schema.org consumers | `/creek-logo-square.png` (1024×1024) | JSON-LD `logo` field |
| Browser tab, OS icons, PWA install | `/favicon-*.png`, `/apple-touch-icon.png`, `/android-chrome-*.png` | Existing `<link>` tags + `site.webmanifest` |
| In-page header / footer / modal | `creek-logo-nav-sm.png` / `creek-logo-nav-md.png` | Existing component imports |
| **Team social profile pictures (manual upload)** | `src/assets/creek-logo-profile-400.png` | Not auto-served — give to whoever runs IG/FB/LinkedIn |

## What this still does NOT do

- Doesn't change the favicon set (already complete from batches 1–2)
- Doesn't touch any in-UI component import — header/footer/modal stay on `creek-logo-nav-*`
- The team still needs to **manually upload** `creek-logo-profile-400.png` to Instagram, Facebook, LinkedIn profile-picture surfaces. There's no automation for that — but it's now the canonical 400×400 source ready to drag into any platform's avatar uploader.