import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e:any) {
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  if (evt.type === "checkout.session.completed" || evt.type === "customer.subscription.updated") {
    const session = evt.data.object as Stripe.Checkout.Session | any;
    const email = (session.customer_details?.email) || session.customer_email || session.metadata?.userEmail;
    if (email) {
      await prisma.user.updateMany({
        where: { email },
        data: { plan: "PRO", planExpiresAt: new Date(Date.now() + 1000*60*60*24*30) } // naive month
      });
    }
  }
  if (evt.type === "customer.subscription.deleted") {
    const sub = evt.data.object as any;
    const email = sub.customer_email || sub.metadata?.userEmail;
    if (email) {
      await prisma.user.updateMany({ where: { email }, data: { plan: "FREE", planExpiresAt: null } });
    }
  }
  return NextResponse.json({ received: true });
}
