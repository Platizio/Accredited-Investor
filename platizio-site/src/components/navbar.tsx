"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, ChevronDown, FileCheck2, FileSignature, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#eligibility", label: "Eligibility" },
  { href: "/#why", label: "Why Accreditation" },
  { href: "/#process", label: "Process" },
  { href: "/#fees", label: "Fees" },
  { href: "/#faq", label: "FAQ" },
];

const APPLY_LINKS = [
  {
    href: "/apply/net-worth",
    icon: FileCheck2,
    label: "Apply for Net-Worth Certificate",
    desc: "Get a CA-issued certificate",
  },
  {
    href: "/apply/accreditation",
    icon: FileSignature,
    label: "Apply for Accreditation",
    desc: "Already have a certificate",
  },
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
            alt="Platizio — SEBI Accredited Investor facilitation in India"
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
          {/* Desktop: Apply dropdown */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="bg-brand hover:bg-brand-deep">
                  Apply Now <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {APPLY_LINKS.map((a) => (
                  <DropdownMenuItem key={a.href} asChild>
                    <Link href={a.href} className="flex cursor-pointer items-start gap-3 py-2.5">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-brand">
                        <a.icon className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{a.label}</span>
                        <span className="text-xs text-muted-foreground">{a.desc}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
            <div className="mt-2 flex flex-col gap-2">
              {APPLY_LINKS.map((a) => (
                <Button key={a.href} asChild className="justify-start bg-brand hover:bg-brand-deep">
                  <Link href={a.href} onClick={() => setOpen(false)}>
                    <a.icon data-icon="inline-start" /> {a.label}
                    <ArrowRight data-icon="inline-end" className="ml-auto" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
