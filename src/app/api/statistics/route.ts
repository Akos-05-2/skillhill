import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Összesített statisztikák lekérése
    const [
      totalCourses,
      activeCourses,
      totalUsers,
      totalTeachers,
      totalStudents,
      courseStats
    ] = await Promise.all([
      // Összes kurzus száma
      prisma.courses.count(),
      
      // Aktív kurzusok száma
      prisma.courses.count({
        where: { isActive: true }
      }),
      
      // Összes felhasználó száma
      prisma.user.count(),
      
      // Tanárok száma (roleId: 3)
      prisma.user.count({
        where: { roleId: 3 }
      }),
      
      // Diákok száma (roleId: 1)
      prisma.user.count({
        where: { roleId: 1 }
      }),
      
      // Kurzusonkénti statisztikák
      prisma.courses.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              students: true
            }
          }
        },
        orderBy: {
          students: {
            _count: 'desc'
          }
        },
        take: 5 // Top 5 legnépszerűbb kurzus
      })
    ]);

    const statistics = {
      overview: {
        totalCourses,
        activeCourses,
        inactiveCourses: totalCourses - activeCourses,
        totalUsers,
        totalTeachers,
        totalStudents,
        averageStudentsPerCourse: totalCourses > 0 
          ? Math.round((totalStudents / totalCourses) * 10) / 10 
          : 0
      },
      topCourses: courseStats.map(course => ({
        id: course.id,
        name: course.name,
        studentCount: course._count.students
      }))
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
