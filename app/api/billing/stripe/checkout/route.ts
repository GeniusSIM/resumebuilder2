import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "next-auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.redirect(new URL("/login", req.url));
  const body = await req.formData();
  const priceId = String(body.get("priceId") || "");
  if (!priceId) return NextResponse.redirect(new URL("/pricing?e=noprice", req.url));
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: new URL("/billing/success", req.url).toString(),
    cancel_url: new URL("/pricing", req.url).toString(),
    customer_email: session.user.email!,
    metadata: { userEmail: session.user.email! }
  });
  return NextResponse.redirect(checkout.url!, 303);
}
