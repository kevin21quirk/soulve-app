import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEOHead = ({
  title = "SouLVE - Social Impact Platform",
  description = "Connect, contribute, and create lasting social impact. Join SouLVE to track your ESG contributions, support campaigns, and make a difference.",
  keywords = ["social impact", "ESG", "charity", "campaigns", "volunteering", "donations"],
  image = "https://join-soulve.com/soulve-og-image.png",
  url = "https://join-soulve.com",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) => {
  const fullTitle = title.includes("SouLVE") ? title : `${title} | SouLVE`;
  const canonicalUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SouLVE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="SouLVE" />
    </Helmet>
  );
};

export default SEOHead;
