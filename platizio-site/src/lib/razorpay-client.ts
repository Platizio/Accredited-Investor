// Client-side Razorpay helper. Only call from the browser (event handlers).
// References to window/document are inside functions, so importing this module
// during SSR/prerender is safe.

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

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

/** A server-verified payment. */
export type PaymentResult = {
  paymentId: string;
  orderId: string;
  signature: string;
};

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

/**
 * Runs the full Standard Checkout flow: create order → open modal → verify.
 * Resolves with the verified payment on success, or `null` if the user
 * dismissed the modal (cancelled). Rejects on config/load/order/verify errors
 * and on `payment.failed` — callers should catch and surface the message.
 */
export async function payWithRazorpay(opts: {
  amount: number; // paise
  name?: string;
  description?: string;
  receipt?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onStatus?: (s: "creating" | "open" | "verifying") => void;
}): Promise<PaymentResult | null> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Payment key is not configured.");

  const loaded = await loadRazorpay();
  if (!loaded || !window.Razorpay) {
    throw new Error("Couldn't load the payment library — check your connection and retry.");
  }

  opts.onStatus?.("creating");
  const orderRes = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: opts.amount, currency: "INR", receipt: opts.receipt }),
  });
  const order = await orderRes.json();
  if (!orderRes.ok) throw new Error(order?.error ?? "Could not start the payment.");

  return new Promise<PaymentResult | null>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: keyId,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      name: opts.name ?? "Platizio",
      description: opts.description,
      prefill: opts.prefill,
      theme: { color: "#C85A1E" },
      handler: async (resp: RazorpaySuccess) => {
        opts.onStatus?.("verifying");
        try {
          const vRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const v = await vRes.json();
          if (vRes.ok && v.verified) {
            resolve({
              paymentId: resp.razorpay_payment_id,
              orderId: resp.razorpay_order_id,
              signature: resp.razorpay_signature,
            });
          } else {
            reject(new Error(v?.error ?? "Payment could not be verified."));
          }
        } catch {
          reject(new Error("Verification request failed. Save your payment id and contact support."));
        }
      },
      modal: {
        ondismiss: () => resolve(null), // user cancelled
      },
    });

    rzp.on("payment.failed", (resp: unknown) => {
      const r = resp as { error?: { description?: string } };
      reject(new Error(r?.error?.description ?? "Payment failed. Please try again."));
    });

    opts.onStatus?.("open");
    rzp.open();
  });
}
