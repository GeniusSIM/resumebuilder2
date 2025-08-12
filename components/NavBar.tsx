"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <nav className="w-full border-b">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-lg">ResumeSaaS Pro</Link>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link><Link href="/tracker" className="text-sm hover:underline">Tracker</Link><Link href="/cover-letters" className="text-sm hover:underline">Letters</Link>
              <button onClick={() => signOut()} className="text-sm px-3 py-1 rounded bg-gray-900 text-white">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="text-sm px-3 py-1 rounded bg-gray-900 text-white">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
