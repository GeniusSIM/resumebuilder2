"use client";
import { THEMES } from "@/lib/templates";

export default function ThemePicker({ value, onChange }:{ value:string, onChange:(v:string)=>void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {THEMES.map(t => (
        <button key={t.key}
          onClick={()=>onChange(t.key)}
          className={`px-3 py-1 rounded border ${value===t.key ? "bg-gray-900 text-white" : ""}`}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
