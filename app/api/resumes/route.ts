import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const resumes = await prisma.resume.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(resumes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, template, data } = await req.json();
  const r = await prisma.resume.create({
    data: { userId: user.id, title: title || "Untitled Resume", template: template || "MODERN", data: data || {} }
  });
  return NextResponse.json(r);
}
