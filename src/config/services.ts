// Single source of truth for the services Creek Construction offers.
//
// Two layers:
//   • SERVICE_GROUPS — five editorial categories used on the homepage grid
//     and as section headers on the /services page.
//   • SERVICE_ITEMS  — the fifteen actual services. The QuoteModal exposes
//     these as individual checkboxes; each item is also clickable on the
//     /services page to open the modal in express mode.
//
// Adding a service:
//   1. Append a SERVICE_ITEM with a stable id and the parent group id.
//   2. If it doesn't fit any existing group, add a SERVICE_GROUP first.
//   3. Optional: extend ServiceCategory in src/lib/api/public-media.ts so
//      MediaSlot can pull approved photos for it.

import {
  Hammer,
  Home,
  Paintbrush,
  Fence,
  Trees,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceGroupId =
  | "outdoor-structures"
  | "roofing-envelope"
  | "painting-restoration"
  | "fences-hardscape"
  | "landscaping-grounds";

export interface ServiceGroup {
  id: ServiceGroupId;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Maps the group to a photo category for MediaSlot lookups. */
  mediaCategory: string;
  /** Bronze opacity 0–1 used in the thermal-crescendo border pattern. */
  intensity: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  parentId: ServiceGroupId;
  /** Optional one-line description used on /services rows and modal tiles. */
  short?: string;
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "outdoor-structures",
    title: "Decks & Outdoor Structures",
    short: "Decks · platforms · pergolas · sheds · garages",
    description:
      "Cedar, pressure-treated, composite — built for how you actually use the outdoors and engineered to outlast Alberta winters.",
    icon: Hammer,
    mediaCategory: "decks",
    intensity: 0.22,
  },
  {
    id: "roofing-envelope",
    title: "Roofing & Exterior Envelope",
    short: "Roof repairs · new builds · siding · fixtures",
    description:
      "From single-shingle repairs to full re-roofs and re-clads. We seal the envelope so the inside stays inside.",
    icon: Home,
    mediaCategory: "siding",
    intensity: 0.4,
  },
  {
    id: "painting-restoration",
    title: "Painting & Surface Restoration",
    short: "Exterior paint · sanding · prep",
    description:
      "Proper prep, premium paint, clean lines. The difference between a paint job that lasts two seasons and one that lasts a decade.",
    icon: Paintbrush,
    mediaCategory: "painting",
    intensity: 0.55,
  },
  {
    id: "fences-hardscape",
    title: "Fences & Hardscape",
    short: "Fences · walkways · driveway pressure cleaning",
    description:
      "Privacy fences, property lines, walkways and driveway restoration. Straight posts, square corners, no shortcuts on the parts you can’t see.",
    icon: Fence,
    mediaCategory: "fencing",
    intensity: 0.72,
  },
  {
    id: "landscaping-grounds",
    title: "Landscaping & Grounds",
    short: "Landscaping · backyard gardens · gutter cleaning",
    description:
      "Yard transformations, garden builds, and the seasonal upkeep that protects everything else you’ve invested in.",
    icon: Trees,
    mediaCategory: "pergolas",
    intensity: 0.88,
  },
];

export const SERVICE_ITEMS: ServiceItem[] = [
  // Decks & Outdoor Structures
  { id: "decks", title: "Decks", parentId: "outdoor-structures", short: "Custom builds & rebuilds" },
  { id: "platforms", title: "Platforms", parentId: "outdoor-structures", short: "Hot-tub, equipment & seating platforms" },
  { id: "pergolas", title: "Pergolas & Fireplaces", parentId: "outdoor-structures", short: "Shade structures & outdoor fireplaces" },
  { id: "sheds", title: "Sheds", parentId: "outdoor-structures", short: "Garden sheds, workshops, bunkies" },
  { id: "garage", title: "Garage Builds", parentId: "outdoor-structures", short: "Detached & attached garage construction" },

  // Roofing & Exterior Envelope
  { id: "roof-repairs", title: "Roof Repairs", parentId: "roofing-envelope", short: "Leaks, missing shingles, flashing" },
  { id: "roof-new", title: "New Roof Builds", parentId: "roofing-envelope", short: "Full re-roofs & new construction" },
  { id: "siding", title: "Siding", parentId: "roofing-envelope", short: "Repairs, replacements & full re-clads" },
  { id: "fixtures", title: "Exterior Fixtures", parentId: "roofing-envelope", short: "Lights, vents, mounts & hardware" },

  // Painting & Restoration
  { id: "exterior-paint", title: "Exterior Paint", parentId: "painting-restoration", short: "Homes, trim, fences & decks" },
  { id: "sanding", title: "Sanding & Prep", parentId: "painting-restoration", short: "Strip, sand, prime — done properly" },

  // Fences & Hardscape
  { id: "fencing", title: "Fences", parentId: "fences-hardscape", short: "Wood, vinyl, chain link & gates" },
  { id: "walkways", title: "Walkways", parentId: "fences-hardscape", short: "Stone, paver & concrete paths" },
  { id: "pressure-wash", title: "Driveway Pressure Cleaning", parentId: "fences-hardscape", short: "Restore concrete, pavers & stone" },

  // Landscaping & Grounds
  { id: "landscaping", title: "Landscaping", parentId: "landscaping-grounds", short: "Grading, sod, beds & full yard work" },
  { id: "gardens", title: "Backyard Gardens", parentId: "landscaping-grounds", short: "Raised beds, planters & garden builds" },
  { id: "gutters", title: "Gutter Cleaning", parentId: "landscaping-grounds", short: "Seasonal clean-out & inspection" },
];

export const OTHER_SERVICE_OPTION = "Something else exterior";

// ---------- Helpers ----------

export function getItemsForGroup(groupId: ServiceGroupId): ServiceItem[] {
  return SERVICE_ITEMS.filter((s) => s.parentId === groupId);
}

export function findService(id: string): ServiceItem | undefined {
  return SERVICE_ITEMS.find((s) => s.id === id);
}

export function findGroup(id: ServiceGroupId): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((g) => g.id === id);
}

// ---------- Back-compat shim ----------
//
// Some legacy call-sites still import `SERVICES` expecting the old flat list
// shape `{ id, title, short, description, icon, intensity }`. We expose the
// fifteen items in that shape so nothing breaks during the migration. New
// code should prefer SERVICE_GROUPS / SERVICE_ITEMS directly.
export interface ServiceDef {
  id: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  intensity: number;
}

export const SERVICES: ServiceDef[] = SERVICE_ITEMS.map((item, i) => {
  const group = findGroup(item.parentId)!;
  return {
    id: item.id,
    title: item.title,
    short: item.short ?? group.short,
    description: group.description,
    icon: group.icon,
    intensity: 0.2 + (i / Math.max(1, SERVICE_ITEMS.length - 1)) * 0.65,
  };
});
