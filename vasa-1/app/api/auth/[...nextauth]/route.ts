import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account }) {
      // Ensure user exists in your Prisma DB
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              fullName: user.name || "",
              image: user.image || "",
            },
          });
        }

        return true; // Allow sign in
      } catch (error) {
        console.error("Error checking user in DB:", error);
        return false; // Deny access on error
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, token }) {
      // Attach Prisma user ID to session
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session.user as any).id = dbUser.id;
        }
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
