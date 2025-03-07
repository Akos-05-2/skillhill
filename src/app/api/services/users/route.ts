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
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let whereClause: any = {};
    
    if (role) {
      whereClause.roleId = parseInt(role);
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        image: true,
        role: {
          select: {
            role_name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      roleId: user.roleId,
      image: user.image || '',
      roleName: user.role.role_name
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
