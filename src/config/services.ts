// Single source of truth for the services Creek Construction offers.
//
// Pass 48: collapsed to a single flat list of 16 services with one
// description per item. The five-group layer is preserved as a back-compat
// shim (one synthetic "all" group) so QuoteModal / QuoteFormInline / any
// legacy callsite that maps over SERVICE_GROUPS keeps working without
// surgery.

import {
  Hammer,
  Home,
  Paintbrush,
  Fence,
  Trees,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Bronze opacity 0–1, used for the thermal-crescendo border pattern. */
  intensity: number;
}

/**
 * The definitive Creek Construction service list — order matches the
 * sequence the owner wants surfaced on the website.
 */
export const SERVICES: ServiceDef[] = [
  { id: "siding",            title: "Siding",                       description: "Repairs, replacements, and full re-clads — cedar, fibre-cement, vinyl.",         icon: Home,       intensity: 0.20 },
  { id: "exterior-paint",    title: "Exterior Paint & Sanding",     description: "Proper prep, premium paint, clean lines that hold for a decade.",                icon: Paintbrush, intensity: 0.24 },
  { id: "decks",             title: "Decks",                        description: "Cedar, pressure-treated, composite — built for how you use the outdoors.",       icon: Hammer,     intensity: 0.28 },
  { id: "platforms",         title: "Platforms",                    description: "Hot-tub, equipment, and seating platforms engineered to sit dead level.",         icon: Hammer,     intensity: 0.32 },
  { id: "fireplaces",        title: "Fireplaces",                   description: "Outdoor fireplaces and surrounds — masonry, steel, stone.",                       icon: Hammer,     intensity: 0.36 },
  { id: "sheds",             title: "Sheds",                        description: "Garden sheds, workshops, and bunkies — finished to the same standard as the house.", icon: Hammer,  intensity: 0.40 },
  { id: "gutters",           title: "Gutter Cleaning",              description: "Seasonal clean-out and inspection so the envelope keeps doing its job.",          icon: Trees,      intensity: 0.44 },
  { id: "roof-repairs",      title: "Roof Repairs",                 description: "Leaks, missing shingles, flashing — diagnosed and fixed in one visit when possible.", icon: Home,    intensity: 0.48 },
  { id: "roof-new",          title: "New Roof Builds",              description: "Full re-roofs and new construction — shingle, metal, membrane.",                  icon: Home,       intensity: 0.52 },
  { id: "fencing",           title: "Fences",                       description: "Wood, vinyl, chain link, and gates — straight posts, square corners.",            icon: Fence,      intensity: 0.58 },
  { id: "fixtures",          title: "Exterior Fixtures",            description: "Lights, vents, mounts, and hardware — properly flashed and sealed.",              icon: Home,       intensity: 0.62 },
  { id: "landscaping",       title: "Landscaping",                  description: "Grading, sod, beds, and full yard transformations.",                              icon: Trees,      intensity: 0.68 },
  { id: "walkways",          title: "Walkways",                     description: "Stone, paver, and concrete paths laid on a base that won't heave.",               icon: Fence,      intensity: 0.74 },
  { id: "gardens",           title: "Backyard Gardens",             description: "Raised beds, planters, and garden builds tuned to your sun and soil.",            icon: Trees,      intensity: 0.80 },
  { id: "pressure-wash",     title: "Driveway Pressure Cleaning",   description: "Restore concrete, pavers, and stone to factory tone.",                            icon: Fence,      intensity: 0.86 },
  { id: "garage",            title: "Garage Builds",                description: "Detached and attached garage construction — foundation to finish.",               icon: Hammer,     intensity: 0.92 },
];

export const OTHER_SERVICE_OPTION = "Something else exterior";

// ---------- Helpers ----------

export function findService(id: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.id === id);
}

// ---------- Back-compat shim ----------
//
// Older callsites (QuoteModal, QuoteFormInline, anything calling
// SERVICE_GROUPS / SERVICE_ITEMS / getItemsForGroup) now see one synthetic
// "all" group containing every service. Lets us collapse the structure
// without a sweeping rewrite of every consumer.

export type ServiceGroupId = "all";

export interface ServiceGroup {
  id: ServiceGroupId;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  mediaCategory: string;
  intensity: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  parentId: ServiceGroupId;
  short?: string;
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "all",
    title: "Everything we build",
    short: "Sixteen services. One crew.",
    description:
      "Residential exterior work across Alberta — done by the same crew you meet on day one.",
    icon: Hammer,
    mediaCategory: "decks",
    intensity: 0.5,
  },
];

export const SERVICE_ITEMS: ServiceItem[] = SERVICES.map((s) => ({
  id: s.id,
  title: s.title,
  parentId: "all" as const,
  short: s.description,
}));

export function getItemsForGroup(_groupId: ServiceGroupId): ServiceItem[] {
  return SERVICE_ITEMS;
}

export function findGroup(id: ServiceGroupId): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((g) => g.id === id);
}
