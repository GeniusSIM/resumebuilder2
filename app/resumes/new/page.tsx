import { prisma } from "@/lib/prisma";
import { auth } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewResume() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const r = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Untitled Resume",
      template: "MODERN",
      data: {
        basics: { fullName: user.name || "Your Name", title: "", email: user.email, phone: "", location: "", website: "" },
        summary: "",
        skills: [],
        experience: [],
        education: [],
        projects: []
      }
    }
  });

  redirect(`/resumes/${r.id}/edit`);
}
