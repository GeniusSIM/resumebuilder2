import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import { NextAuthProvider } from "@/components/providers";

export const metadata = {
  title: "Resume SaaS",
  description: "Build resumes and cover letters"
};

export default function RootLayout({ children }:{ children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <NextAuthProvider>
          <NavBar />
          <main className="container py-6">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
