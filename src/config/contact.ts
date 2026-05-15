// Centralized contact info for Creek Construction.
// Update here once and it propagates to the modal, footer, contact section,
// JSON-LD, and every tel: / mailto: link on the site.

export const CONTACT = {
  businessName: "Creek Construction",
  shortName: "Creek",
  tagline: "Excellence in the Work.",
  description:
    "Residential exterior construction across Calgary, Edmonton, and surrounding Alberta. Decks, fencing, sheds, painting, siding — built to last, finished with care.",

  // Phone — keep digits only for the tel: link, keep formatted for display.
  phone: "(780) 777-5178",
  phoneTel: "7807775178",

  email: "Creekproconstruction@gmail.com",

  instagram: "Creek_construction",
  instagramUrl: "https://instagram.com/Creek_construction",

  serviceAreas: ["Edmonton metro", "Calgary metro", "Okanagan, BC"] as const,

  cities: [
    // Edmonton metro
    "Edmonton",
    "St. Albert",
    "Sherwood Park",
    "Stony Plain",
    "Spruce Grove",
    "Leduc",
    "Nisku",
    // Calgary metro
    "Calgary",
    "Cochrane",
    "Airdrie",
    // Okanagan, BC
    "Kelowna",
    "West Kelowna",
    "Peachland",
    "Summerland",
    "Penticton",
    "Vernon",
  ] as const,

  // Used in JSON-LD and as the canonical site URL placeholder.
  // Update once you publish + connect a custom domain.
  siteUrl: "https://creekconstruction.ca",
} as const;
