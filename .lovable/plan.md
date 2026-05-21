Make the 16 service cities visible on-page (not just JSON-LD) so they're indexed as body text, and tighten the existing schema.

## Changes

**1. `src/config/contact.ts`** — Add a `serviceRegions` array grouped by metro so UI and schema share one source:
```
[
  { region: "Edmonton metro, AB", cities: ["Edmonton","St. Albert","Sherwood Park","Stony Plain","Spruce Grove","Leduc","Nisku"] },
  { region: "Calgary metro, AB",  cities: ["Calgary","Cochrane","Airdrie"] },
  { region: "Okanagan, BC",       cities: ["Kelowna","West Kelowna","Peachland","Summerland","Penticton","Vernon"] },
]
```
Keep `cities` as a flat derived export for back-compat.

**2. `src/pages/Contact.tsx`** — Add an "Areas We Serve" block under the direct-contact card (left column, below the MapPin row). Renders each region as an `<h3>` with a comma-separated city list in body text. Uses existing cedar/serif tokens. This is the main SEO win — real, crawlable on-page text for every city name.

**3. `src/components/Footer.tsx`** — Add a compact "Service Areas" column (or append to existing column) listing all cities grouped by region, so every page on the site carries the city names in the footer (sitewide internal text signal).

**4. `src/components/JsonLd.tsx`** — Keep `areaServed` driven by the flat `cities` list (already done). Add `address.addressRegion` handling so AB + BC are both represented (use an array of `PostalAddress` or switch `areaServed` to include both `City` and `AdministrativeArea` entries for "Alberta" and "British Columbia").

**5. `index.html`** — Tighten the meta description to name the highest-intent cities once (Edmonton, Calgary, Kelowna already there; add St. Albert, Sherwood Park, Airdrie within the 160-char budget). No new tags — Google ignores keyword stuffing; the on-page text in steps 2–3 is what moves the needle.

## What we intentionally don't do

- No per-city landing pages — out of scope for this request and would need real content per city to avoid doorway-page penalties.
- No keyword-stuffed hidden div — visible, semantic, grouped lists only.
- No changes to nav `SERVICE_AREAS` (already shows the same cities in GlobalMenu).

## Files touched
`src/config/contact.ts`, `src/pages/Contact.tsx`, `src/components/Footer.tsx`, `src/components/JsonLd.tsx`, `index.html`