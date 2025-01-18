export interface IUser{
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
    image: number;
    createdAt: Date;
    updatedAt: Date;
    role_id: number;
}