import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await prisma.resume.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!r || r.user.email !== session.user.email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(r);
}

export async function PUT(req: Request, { params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await prisma.resume.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!r || r.user.email !== session.user.email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const updated = await prisma.resume.update({ where: { id: params.id }, data: { data: body.data ?? r.data, title: body.title ?? r.title, template: body.template ?? r.template } });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await prisma.resume.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!r || r.user.email !== session.user.email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.resume.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
