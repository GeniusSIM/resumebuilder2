"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ResumeData } from "@/lib/utils";
import ResumePreview from "./ResumePreview";

export default function ResumeForm({ initial, id, template }:{ initial: ResumeData, id: string, template: "MODERN"|"CLASSIC"|"MINIMAL" }) {
  const [data, setData] = useState<ResumeData>(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function save() {
    startTransition(async () => {
      await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ data })
      });
      router.refresh();
    });
  }

  async function exportPdf() {
    const res = await fetch(`/api/resumes/${id}/export`, { method: "GET" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <fieldset className="border rounded p-3">
          <legend className="px-2 text-sm font-semibold">Basics</legend>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.basics).map(([k,v])=> (
              <label key={k} className="text-sm flex flex-col gap-1">
                <span className="capitalize">{k}</span>
                <input className="border rounded px-2 py-1" value={v as string} onChange={e=>setData(d=>({...d, basics:{...d.basics, [k]: e.target.value}}))}/>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="border rounded p-3">
          <legend className="px-2 text-sm font-semibold">Summary</legend>
          <textarea className="w-full border rounded px-2 py-1 min-h-[100px]" value={data.summary || ""} onChange={e=>setData(d=>({...d, summary:e.target.value}))}></textarea>
        </fieldset>

        <fieldset className="border rounded p-3">
          <legend className="px-2 text-sm font-semibold">Skills</legend>
          <div className="space-y-2">
            {data.skills?.map((s, idx)=>(
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input className="border rounded px-2 py-1" value={s.name} onChange={e=>{
                  const copy=[...(data.skills||[])]; copy[idx]={...copy[idx], name:e.target.value}; setData(d=>({...d, skills:copy}));
                }} />
                <input type="number" min={1} max={5} className="border rounded px-2 py-1" value={s.level || 3} onChange={e=>{
                  const copy=[...(data.skills||[])]; copy[idx]={...copy[idx], level:Number(e.target.value)}; setData(d=>({...d, skills:copy}));
                }} />
                <button className="text-sm px-2 py-1 border rounded" onClick={()=>{
                  const copy=[...(data.skills||[])]; copy.splice(idx,1); setData(d=>({...d, skills:copy}));
                }}>Remove</button>
              </div>
            ))}
            <button className="text-sm px-2 py-1 border rounded" onClick={()=> setData(d=>({...d, skills:[...(d.skills||[]), {name:"", level:3}]}))}>+ Add skill</button>
          </div>
        </fieldset>

        <fieldset className="border rounded p-3">
          <legend className="px-2 text-sm font-semibold">Experience</legend>
          <div className="space-y-2">
            {data.experience?.map((e, idx)=>(
              <div key={idx} className="space-y-1 border rounded p-2">
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Company" className="border rounded px-2 py-1" value={e.company} onChange={ev=>{
                    const copy=[...(data.experience||[])]; copy[idx]={...copy[idx], company: ev.target.value}; setData(d=>({...d, experience:copy}));
                  }}/>
                  <input placeholder="Role" className="border rounded px-2 py-1" value={e.role} onChange={ev=>{
                    const copy=[...(data.experience||[])]; copy[idx]={...copy[idx], role: ev.target.value}; setData(d=>({...d, experience:copy}));
                  }}/>
                  <input placeholder="Start" className="border rounded px-2 py-1" value={e.start} onChange={ev=>{
                    const copy=[...(data.experience||[])]; copy[idx]={...copy[idx], start: ev.target.value}; setData(d=>({...d, experience:copy}));
                  }}/>
                  <input placeholder="End" className="border rounded px-2 py-1" value={e.end || ""} onChange={ev=>{
                    const copy=[...(data.experience||[])]; copy[idx]={...copy[idx], end: ev.target.value}; setData(d=>({...d, experience:copy}));
                  }}/>
                </div>
                <div>
                  <label className="text-sm">Bullets</label>
                  <ul className="space-y-1">
                    {(e.bullets||[]).map((b,bi)=>(
                      <li key={bi} className="flex gap-2">
                        <input className="border rounded px-2 py-1 flex-1" value={b} onChange={ev=>{
                          const copy=[...(data.experience||[])];
                          const bullets=[...((copy[idx].bullets)||[])];
                          bullets[bi]=ev.target.value;
                          copy[idx]={...copy[idx], bullets};
                          setData(d=>({...d, experience:copy}));
                        }}/>
                        <button className="text-sm px-2 py-1 border rounded" onClick={()=>{
                          const copy=[...(data.experience||[])];
                          const bullets=[...((copy[idx].bullets)||[])];
                          bullets.splice(bi,1);
                          copy[idx]={...copy[idx], bullets};
                          setData(d=>({...d, experience:copy}));
                        }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <button className="text-sm px-2 py-1 border rounded mt-1" onClick={()=>{
                    const copy=[...(data.experience||[])];
                    const bullets=[...((copy[idx].bullets)||[])];
                    bullets.push(""); copy[idx]={...copy[idx], bullets};
                    setData(d=>({...d, experience:copy}));
                  }}>+ Add bullet</button>
                </div>
              </div>
            ))}
            <button className="text-sm px-2 py-1 border rounded" onClick={()=> setData(d=>({...d, experience:[...(d.experience||[]), {company:"", role:"", start:"", end:"", bullets:[]}]}))}>+ Add experience</button>
          </div>
        </fieldset>

        <div className="flex items-center gap-2">
          <button onClick={save} disabled={pending} className="px-3 py-2 rounded bg-blue-600 text-white">{pending? "Saving..." : "Save"}</button>
          <button onClick={exportPdf} className="px-3 py-2 rounded border">Export PDF</button>
        </div>
      </div>

      <div className="sticky top-4">
        <ResumePreview data={data} template={template} />
      </div>
    </div>
  );
}
