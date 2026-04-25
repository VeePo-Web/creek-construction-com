import { CONTACT } from "@/config/contact";
import { PROJECTS } from "@/data/projects";

interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const LocalBusinessJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      name: CONTACT.businessName,
      description: CONTACT.description,
      url: CONTACT.siteUrl,
      logo: `${CONTACT.siteUrl}/creek-logo-square.png`,
      image: `${CONTACT.siteUrl}/creek-logo-square.png`,
      telephone: `+1${CONTACT.phoneTel}`,
      email: CONTACT.email,
      areaServed: CONTACT.cities.map((name) => ({ "@type": "City", name })),
      address: {
        "@type": "PostalAddress",
        addressRegion: "AB",
        addressCountry: "CA",
      },
      priceRange: "$$",
      serviceType: [
        "Deck construction",
        "Fencing",
        "Sheds",
        "Exterior painting",
        "Siding & exterior repair",
        "Pergolas & gazebos",
      ],
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

/**
 * Schema.org ItemList of CreativeWork nodes — one per real photographed project.
 * Drives Google image-pack indexing for the /work page. Photos must be referenced
 * by absolute URL so crawlers can resolve them.
 */
export const ProjectsJsonLd = () => {
  if (PROJECTS.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Creek Construction — Featured Projects",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.summary,
            dateCreated: String(p.year),
            locationCreated: { "@type": "Place", name: `${p.location}, AB, Canada` },
            creator: { "@type": "Organization", name: CONTACT.businessName, url: CONTACT.siteUrl },
            image: p.photos.map((photo) => `${CONTACT.siteUrl}${photo.src}`),
          },
        })),
      }}
    />
  );
};

export default JsonLd;
