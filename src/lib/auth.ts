import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      // expose user id on session
      if (session.user) (session.user as unknown as { id: string }).id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user, profile }) {
      const login = (profile as unknown as { login?: string })?.login;
      if (login) {
        await prisma.user.update({ where: { id: user.id }, data: { githubLogin: String(login) } });
      }
    },
  },
});
