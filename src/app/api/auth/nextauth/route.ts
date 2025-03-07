import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
import NextAuth from "next-auth";

export const prisma = new PrismaClient();

const ROLE_IDS = {
  USER: 2,
  TEACHER: 3,
  ADMIN: 4,
  SUPERADMIN: 5
};

export const OPTIONS = {
  providers: [
    GoogleProvider({
      profile(profile) {
        let roleId = ROLE_IDS.USER;
        if (profile.email === "admin@skillhill.com") {
          roleId = ROLE_IDS.ADMIN;
        } else if (profile.email === "superadmin@skillhill.com") {
          roleId = ROLE_IDS.SUPERADMIN;
        } else if (profile.email?.includes("teacher")) {
          roleId = ROLE_IDS.TEACHER;
        }
        
        return {
          id: profile.sub,
          name: profile.name,
          roleId: roleId,
          email: profile.email,
        }
      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    DiscordProvider({
      profile(profile) {
        let roleId = ROLE_IDS.USER;
        if (profile.email === "admin@skillhill.com") {
          roleId = ROLE_IDS.ADMIN;
        } else if (profile.email === "superadmin@skillhill.com") {
          roleId = ROLE_IDS.SUPERADMIN;
        } else if (profile.email?.includes("teacher")) {
          roleId = ROLE_IDS.TEACHER;
        }

        return {
          id: profile.id,
          name: profile.name,
          roleId: roleId,
          email: profile.email
        }
      },
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),
    SpotifyProvider({
      profile(profile) {
        let roleId = ROLE_IDS.USER;
        if (profile.email === "admin@skillhill.com") {
          roleId = ROLE_IDS.ADMIN;
        } else if (profile.email === "superadmin@skillhill.com") {
          roleId = ROLE_IDS.SUPERADMIN;
        } else if (profile.email?.includes("teacher")) {
          roleId = ROLE_IDS.TEACHER;
        }

        return {
          id: profile.id,
          name: profile.name,
          roleId: roleId,
          email: profile.email
        }
      },
      clientId: process.env.SPOTIFY_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
    })
  ],
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      // Szerepkör meghatározása a roleId alapján
      let role = 'user';
      switch (user.roleId) {
        case ROLE_IDS.ADMIN:
          role = 'admin';
          break;
        case ROLE_IDS.SUPERADMIN:
          role = 'superadmin';
          break;
        case ROLE_IDS.TEACHER:
          role = 'teacher';
          break;
      }

      return {
        ...session,
        user: {
          ...session.user,
          roleId: user.roleId,
          role: role // Szerepkör string hozzáadása a session-höz
        }
      }
    }
  }
}

const handler = NextAuth(OPTIONS);
export { handler as GET, handler as POST };