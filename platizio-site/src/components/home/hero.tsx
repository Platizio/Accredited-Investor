"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BadgeCheck, Landmark, ShieldCheck } from "lucide-react";
import { CountUp } from "@/components/motion";

type Stat = {
  value?: number;
  static?: string;
  prefix: string;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 7.5, prefix: "₹", suffix: " Cr", label: "Net worth path threshold" },
  {
    static: "₹1 + ₹5 Cr",
    prefix: "",
    suffix: "",
    label: "Hybrid threshold (income · net worth)",
  },
  { value: 2, prefix: "₹", suffix: " Cr", label: "Income path threshold" },
  { value: 3, prefix: "", suffix: " yrs", label: "Maximum certificate validity" },
  { value: 100, prefix: "", suffix: "%", label: "Digital application process" },
];

export function Hero() {
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);
  const chipY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Background: dot grid + soft brand glows that drift on scroll */}
      <div className="bg-dot-grid absolute inset-0 -z-20" />
      <motion.div
        style={{ y: glowY }}
        className="absolute -top-40 left-1/2 -z-10 h-130 w-130 -translate-x-[80%] rounded-full bg-brand-light/25 blur-[120px]"
      />
      <motion.div
        style={{ y: glowY }}
        className="absolute -top-20 right-0 -z-10 h-110 w-110 translate-x-1/3 rounded-full bg-brand/15 blur-[110px]"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="gap-1.5 border border-brand/20 bg-accent px-3 py-1 text-[13px] font-medium text-brand-deep"
            >
              <ShieldCheck className="size-3.5" />
              SEBI Accredited Investor framework · Certified via NDML
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-display font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Your gateway to India&apos;s{" "}
            <span className="font-display italic text-brand">exclusive</span>{" "}
            investment universe
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Become a SEBI Accredited Investor and unlock AIFs, PMS, Angel Funds
            and Co-Investment Vehicles with lower minimum investments and lighter
            regulatory conditions. Platizio handles your net worth
            certification and NDML application, end to end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-12 bg-brand px-7 text-base shadow-lg shadow-brand/25 transition-shadow hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/30"
            >
              <Link href="/apply">
                Start Your Application <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base"
            >
              <Link href="/#why">Learn more</Link>
            </Button>
          </motion.div>
        </div>

        {/* Floating chips, gently parallaxed */}
        <motion.div
          style={{ y: chipY }}
          className="pointer-events-none absolute top-40 left-4 hidden xl:block"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg shadow-brand-deep/5"
          >
            <BadgeCheck className="size-5 text-brand" />
            <div className="text-left text-sm">
              <div className="font-semibold">Certificate issued</div>
              <div className="text-xs text-muted-foreground">via NDML · 2-year or 3-year validity</div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: chipY }}
          className="pointer-events-none absolute top-72 right-4 hidden xl:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg shadow-brand-deep/5"
          >
            <Landmark className="size-5 text-brand" />
            <div className="text-left text-sm">
              <div className="font-semibold">AIF · PMS · Angel Funds</div>
              <div className="text-xs text-muted-foreground">access with relaxed minimum investment</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-sm md:grid-cols-5"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-card px-5 py-6 text-center">
              <div className="text-2xl font-bold text-brand-deep sm:text-3xl">
                {s.static ? (
                  s.static
                ) : (
                  <CountUp
                    value={s.value ?? 0}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    decimals={(s.value ?? 0) % 1 !== 0 ? 1 : 0}
                  />
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
