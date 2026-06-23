import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, FileCheck2, FileSignature } from "lucide-react";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata = buildMetadata({
  title: "Apply for SEBI Accredited Investor Status",
  description:
    "Choose your application: get a Net Worth Certificate issued by our affiliated CA, or apply directly for SEBI Accreditation if you already hold one.",
  path: "/apply",
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Apply", path: "/apply" },
]);

const CHOICES = [
  {
    href: "/apply/net-worth",
    icon: FileCheck2,
    eyebrow: "Step 1 · If you don't have a certificate",
    title: "Apply for Net-Worth Certificate",
    desc: "Our affiliated Chartered Accountants prepare and issue your Net Worth Certificate. Upload your financial documents and we handle the certification.",
    points: ["Issued by our affiliated CA", "2-year or 3-year validity", "All-inclusive ₹17,000–₹23,500+GST"],
    cta: "Start Net-Worth application",
  },
  {
    href: "/apply/accreditation",
    icon: FileSignature,
    eyebrow: "Step 2 · If you already hold a certificate",
    title: "Apply for Accreditation",
    desc: "Already have a Net Worth Certificate? Apply directly for SEBI Accredited Investor status. We verify and submit your application to NDML.",
    points: ["Upload your Net Worth Certificate", "Submitted to NDML", "From ₹12,000+GST all-inclusive"],
    cta: "Start Accreditation application",
  },
];

export default function ApplyChooser() {
  return (
    <>
      <Navbar />
      <JsonLd data={breadcrumb} />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Start your SEBI{" "}
              <span className="font-display italic text-brand">Accreditation</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              Two paths, one destination. Get your Net Worth Certificate issued first, or jump
              straight to accreditation if you already have one.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {CHOICES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <c.icon className="size-6" />
                </div>
                <div className="mt-5 text-xs font-bold uppercase tracking-widest text-brand">{c.eyebrow}</div>
                <h2 className="mt-1 text-xl font-bold">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm">
                      <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-deep">
                  {c.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Not sure which to pick? If you don&apos;t yet have a CA-issued Net Worth Certificate,
            start with the Net-Worth Certificate application.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
