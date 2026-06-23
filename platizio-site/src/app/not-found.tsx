import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  // Override the root layout's `index: true` so the 404 isn't indexable
  // (consistent with Next's auto-injected noindex); keep follow so the
  // page's links to / and /apply still pass.
  robots: { index: false, follow: true },
  // Don't inherit the root layout's canonical: "/" on a 404.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-8xl font-bold tracking-tight text-brand sm:text-9xl">
        404
      </p>

      <h1 className="mt-6 text-2xl font-display font-semibold text-foreground sm:text-3xl">
        This page doesn&apos;t exist
      </h1>

      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        Let&apos;s get you back on track.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="h-12 bg-brand px-7 text-base shadow-lg shadow-brand/25 transition-shadow hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/30"
        >
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base">
          <Link href="/apply">Start an application</Link>
        </Button>
      </div>
    </main>
  );
}
