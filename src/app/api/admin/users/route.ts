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
      include: { role: true }
    });

    if (!user || (user.role.role_name !== "admin" && user.role.role_name !== "super_admin")) {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérése során:', error);
    return NextResponse.json(
      { error: "Hiba a felhasználók lekérése során" },
      { status: 500 }
    );
  }
}
