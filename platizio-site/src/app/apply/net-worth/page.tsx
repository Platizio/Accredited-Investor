import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NetWorthForm } from "@/components/apply/net-worth-form";

export const metadata: Metadata = {
  title: "Net-Worth Certificate Application — Platizio",
  description:
    "Apply for a Net Worth Certificate issued by Platizio's affiliated Chartered Accountants — your first step toward SEBI Accredited Investor status.",
};

export default function NetWorthPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
