import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET - Kurzus adatok lekérdezése
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Kurzus adatok API - kérés fogadva', { courseId: params.id });
    
    // Használjuk a beépített auth funkciót
    const session = await auth();
    console.log('Kurzus adatok API - session adatok:', {
      sessionExists: !!session,
      userExists: !!session?.user
    });
    
    if (!session?.user) {
      console.log('Kurzus adatok API - nincs bejelentkezve');
      return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
    }
    
    // Lekérjük a felhasználó adatait a szerepkörével együtt
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });
    
    console.log('Kurzus adatok API - felhasználó adatok:', {
      userExists: !!user,
      userRole: user?.role?.role_name
    });

    if (!user) {
      console.log('Kurzus adatok API - felhasználó nem található');
      return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
    }

    // Csak admin és super_admin férhet hozzá ehhez az API-hoz
    if (user.role?.role_name !== 'admin' && user.role?.role_name !== 'super_admin') {
      console.log('Kurzus adatok API - jogosultság elutasítva');
      return NextResponse.json({ error: 'Nincs megfelelő jogosultság' }, { status: 403 });
    }

    try {
      console.log('Kurzus adatok API - kurzus lekérdezése Prisma-val');
      
      // Ellenőrizzük, hogy a Prisma kliens megfelelően inicializálódott-e
      if (!prisma) {
        console.error('Kurzus adatok API - Prisma kliens nem elérhető!');
        return NextResponse.json({ 
          error: 'Adatbázis kapcsolódási hiba', 
          detail: 'Prisma kliens nem inicializálódott'
        }, { status: 500 });
      }

      const courseId = params.id;
      if (!courseId) {
        console.error('Kurzus adatok API - Kurzus azonosító hiányzik');
        return NextResponse.json({ error: 'Kurzus azonosító hiányzik' }, { status: 400 });
      }

      // Kurzus lekérdezése
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
      });

      if (!course) {
        console.log('Kurzus adatok API - Kurzus nem található', { courseId });
        return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
      }

      // Beiratkozások lekérdezése külön lépésben
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: parseInt(courseId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      console.log('Kurzus adatok API - sikeres lekérdezés', { 
        courseId, 
        enrollmentsCount: enrollments.length 
      });

      // Visszaadjuk a kurzust a beiratkozásokkal
      return NextResponse.json({
        ...course,
        enrollments: enrollments
      });
    } catch (prismaError) {
      console.error('Kurzus adatok API - Prisma hiba:', prismaError);
      console.error('Kurzus adatok API - Hibaüzenet:', 
        prismaError instanceof Error ? prismaError.message : 'Ismeretlen hiba');
      
      return NextResponse.json({ 
        error: 'Adatbázis hiba', 
        detail: prismaError instanceof Error ? prismaError.message : 'Ismeretlen hiba',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Kurzus adatok API - Általános hiba:', error);
    console.error('Kurzus adatok API - Hibaüzenet:', 
      error instanceof Error ? error.message : 'Ismeretlen hiba');
    
    return NextResponse.json({ 
      error: 'Szerver hiba történt', 
      detail: error instanceof Error ? error.message : 'Ismeretlen hiba',
    }, { status: 500 });
  }
}

// Kurzus törlése
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Nincs bejelentkezve!' }), { status: 401 });
    }

    // Role ellenőrzés - csak admin és a kurzus tulajdonosa (teacher) törölhet
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Felhasználó nem található!' }), { status: 404 });
    }

    const courseId = parseInt(params.id, 10);
    if (isNaN(courseId)) {
      return new NextResponse(JSON.stringify({ error: 'Érvénytelen kurzus azonosító!' }), { status: 400 });
    }

    // Kurzus lekérdezése
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return new NextResponse(JSON.stringify({ error: 'A kurzus nem található!' }), { status: 404 });
    }

    // Ellenőrzés, hogy a felhasználó admin vagy a kurzus tulajdonosa-e
    if (user.role.role_name !== 'admin' && course.email !== user.email) {
      return new NextResponse(JSON.stringify({ error: 'Nincs jogosultságod törölni ezt a kurzust!' }), { status: 403 });
    }

    // Kurzus törlése
    await prisma.course.delete({
      where: { id: courseId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Hiba a kurzus törlése közben:', error);
    return new NextResponse(JSON.stringify({ error: 'Szerver hiba történt!' }), { status: 500 });
  }
} 