import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, username } = data;

    // Ellenőrizzük, hogy létezik-e már a felhasználó
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A megadott email vagy felhasználónév már foglalt" },
        { status: 400 }
      );
    }

    // Alapértelmezett "user" szerepkör ID lekérése (általában 2)
    const defaultRole = await prisma.roles.findFirst({
      where: { role_name: "user" }
    });

    if (!defaultRole) {
      return NextResponse.json(
        { error: "Az alapértelmezett szerepkör nem található" },
        { status: 500 }
      );
    }

    // Felhasználó létrehozása a megfelelő szerepkör ID-val
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        roleId: defaultRole.id, // Itt adjuk meg a szerepkör ID-t
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        role: true // Szerepkör adatok betöltése a válaszhoz
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Hiba a regisztráció során:", error);
    return NextResponse.json(
      { error: "Hiba történt a regisztráció során" },
      { status: 500 }
    );
  }
} 