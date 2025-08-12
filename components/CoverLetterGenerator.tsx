"use client";
import { useState } from "react";
import { COVER_LETTER_TEMPLATES } from "@/lib/templates";

export default function CoverLetterGenerator({ resumeId }:{ resumeId: string }) {
  const [tpl, setTpl] = useState("STANDARD");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [jd, setJd] = useState("");
  const [content, setContent] = useState("");

  async function generate() {
    const res = await fetch("/api/cover-letter/generate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ resumeId, template: tpl, company, jobTitle: title, jobDescription: jd })
    });
    const d = await res.json();
    setContent(d.content);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      <div className="flex gap-2 flex-wrap">
        {COVER_LETTER_TEMPLATES.map(c => (
          <button key={c.key} onClick={()=>setTpl(c.key)} className={`px-3 py-1 rounded border ${tpl===c.key ? "bg-gray-900 text-white":""}`}>{c.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="Company" className="border rounded px-2 py-1" value={company} onChange={e=>setCompany(e.target.value)} />
        <input placeholder="Job Title" className="border rounded px-2 py-1" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <textarea placeholder="Paste job description..." className="w-full border rounded px-2 py-1 min-h-[120px]" value={jd} onChange={e=>setJd(e.target.value)} />
      <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={generate}>Generate</button>
      {content && <pre className="whitespace-pre-wrap text-sm">{content}</pre>}
    </div>
  );
}
