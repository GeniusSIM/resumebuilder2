import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ResumeSchema } from "@/lib/utils";
import { aiSuggest } from "@/lib/ai";

function tplContent(kind: string, name: string, company: string, jobTitle: string, jd: string, resume: any) {
  const skills = (resume?.skills||[]).slice(0,8).map((s:any)=>s.name).join(", ");
  const exp = resume?.experience?.[0]?.role ? `${resume.experience[0].role} at ${resume.experience[0].company}` : "relevant experience";
  const base = {
    STANDARD: `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${company}. With experience as ${exp}, I bring strengths in ${skills}.

Thank you for your consideration.
${name}`,
    IMPACT: `Dear ${company} Team,

In my recent role, I delivered measurable results (e.g., +30% feature delivery, -20% cycle time). I’m excited to bring this impact to ${jobTitle} at ${company}.

Best regards,
${name}`,
    NARRATIVE: `Dear ${company} Hiring Committee,

From my first ${resume?.projects?.[0]?.name||"project"}, I learned that outcomes beat output. That lens helped me grow into ${exp}. I’m eager to apply that mindset as ${jobTitle} at ${company}.

Sincerely,
${name}`,
    BRIEF: `Dear ${company},

I’m interested in ${jobTitle}. My background includes ${exp} and skills in ${skills}. I’d welcome a short call.

Regards,
${name}`
  } as Record<string,string>;
  return base[kind] || base.STANDARD;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { resumeId, template, company, jobTitle, jobDescription } = await req.json();
  const r = await prisma.resume.findFirst({ where: { id: resumeId } });
  if (!r) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  const parsed = ResumeSchema.safeParse(r.data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid resume" }, { status: 400 });

  const name = parsed.data.basics.fullName || "Candidate";
  let content = tplContent(String(template), name, String(company||"Company"), String(jobTitle||"Role"), String(jobDescription||""), parsed.data);

  // Optionally refine with AI based on JD and template tone
  const aiPrompt = `Improve this cover letter to be concise, metric-led, and aligned with the JD. Keep the chosen tone (${template}).
COVER_LETTER:
${content}

JD:
${jobDescription}`;
  try {
    const improved = await aiSuggest("You refine cover letters for ATS and clarity. Return only the letter text.", aiPrompt);
    if (improved && improved.length > 50) content = improved;
  } catch {}

  const cl = await prisma.coverLetter.create({
    data: { userId: r.userId, title: `${company||"Company"} - ${jobTitle||"Cover Letter"}`, company, jobTitle, jobDescription, content }
  });

  return NextResponse.json({ id: cl.id, content });
}
