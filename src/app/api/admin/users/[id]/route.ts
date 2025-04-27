import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
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

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: { role: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ error: "Nem törölheted saját magad" }, { status: 400 });
    }

    if (targetUser.role.role_name === "super_admin") {
      return NextResponse.json({ error: "Nem törölhetsz super_admin felhasználót" }, { status: 403 });
    }

    if (targetUser.role.role_name === "admin" && user.role.role_name !== "super_admin") {
      return NextResponse.json({ error: "Csak super_admin törölhet admin felhasználót" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a felhasználó törlése során:', error);
    return NextResponse.json(
      { error: "Hiba a felhasználó törlése során" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true }
    });

    if (!adminUser || (adminUser.role.role_name !== "admin" && adminUser.role.role_name !== "super_admin")) {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const data = await request.json();
    const { roleId } = data;

    if (!roleId) {
      return NextResponse.json(
        { error: "A szerepkör azonosító megadása kötelező" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy létezik-e a szerepkör
    const role = await prisma.roles.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return NextResponse.json(
        { error: "A megadott szerepkör nem található" },
        { status: 404 }
      );
    }

    // Ellenőrizzük, hogy létezik-e a felhasználó
    const userToUpdate = await prisma.user.findUnique({
      where: { id: params.id },
      include: { role: true }
    });

    if (!userToUpdate) {
      return NextResponse.json(
        { error: "A felhasználó nem található" },
        { status: 404 }
      );
    }

    // Admin nem módosíthatja admin vagy super_admin szerepkörét
    if (
      adminUser.role.role_name === "admin" &&
      (userToUpdate.role.role_name === "admin" || userToUpdate.role.role_name === "super_admin")
    ) {
      return NextResponse.json(
        { error: "Nincs jogosultság más adminok szerepkörének módosításához" },
        { status: 403 }
      );
    }

    // Super admin nem módosíthatja saját szerepkörét
    if (
      adminUser.role.role_name === "super_admin" &&
      userToUpdate.id === adminUser.id
    ) {
      return NextResponse.json(
        { error: "Nem módosíthatod a saját szerepkörödet" },
        { status: 403 }
      );
    }

    // Frissítjük a felhasználó szerepkörét
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { roleId: roleId },
      include: { role: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Hiba a felhasználó frissítése során:', error);
    return NextResponse.json(
      { error: "Hiba történt a felhasználó frissítése során" },
      { status: 500 }
    );
  }
} 