import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Admin emails that should be granted admin role (roleId: 4)
const ADMIN_EMAILS = ['admin@skillhill.com']; // Add your admin email here

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID || "",
      clientSecret: process.env.DISCORD_SECRET || "",
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_ID || "",
      clientSecret: process.env.SPOTIFY_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as number;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        // Handle session updates
        token.roleId = session.user.roleId;
      }
      if (user) {
        token.id = user.id;
        token.roleId = user.roleId;
      }
      return token;
    },
    async signIn({ user }) {
      try {
        if (!user?.email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            roleId: true,
          },
        });

        if (!existingUser) {
          // Determine role based on email
          const roleId = ADMIN_EMAILS.includes(user.email) ? 4 : 2;

          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              image: user.image,
              roleId: roleId, // 4 for admin, 2 for student
            },
          });

          user.roleId = newUser.roleId;
        } else {
          // Update user role if they are an admin
          if (ADMIN_EMAILS.includes(user.email) && existingUser.roleId !== 4) {
            await prisma.user.update({
              where: { email: user.email },
              data: { roleId: 4 },
            });
            user.roleId = 4;
          } else {
            user.roleId = existingUser.roleId;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
