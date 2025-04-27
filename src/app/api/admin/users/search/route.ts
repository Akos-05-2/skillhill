import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { User } from '@/app/types';
export async function GET(request: Request) {
  try {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Nincs bejelentkezve!' }, { status: 401 });
    }

    // Role ellenőrzés - csak admin és super_admin férhet hozzá
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });

    console.log('API - felhasználó szerepköre:', user?.role?.role_name);

    if (!user || (user.role.role_name !== 'admin' && user.role.role_name !== 'super_admin')) {
      return NextResponse.json({ error: 'Nincs jogosultságod!' }, { status: 403 });
    }

    // Query paraméterek kinyerése
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';

    // Felhasználók lekérdezése
    const users = await prisma.user.findMany({
      include: {
        role: true,
        enrollments: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('API - lekérdezett felhasználók száma:', users.length);

    // Szerepkör statisztikák számítása
    const roleStats = users.reduce((stats: Record<string, number>, user: User) => {
      const roleName = user?.role?.role_name || 'nincs szerepkör';
      if (!stats[roleName]) {
        stats[roleName] = 0;
      }
      stats[roleName]++;
      return stats;
    }, {} as Record<string, number>);

    // Statisztikai adatok
    const statistics = {
      totalUsers: users.length,
      roleStats: roleStats
    };

    console.log('API - statisztikák:', statistics);

    if (!users.length) {
      return NextResponse.json({ 
        error: 'Nem található felhasználó!',
        statistics,
        users: []
      }, { status: 404 });
    }

    // Formázott válasz küldése
    const response = {
      users,
      statistics
    };

    console.log('API - válasz formátum (részlet):', {
      usersCount: users.length,
      statistics
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Hiba a felhasználók lekérése közben:', error);
    return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
  }
} 