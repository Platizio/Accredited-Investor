"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/motion";
import { Award, FileCheck2, FileText, Send } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Apply Online",
    desc: "Complete the two-step application — your details, eligibility path and supporting documents — entirely online.",
  },
  {
    icon: FileCheck2,
    title: "Net Worth Certification",
    desc: "For the Net Worth and Hybrid paths, your own CA or a Platizio-empanelled CA issues the Net Worth Certificate. The Income path skips straight ahead on your ITR.",
  },
  {
    icon: Send,
    title: "Submission to NDML",
    desc: "Your application and verified documents are submitted to the accreditation agency — NSDL Database Management Limited (NDML).",
  },
  {
    icon: Award,
    title: "Certificate Issued",
    desc: "Receive your Accredited Investor Certificate, valid for the 2-year or 3-year period you selected.",
  },
];

export function Process() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to your{" "}
            <span className="font-display italic text-brand">certificate</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A streamlined, fully digital journey from application to
            accreditation.
          </p>
        </Reveal>

        <div ref={lineRef} className="relative mx-auto mt-16 max-w-2xl">
          {/* Track + scroll-linked progress line */}
          <div className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-7" />
          <motion.div
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-6 w-px origin-top bg-gradient-to-b from-brand-deep via-brand to-brand-light sm:left-7"
          />

          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="relative flex gap-6 pl-0">
                  <div className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-card shadow-md shadow-brand/10 sm:size-14">
                    <s.icon className="size-5 text-brand sm:size-6" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
                    <div className="text-xs font-bold tracking-widest text-brand">
                      STEP {i + 1}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
