import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-espresso py-20 sm:py-28">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white sm:text-5xl">
            Ready to join India&apos;s{" "}
            <span className="font-display italic text-brand-light">
              accredited
            </span>{" "}
            circle?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            The application takes minutes. Pick your eligibility path, upload
            your documents, and Platizio handles certification and submission
            to NDML.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-13 bg-brand px-8 text-base shadow-lg shadow-brand/40 hover:bg-brand-light"
          >
            <Link href="/apply">
              Start Your Application <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
