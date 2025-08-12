import Link from "next/link";

export default function Pricing() {
  const month = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH;
  const year = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEAR;
  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Pricing</h1>
      <p className="text-gray-600 mb-6">Free to start. Upgrade to PRO for unlimited exports, AI assistance, and premium templates.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Free</h3>
          <ul className="mt-2 text-sm list-disc pl-5">
            <li>Basic templates</li>
            <li>PDF export</li>
            <li>Manual cover letters</li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-lg shadow ring-2 ring-blue-500">
          <h3 className="text-xl font-semibold">PRO</h3>
          <ul className="mt-2 text-sm list-disc pl-5">
            <li>All templates & themes</li>
            <li>AI-assisted writing</li>
            <li>Advanced ATS checker</li>
            <li>DOCX export</li>
            <li>Priority support</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <form action="/api/billing/stripe/checkout" method="POST">
              <input type="hidden" name="priceId" value={month || ""} />
              <button className="px-3 py-2 rounded bg-gray-900 text-white">Stripe Monthly</button>
            </form>
            <form action="/api/billing/stripe/checkout" method="POST">
              <input type="hidden" name="priceId" value={year || ""} />
              <button className="px-3 py-2 rounded bg-gray-900 text-white">Stripe Yearly</button>
            </form>
          </div>
          <div className="mt-3">
            <form action="/api/billing/paypal/create-order" method="POST">
              <button className="px-3 py-2 rounded border">PayPal</button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500">Test in Stripe/PayPal sandbox. Configure env vars first.</div>
    </section>
  );
}
