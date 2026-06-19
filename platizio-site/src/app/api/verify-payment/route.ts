import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Verifies HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET) === signature.
 * Returns { verified: true } only when the signatures match.
 */
export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Payments are not configured on the server." },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Constant-time comparison to avoid timing leaks.
  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(signature, "utf8");
  const verified =
    expectedBuf.length === givenBuf.length &&
    crypto.timingSafeEqual(expectedBuf, givenBuf);

  if (!verified) {
    // Signature mismatch — do NOT treat the payment as successful.
    return NextResponse.json(
      { verified: false, error: "Signature verification failed." },
      { status: 400 },
    );
  }

  // Authentic. If/when you want to persist payments, record (orderId, paymentId)
  // here — e.g. a Supabase `payments` row. No DB write is done by default.
  return NextResponse.json({ verified: true, paymentId });
}
