import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { Eligibility } from "@/components/home/eligibility";
import { Process } from "@/components/home/process";
import { Documents } from "@/components/home/documents";
import { Fees } from "@/components/home/fees";
import { Faq } from "@/components/home/faq";
import { Cta } from "@/components/home/cta";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { FAQS } from "@/components/home/faq-data";

export const metadata = buildMetadata({ path: "/" });

const homeJsonLd: Record<string, unknown>[] = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SEBI Accredited Investor Accreditation",
    serviceType: "Investor accreditation facilitation",
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: "IN",
    description: SITE.description,
    audience: {
      "@type": "Audience",
      audienceType: "High-net-worth investors in India",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a + (f.bullets ? " " + f.bullets.join(" ") : ""),
      },
    })),
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <JsonLd data={homeJsonLd} />
      <main className="flex-1">
        <Hero />
        <Eligibility />
        <Benefits />
        <Process />
        <Documents />
        <Fees />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
