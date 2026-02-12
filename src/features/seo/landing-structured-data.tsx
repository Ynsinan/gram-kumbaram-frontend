import { JsonLd } from "@/shared/ui/json-ld";
import { env } from "@/shared/config/env";
import { SEO } from "@/shared/constants/seo";

export const LandingStructuredData = () => {
  const siteUrl = env.FRONTEND_URL;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO.SITE_NAME,
    alternateName: "Gram Kumbaram - Fiziksel Altın Takip",
    url: siteUrl,
    description: SEO.DEFAULT_DESCRIPTION,
    inLanguage: SEO.LANGUAGE,
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO.SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon-512x512.png`,
    description:
      "Fiziksel altın yatırım takip platformu.",
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SEO.SITE_NAME,
    url: siteUrl,
    description: SEO.DEFAULT_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    featureList: [
      "Canlı altın fiyat takibi",
      "Altın değer hesaplayıcı",
      "Portföy yönetimi",
      "Kar/zarar hesaplama",
      "İşlem geçmişi",
    ],
    inLanguage: SEO.LANGUAGE,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: siteUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={webApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
};
