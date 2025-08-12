import Link from "next/link";

export default function Home() {
  return (
    <section className="container max-w-3xl">
      <h1 className="text-3xl font-bold">Build beautiful resumes & cover letters</h1>
      <p className="text-gray-700 mt-2">Free to start. Export PDF. Save unlimited drafts.</p>
      <div className="mt-4 flex gap-3">
        <Link href="/login" className="px-4 py-2 rounded bg-gray-900 text-white">Get started</Link>
        <Link href="/dashboard" className="px-4 py-2 rounded border">Go to dashboard</Link>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white shadow">
          <h3 className="font-semibold">Live Preview</h3>
          <p className="text-sm text-gray-600">Edit and see changes instantly.</p>
        </div>
        <div className="p-4 rounded-lg bg-white shadow">
          <h3 className="font-semibold">PDF Export</h3>
          <p className="text-sm text-gray-600">Export high-quality PDFs anytime.</p>
        </div>
        <div className="p-4 rounded-lg bg-white shadow">
          <h3 className="font-semibold">Cover Letters</h3>
          <p className="text-sm text-gray-600">Generate tailored cover letters.</p>
        </div>
      </div>
    </section>
  );
}
