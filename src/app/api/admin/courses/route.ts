import { auth } from '../../../../auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Course } from '@/app/types'
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, teacherId, categoryId } = await request.json();
    const teacher = await prisma.user.findUnique({
        where: {
            id: teacherId,
        },
    });

    if (!teacher) {
        return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }
    const email = teacher.email;
    
    const course = await prisma.course.create({
        data: {
            name,
            description,
            email: email!,
            categoryId: parseInt(categoryId),
        },  
    });

    return NextResponse.json(course, { status: 201 });
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    console.log('Fetching courses for admin...');
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        enrollments: {
          select: {
            id: true,
            enrolledAt: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log('Raw courses from database:', JSON.stringify(courses, null, 2));

    if (!courses || courses.length === 0) {
      console.log('No courses found');
      return NextResponse.json([]);
    }

    const formattedAdminCourses = courses.map((course: any) => {
      return {
        id: course.id,
        name: course.name,
        description: course.description,
        createdAt: course.createdAt.toISOString(),
        category: {
          name: course.category?.name || 'Kategória nélkül'
        },
        user: {
          name: course.user?.name || 'Ismeretlen oktató',
          email: course.user?.email
        },
        enrollments: course.enrollments?.map((enrollment: any) => ({
          id: enrollment.id,
          enrolledAt: enrollment.enrolledAt.toISOString(),
          user: {
            name: enrollment.user?.name || null,
            email: enrollment.user?.email
          }
        })) || []
      };
    });
    
    console.log('Formatted admin courses:', JSON.stringify(formattedAdminCourses, null, 2));
    return NextResponse.json(formattedAdminCourses);
  } catch (error) {
    console.error('Hiba a kurzusok lekérése során:', error);
    return NextResponse.json(
      { error: "Hiba a kurzusok lekérése során" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const courseId = url.pathname.split('/').pop();

    if (!courseId) {
      return NextResponse.json(
        { error: "Hiányzó kurzus azonosító" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    await prisma.course.delete({
      where: {
        id: parseInt(courseId)
      }
    });

    return NextResponse.json({ message: "Kurzus sikeresen törölve" });
  } catch (error) {
    console.error('Hiba a kurzus törlése során:', error);
    return NextResponse.json(
      { error: "Hiba a kurzus törlése során" },
      { status: 500 }
    );
  }
}
