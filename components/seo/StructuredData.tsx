import { brand, extras, seoContent, services } from "@/content/contentBible";

/**
 * Server-rendered JSON-LD (Blueprint §7.3): Organization + WebSite +
 * one Service per Smart-Grid entry (descriptions verbatim). Emitted in
 * the initial HTML so crawlers get structured data with zero JS.
 */
export function StructuredData() {
  const orgId = `${seoContent.url}/#organization`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: brand.name,
      url: seoContent.url,
      slogan: brand.tagline,
      description: seoContent.description,
      email: extras.contact.email,
      sameAs: extras.social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${seoContent.url}/#website`,
      url: seoContent.url,
      name: seoContent.title,
      description: seoContent.description,
      inLanguage: "en",
      publisher: { "@id": orgId },
    },
    ...services.items.map((service) => ({
      "@type": "Service",
      name: service.name,
      description: service.blurb,
      provider: { "@id": orgId },
    })),
  ];

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
