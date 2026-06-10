"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#why", label: "Why Accreditation" },
  { href: "/#eligibility", label: "Eligibility" },
  { href: "/#process", label: "Process" },
  { href: "/#fees", label: "Fees" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-[0_2px_24px_rgba(122,32,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/platizio-logo.png"
            alt="Platizio"
            width={220}
            height={80}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="hidden bg-brand hover:bg-brand-deep md:inline-flex">
            <Link href="/apply">
              Apply Now <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <button
            className="rounded-md p-2 text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b border-border bg-background/95 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-brand-deep"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-brand hover:bg-brand-deep">
              <Link href="/apply" onClick={() => setOpen(false)}>
                Apply Now <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
