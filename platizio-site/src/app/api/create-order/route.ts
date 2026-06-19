import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Razorpay SDK + reading the secret require the Node.js runtime (not edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/create-order
 * Body: { amount: number (paise), currency?: string, receipt?: string }
 * Returns: { order_id, amount, currency }
 */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payments are not configured on the server." },
      { status: 500 },
    );
  }

  let body: { amount?: unknown; currency?: unknown; receipt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const amount = Number(body.amount); // paise
  const currency =
    typeof body.currency === "string" && body.currency ? body.currency : "INR";
  const receipt =
    typeof body.receipt === "string" && body.receipt
      ? body.receipt.slice(0, 40)
      : `rcpt_${Date.now()}`;

  // Razorpay minimum is 100 paise (₹1); amount must be a whole number of paise.
  if (!Number.isInteger(amount) || amount < 100) {
    return NextResponse.json(
      { error: "Amount must be a whole number of at least 100 paise (₹1)." },
      { status: 400 },
    );
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; error?: { description?: string } };
    // Don't leak internals to the client; log server-side.
    console.error("[razorpay] create-order failed:", e?.error ?? err);
    const status = e?.statusCode === 401 ? 401 : 500;
    return NextResponse.json(
      {
        error:
          status === 401
            ? "Payment authentication failed."
            : "Could not create the payment order. Please try again.",
      },
      { status },
    );
  }
}
