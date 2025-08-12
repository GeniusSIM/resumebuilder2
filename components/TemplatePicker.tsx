"use client";
import { RESUME_TEMPLATES } from "@/lib/templates";

export default function TemplatePicker({ value, onChange }:{ value:string, onChange:(v:string)=>void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {RESUME_TEMPLATES.map(t => (
        <button key={t.key} onClick={()=>onChange(t.key)}
          className={`p-3 rounded border text-left bg-white shadow ${value===t.key ? "ring-2 ring-blue-500" : ""}`}>
          <div className="font-semibold">{t.name}</div>
          <div className="text-xs text-gray-600">{t.description}</div>
        </button>
      ))}
    </div>
  );
}
