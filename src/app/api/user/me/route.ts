import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * A bejelentkezett felhasználó adatainak lekérése
 */
export const GET = auth(async function GET(req: any) {
  try {
    // Lekérjük a munkamenetet a NextAuth segítségével
    if (!req.auth) {
      return NextResponse.json({ error: 'Nincs bejelentkezve!' }, { status: 401 });
    }

    // Felhasználó adatainak lekérése a szerepkörrel együtt
    const user = await prisma.user.findUnique({
      where: { id: req.auth.user.id },
      include: { role: true }
    });
    
    // Ha nem található a felhasználó, 404 hibakód
    if (!user) {
      return NextResponse.json({ error: 'Felhasználó nem található!' }, { status: 404 });
    }

    // Debug információk a konzolra
    console.log('User API - ME végpont:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role_name: user.role?.role_name
    });

    // Visszaadjuk a felhasználó adatait
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Hiba a felhasználó adatainak lekérése közben:', error);
    return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
  }
})