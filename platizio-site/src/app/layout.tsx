import type { Metadata, Viewport } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Coldiac is a paid commercial font; Cormorant is the closest free
// luxury-serif lookalike (elegant wide forms + a true italic for accent words).
const cormorant = Cormorant({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s · Platizio" },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "r38lcOLoUKZkYJ_4evGjeN09WQ7do5duawJtv01dPVk",
  },
};

// themeColor must live in the viewport export (deprecated in `metadata` since Next 14).
export const viewport: Viewport = {
  themeColor: "#7A2000",
};

// Site-wide structured data. Two graphs: the Organization and the WebSite.
const siteJsonLd: Record<string, unknown>[] = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SITE.url + "#organization",
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.url + "/platizio-logo.png",
      width: 500,
      height: 150,
    },
    description: SITE.description,
    areaServed: { "@type": "Country", name: "India" },
    slogan: "Become a SEBI Accredited Investor.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      // TODO(launch): placeholder support email — set the real address before launch.
      email: "support@platizio.com",
    },
    sameAs: [], // TODO(launch): add social/profile URLs.
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE.url + "#website",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@id": SITE.url + "#organization" },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteJsonLd} />
        {children}
      </body>
    </html>
  );
}
