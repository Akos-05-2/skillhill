import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const courseId = parseInt(params.id);
        
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'A kurzus nem található' }, { status: 404 });
        }

        // Átalakítjuk a választ a frontend által várt formátumra
        const formattedCourse = {
            id: course.id,
            name: course.name,
            description: course.description,
            category: {
                category_id: course.category.id,
                category_name: course.category.name
            }
        };

        return NextResponse.json(formattedCourse);
    } catch (error) {
        console.error('Hiba a kurzus lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a kurzus lekérése során' },
            { status: 500 }
        );
    }
}