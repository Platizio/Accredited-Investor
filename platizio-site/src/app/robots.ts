import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // The /apply/net-worth and /apply/accreditation form routes are intentionally
  // left crawlable (no Disallow): each sets `noindex` in its metadata, and a
  // page must be fetchable for Googlebot to read that tag and drop it from the
  // index. Disallowing them instead can leave the bare URLs "indexed, though
  // blocked by robots.txt". The form HTML exposes no PII (data is user-submitted,
  // never server-rendered). They're also excluded from sitemap.ts.
  // `host` is omitted — it's a legacy Yandex-only directive Google ignores;
  // canonicalization is handled by per-page `alternates.canonical`.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: SITE.url + "/sitemap.xml",
  };
}
