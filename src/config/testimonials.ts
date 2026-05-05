/**
 * Testimonials — single source of truth for client quotes used across the site.
 * Editorial: no avatars, no stars. Just the words and an attribution line.
 */
export interface Testimonial {
  quote: string;
  firstName: string;
  city: string;
  service: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Quote was clear, the crew showed up when they said, and the deck looks like it belongs on the house. Quiet, careful work.",
    firstName: "Megan",
    city: "Calgary NW",
    service: "Cedar deck",
  },
  {
    quote:
      "Two estimates lower than ours quoted. Creek’s scope was the only one in writing. We picked them on that alone — no regrets.",
    firstName: "David",
    city: "Sherwood Park",
    service: "Privacy fence",
  },
  {
    quote:
      "They left the site cleaner than when they arrived. The paint lines are hand-cut. It’s the small things that told me they cared.",
    firstName: "Priya",
    city: "Calgary SW",
    service: "Exterior repaint",
  },
  {
    quote:
      "No upsells, no pressure. Honest about what we needed and what we didn’t. Pergola’s held through two Alberta winters now.",
    firstName: "Andrew",
    city: "Okotoks",
    service: "Cedar pergola",
  },
  {
    quote:
      "We’ve hired a lot of contractors. Creek is the only one we’ve called back twice. That’s the highest compliment I can give.",
    firstName: "Sarah",
    city: "Edmonton",
    service: "Soffit & fascia",
  },
];

export const TESTIMONIALS_TOP3 = TESTIMONIALS.slice(0, 3);
