import { CONTACT } from "@/config/contact";
import { SERVICES } from "@/config/services";
import type { FaqItem } from "@/components/ui/faq-accordion";

interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

const absoluteUrl = (path = "") => `${CONTACT.siteUrl}${path}`;

const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");
const localBusinessId = absoluteUrl("/#localbusiness");

const serviceNames = SERVICES.map((service) => service.title);

export const LocalBusinessJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      "@id": localBusinessId,
      name: CONTACT.businessName,
      description: CONTACT.description,
      url: CONTACT.siteUrl,
      logo: `${CONTACT.siteUrl}/creek-logo-square.png`,
      image: `${CONTACT.siteUrl}/creek-logo-square.png`,
      telephone: `+1${CONTACT.phoneTel}`,
      email: CONTACT.email,
      areaServed: [
        { "@type": "AdministrativeArea", name: "Alberta" },
        { "@type": "AdministrativeArea", name: "British Columbia" },
        ...CONTACT.cities.map((name) => ({ "@type": "City", name })),
      ],
      sameAs: [CONTACT.instagramUrl],
      address: {
        "@type": "PostalAddress",
        addressRegion: "AB",
        addressCountry: "CA",
      },
      priceRange: "$$",
      serviceType: serviceNames,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+1${CONTACT.phoneTel}`,
        email: CONTACT.email,
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: "en",
      },
      makesOffer: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          areaServed: CONTACT.cities.map((name) => ({ "@type": "City", name })),
          provider: { "@id": localBusinessId },
        },
      })),
    }}
  />
);

export const OrganizationJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: CONTACT.businessName,
      url: CONTACT.siteUrl,
      logo: `${CONTACT.siteUrl}/creek-logo-square.png`,
      email: CONTACT.email,
      telephone: `+1${CONTACT.phoneTel}`,
      sameAs: [CONTACT.instagramUrl],
    }}
  />
);

export const WebSiteJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: CONTACT.businessName,
      url: CONTACT.siteUrl,
      publisher: { "@id": organizationId },
      inLanguage: "en-CA",
    }}
  />
);

export const ServiceCatalogJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Creek Construction services",
      description: "Residential exterior construction services offered by Creek Construction.",
      itemListElement: SERVICES.map((service, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          provider: { "@id": localBusinessId },
          areaServed: CONTACT.cities.map((name) => ({ "@type": "City", name })),
        },
      })),
    }}
  />
);

export const FaqJsonLd = ({ items }: { items: FaqItem[] }) => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }}
  />
);

export const ContactPageJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Creek Construction",
      url: absoluteUrl("/contact"),
      about: { "@id": localBusinessId },
      mainEntity: {
        "@type": "GeneralContractor",
        "@id": localBusinessId,
        name: CONTACT.businessName,
        telephone: `+1${CONTACT.phoneTel}`,
        email: CONTACT.email,
      },
    }}
  />
);

export const BreadcrumbJsonLd = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }}
  />
);

export default JsonLd;
