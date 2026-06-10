import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ApplicationForm } from "@/components/apply/application-form";

export const metadata: Metadata = {
  title: "Apply — Platizio Accredited Investor Application",
  description:
    "Complete your SEBI Accredited Investor application — pick your eligibility path, upload documents and Platizio handles certification and CDSL submission.",
};

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Accredited Investor{" "}
              <span className="font-display italic text-brand">Application</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Two quick steps: your details first, then your eligibility path
              and documents. Have your PAN and latest ITR handy.
            </p>
          </div>
          <ApplicationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
