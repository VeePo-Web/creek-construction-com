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
      "@type": "LocalBusiness",
      name: "B&P Sauna",
      description:
        "Alberta-built cedar outdoor saunas — delivered and installed turnkey.",
      url: "https://bpsauna.ca",
      telephone: "",
      email: "hello@bpsauna.ca",
      areaServed: [
        { "@type": "City", name: "Edmonton" },
        { "@type": "City", name: "Calgary" },
        { "@type": "City", name: "Sherwood Park" },
        { "@type": "City", name: "Red Deer" },
        { "@type": "City", name: "Canmore" },
        { "@type": "City", name: "Cochrane" },
        { "@type": "City", name: "Bragg Creek" },
      ],
      address: {
        "@type": "PostalAddress",
        addressRegion: "AB",
        addressCountry: "CA",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "3",
      },
    }}
  />
);

export const ArticleJsonLd = ({
  title,
  excerpt,
  date,
  image,
  id,
}: {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  id: string;
}) => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: excerpt,
      datePublished: date,
      image,
      author: {
        "@type": "Organization",
        name: "B&P Sauna",
      },
      publisher: {
        "@type": "Organization",
        name: "B&P Sauna",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://bpsauna.ca/resources/${id}`,
      },
    }}
  />
);

export const ProductJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "Product",
      name: "B&P Signature 8×8 Cedar Sauna",
      description:
        "Premium outdoor cedar sauna engineered for Alberta winters. 8×8 footprint, western red cedar interior, traditional electric heater, turnkey installation.",
      brand: { "@type": "Brand", name: "B&P Sauna" },
      offers: {
        "@type": "Offer",
        priceCurrency: "CAD",
        price: "8000",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: "https://bpsauna.ca/signature",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "3",
      },
    }}
  />
);

export const FAQPageJsonLd = ({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }}
  />
);

export const ServiceJsonLd = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Custom Outdoor Sauna Construction",
      provider: {
        "@type": "LocalBusiness",
        name: "B&P Sauna",
      },
      areaServed: {
        "@type": "State",
        name: "Alberta",
      },
      description:
        "Bespoke outdoor cedar saunas tailored to your Alberta property. Premium materials, proven build standard, turnkey installation.",
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
