import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  async function createAction() {
    "use server";
    const u = await prisma.user.findUnique({ where: { email: session.user!.email! } });
    if (!u) return;
    const r = await prisma.resume.create({
      data: {
        userId: u.id,
        title: "Untitled Resume",
        template: "MODERN",
        data: {
          basics: { fullName: u.name || "Your Name", title: "", email: u.email, phone: "", location: "", website: "" },
          summary: "",
          skills: [],
          experience: [],
          education: [],
          projects: []
        }
      }
    });
    return r.id;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Resumes</h1>
        <form action={async ()=>{
          const id = await createAction();
          // redirect to edit page
        }}>
          <Link href="/resumes/new" className="hidden"></Link>
        </form>
        <Link href="/resumes/new" className="px-3 py-2 rounded bg-blue-600 text-white">New resume</Link>
      </div>

      {resumes.length === 0 ? (
        <p className="text-sm text-gray-600">No resumes yet. Click “New resume”.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => (
            <li key={r.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
              <div className="font-semibold">{r.title}</div>
              <div className="text-xs text-gray-600">Updated {r.updatedAt.toLocaleString()}</div>
              <div className="flex gap-2">
                <Link href={`/resumes/${r.id}/edit`} className="px-2 py-1 rounded border">Edit</Link>
                <Link href={`/api/resumes/${r.id}/export`} className="px-2 py-1 rounded border">PDF</Link>
                <form action={`/api/resumes/${r.id}`} method="POST" className="ml-auto">
                  <input type="hidden" name="_method" value="DELETE" />
                </form>
                <a href={`/api/resumes/${r.id}`} data-method="DELETE" className="px-2 py-1 rounded border text-red-600">Delete</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
