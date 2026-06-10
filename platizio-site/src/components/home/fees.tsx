import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "2-Year Certificate",
    tagline: "Standard validity",
    caFee: "₹9,000",
    cdslFee: "₹10,000",
    itrNote: "Latest year ITR required",
  },
  {
    name: "3-Year Certificate",
    tagline: "Extended validity",
    caFee: "₹13,500",
    cdslFee: "₹14,500",
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple fees, no{" "}
            <span className="font-display italic text-brand">surprises</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Two components: the CA certification fee payable now, and the CDSL
            certificate fee payable later at registration. GST applies to both.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
          {PLANS.map((p) => (
            <StaggerItem key={p.name} className="h-full">
              <div
                className={`relative h-full rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10 ${
                  p.featured ? "border-brand/40 ring-1 ring-brand/20" : "border-border"
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

                <div className="mt-6 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-dashed border-border pb-4">
                    <div>
                      <div className="text-sm font-medium">CA certification fee</div>
                      <div className="text-xs text-muted-foreground">payable now</div>
                    </div>
                    <div className="text-xl font-bold text-brand-deep">
                      {p.caFee}
                      <span className="ml-1 text-xs font-medium text-muted-foreground">+ GST</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-sm font-medium">CDSL certificate fee</div>
                      <div className="text-xs text-muted-foreground">payable later</div>
                    </div>
                    <div className="text-xl font-bold text-brand-deep">
                      {p.cdslFee}
                      <span className="ml-1 text-xs font-medium text-muted-foreground">+ GST</span>
                    </div>
                  </div>
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
