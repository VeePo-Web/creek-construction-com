import { CONTACT } from "@/config/contact";

export type AreaPageKind = "hub" | "metro" | "city";

export interface AreaPage {
  slug: string;
  kind: AreaPageKind;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  region?: string;
  cities?: string[];
  nearby?: string[];
}

export const AREA_HUB: AreaPage = {
  slug: "",
  kind: "hub",
  name: "Areas We Serve",
  title: "Areas We Serve",
  description:
    "Creek Construction serves residential exterior projects across Edmonton Metro, Calgary Metro, and the Okanagan, BC.",
  h1: "Areas we serve.",
  intro:
    "Creek Construction works across Edmonton Metro, Calgary Metro, and the Okanagan, BC. Our crew handles residential exterior projects including decks, fences, siding, painting, sheds, roofing, landscaping, and related outdoor work.",
};

export const METRO_AREAS: AreaPage[] = [
  {
    slug: "edmonton-metro",
    kind: "metro",
    name: "Edmonton Metro",
    title: "Edmonton Metro Service Area",
    description:
      "Creek Construction serves decks, fences, siding, roofing, sheds, painting, and exterior projects across Edmonton Metro.",
    h1: "Exterior construction across Edmonton Metro.",
    region: "Edmonton metro, AB",
    cities: ["Edmonton", "St. Albert", "Sherwood Park", "Stony Plain", "Spruce Grove", "Leduc", "Nisku"],
    intro:
      "Creek Construction serves homeowners across Edmonton Metro with residential exterior work built by the same crew customers meet at the quote.",
  },
  {
    slug: "calgary-metro",
    kind: "metro",
    name: "Calgary Metro",
    title: "Calgary Metro Service Area",
    description:
      "Creek Construction serves decks, fences, siding, painting, sheds, roofing, and exterior projects across Calgary Metro.",
    h1: "Exterior construction across Calgary Metro.",
    region: "Calgary metro, AB",
    cities: ["Calgary", "Cochrane", "Airdrie"],
    intro:
      "Creek Construction serves Calgary Metro homeowners with written quotes, careful exterior builds, and a small crew that keeps quality consistent.",
  },
  {
    slug: "okanagan-bc",
    kind: "metro",
    name: "Okanagan, BC",
    title: "Okanagan BC Service Area",
    description:
      "Creek Construction serves residential exterior projects across Kelowna, West Kelowna, Penticton, Vernon, and nearby Okanagan communities.",
    h1: "Exterior construction across the Okanagan.",
    region: "Okanagan, BC",
    cities: ["Kelowna", "West Kelowna", "Peachland", "Summerland", "Penticton", "Vernon"],
    intro:
      "Creek Construction serves Okanagan homeowners with exterior projects designed for outdoor living, weather exposure, and long-term use.",
  },
];

const cityToMetro: Record<string, string> = Object.fromEntries(
  METRO_AREAS.flatMap((metro) => (metro.cities ?? []).map((city) => [city, metro.name])),
);

const citySlugs: Record<string, string> = {
  Edmonton: "edmonton",
  "St. Albert": "st-albert",
  "Sherwood Park": "sherwood-park",
  "Stony Plain": "stony-plain",
  "Spruce Grove": "spruce-grove",
  Leduc: "leduc",
  Nisku: "nisku",
  Calgary: "calgary",
  Cochrane: "cochrane",
  Airdrie: "airdrie",
  Kelowna: "kelowna",
  "West Kelowna": "west-kelowna",
  Peachland: "peachland",
  Summerland: "summerland",
  Penticton: "penticton",
  Vernon: "vernon",
};

export const CITY_AREAS: AreaPage[] = CONTACT.cities.map((city) => {
  const metro = cityToMetro[city] ?? "Creek Construction service area";
  return {
    slug: citySlugs[city],
    kind: "city",
    name: city,
    title: `${city} Exterior Contractor`,
    description: `Creek Construction serves ${city} homeowners with decks, fences, siding, painting, sheds, roofing, landscaping, and exterior project quotes.`,
    h1: `Exterior construction in ${city}.`,
    region: metro,
    intro: `Creek Construction serves ${city} homeowners with residential exterior construction, written quotes, and a crew that handles the build from first visit through final walkthrough.`,
    nearby: CONTACT.cities.filter((candidate) => candidate !== city).slice(0, 5),
  };
});

export const AREA_PAGES = [AREA_HUB, ...METRO_AREAS, ...CITY_AREAS] as const;

export function getAreaPage(slug?: string) {
  if (!slug) return AREA_HUB;
  return AREA_PAGES.find((page) => page.slug === slug);
}

export function areaPath(slug?: string) {
  return slug ? `/areas-we-serve/${slug}` : "/areas-we-serve";
}

