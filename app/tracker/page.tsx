import { prisma } from "@/lib/prisma";
import { auth } from "next-auth";
import { redirect } from "next/navigation";

export default async function TrackerPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const apps = await prisma.jobApp.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Job Tracker</h1>
      <form action="/api/tracker" method="POST" className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="title" placeholder="Job Title" className="border rounded px-2 py-1" />
        <input name="company" placeholder="Company" className="border rounded px-2 py-1" />
        <input name="location" placeholder="Location" className="border rounded px-2 py-1" />
        <input name="url" placeholder="Link" className="border rounded px-2 py-1 md:col-span-2" />
        <button className="px-3 py-2 rounded bg-blue-600 text-white">Add</button>
      </form>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {apps.map(a => (
          <li key={a.id} className="bg-white p-4 rounded-lg shadow">
            <div className="font-semibold">{a.title} • {a.company}</div>
            <div className="text-xs text-gray-600">{a.location} {a.url ? "• "+a.url : ""}</div>
            <div className="text-xs mt-1">Status: {a.status}</div>
            {a.keywords ? <div className="text-xs mt-1">Keywords: {a.keywords}</div> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
