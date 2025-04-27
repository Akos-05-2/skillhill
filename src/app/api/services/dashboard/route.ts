import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    const session = await auth();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Nincs bejelentkezve!' }), { status: 401 });
    }

    // Lekérjük a felhasználót a szerepkörrel együtt
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true, enrollments: true }
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Felhasználó nem található!' }), { status: 404 });
    }

    // Ha nincs email, nem tudunk adatokat lekérdezni
    if (!user.email) {
      return new NextResponse(JSON.stringify({ error: 'Hibás felhasználói adatok: hiányzó email!' }), { status: 400 });
    }

    // Alap válasz, amit minden felhasználó megkap
    const response: any = {
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.role_name
      }
    };

    // Szerepkör alapján további adatok hozzáadása
    switch (user.role.role_name) {
      case 'super_admin':
      case 'admin':
        // Admin statisztikák
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();
        const enrollmentCount = await prisma.enrollment.count();
        
        response.stats = {
          userCount,
          courseCount,
          enrollmentCount,
          lastLogin: new Date().toISOString()
        };
        
        // Legújabb felhasználók
        response.latestUsers = await prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: { select: { role_name: true } }
          }
        });
        break;
        
      case 'teacher':
        // Tanár kurzusai
        response.courses = await prisma.course.findMany({
          where: {
            email: user.email // A Course modellben az email mező kapcsolódik a User email mezőjéhez
          },
          include: {
            enrollments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            },
            category: true
          }
        });
        
        // Tanári statisztikák
        const studentCount = await prisma.enrollment.count({
          where: {
            course: {
              email: user.email
            }
          }
        });
        
        response.stats = {
          courseCount: response.courses.length,
          studentCount,
          averageStudentsPerCourse: response.courses.length ? studentCount / response.courses.length : 0
        };
        break;
        
      case 'user':
        // Hallgató beiratkozott kurzusai
        response.enrolledCourses = await prisma.enrollment.findMany({
          where: {
            email: user.email
          },
          include: {
            course: {
              include: {
                user: true, // Ez a tanár a Course modellben
                category: true
              }
            }
          }
        });
        
        // Elérhető kurzusok (amelyekre még nem iratkozott be)
        response.availableCourses = await prisma.course.findMany({
          where: {
            enrollments: {
              none: {
                email: user.email
              }
            }
          },
          include: {
            user: true, // Ez a tanár a Course modellben
            category: true
          },
          take: 5 // Csak néhányat mutatunk
        });
        
        // Hallgatói statisztikák
        response.stats = {
          enrolledCourseCount: response.enrolledCourses.length,
          completedLessons: 0, // Itt lehetne követni az elvégzett leckéket
          lastAccess: new Date().toISOString()
        };
        break;
    }

    return new NextResponse(JSON.stringify(response));
  } catch (error) {
    console.error('Hiba a dashboard adatok lekérése közben:', error);
    return new NextResponse(JSON.stringify({ error: 'Szerver hiba történt!' }), { status: 500 });
  }
} 