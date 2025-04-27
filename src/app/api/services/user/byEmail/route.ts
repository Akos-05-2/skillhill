import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const GET = auth(async function GET(req: any) {
  try {
    // Query paraméterek kinyerése
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Az email paraméter kötelező' }, { status: 400 });
    }

    // Felhasználó keresése email alapján
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            role_name: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
    }

    // Visszaadjuk a felhasználó adatait
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.role_name
    });
  } catch (error) {
    console.error('Hiba a felhasználó adatainak lekérése közben:', error);
    return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
  }
})