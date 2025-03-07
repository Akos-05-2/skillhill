export interface User {
    id?: string;
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: number;
    createdAt?: Date;
    updatedAt?: Date;
    roleId: number;
    role?: string;
}