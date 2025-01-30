export class User{
    id?: string;
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: number;
    createdAt?: Date;
    updatedAt?: Date;
    role_id: number;

    constructor(id: string, name: string, email: string, emailVerified: Date, image: number, createdAt: Date, updatedAt: Date, role_id: number) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.emailVerified = emailVerified;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.role_id = role_id;
    }
}