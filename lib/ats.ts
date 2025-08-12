export type ATSResult = {
  matchScore: number;
  keywordsPresent: string[];
  keywordsMissing: string[];
  issues: string[];
  suggestions: string[];
};

const STOP = new Set(["and","or","the","a","an","for","to","of","in","on","with","at","by","from","as","is","are","be","this","that","it","you","your"]);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9\+\#\.]+/g) || []).filter(w=>!STOP.has(w));
}

export function atsScan(resumeText: string, jobText: string): ATSResult {
  const r = tokenize(resumeText);
  const j = tokenize(jobText);
  const rset = new Set(r);
  const jset = new Set(j);
  const uniqueJ = [...jset];

  const present = uniqueJ.filter(k => rset.has(k));
  const missing = uniqueJ.filter(k => !rset.has(k));

  // Heuristics for issues
  const issues: string[] = [];
  if (resumeText.length < 800) issues.push("Resume is quite short. Consider adding more detail.");
  if (!/experience/i.test(resumeText)) issues.push("Missing 'Experience' section heading.");
  if (!/education/i.test(resumeText)) issues.push("Missing 'Education' section heading.");
  if (!/skills?/i.test(resumeText)) issues.push("Missing 'Skills' section heading.");

  // Score: 70% keyword coverage + 30% structure
  const coverage = present.length / Math.max(1, uniqueJ.length);
  let structure = 1 - (issues.length / 6);
  if (structure < 0) structure = 0;
  const matchScore = Math.round((coverage * 0.7 + structure * 0.3) * 100);

  const suggestions = [
    "Mirror exact keywords and phrases from the job description (skills, tools, job title).",
    "Prioritize recent, relevant achievements with quantified impact (numbers, %).",
    "Use simple headings (Summary, Skills, Experience, Education) and clean formatting."
  ];

  return { matchScore, keywordsPresent: present.slice(0,60), keywordsMissing: missing.slice(0,60), issues, suggestions };
}
