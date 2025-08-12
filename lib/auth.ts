import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(creds) {
        const parsed = CredentialsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, plan: user.plan };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        // @ts-expect-error
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // @ts-expect-error
        session.user.id = token.id;
        // @ts-expect-error
        session.user.plan = token.plan;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
