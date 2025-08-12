import { NextResponse } from "next/server";
import { paypalClient } from "@/lib/paypal";
import { auth } from "next-auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.redirect(new URL("/login", req.url));
  const client = paypalClient();
  const request = new (require("@paypal/checkout-server-sdk").orders.OrdersCreateRequest)();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "USD", value: "9.00" }, custom_id: session.user.email }],
    application_context: {
      return_url: new URL("/billing/success", req.url).toString(),
      cancel_url: new URL("/pricing", req.url).toString()
    }
  });
  const order = await client.execute(request);
  const approve = order.result.links.find((l:any)=> l.rel === "approve")?.href;
  return NextResponse.redirect(approve, 303);
}
