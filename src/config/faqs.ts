import type { FaqItem } from "@/components/ui/faq-accordion";

/**
 * FAQS — single source of truth. Used by /services, /contact, and the
 * homepage MiniFaq. Keep tight: four questions, no more.
 */
export const FAQS_CORE: FaqItem[] = [
  {
    q: "How much does a project usually cost?",
    a: "It depends on scope and materials, but every quote we send is an itemised, written number — no vague ranges. Most decks land between $8K and $25K. Most fences between $4K and $14K. Painting and siding scale with square footage.",
  },
  {
    q: "How long does a typical project take?",
    a: "Decks and fences usually run 3–7 build days once we’re on-site. Painting, siding, and roofing scale with square footage. We give you a real timeline in writing with your quote — not a vague window.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes. We warranty our workmanship — if something we built fails because of how we built it, we come back and fix it. Manufacturer warranties on materials are passed through to you.",
  },
  {
    q: "Where do you work?",
    a: "Calgary, Edmonton, and the towns in between — Airdrie, Okotoks, Cochrane, Sherwood Park, St. Albert and more. If you’re close to either metro, ask.",
  },
];

export const FAQS_SERVICES: FaqItem[] = [
  ...FAQS_CORE.slice(0, 3),
  {
    q: "What about permits?",
    a: "If your municipality requires a permit for the work, we handle pulling it and include it in the quote. We’ll tell you upfront whether one is needed.",
  },
];
