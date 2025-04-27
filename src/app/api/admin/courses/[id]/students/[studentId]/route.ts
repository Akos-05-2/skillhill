import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// DELETE - Beiratkozott tanuló eltávolítása a kurzusról
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, studentId: string } }
) {
  try {
    console.log('Tanuló eltávolítás API - kérés fogadva', { 
      courseId: params.id,
      studentId: params.studentId 
    });
    
    // Használjuk a beépített auth funkciót
    const session = await auth();
    console.log('Tanuló eltávolítás API - session adatok:', {
      sessionExists: !!session,
      userExists: !!session?.user
    });
    
    if (!session?.user) {
      console.log('Tanuló eltávolítás API - nincs bejelentkezve');
      return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
    }
    
    // Lekérjük a felhasználó adatait a szerepkörével együtt
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true }
    });
    
    console.log('Tanuló eltávolítás API - felhasználó adatok:', {
      userExists: !!user,
      userRole: user?.role?.role_name
    });

    if (!user) {
      console.log('Tanuló eltávolítás API - felhasználó nem található');
      return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
    }

    // Csak admin és super_admin férhet hozzá ehhez az API-hoz
    if (user.role?.role_name !== 'admin' && user.role?.role_name !== 'super_admin') {
      console.log('Tanuló eltávolítás API - jogosultság elutasítva');
      return NextResponse.json({ error: 'Nincs megfelelő jogosultság' }, { status: 403 });
    }

    try {
      console.log('Tanuló eltávolítás API - Prisma művelet indítása');
      
      // Ellenőrizzük, hogy a Prisma kliens megfelelően inicializálódott-e
      if (!prisma) {
        console.error('Tanuló eltávolítás API - Prisma kliens nem elérhető!');
        return NextResponse.json({ 
          error: 'Adatbázis kapcsolódási hiba', 
          detail: 'Prisma kliens nem inicializálódott'
        }, { status: 500 });
      }

      const courseId = params.id;
      const studentId = params.studentId;
      
      if (!courseId || !studentId) {
        console.error('Tanuló eltávolítás API - Hiányzó paraméter');
        return NextResponse.json({ 
          error: 'Hiányzó paraméter', 
          detail: 'Kurzus ID vagy Tanuló ID hiányzik'
        }, { status: 400 });
      }

      // Ellenőrizzük, hogy létezik-e a kurzus
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) }
      });

      if (!course) {
        console.log('Tanuló eltávolítás API - Kurzus nem található', { courseId });
        return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
      }

      // Ellenőrizzük, hogy létezik-e a felhasználó
      const student = await prisma.user.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        console.log('Tanuló eltávolítás API - Tanuló nem található', { studentId });
        return NextResponse.json({ error: 'Tanuló nem található' }, { status: 404 });
      }

      // Ellenőrizzük, hogy létezik-e a beiratkozás
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          courseId: parseInt(courseId),
          user: {
            id: studentId
          }
        }
      });

      if (!enrollment) {
        console.log('Tanuló eltávolítás API - Beiratkozás nem található', { 
          courseId, 
          studentId 
        });
        return NextResponse.json({ 
          error: 'Beiratkozás nem található', 
          detail: 'A tanuló nem iratkozott be erre a kurzusra'
        }, { status: 404 });
      }

      // Beiratkozás törlése
      const deletedEnrollment = await prisma.enrollment.delete({
        where: { id: enrollment.id }
      });

      console.log('Tanuló eltávolítás API - Sikeres törlés', { 
        enrollmentId: deletedEnrollment.id,
        courseId,
        studentId
      });

      // Sikeres válasz
      return NextResponse.json({ 
        message: 'Tanuló sikeresen eltávolítva a kurzusról',
        deletedEnrollment
      });
    } catch (prismaError) {
      console.error('Tanuló eltávolítás API - Prisma hiba:', prismaError);
      console.error('Tanuló eltávolítás API - Hibaüzenet:', 
        prismaError instanceof Error ? prismaError.message : 'Ismeretlen hiba');
      
      return NextResponse.json({ 
        error: 'Adatbázis hiba', 
        detail: prismaError instanceof Error ? prismaError.message : 'Ismeretlen hiba',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Tanuló eltávolítás API - Általános hiba:', error);
    console.error('Tanuló eltávolítás API - Hibaüzenet:', 
      error instanceof Error ? error.message : 'Ismeretlen hiba');
    
    return NextResponse.json({ 
      error: 'Szerver hiba történt', 
      detail: error instanceof Error ? error.message : 'Ismeretlen hiba',
    }, { status: 500 });
  }
} 