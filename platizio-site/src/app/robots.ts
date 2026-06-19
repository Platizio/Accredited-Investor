import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // These routes post PII (net worth + accreditation form submissions).
      disallow: ["/apply/net-worth", "/apply/accreditation"],
    },
    sitemap: SITE.url + "/sitemap.xml",
    host: SITE.url,
  };
}
