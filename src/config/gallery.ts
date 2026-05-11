// Gallery image registry — captionless gallery, alt text only.
// Drives /work (full wall) and the homepage strip. Never add titles,
// locations, summaries, or any other on-screen text here.
//
// Real photographs only. Additional photos are merged in at runtime
// from the approved media library (see GalleryWall).

import galleryShed01 from "@/assets/gallery/gallery-shed-01.jpg";
import galleryShed02 from "@/assets/gallery/gallery-shed-02.jpg";
import galleryShed03 from "@/assets/gallery/gallery-shed-03.jpg";

export interface GalleryImage {
  src: string;
  /** Descriptive alt — geographic + structural, never marketing copy. */
  alt: string;
}

export const GALLERY: GalleryImage[] = [
  { src: galleryShed01, alt: "Backyard structure under construction with framed walls and clean joinery." },
  { src: galleryShed02, alt: "Front elevation of a framed build with cedar privacy fence beyond." },
  { src: galleryShed03, alt: "Interior view through framed doorway showing stud walls and tools." },
];

/** Three hand-picked images for the homepage strip. */
export const HOMEPAGE_GALLERY: GalleryImage[] = [GALLERY[0], GALLERY[1], GALLERY[2]];
