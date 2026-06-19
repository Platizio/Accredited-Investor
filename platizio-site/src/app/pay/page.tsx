import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo";
import { RazorpayCheckout } from "@/components/razorpay-checkout";

export const metadata = buildMetadata({
  title: "Pay",
  description: "Securely pay your Platizio accreditation fee via Razorpay.",
  path: "/pay",
  noindex: true,
});

export default function PayPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-md px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Secure <span className="font-display italic text-brand">payment</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              Pay your accreditation processing fee securely via Razorpay.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-baseline justify-between border-b border-dashed border-border pb-4">
              <span className="text-sm font-medium">Processing fee</span>
              <span className="text-2xl font-bold text-brand-deep">₹2,000</span>
            </div>
            <p className="mt-4 mb-6 text-xs text-muted-foreground">
              GST as applicable. You&apos;ll be redirected to Razorpay&apos;s secure checkout.
            </p>

            <RazorpayCheckout
              amount={2000}
              label="Pay ₹2,000"
              description="Platizio accreditation processing fee"
            />

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Test mode · use card 4111 1111 1111 1111 (any future expiry &amp; CVV) or UPI{" "}
              <span className="font-mono">success@razorpay</span>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
