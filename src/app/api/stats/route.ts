import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [
      totalUsers,
      students,
      teachers,
      admins,
      totalCourses,
      activeCourses,
      coursesWithStudents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { roleId: 2 } }),
      prisma.user.count({ where: { roleId: 3 } }),
      prisma.user.count({ where: { roleId: { in: [4, 5] } } }),
      prisma.courses.count(),
      prisma.courses.count({ where: { isActive: true } }),
      prisma.courses.count({
        where: {
          students: {
            some: {}
          }
        }
      })
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        students,
        teachers,
        admins,
      },
      courses: {
        total: totalCourses,
        active: activeCourses,
        withStudents: coursesWithStudents,
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
