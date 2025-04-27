import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@/app/types'

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    console.log('Fetching categories for admin...');
    const categories = await prisma.category.findMany({
      include: {
        courses: true
      }
    });

    const formattedCategories = categories.map((category: Category) => ({
      id: category.id,
      name: category.name,
      courseCount: category.courses.length
    }));
      
    console.log('Formatted categories:', JSON.stringify(formattedCategories, null, 2));
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Hiba a kategóriák lekérése során:', error);
    return NextResponse.json(
      { error: "Hiba a kategóriák lekérése során" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Ellenőrizzük a jogosultságot
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    // Kiolvassuk a kategória ID-t az URL-ből
    const segments = req.url.split('/');
    const categoryId = segments[segments.length - 1];

    if (!categoryId || isNaN(parseInt(categoryId))) {
      return NextResponse.json(
        { error: "Érvénytelen kategória azonosító" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy van-e kurzus a kategóriában
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
      include: { courses: true }
    });

    if (!category) {
      return NextResponse.json(
        { error: "A kategória nem található" },
        { status: 404 }
      );
    }

    if (category.courses.length > 0) {
      return NextResponse.json(
        { error: "A kategória nem törölhető, mert vannak hozzá tartozó kurzusok" },
        { status: 400 }
      );
    }

    // Töröljük a kategóriát
    await prisma.category.delete({
      where: { id: parseInt(categoryId) }
    });

    return NextResponse.json({ 
      success: true,
      message: "Kategória sikeresen törölve" 
    });
  } catch (error) {
    console.error('Hiba a kategória törlése során:', error);
    return NextResponse.json(
      { error: "Hiba a kategória törlése során" },
      { status: 500 }
    );
  }
}