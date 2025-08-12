import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ResumeSchema } from "@/lib/utils";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export async function GET(_: Request, { params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await prisma.resume.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!r || r.user.email !== session.user.email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = ResumeSchema.safeParse(r.data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
  const d = parsed.data;

  const doc = new Document({ sections: [{
    children: [
      new Paragraph({ text: d.basics.fullName, heading: HeadingLevel.TITLE }),
      new Paragraph({ text: [d.basics.email, d.basics.phone, d.basics.location].filter(Boolean).join(" • ") }),
      ...(d.summary ? [new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_2 }), new Paragraph(d.summary)] : []),
      ...(d.skills?.length ? [new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }), new Paragraph(d.skills.map(s=>s.name).join(", "))] : []),
      ...(d.experience?.flatMap(e => [new Paragraph({ text: `${e.role} • ${e.company} • ${e.start}-${e.end||"Present"}`, heading: HeadingLevel.HEADING_3 }), ...((e.bullets||[]).map(b=>new Paragraph("• "+b)))]) || []),
      ...(d.education?.flatMap(ed => [new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }), new Paragraph(`${ed.degree} • ${ed.school} • ${ed.start}-${ed.end||"Present"}`)]) || [])
    ]
  }] });

  const buffer = await Packer.toBuffer(doc);
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=resume.docx"
    }
  });
}
