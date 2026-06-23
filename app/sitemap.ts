import type { MetadataRoute } from "next";
import { seoContent } from "@/content/contentBible";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: seoContent.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
