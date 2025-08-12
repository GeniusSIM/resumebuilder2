"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string|null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) router.push("/dashboard");
    else setErr("Invalid email or password");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="text-sm block">
          Email
          <input className="mt-1 w-full border rounded px-2 py-1" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="text-sm block">
          Password
          <input type="password" className="mt-1 w-full border rounded px-2 py-1" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full px-3 py-2 rounded bg-gray-900 text-white">Sign in</button>
      </form>
      <p className="text-sm mt-3">No account? <Link className="underline" href="/register">Create one</Link></p>
      <div className="text-xs text-gray-500 mt-2">Demo: demo@demo.com / password123</div>
    </div>
  );
}
