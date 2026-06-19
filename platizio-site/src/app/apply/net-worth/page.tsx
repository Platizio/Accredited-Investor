import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NetWorthForm } from "@/components/apply/net-worth-form";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = buildMetadata({
  title: "Net-Worth Certificate Application",
  description:
    "Apply for a Net Worth Certificate issued by Platizio's affiliated Chartered Accountants — your first step toward SEBI Accredited Investor status.",
  path: "/apply/net-worth",
  noindex: true,
});

const breadcrumbJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE.url + "/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Apply",
      item: SITE.url + "/apply",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Net-Worth Certificate Application",
      item: SITE.url + "/apply/net-worth",
    },
  ],
};

export default function NetWorthPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={breadcrumbJsonLd} />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Net-Worth Certificate{" "}
              <span className="font-display italic text-brand">Application</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Our affiliated CA prepares your Net Worth Certificate. Two quick steps: your
              details, then your certificate validity and supporting documents.
            </p>
          </div>
          <NetWorthForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
