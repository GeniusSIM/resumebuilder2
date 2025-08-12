import { NextResponse } from "next/server";
import { atsScan } from "@/lib/ats";

export async function POST(req: Request) {
  const { resumeText, jobText } = await req.json();
  const res = atsScan(String(resumeText||""), String(jobText||""));
  return NextResponse.json(res);
}
