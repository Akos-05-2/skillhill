import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
import NextAuth from "next-auth";


export const prisma = new PrismaClient()

export const OPTIONS = {
  providers: [
    GoogleProvider({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          roleId: profile.roleId ?? 2,
          email: profile.email,
        }
      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    DiscordProvider({
       profile(profile) {
         return {
           id: profile.id,
           name: profile.name,
           roleId: profile.roleId ?? 2,
           email: profile.email
         }
      },
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
      token: 'https://discord.com/api/oauth2/token',
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: {redirect_uri: 'http://localhost:3000/api/auth/callback/discord'}
      }
    }),
    SpotifyProvider({
       profile(profile){
         return{
           id: profile.id,
           name: profile.name,
           roleId: profile.roleId ?? 2,
           email: profile.email
         }
      },
      clientId: process.env.SPOTIFY_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
      token: 'https://accounts.spotify.com/api/token',
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {redirect_uri: 'http://localhost:3000/api/auth/callback/spotify'}
      }
    })
  ],
  adapter: PrismaAdapter(prisma),
  debug: true,
}

const handler = NextAuth(OPTIONS);
export { handler as GET, handler as POST };