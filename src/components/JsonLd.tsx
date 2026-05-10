import { CONTACT } from "@/config/contact";

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

export default JsonLd;
