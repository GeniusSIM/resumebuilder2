import { NextResponse } from "next/server";
import { aiSuggest } from "@/lib/ai";

export async function POST(req: Request) {
  const { resume, job } = await req.json();
  const prompt = `You are a resume optimization assistant. Given RESUME JSON and JOB DESCRIPTION, propose: 
1) 5 improved bullet points with quantified impact, 
2) a tailored professional summary (2-3 sentences), 
3) a list of top 15 keywords to include, 
4) 3 suggestions to improve formatting for ATS.
Return JSON with keys bullets, summary, keywords, suggestions.
RESUME=${JSON.stringify(resume).slice(0, 4000)}
JOB=${String(job).slice(0, 4000)}`;
  const out = await aiSuggest("Be concise, metric-focused, and ATS-friendly. Output only valid JSON.", prompt);
  return NextResponse.json({ result: out });
}
