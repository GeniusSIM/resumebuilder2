import { prisma } from "@/lib/prisma";
import { auth } from "next-auth";
import { redirect } from "next/navigation";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";

export default async function CoverLettersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const resumes = await prisma.resume.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  const letters = await prisma.coverLetter.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Cover Letters</h1>
      {resumes[0] ? <CoverLetterGenerator resumeId={resumes[0].id} /> : <p className="text-sm text-gray-600">Create a resume first.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {letters.map(l => (
          <div key={l.id} className="bg-white p-4 rounded-lg shadow space-y-2">
            <div className="font-semibold">{l.title}</div>
            <pre className="text-sm whitespace-pre-wrap">{l.content}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
