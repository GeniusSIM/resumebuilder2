import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.formData();
  const title = String(body.get("title")||"");
  const company = String(body.get("company")||"");
  const location = String(body.get("location")||"");
  const url = String(body.get("url")||"");
  const rec = await prisma.jobApp.create({ data: { userId: user.id, title, company, location, url, status: "SAVED" } });
  return NextResponse.redirect(new URL("/tracker", req.url));
}
