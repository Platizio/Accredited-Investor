import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "2-Year Certificate",
    tagline: "Standard validity",
    certFee: "₹5,000",
    ndml: "₹10,000+GST",
    itrNote: "Latest year ITR required",
  },
  {
    name: "3-Year Certificate",
    tagline: "Extended validity",
    certFee: "₹7,000",
    ndml: "₹14,500+GST",
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
            A flat Net Worth Certificate fee (no GST) when Platizio arranges it through
            our affiliated CA, plus the SEBI accreditation fee of ₹2,000 + GST. The NDML
            registration fee is paid separately, later, at registration. Already hold a
            Net Worth Certificate? You skip the certificate fee.
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
                <div className="mt-6 space-y-3 text-sm">
                  <div className="rounded-xl border border-border bg-cream/40 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-brand-deep">Net Worth Certificate</span>
                      <span className="text-xl font-bold text-brand-deep">{p.certFee}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Arranged by our affiliated CA · flat fee, no GST
                    </div>
                  </div>

                  <div className="space-y-1.5 px-1 text-muted-foreground">
                    <div className="flex items-baseline justify-between">
                      <span>SEBI Accreditation</span>
                      <span className="font-medium text-foreground/80">₹2,000+GST</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span>
                        NDML registration <span className="text-[11px]">(payable later)</span>
                      </span>
                      <span className="font-medium text-foreground/80">{p.ndml}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-xs text-muted-foreground">
                  Already hold a Net Worth Certificate? You pay only the accreditation fee.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{p.itrNote}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-deep">
            <Link href="/apply">
              Apply for accreditation <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
