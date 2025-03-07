import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.roleId !== 4 && session.user.roleId !== 5)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get target user's current role
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    if (!targetUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Only superadmins can modify admins
    if ((targetUser.roleId === 4 || targetUser.roleId === 5) && session.user.roleId !== 5) {
      return new NextResponse('Unauthorized to modify admin users', { status: 403 });
    }

    // Prevent non-superadmins from creating superadmins
    if (session.user.roleId !== 5 && roleId === 5) {
      return new NextResponse('Unauthorized to create superadmin', { status: 403 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { roleId },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        image: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('Missing user ID', { status: 400 });
    }

    // Get target user's current role
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    if (!targetUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Only superadmins can delete admins
    if ((targetUser.roleId === 4 || targetUser.roleId === 5) && session.user.roleId !== 5) {
      return new NextResponse('Unauthorized to delete admin users', { status: 403 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
