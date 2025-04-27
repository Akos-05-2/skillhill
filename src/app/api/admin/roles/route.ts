import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true }
    });

    if (!user || (user.role.role_name !== 'admin' && user.role.role_name !== 'super_admin')) {
      return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });
    }

    // Debug log a felhasználó szerepköréről
    console.log('Felhasználó szerepköre:', user.role.role_name);

    const roles = await prisma.roles.findMany({
      select: {
        id: true,
        role_name: true,
      },
      orderBy: {
        id: 'asc'
      }
    });

    // Debug log a lekért szerepkörökről
    console.log('Lekért szerepkörök:', roles);

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Hiba a szerepkörök lekérése során:', error);
    return NextResponse.json(
      { 
        error: 'Hiba történt a szerepkörök lekérése során',
        details: error instanceof Error ? error.message : 'Ismeretlen hiba'
      },
      { status: 500 }
    );
  }
} 