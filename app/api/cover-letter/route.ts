import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ResumeSchema } from "@/lib/utils";

function generateCoverLetter(opts: {
  name: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  jobDescription?: string;
  resume: any;
}) {
  const { name, company = "Hiring Manager", jobTitle = "the role", jobDescription = "", resume } = opts;
  const skills = (resume?.skills || []).slice(0, 6).map((s:any)=>s.name);
  const expLine = (resume?.experience?.[0]) ? `${resume.experience[0].role} at ${resume.experience[0].company}` : "relevant experience";
  const jdFocus = jobDescription ? ` I was particularly drawn to your requirement for ${jobDescription.substring(0, 120)}...` : "";
  return `Dear ${company},

I am writing to express my interest in ${jobTitle} at ${company}. With experience as ${expLine}, I have developed strengths in ${skills.join(", ")} that align well with your needs.${jdFocus}

At my previous role, I delivered measurable impact by leading projects, collaborating across teams, and shipping high-quality features. I am confident I can bring the same energy and results to your team.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my background can contribute to ${company}.

Sincerely,
${name}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let resumeId: string | null = null;
  let title: string | null = null;
  let company: string | null = null;
  let jobTitle: string | null = null;
  let jobDescription: string | null = null;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    resumeId = body.resumeId;
    title = body.title || null;
    company = body.company || null;
    jobTitle = body.jobTitle || null;
    jobDescription = body.jobDescription || null;
  } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    resumeId = String(form.get("resumeId") || "");
    title = String(form.get("title") || "");
    company = String(form.get("company") || "");
    jobTitle = String(form.get("jobTitle") || "");
    jobDescription = String(form.get("jobDescription") || "");
  } else {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  if (!resumeId) return NextResponse.json({ error: "resumeId required" }, { status: 400 });

  const r = await prisma.resume.findUnique({ where: { id: resumeId, userId: user.id } });
  if (!r) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  const parsed = ResumeSchema.safeParse(r.data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid resume" }, { status: 400 });

  const content = generateCoverLetter({
    name: parsed.data.basics.fullName,
    email: parsed.data.basics.email,
    company: company || undefined, jobTitle: jobTitle || undefined,
    jobDescription: jobDescription || undefined, resume: parsed.data
  });

  const cl = await prisma.coverLetter.create({
    data: {
      userId: user.id,
      title: title || `${company || "Company"} - ${jobTitle || "Cover Letter"}`,
      company: company || undefined, jobTitle: jobTitle || undefined, jobDescription: jobDescription || undefined, content
    }
  });
  return NextResponse.json(cl);
}
