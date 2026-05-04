/**
 * The Creek Process — single source of truth for the 5-step workflow.
 * Used by the homepage About section and the /about page so the steps
 * can never drift apart.
 */
export interface ProcessStep {
  title: string;
  desc: string;
}

export const CREEK_PROCESS: ProcessStep[] = [
  {
    title: "Request",
    desc: "Tell us what you’re building. Online form, a call, or a text — whatever’s easiest.",
  },
  {
    title: "Site Visit & Quote",
    desc: "We come look in person. Honest scope, fair price, in writing — usually within 48 hours.",
  },
  {
    title: "Schedule",
    desc: "We lock in a start date and a realistic finish date. No vague windows.",
  },
  {
    title: "Build",
    desc: "Our crew, on-site. We protect your property, clean up daily, and stay in touch.",
  },
  {
    title: "Walkthrough & Warranty",
    desc: "We walk it together at the end. If something isn’t right, we make it right.",
  },
];
