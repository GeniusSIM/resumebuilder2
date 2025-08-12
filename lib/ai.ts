import OpenAI from "openai";

export async function aiSuggest(system: string, user: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    // Offline fallback: simple echo with tips
    return `AI (offline) suggestions based on your input:\n\n${user}\n\nTips: Use strong action verbs, quantify impact, and mirror keywords from the job description.`;
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.3
  });
  return resp.choices[0]?.message?.content || "";
}
