import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

export function paypalClient() {
  const env = process.env.PAYPAL_ENV === "live"
    ? new checkoutNodeJssdk.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
    : new checkoutNodeJssdk.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
  return new checkoutNodeJssdk.core.PayPalHttpClient(env);
}
