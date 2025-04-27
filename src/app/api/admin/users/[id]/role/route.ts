import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { role } = await request.json();

    if (!role) {
      return NextResponse.json({ error: "A szerepkör megadása kötelező" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: { role: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ error: "Nem módosíthatod saját szerepkörödet" }, { status: 400 });
    }

    if (targetUser.role.role_name === "super_admin") {
      return NextResponse.json({ error: "Nem módosíthatod a super_admin szerepkört" }, { status: 403 });
    }

    if (role === "admin" && user.role.role_name !== "super_admin") {
      return NextResponse.json({ error: "Csak super_admin nevezhet ki admint" }, { status: 403 });
    }

    const roleRecord = await prisma.roles.findUnique({
      where: { role_name: role }
    });

    if (!roleRecord) {
      return NextResponse.json({ error: "Érvénytelen szerepkör" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: params.id },
      data: { roleId: roleRecord.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a felhasználó szerepkörének módosítása során:', error);
    return NextResponse.json(
      { error: "Hiba a felhasználó szerepkörének módosítása során" },
      { status: 500 }
    );
  }
} 