import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  CircleDollarSign,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

function AngelWings({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Halo */}
      <ellipse cx="12" cy="4" rx="3.4" ry="1.4" />
      {/* Left wing */}
      <path d="M12 9.2c-1.1-1.2-2.7-1.9-4.3-1.6.9.5 1.5 1.3 1.8 2.2-1.3-.8-2.9-1-4.4-.4 1.1.6 1.9 1.5 2.2 2.6-1.4-.6-3-.5-4.3.4 1.5.4 2.6 1.4 3.3 2.7.8 1.4 2.4 2.2 4 2" />
      {/* Right wing */}
      <path d="M12 9.2c1.1-1.2 2.7-1.9 4.3-1.6-.9.5-1.5 1.3-1.8 2.2 1.3-.8 2.9-1 4.4-.4-1.1.6-1.9 1.5-2.2 2.6 1.4-.6 3-.5 4.3.4-1.5.4-2.6 1.4-3.3 2.7-.8 1.4-2.4 2.2-4 2" />
      {/* Body */}
      <path d="M12 9.2V19" />
    </svg>
  );
}

const BENEFITS = [
  {
    icon: CircleDollarSign,
    title: "Lower Investment Thresholds",
    desc: "Invest in AIFs, PMS and SIFs with reduced minimum investment requirements reserved for accredited investors.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Relaxations",
    desc: "Benefit from relaxations in investment agreements, prudential norms and investment conditions under SEBI's framework.",
  },
  {
    icon: AngelWings,
    title: "Angel Fund Access",
    desc: "Participate in Angel Funds and Co-Investment Vehicles (CIVs) that are open only to accredited investors.",
  },
  {
    icon: SlidersHorizontal,
    title: "Customised Products",
    desc: "Access investment products tailored to your specific risk-return profile, beyond standardised retail offerings.",
  },
];

export function Benefits() {
  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            Why get accredited
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Accreditation opens doors that stay{" "}
            <span className="font-display italic text-brand">closed</span> to
            retail investors
          </h2>
          <p className="mt-4 text-muted-foreground">
            SEBI&apos;s Accredited Investor framework recognises financially
            sophisticated investors and grants them access to exclusive
            investment vehicles and regulatory benefits.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <StaggerItem key={b.title}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <b.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
