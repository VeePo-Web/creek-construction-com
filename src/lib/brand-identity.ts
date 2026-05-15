/**
 * Creek Construction — Brand Identity
 *
 * The editorial brain. Not a style file — a strategy file.
 * Codifies the brand spine, voice, value proposition, and the
 * non-negotiables / dealbreakers that govern every design and copy
 * decision.
 *
 * This file is imported into /style-guide for stakeholder review,
 * and read by every contributor before they ship anything.
 *
 * Cross-references:
 * - Visual tokens:    src/lib/colors.ts
 * - Typography rules: src/lib/typography.ts
 * - Spacing system:   src/lib/spacing.ts
 * - Motion contracts: src/lib/motion.ts
 * - Photography:      MEDIA_PLAYBOOK.md
 * - Live preview:     /style-guide → "Brand"
 */

// ─────────────────────────────────────────────────────────────────────
// BRAND SPINE — the one-pager
// ─────────────────────────────────────────────────────────────────────

export const BRAND_SPINE = {
  name: "Creek Construction",
  tagline: "Excellence in the Work.",
  category: "Residential exterior construction",
  region: "Alberta & Okanagan, BC",

  purpose:
    "Build the parts of people's homes you live with the longest \u2014 decks, fences, sheds, exteriors \u2014 with the kind of care that makes them last decades, not seasons.",

  promise:
    "An honest scope. A fair quote in writing. Work done right the first time, by the same crew, on the schedule we said.",

  /** Three adjectives that filter every decision. */
  personality: ["honest", "patient", "exacting"] as const,

  /** Who we're for. */
  audience:
    "Homeowners who value durability and craft over the cheapest bid \u2014 and who'd rather hire someone they trust than manage a contractor they don't.",

  /** What we're not. */
  notFor: [
    "Race-to-the-bottom price shoppers.",
    "Investors flipping properties on 90-day timelines.",
    "Anyone who wants the cheapest pressure-treated quote in town.",
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────
// VOICE & TONE
// ─────────────────────────────────────────────────────────────────────

export const VOICE = {
  /** How we sound on the page. */
  attributes: [
    "Plain-spoken. No jargon.",
    "Confident, not aggressive.",
    "Specific, not vague (\u201Ccedar\u201D not \u201Cpremium wood\u201D).",
    "Honest about tradeoffs (cost vs. lifespan).",
    "Warm but never folksy.",
  ] as const,

  /** Tone shifts by context. */
  tones: {
    hero: "Confident statement of craft. Short sentences.",
    services: "Specific & honest. Materials, methods, what you get.",
    testimonials: "Quoted directly. We don't paraphrase.",
    contact: "Direct & inviting. \u201CFree quote. No high-pressure sales.\u201D",
    legal: "Plain English. No corporate hedging.",
  },

  /** Phrases we say. */
  do: [
    "Quoted in writing.",
    "Built to outlast Alberta winters.",
    "Same crew, start to finish.",
    "Fixed once, properly.",
    "We'll come look. We'll give you a fair price.",
  ] as const,

  /** Phrases we never say. */
  dont: [
    "We're passionate about... (everyone says this)",
    "Best in class / industry-leading / world-class (about ourselves)",
    "Synergy / leverage / value-add / solutions",
    "!!! / multiple exclamation points / SHOUTING",
    "Limited time only! (we don't fake-scarcity)",
    "Affordable (vague \u2014 say what it actually costs to scope)",
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────
// VALUE PROPOSITION STACK
// ─────────────────────────────────────────────────────────────────────

export const VALUE_PROP = {
  /** The headline value. */
  primary:
    "Honest exterior construction that lasts the seasons \u2014 done right by the people who quoted it.",

  /** Three supporting pillars. */
  pillars: [
    {
      title: "Quoted in writing.",
      proof:
        "Every project starts with an on-site visit and a written scope and price. No deposit required to receive your quote.",
    },
    {
      title: "Built by the crew that quoted it.",
      proof:
        "Same hands from estimate to final walk-through. No subcontractor handoffs.",
    },
    {
      title: "Fully insured & WCB-covered.",
      proof:
        "Workers' Compensation Board covered, $5M general liability. We can show you the certificates before we lift a hammer.",
    },
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────
// VERBAL IDENTITY — the small, sweat-the-details rules
// ─────────────────────────────────────────────────────────────────────

export const VERBAL_IDENTITY = {
  /** Brand name capitalization. */
  capitalization: {
    correct: "Creek Construction",
    wrong: ["CREEK CONSTRUCTION", "creek construction", "Creek Co.", "CC"],
    note: "Always title case. Never abbreviate.",
  },

  /** Service capitalization. */
  services: {
    correct: ["Decks", "Fencing", "Sheds", "Exterior Painting", "Siding & Exterior Repair", "Pergolas & Gazebos"],
    note: "Title case in headlines and lists. lowercase in body sentences (\u201Cwe build decks\u201D).",
  },

  /** Punctuation. */
  punctuation: [
    "Use curly quotes \u201C\u201D \u2018\u2019, never straight \" '.",
    "Use em-dash \u2014 with no surrounding spaces. Reserve en-dash \u2013 for ranges (1\u20133 months).",
    "Use proper ellipsis \u2026, not three periods.",
    "Oxford comma always.",
    "Sentence case in headlines, not Title Case.",
  ] as const,

  /** Phone & address format. */
  phone: "(780) 777-5178",
  email: "Creekproconstruction@gmail.com",
  serviceArea: "Alberta & Okanagan, BC",
} as const;

// ─────────────────────────────────────────────────────────────────────
// VISUAL IDENTITY DIRECTION
// ─────────────────────────────────────────────────────────────────────

export const VISUAL_DIRECTION = {
  philosophy:
    "Warm minimalism. The site should feel like a well-built shelter \u2014 cream walls, dark structural timbers, bronze hardware. Quiet, precise, and built to last.",

  principles: [
    {
      name: "Restraint",
      description: "Two fonts, five colors, four shadow weights. Every decision earns its place.",
    },
    {
      name: "Warmth",
      description: "Never pure white, never pure black. Every neutral carries warm undertones.",
    },
    {
      name: "Editorial rhythm",
      description: "Generous whitespace. Section padding 96\u2013128px. Content breathes.",
    },
    {
      name: "Photography first",
      description: "Real project photography \u2014 not stock. Bronze + evergreen sit quietly so the work is the hero.",
    },
    {
      name: "Asymmetry over symmetry",
      description: "Editorial 60/40 splits and offset grids. Centered-everything reads as a template.",
    },
  ] as const,

  colorUsage: {
    evergreen:
      "Footer, dark hero overlays, primary text on light. Carries authority and craft.",
    bronze:
      "CTAs, dividers, hover states, active elements. Reserved for moments that earn attention.",
    cream:
      "Page canvas. The default. Sets the warm tone everything else rests on.",
    stone:
      "Alternating section backgrounds. Provides quiet rhythm without hard color breaks.",
  },

  photographyRules: [
    "Real project photography only. No stock people, no posed handshakes.",
    "Wide & hero shots prefer overcast light \u2014 harsh blue Alberta skies clip and feel cheap.",
    "Crop tight to the work; avoid empty foregrounds.",
    "No filters, no Instagram presets. Editorial color, not influencer color.",
    "Every approved image carries provenance metadata (location, year, crew lead).",
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────
// NON-NEGOTIABLES — guardrails that hold the brand together
// ─────────────────────────────────────────────────────────────────────

export const NON_NEGOTIABLES = [
  {
    rule: "Never use pure black (#000) or pure white (#fff).",
    why: "Both feel digital and harsh. The brand is warm \u2014 every neutral has a hue.",
  },
  {
    rule: "Never use a sans-serif font for a headline.",
    why: "DM Serif Display is the brand's signature voice. Headlines without it are off-brand.",
  },
  {
    rule: "Never use bronze and evergreen at >40% opacity in the same surface area.",
    why: "They fight. One must lead and the other support. Usually evergreen leads, bronze accents.",
  },
  {
    rule: "Every interactive element must hit 44\u00d744px on mobile.",
    why: "WCAG 2.5.8. Non-negotiable accessibility.",
  },
  {
    rule: "Every image must have meaningful alt text.",
    why: "Screen readers and SEO. EditorialPicture warns in dev when alt is missing.",
  },
  {
    rule: "Every animation must respect prefers-reduced-motion.",
    why: "Vestibular accessibility. ScrollRevealMotion handles this; verify before merging custom motion.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────
// DEALBREAKERS — patterns that invalidate the brand
// ─────────────────────────────────────────────────────────────────────

export const DEALBREAKERS = [
  {
    pattern: "Stock photography of smiling families / handshakes / hard hats.",
    why: "Generic and dishonest. We have real project photography; use it. If the slot is empty, leave a tasteful gradient fallback.",
  },
  {
    pattern: "Emojis in body copy or navigation.",
    why: "The brand voice is plain-spoken and confident. Emojis read as casual / cheap.",
  },
  {
    pattern: "Gradient buttons or drop-shadowed text.",
    why: "Reads as 2014 SaaS template. Buttons are flat solid colors; text shadows are reserved for image overlays.",
  },
  {
    pattern: "Multiple exclamation points or all-caps shouting.",
    why: "We're confident, not aggressive.",
  },
  {
    pattern: "Auto-playing audio or video with sound.",
    why: "Hostile UX. Background video is allowed, muted only.",
  },
  {
    pattern: "Modal popups offering 10% off / newsletter signups on first scroll.",
    why: "Dark pattern. We don't run a discount business.",
  },
  {
    pattern: "Carousels for primary content (services, testimonials).",
    why: "Carousels hide content. Show the work directly in a grid.",
  },
  {
    pattern: "Fake scarcity (\u201COnly 3 spots left this season!\u201D).",
    why: "We're not a discount-airline brand. Trust over urgency.",
  },
  {
    pattern: "More than 3 fonts on a page.",
    why: "DM Serif Display + DM Sans is the system. No exceptions.",
  },
  {
    pattern: "Light-mode + dark-mode toggle.",
    why: "Light only. The warm cream canvas is the brand identity \u2014 a dark mode would dilute it.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────
// PERFORMANCE BUDGETS — measured on the homepage, mobile, simulated 4G
// ─────────────────────────────────────────────────────────────────────

export const PERFORMANCE_BUDGETS = {
  /** Largest Contentful Paint. */
  lcp: { target: "< 2.0s", critical: "< 2.5s" },
  /** Cumulative Layout Shift. */
  cls: { target: "< 0.05", critical: "< 0.1" },
  /** Interaction to Next Paint. */
  inp: { target: "< 200ms", critical: "< 500ms" },
  /** Total JS shipped (gzipped). */
  jsBudget: { target: "< 180 KB", critical: "< 250 KB" },
  /** Critical CSS (gzipped, above the fold). */
  cssBudget: { target: "< 14 KB", critical: "< 30 KB" },
  /** Lighthouse Performance score. */
  lighthouse: { target: "> 95", critical: "> 90" },
} as const;

// ─────────────────────────────────────────────────────────────────────
// ACCESSIBILITY MINIMUMS
// ─────────────────────────────────────────────────────────────────────

export const ACCESSIBILITY = {
  wcag: "WCAG 2.1 AA (target AAA where contrast allows)",
  touchTarget: "44\u00d744px minimum for any interactive element (WCAG 2.5.8)",
  contrast: "4.5:1 for body text, 3:1 for large text and UI components",
  focus:
    "Every focusable element shows a visible 2px bronze ring with 2px offset",
  motion: "All non-essential animation is disabled at prefers-reduced-motion: reduce",
  semantics:
    "Use real <header>, <main>, <section>, <article>, <nav>, <footer>. No <div>-soup.",
  altText:
    "Every image carries meaningful alt text. Decorative images use alt=\"\" + role=\"presentation\".",
} as const;

// ─────────────────────────────────────────────────────────────────────
// GOVERNANCE — how this system evolves
// ─────────────────────────────────────────────────────────────────────

export const GOVERNANCE = {
  ownership:
    "The design system lives in code (src/lib/*.ts). Memory entries describe principles; code is the source of truth.",
  beforeAddingAToken: [
    "Does an existing token solve this? (Check colors, spacing, motion.)",
    "Will this token be used 3+ times? If not, it's a one-off, not a token.",
    "Have you documented the usage rule and the WHY?",
    "Does it need a /style-guide entry? (Almost always yes.)",
  ] as const,
  deprecation:
    "When a token is replaced, leave it in place for one release with a deprecation comment, then delete. Never silently re-map.",
  contributorChecklist: [
    "Did you import from src/lib/* instead of hand-rolling classes?",
    "Did you add the new token's usage to /style-guide?",
    "Did you check the contrast on any new color combination?",
    "Did you wrap motion in motion-reduce: classes?",
    "Did you hit 44\u00d744 touch targets?",
  ] as const,
} as const;
