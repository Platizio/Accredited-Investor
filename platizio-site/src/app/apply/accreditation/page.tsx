import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AccreditationForm } from "@/components/apply/accreditation-form";

export const metadata: Metadata = {
  title: "Accreditation Application — Platizio",
  description:
    "Already hold a Net Worth Certificate? Apply for SEBI Accredited Investor status — Platizio verifies your documents and submits to NDML.",
};

export default function AccreditationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Accreditation{" "}
              <span className="font-display italic text-brand">Application</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              For applicants who already hold a Net Worth Certificate. Two quick steps: your
              details, then your eligibility path and accreditation documents.
            </p>
          </div>
          <AccreditationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
