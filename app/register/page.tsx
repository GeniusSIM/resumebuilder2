"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string|null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, name, password })
    });
    if (res.ok) {
      setMessage("Account created! You can sign in now.");
      setTimeout(()=> router.push("/login"), 1000);
    } else {
      const d = await res.json();
      setMessage(d.error || "Error creating account");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="text-sm block">
          Name
          <input className="mt-1 w-full border rounded px-2 py-1" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label className="text-sm block">
          Email
          <input className="mt-1 w-full border rounded px-2 py-1" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="text-sm block">
          Password
          <input type="password" className="mt-1 w-full border rounded px-2 py-1" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <button className="w-full px-3 py-2 rounded bg-gray-900 text-white">Create account</button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
