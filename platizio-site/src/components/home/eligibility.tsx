import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const PATHS = [
  {
    letter: "A",
    title: "Net Worth",
    rules: [
      "Total net worth ≥ ₹7.5 Crore",
      "Of which financial assets ≥ ₹3.75 Crore",
    ],
    note: "Best if your wealth sits in investments, property and other assets.",
  },
  {
    letter: "B",
    title: "Hybrid",
    rules: [
      "Annual income ≥ ₹1 Crore",
      "Total net worth ≥ ₹5 Crore",
      "Of which financial assets ≥ ₹2.5 Crore",
    ],
    note: "A balanced route combining income and net worth thresholds.",
  },
  {
    letter: "C",
    title: "Income",
    rules: ["Annual income ≥ ₹2 Crore"],
    note: "The simplest route — qualify on your income tax returns alone.",
  },
];

export function Eligibility() {
  return (
    <section id="eligibility" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            Who can apply
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Three ways to{" "}
            <span className="font-display italic text-brand">qualify</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Meet any one of SEBI&apos;s criteria below — as an individual, or
            jointly with your spouse on combined figures.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {PATHS.map((p) => (
            <StaggerItem key={p.letter} className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
                <span className="pointer-events-none absolute -top-6 -right-2 font-display text-[120px] leading-none text-brand/8 select-none">
                  {p.letter}
                </span>
                <div className="text-xs font-bold tracking-widest text-brand">
                  PATH {p.letter}
                </div>
                <h3 className="mt-1 text-2xl font-bold">{p.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {p.rules.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  {p.note}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-deep">
            <Link href="/apply">
              Check your eligibility <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
