import type { MetadataRoute } from "next";
import { seoContent } from "@/content/contentBible";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide", "/v1"],
    },
    sitemap: `${seoContent.url}/sitemap.xml`,
    host: seoContent.url,
  };
}
