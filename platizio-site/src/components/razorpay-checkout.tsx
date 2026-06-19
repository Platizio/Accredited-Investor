"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

// Minimal typing for the global the checkout.js script injects.
type RazorpayInstance = {
  open: () => void;
  on: (event: string, cb: (resp: unknown) => void) => void;
};
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

/** Inject checkout.js once; resolve false if it can't load. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

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
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const busy = status === "starting" || status === "verifying";

  const startPayment = async () => {
    setMessage("");
    setStatus("starting");
    try {
      if (!keyId) throw new Error("Payment key is not configured.");

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        throw new Error("Couldn't load the payment library — check your connection and retry.");
      }

      // 1) Create the order on the server.
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order?.error ?? "Could not start the payment.");

      // 2) Open the Razorpay modal for that order.
      const rzp = new window.Razorpay({
        key: keyId,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name,
        description,
        prefill,
        theme: { color: "#C85A1E" },
        handler: async (resp: RazorpaySuccess) => {
          // 3) Verify the signature on the server.
          setStatus("verifying");
          try {
            const vRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const v = await vRes.json();
            if (vRes.ok && v.verified) {
              setStatus("success");
              setMessage(`Payment verified · ${resp.razorpay_payment_id}`);
              onVerified?.(resp.razorpay_payment_id);
            } else {
              setStatus("error");
              setMessage(
                v?.error ?? "We received your payment but couldn't verify it — please contact support.",
              );
            }
          } catch {
            setStatus("error");
            setMessage("Verification request failed. Save your payment id and contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus((s) => (s === "verifying" || s === "success" ? s : "cancelled"));
            setMessage((m) => m || "Payment cancelled.");
          },
        },
      });

      rzp.on("payment.failed", (resp: unknown) => {
        const r = resp as { error?: { description?: string } };
        setStatus("error");
        setMessage(r?.error?.description ?? "Payment failed. Please try again.");
      });

      rzp.open();
      // Modal is open now; subsequent state comes from handler / ondismiss / payment.failed.
      setStatus("idle");
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
