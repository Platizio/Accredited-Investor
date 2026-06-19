import type { Metadata } from "next";
import { SITE } from "./site";

export function buildMetadata({
  title,
  description,
  path = "/",
  noindex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = SITE.url + path;
  const desc = description ?? SITE.description;
  return {
    title, // pages pass a plain string; layout supplies the template
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: title ?? SITE.title,
      description: desc,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE.title,
      description: desc,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
