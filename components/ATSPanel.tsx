"use client";
import { useState } from "react";

export default function ATSPanel({ resumeText }:{ resumeText: string }) {
  const [jd, setJd] = useState("");
  const [res, setRes] = useState<any|null>(null);
  async function run() {
    const r = await fetch("/api/ats/scan", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ resumeText, jobText: jd })
    });
    const d = await r.json();
    setRes(d);
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <h3 className="font-semibold">ATS Check</h3>
      <textarea className="w-full border rounded px-2 py-1 min-h-[120px]" placeholder="Paste job description..." value={jd} onChange={e=>setJd(e.target.value)} />
      <button onClick={run} className="px-3 py-2 rounded bg-blue-600 text-white">Analyze</button>
      {res && (
        <div className="mt-2 text-sm">
          <div className="font-semibold">Match Score: {res.matchScore}%</div>
          {res.issues?.length ? <ul className="list-disc pl-5">{res.issues.map((i:string,idx:number)=>(<li key={idx}>{i}</li>))}</ul> : null}
          <div className="mt-2">
            <div className="font-semibold">Missing keywords</div>
            <div className="flex flex-wrap gap-2">{res.keywordsMissing.map((k:string,i:number)=>(<span key={i} className="px-2 py-1 border rounded">{k}</span>))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
