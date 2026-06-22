"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { payWithRazorpay } from "@/lib/razorpay-client";

type Status = "idle" | "starting" | "verifying" | "success" | "error" | "cancelled";

export function RazorpayCheckout({
  amount,
  label = "Pay now",
  name = "Platizio",
  description = "Accreditation fee",
  prefill,
  receipt,
  onVerified,
}: {
  /** Amount in rupees (converted to paise before sending). */
  amount: number;
  label?: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  receipt?: string;
  onVerified?: (paymentId: string) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const busy = status === "starting" || status === "verifying";

  const startPayment = async () => {
    setMessage("");
    setStatus("starting");
    try {
      const result = await payWithRazorpay({
        amount: Math.round(amount * 100),
        name,
        description,
        prefill,
        receipt,
        onStatus: (s) => setStatus(s === "verifying" ? "verifying" : "starting"),
      });
      if (!result) {
        setStatus("cancelled");
        setMessage("Payment cancelled.");
        return;
      }
      setStatus("success");
      setMessage(`Payment verified · ${result.paymentId}`);
      onVerified?.(result.paymentId);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={startPayment}
        disabled={busy}
        size="lg"
        className="h-12 w-full bg-brand text-base hover:bg-brand-deep"
      >
        {busy ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            {status === "verifying" ? "Verifying…" : "Starting…"}
          </>
        ) : (
          label
        )}
      </Button>
      {message && (
        <p
          className={`flex items-center justify-center gap-1.5 text-center text-sm font-medium ${
            status === "success"
              ? "text-green-600"
              : status === "cancelled"
                ? "text-muted-foreground"
                : "text-red-600"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : status === "error" ? (
            <XCircle className="size-4" />
          ) : null}
          {message}
        </p>
      )}
    </div>
  );
}
