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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Eligibility />
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
