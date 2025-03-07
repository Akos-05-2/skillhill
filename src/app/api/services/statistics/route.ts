import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Kurzusok lekérése
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isActive: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      courses,
      success: true
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', success: false },
      { status: 500 }
    );
  }
}
