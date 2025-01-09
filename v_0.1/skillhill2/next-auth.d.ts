import { UserRole } from "@prisma/client";

declare module "next-auth"{
    interface Session {
        user: User;
    }

    interface User {
        id: string;
        name: string | null;
        username: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: UserRole;
    }
}