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

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const isActive = searchParams.get('isActive') === 'true';

    let whereClause: any = {};

    if (searchTerm) {
      whereClause.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        {
          teacher: {
            name: { contains: searchTerm, mode: 'insensitive' }
          }
        }
      ];
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    const courses = await prisma.courses.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        enrollment: true
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      teacherId: course.teacherId,
      isActive: course.isActive,
      createdAt: course.createdAt,
      teacher: course.teacher,
      _count: {
        students: course.enrollment.length
      }
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 3 && session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description, teacherId, isActive = true } = body;

    if (!name || !description || !teacherId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Ellenőrizzük, hogy a megadott tanár létezik-e és tényleg tanár-e
    const teacher = await prisma.user.findFirst({
      where: { 
        id: teacherId,
        roleId: 3 // Tanár szerepkör
      }
    });

    if (!teacher) {
      return new NextResponse('Invalid teacher ID', { status: 400 });
    }

    const course = await prisma.courses.create({
      data: {
        name,
        description,
        teacherId,
        isActive
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        enrollment: true
      }
    });

    const formattedCourse = {
      ...course,
      _count: {
        students: course.enrollment.length
      }
    };
    delete formattedCourse.enrollment;

    return NextResponse.json(formattedCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 3 && session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { courseId, name, description, teacherId, isActive } = body;

    if (!courseId || !name || !description || !teacherId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Ellenőrizzük, hogy a megadott tanár létezik-e és tényleg tanár-e
    const teacher = await prisma.user.findFirst({
      where: { 
        id: teacherId,
        roleId: 3 // Tanár szerepkör
      }
    });

    if (!teacher) {
      return new NextResponse('Invalid teacher ID', { status: 400 });
    }

    // Ellenőrizzük a kurzus tulajdonosát
    const existingCourse = await prisma.courses.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });

    if (!existingCourse) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Csak a kurzus tanára, adminok és szuperadminok módosíthatják
    if (existingCourse.teacherId !== session.user.id && session.user.roleId !== 4 && session.user.roleId !== 5) {
      return new NextResponse('Unauthorized to modify this course', { status: 403 });
    }

    const course = await prisma.courses.update({
      where: { id: courseId },
      data: { 
        name, 
        description, 
        teacherId,
        isActive
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        enrollment: true
      }
    });

    const formattedCourse = {
      ...course,
      _count: {
        students: course.enrollment.length
      }
    };
    delete formattedCourse.enrollment;

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');

    if (!courseId) {
      return new NextResponse('Missing course ID', { status: 400 });
    }

    await prisma.courses.delete({
      where: { id: courseId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}