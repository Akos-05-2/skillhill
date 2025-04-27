import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        const formattedCategories = categories.map((category: { id: number, name: string }) => ({
            category_id: category.id,
            category_name: category.name
        }));

        return NextResponse.json(formattedCategories);
    } catch (error) {
        console.error('Hiba a kategóriák lekérése során:', error);
        return NextResponse.json({ error: 'Hiba történt a kategóriák betöltése során' }, { status: 500 });
    }
}