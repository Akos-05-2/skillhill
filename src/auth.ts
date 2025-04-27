import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { AdapterUser } from "@auth/core/adapters";

declare module "next-auth" {
    interface User extends AdapterUser {
        role?: string;
    }

    interface Session {
        user: User & {
            id: string;
            role: string;
        }
    }
}

export const prisma = new PrismaClient();

export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_ID || "",
            clientSecret: process.env.DISCORD_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) {
                return false;
            }

            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    include: { accounts: true }
                });

                if (existingUser) {
                    const hasAccount = existingUser.accounts.some(
                        acc => acc.provider === account?.provider
                    );

                    if (!hasAccount) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account?.type || "oauth",
                                provider: account?.provider || "",
                                providerAccountId: account?.providerAccountId || "",
                                access_token: account?.access_token,
                                token_type: account?.token_type,
                                scope: account?.scope,
                                id_token: account?.id_token,
                                expires_at: account?.expires_at
                            }
                        });
                    }
                    return true;
                }

                
                const newUser = await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        roleId: 2, 
                    }
                });

                if (account) {
                    await prisma.account.create({
                        data: {
                            userId: newUser.id,
                            type: account.type || "oauth",
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                            expires_at: account.expires_at
                        }
                    });
                }

                return true;
            } catch (error) {
                console.error("Hiba a bejelentkezés során:", error);
                return false;
            }
        },
        async session({ session, user }) {
            if (session.user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email! },
                    include: { role: true }
                });

                if (dbUser) {
                    session.user.id = dbUser.id;
                    session.user.role = dbUser.role?.role_name || "user";
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/",
        error: "/auth/error",
    },
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, 
        updateAge: 24 * 60 * 60, 
    },
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);