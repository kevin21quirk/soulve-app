import { Helmet } from "react-helmet-async";

interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface CampaignSchema {
  name: string;
  description: string;
  url: string;
  image: string;
  startDate: string;
  endDate?: string;
  location?: string;
  organizer: {
    name: string;
    url: string;
  };
  offers?: {
    price: number;
    priceCurrency: string;
  };
}

interface StructuredDataProps {
  type: "Organization" | "Campaign" | "Person" | "Event";
  data: OrganizationSchema | CampaignSchema | any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateSchema = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: data.name,
          description: data.description,
          url: data.url,
          logo: data.logo,
          sameAs: data.sameAs || [],
        };

      case "Campaign":
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location
            ? {
                "@type": "Place",
                name: data.location,
              }
            : undefined,
          organizer: {
            "@type": "Organization",
            name: data.organizer.name,
            url: data.organizer.url,
          },
          offers: data.offers
            ? {
                "@type": "Offer",
                price: data.offers.price,
                priceCurrency: data.offers.priceCurrency,
                availability: "https://schema.org/InStock",
              }
            : undefined,
        };

      case "Person":
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          name: data.name,
          url: data.url,
          image: data.image,
          description: data.description,
          sameAs: data.sameAs || [],
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default StructuredData;
