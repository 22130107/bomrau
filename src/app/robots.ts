import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/npp/", "/api/"],
    },
    sitemap: "https://bomrautft.com/sitemap.xml",
  };
}
