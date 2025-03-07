import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roleId: number;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roleId: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId: number;
  }
}
