import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.role_name
    });
  } catch (error) {
    console.error("Hiba a felhasználó adatainak lekérése során:", error);
    return NextResponse.json(
      { error: "Hiba a felhasználó adatainak lekérése során" },
      { status: 500 }
    );
  }
} 