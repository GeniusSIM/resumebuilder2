"use client";
import { useMemo } from "react";
import type { ResumeData } from "@/lib/utils";

export default function ResumePreview({ data, template }:{ data:ResumeData, template: "MODERN"|"CLASSIC"|"MINIMAL" }) {
  const clz = useMemo(() => {
    switch (template) {
      case "CLASSIC": return "font-serif";
      case "MINIMAL": return "text-gray-800";
      default: return "font-sans";
    }
  }, [template]);

  return (
    <div className={`p-6 bg-white rounded-lg shadow ${clz}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data.basics.fullName}</h1>
          {data.basics.title && <p className="text-sm">{data.basics.title}</p>}
        </div>
        <div className="text-right text-sm">
          {data.basics.email && <div>{data.basics.email}</div>}
          {data.basics.phone && <div>{data.basics.phone}</div>}
          {data.basics.location && <div>{data.basics.location}</div>}
          {data.basics.website && <div>{data.basics.website}</div>}
        </div>
      </div>
      {data.summary && (
        <section className="mt-4">
          <h2 className="font-semibold uppercase text-xs tracking-widest">Summary</h2>
          <p className="mt-1 text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}
      {data.skills && data.skills.length>0 && (
        <section className="mt-4">
          <h2 className="font-semibold uppercase text-xs tracking-widest">Skills</h2>
          <ul className="mt-1 flex flex-wrap gap-2 text-sm">
            {data.skills.map((s,i)=>(<li className="px-2 py-1 rounded bg-gray-100" key={i}>{s.name}</li>))}
          </ul>
        </section>
      )}
      {data.experience && data.experience.length>0 && (
        <section className="mt-4">
          <h2 className="font-semibold uppercase text-xs tracking-widest">Experience</h2>
          <div className="space-y-3 mt-1">
            {data.experience.map((e,i)=>(
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold">{e.role} • {e.company}</div>
                  <div className="text-xs">{e.start} - {e.end || "Present"}</div>
                </div>
                {e.bullets?.length ? (
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {e.bullets.map((b,bi)=>(<li key={bi}>{b}</li>))}
                  </ul>
                ):null}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.education && data.education.length>0 && (
        <section className="mt-4">
          <h2 className="font-semibold uppercase text-xs tracking-widest">Education</h2>
          <div className="space-y-2 mt-1">
            {data.education.map((ed,i)=>(
              <div key={i} className="text-sm">
                <div className="font-semibold">{ed.degree} • {ed.school}</div>
                <div className="text-xs">{ed.start} - {ed.end || "Present"}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects && data.projects.length>0 && (
        <section className="mt-4">
          <h2 className="font-semibold uppercase text-xs tracking-widest">Projects</h2>
          <div className="space-y-2 mt-1">
            {data.projects.map((p,i)=>(
              <div key={i} className="text-sm">
                <div className="font-semibold">{p.name} {p.link ? <a className="text-blue-600 underline" href={p.link} target="_blank" rel="noreferrer">link</a> : null}</div>
                {p.bullets?.length ? <ul className="list-disc pl-5">{p.bullets.map((b,bi)=>(<li key={bi}>{b}</li>))}</ul> : null}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
