import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "2-Year Certificate",
    tagline: "Standard validity",
    ndml: "₹10,000+GST",
    options: [
      { label: "Net Worth Certificate Arranged by Platizio", processing: "₹7,000+GST", total: "₹17,000+GST" },
      { label: "Net Worth Certificate arranged by self", processing: "₹2,000+GST", total: "₹12,000+GST" },
    ],
    itrNote: "Latest year ITR required",
  },
  {
    name: "3-Year Certificate",
    tagline: "Extended validity",
    ndml: "₹14,500+GST",
    options: [
      { label: "Net Worth Certificate Arranged by Platizio", processing: "₹9,000+GST", total: "₹23,500+GST" },
      { label: "Net Worth Certificate arranged by self", processing: "₹2,000+GST", total: "₹16,500+GST" },
    ],
    itrNote: "Latest + previous year ITR required",
    featured: true,
  },
];

export function Fees() {
  return (
    <section id="fees" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            Transparent pricing
          </span>
          <h2 className="mt-3 text-3xl font-display font-bold tracking-tight sm:text-4xl">
            Simple fees, no{" "}
            <span className="font-display italic text-brand">surprises</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Two parts: a Processing fee and the NDML certificate fee. The Processing
            fee depends on whether Platizio arranges your Net Worth Certificate —
            ₹3,000 if you already hold one, ₹8,000 if we issue it through our
            affiliated CA.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
          {PLANS.map((p) => (
            <StaggerItem key={p.name} className="h-full">
              <div
                className={`relative h-full rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10 ${p.featured ? "border-brand/40 ring-1 ring-brand/20" : "border-border"
                  }`}
              >
                {p.featured && (
                  <Badge className="absolute -top-2.5 right-6 bg-brand text-white">
                    Longest validity
                  </Badge>
                )}
                <div className="text-xs font-bold tracking-widest text-brand uppercase">
                  {p.tagline}
                </div>
                <h3 className="mt-1 text-2xl font-bold">{p.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  NDML Fees{" "}
                  <span className="font-semibold text-foreground/70">{p.ndml}</span>
                </div>

                <div className="mt-6 space-y-3">
                  {p.options.map((o) => (
                    <div
                      key={o.label}
                      className="rounded-xl border border-border bg-cream/40 p-4"
                    >
                      <div className="text-xs font-semibold text-brand-deep">{o.label}</div>
                      <div className="mt-3 space-y-1.5 text-sm">
                        <div className="flex items-baseline justify-between text-muted-foreground">
                          <span>Processing Fees</span>
                          <span className="font-medium text-foreground/80">{o.processing}</span>
                        </div>
                        <div className="flex items-baseline justify-between text-muted-foreground">
                          <span>NDML Fees</span>
                          <span className="font-medium text-foreground/80">{p.ndml}</span>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-dashed border-border pt-2">
                          <span className="text-sm font-semibold">Total</span>
                          <span className="text-xl font-bold text-brand-deep">{o.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted-foreground">{p.itrNote}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-deep">
            <Link href="/apply">
              Apply now <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
