import { NextResponse } from "next/server";
import { paypalClient } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/pricing?e=no_token", req.url));
  const client = paypalClient();
  const request = new (require("@paypal/checkout-server-sdk").orders.OrdersCaptureRequest)(token);
  request.requestBody({});
  const res = await client.execute(request);
  const email = res.result?.purchase_units?.[0]?.custom_id;
  if (email) {
    await prisma.user.updateMany({ where: { email }, data: { plan: "PRO", planExpiresAt: new Date(Date.now()+1000*60*60*24*30) } });
  }
  return NextResponse.redirect(new URL("/billing/success", req.url));
}
