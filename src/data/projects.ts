/**
 * Project registry — single source of truth for all built work.
 *
 * Adding a new project / batch of photos:
 *   1. Drop optimized JPEGs into src/assets/projects/{slug}/
 *      Naming: {slug}-{NN}-{shot-type}.jpg
 *      Shot types: hero | elevation | detail | interior | process | wide | aerial
 *   2. Import them at the top of this file.
 *   3. Add or extend a Project entry below.
 *
 * Components consume PROJECTS — never edit Portfolio.tsx, Work.tsx, or
 * ProjectGallery.tsx to swap photos.
 */

import riverbendHero from "@/assets/projects/riverbend-studio-shed/riverbend-studio-shed-01-hero.jpg";
import riverbendElevation from "@/assets/projects/riverbend-studio-shed/riverbend-studio-shed-02-elevation.jpg";

export type ServiceCategory =
  | "decks"
  | "fencing"
  | "sheds"
  | "painting"
  | "siding"
  | "pergolas";

export type ShotType =
  | "hero"
  | "elevation"
  | "detail"
  | "interior"
  | "process"
  | "wide"
  | "aerial";

export interface ProjectPhoto {
  src: string;
  /** Descriptive alt text — geographic + structural, never marketing copy. */
  alt: string;
  width: number;
  height: number;
  shotType: ShotType;
}

export interface Project {
  slug: string;
  title: string;
  service: ServiceCategory;
  location: string;
  year: number;
  status: "in-progress" | "complete";
  /** One editorial sentence — used in OG meta and hover states, never as image overlay. */
  summary: string;
  hero: ProjectPhoto;
  /** All photos in display order. Should include the hero. */
  photos: ProjectPhoto[];
  /** True if this project should surface on the homepage Portfolio strip. */
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "riverbend-studio-shed",
    title: "Riverbend Studio Shed",
    service: "sheds",
    location: "Edmonton",
    year: 2025,
    status: "in-progress",
    summary:
      "A backyard studio shed with a curved cantilever roofline, framed and sheathed on a tight urban lot.",
    hero: {
      src: riverbendHero,
      alt: "Backyard studio shed in Edmonton showing curved cantilever roofline and OSB sheathing against a clear sky.",
      width: 887,
      height: 666,
      shotType: "hero",
    },
    photos: [
      {
        src: riverbendHero,
        alt: "Backyard studio shed in Edmonton showing curved cantilever roofline and OSB sheathing against a clear sky.",
        width: 887,
        height: 666,
        shotType: "hero",
      },
      {
        src: riverbendElevation,
        alt: "Front elevation of an Edmonton backyard studio shed mid-construction with framed door opening, OSB walls, and a cedar privacy fence.",
        width: 887,
        height: 666,
        shotType: "elevation",
      },
    ],
    featured: true,
  },
];

/* ---------- Selectors ---------- */

export const getFeaturedProjects = (limit?: number): Project[] => {
  const list = PROJECTS.filter((p) => p.featured);
  return typeof limit === "number" ? list.slice(0, limit) : list;
};

export const getProjectsByService = (service: ServiceCategory): Project[] =>
  PROJECTS.filter((p) => p.service === service);

export const getProjectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug);

/** Stable, opinionated label for shedding the awkward "in-progress" / "complete" string. */
export const formatStatus = (status: Project["status"]): string =>
  status === "in-progress" ? "In Progress" : "Complete";
