import { prisma } from "@/lib/prisma";
import { auth } from "next-auth";
import { redirect, notFound } from "next/navigation";
import ResumeForm from "@/components/ResumeForm";
import TemplatePicker from "@/components/TemplatePicker";
import ThemePicker from "@/components/ThemePicker";
import ATSPanel from "@/components/ATSPanel";
import { ResumeSchema } from "@/lib/utils";

export default async function EditResumePage({ params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const resume = await prisma.resume.findUnique({ where: { id: params.id }, include:{ user:true } });
  if (!resume) notFound();
  if (resume.user.email !== session.user.email) redirect("/dashboard");

  const parsed = ResumeSchema.safeParse(resume.data);
  const data = parsed.success ? parsed.data : {
    basics: { fullName: "", title: "", email: "", phone: "", location: "", website: "" },
    summary: "",
    skills: [], experience: [], education: [], projects: []
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resume.title}</h1>
      </div>
      <ResumeForm initial={data} id={resume.id} template={resume.template as any} />
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TemplatePicker value={resume.template as any} onChange={()=>{}} />
        </div>
        <div className="space-y-4">
          <ATSPanel resumeText={JSON.stringify(data)} />
        </div>
      </div>
    </section>

  );
}
