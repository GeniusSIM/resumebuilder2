import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, name, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, name, passwordHash } });
  return NextResponse.json({ ok: true });
}
