# Service areas + Instagram tag

## 1. Update service areas (single source of truth)

**`src/config/contact.ts`** — replace `cities[]` with the full list grouped by region:

```ts
cities: [
  // Edmonton metro
  "Edmonton", "St. Albert", "Sherwood Park", "Stony Plain", "Spruce Grove", "Leduc", "Nisku",
  // Calgary metro
  "Calgary", "Cochrane", "Airdrie",
  // BC – Okanagan
  "Kelowna", "West Kelowna", "Peachland", "Summerland", "Penticton", "Vernon",
] as const,
serviceAreas: ["Edmonton metro", "Calgary metro", "Okanagan, BC"] as const,
```

Add Instagram handle:
```ts
instagram: "Creek_construction",
instagramUrl: "https://instagram.com/Creek_construction",
```

## 2. Areas-served UI (GlobalMenu)

**`src/components/navigation/GlobalMenu.tsx`** — `SERVICE_AREAS` becomes 3 groups:

```ts
{ metro: "Edmonton Metro", cities: ["Edmonton","St. Albert","Sherwood Park","Stony Plain","Spruce Grove","Leduc","Nisku"] },
{ metro: "Calgary Metro",  cities: ["Calgary","Cochrane","Airdrie"] },
{ metro: "Okanagan, BC",   cities: ["Kelowna","West Kelowna","Peachland","Summerland","Penticton","Vernon"] },
```

## 3. Contact page area line

**`src/pages/Contact.tsx`** L110 — change "Calgary, Edmonton & surrounding Alberta" → "Edmonton & Calgary metros · Okanagan, BC".

## 4. SEO

**`index.html`** — broaden title/description/og copy to mention all three regions. Example:
- title: `Creek Construction — Excellence in the Work · Alberta & Okanagan, BC`
- description: `Residential exterior construction across Edmonton, Calgary, and the Okanagan (Kelowna, Penticton, Vernon). Decks, fencing, sheds, painting, siding — built to last. Free quotes.`
- duplicate to og:title / og:description / twitter:* (already mirrored in same file).

**`src/pages/Index.tsx`**, **`src/pages/About.tsx`**, **`src/pages/Contact.tsx`** SEO/description strings — same broadening.

**`src/lib/brand-identity.ts`** L29, L154 — `region` / `serviceArea` updated to "Alberta & Okanagan, BC".

`src/components/JsonLd.tsx` `areaServed` already maps from `CONTACT.cities` → automatically picks up the full new list. Add `sameAs: [CONTACT.instagramUrl]` to the LocalBusiness JSON-LD so Instagram is a verified social profile signal for crawlers.

## 5. Instagram tag

Render a small `@Creek_construction` chip in the Footer "Direct Line" column (under email), linking to `instagramUrl` with `target="_blank" rel="noopener"` and an Instagram lucide icon. Same eyebrow/cedar-hover treatment as existing footer links.

## Files touched
- `src/config/contact.ts`
- `src/components/navigation/GlobalMenu.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Index.tsx`
- `src/pages/About.tsx`
- `src/lib/brand-identity.ts`
- `src/components/Footer.tsx`
- `src/components/JsonLd.tsx`
- `index.html`