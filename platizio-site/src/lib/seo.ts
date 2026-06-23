import type { Metadata } from "next";
import { SITE } from "./site";

export function buildMetadata({
  title,
  titleAbsolute,
  description,
  path = "/",
  noindex = false,
}: {
  title?: string;
  /** Title that ignores the layout's "%s · Platizio" template (e.g. the home page). */
  titleAbsolute?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = SITE.url + path;
  const desc = description ?? SITE.description;
  const ogTwTitle = titleAbsolute ?? title ?? SITE.title;
  return {
    // pages pass a plain string (layout supplies the template); titleAbsolute opts out of it
    title: titleAbsolute ? { absolute: titleAbsolute } : title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: ogTwTitle,
      description: desc,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTwTitle,
      description: desc,
    },
    // noindex, follow: keep the page out of the index but let crawlers follow
    // its internal links so equity isn't trapped.
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * Shared BreadcrumbList JSON-LD builder. Pass the trail from root to current
 * page; each item's `path` is resolved against the site URL.
 */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE.url + it.path,
    })),
  };
}
