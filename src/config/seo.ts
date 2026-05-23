import { CONTACT } from "@/config/contact";

export interface SeoRoute {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

export const SITE_SEO = {
  name: CONTACT.businessName,
  baseUrl: CONTACT.siteUrl,
  defaultTitle: `${CONTACT.businessName} — ${CONTACT.tagline.replace(/\.$/, "")}`,
  defaultDescription: CONTACT.description,
  ogImage: `${CONTACT.siteUrl}/og-image.jpg`,
} as const;

export const SEO_ROUTES = {
  home: {
    title: "Excellence in the Work",
    description:
      "Creek Construction — WCB-covered, fully insured exterior contractor serving Edmonton, Calgary & the Okanagan, BC. Decks, fencing, sheds, painting & siding. Free written quotes.",
    path: "/",
  },
  services: {
    title: "Services",
    description:
      "Decks, roofing, siding, painting, fences, landscaping and more — full residential exterior construction across Alberta.",
    path: "/services",
  },
  work: {
    title: "Gallery",
    description:
      "A look at recent residential exterior work across Calgary, Edmonton, and surrounding Alberta.",
    path: "/work",
  },
  about: {
    title: "About",
    description:
      "Creek Construction — locally owned residential exterior contractor serving Edmonton, Calgary & the Okanagan, BC.",
    path: "/about",
  },
  contact: {
    title: "Contact",
    description: `Get in touch with Creek Construction — call ${CONTACT.phone} or email ${CONTACT.email}. Free quotes across Edmonton, Calgary, and the Okanagan, BC.`,
    path: "/contact",
  },
  notFound: {
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist. Find your way back to Creek Construction.",
    path: "/404",
    noindex: true,
  },
} satisfies Record<string, SeoRoute>;

export function absoluteUrl(path: string) {
  return `${SITE_SEO.baseUrl}${path === "/" ? "/" : path}`;
}
