import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Public, indexable routes only. The /apply/net-worth and /apply/accreditation
// form routes post PII and are intentionally excluded (see robots.ts).
const ROUTES = ["/", "/apply", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((path) => ({
    url: SITE.url + path,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
