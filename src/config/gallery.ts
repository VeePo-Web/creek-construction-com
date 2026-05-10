// Gallery image registry — captionless gallery, alt text only.
// Drives /work (full wall) and the homepage strip. Never add titles,
// locations, summaries, or any other on-screen text here.

import heroArchitect from "@/assets/hero-architect-color.jpg";
import heroArchitecture from "@/assets/hero-architecture.jpg";
import saunaAcreage from "@/assets/sauna-acreage-premium.jpg";
import saunaBackyard from "@/assets/sauna-backyard-premium.jpg";
import saunaMountain from "@/assets/sauna-mountain-premium.jpg";
import saunaInteriorPremium from "@/assets/sauna-interior-premium.jpg";
import saunaInteriorEditorial from "@/assets/sauna-interior-editorial.jpg";
import saunaInteriorDetail from "@/assets/sauna-interior-detail.jpg";
import saunaStonesPremium from "@/assets/sauna-stones-premium.jpg";
import saunaStonesMacro from "@/assets/sauna-stones-macro.jpg";
import saunaWinterSteam from "@/assets/sauna-winter-steam.jpg";
import galleryShed01 from "@/assets/gallery/gallery-shed-01.jpg";
import galleryShed02 from "@/assets/gallery/gallery-shed-02.jpg";
import galleryShed03 from "@/assets/gallery/gallery-shed-03.jpg";

export interface GalleryImage {
  src: string;
  /** Descriptive alt — geographic + structural, never marketing copy. */
  alt: string;
}

/**
 * Curated wall order — alternates wide / portrait / square for
 * editorial rhythm in a CSS-columns masonry.
 */
export const GALLERY: GalleryImage[] = [
  { src: heroArchitect,           alt: "Modern Alberta home with cedar siding and wraparound deck at golden hour." },
  { src: saunaBackyard,           alt: "Cedar backyard structure with warm interior light against a clear evening sky." },
  { src: galleryShed01,           alt: "Backyard structure with curved cantilever roofline mid-construction." },
  { src: saunaMountain,           alt: "Cedar exterior structure on an acreage with distant mountain backdrop." },
  { src: saunaInteriorEditorial,  alt: "Cedar-clad interior with bench detail and warm directional light." },
  { src: heroArchitecture,        alt: "Architectural exterior elevation with horizontal cedar cladding." },
  { src: saunaAcreage,            alt: "Cedar building set on prairie acreage at dusk." },
  { src: galleryShed02,           alt: "Front elevation of a framed build with cedar privacy fence beyond." },
  { src: saunaInteriorPremium,    alt: "Interior cedar bench detail under soft directional light." },
  { src: saunaStonesPremium,      alt: "Stone surface detail with steam and warm light." },
  { src: saunaWinterSteam,        alt: "Cedar exterior in winter with steam rising into cold blue air." },
  { src: saunaInteriorDetail,     alt: "Tight cedar joinery and bench detail." },
  { src: galleryShed03,           alt: "Interior view through framed doorway showing stud walls and tools." },
  { src: saunaStonesMacro,        alt: "Macro detail of stones and water on a hot surface." },
];

/** Three hand-picked images for the homepage strip. */
export const HOMEPAGE_GALLERY: GalleryImage[] = [
  GALLERY[1], // backyard
  GALLERY[0], // hero architect
  GALLERY[2], // riverbend hero
];
