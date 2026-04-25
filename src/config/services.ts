// Single source of truth for the services Creek Construction offers.
// Used by the home Services section, the QuoteModal pre-selection,
// and the /services sub-page.

import { Hammer, Fence, Warehouse, Paintbrush, Home, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceDef {
  id: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Hex border opacity 0-1 used in the thermal-crescendo border pattern. */
  intensity: number;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "decks",
    title: "Decks",
    short: "Custom builds & rebuilds",
    description:
      "Cedar, pressure-treated, composite — designed for how you actually use the outdoors and built to outlast Alberta winters.",
    icon: Hammer,
    intensity: 0.2,
  },
  {
    id: "fencing",
    title: "Fencing",
    short: "Wood, vinyl & chain link",
    description:
      "Privacy fences, property lines, gates and repairs. Straight posts, square corners, no shortcuts on the parts you can't see.",
    icon: Fence,
    intensity: 0.32,
  },
  {
    id: "sheds",
    title: "Sheds",
    short: "Custom storage & outbuildings",
    description:
      "Garden sheds, workshops, bunkies — built on-site or pre-built. Real framing, real roofing, real doors that still close in year ten.",
    icon: Warehouse,
    intensity: 0.45,
  },
  {
    id: "painting",
    title: "Exterior Painting",
    short: "Homes, trim, fences & decks",
    description:
      "Proper prep, premium paint, clean lines. The difference between a paint job that lasts two seasons and one that lasts a decade.",
    icon: Paintbrush,
    intensity: 0.58,
  },
  {
    id: "siding",
    title: "Siding & Exterior Repair",
    short: "Siding, soffit, fascia & eaves",
    description:
      "Repairs, replacements, full re-clads. We fix it once, properly — and the seams disappear when we're done.",
    icon: Home,
    intensity: 0.72,
  },
  {
    id: "pergolas",
    title: "Pergolas & Gazebos",
    short: "Custom outdoor structures",
    description:
      "Shade structures, pergolas, covered seating areas. Designed to look intentional on your property, not bolted on.",
    icon: Trees,
    intensity: 0.85,
  },
];

export const OTHER_SERVICE_OPTION = "Something else exterior";
