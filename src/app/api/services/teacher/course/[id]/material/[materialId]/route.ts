import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface CourseMaterial {
    id: number;
    courseId: number;
    moduleId: number | null;
    files: {
        id: number;
        name: string;
        materialId: number | null;
    }[];
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; materialId: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        const materialId = parseInt(params.materialId);
        
        if (isNaN(courseId) || isNaN(materialId)) {
            return NextResponse.json({ error: 'Érvénytelen azonosító' }, { status: 400 });
        }

        // Ellenőrizzük, hogy a felhasználó tanár-e és hozzáfér-e a kurzushoz
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { role: true }
        });

        if (!user || !user.role) {
            return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
        }

        if (!['teacher', 'admin', 'super_admin'].includes(user.role.role_name)) {
            return NextResponse.json({ error: 'Nincs megfelelő jogosultság' }, { status: 403 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
        }

        if (user.role.role_name === 'teacher' && user.email !== course.email) {
            return NextResponse.json({ error: 'Nincs jogosultság ehhez a kurzushoz' }, { status: 403 });
        }

        // Töröljük a material-t és a hozzá tartozó fájlt
        const material = await prisma.courseMaterial.findUnique({
            where: { id: materialId },
            include: { files: true }
        });

        if (!material) {
            return NextResponse.json({ error: 'Anyag nem található' }, { status: 404 });
        }

        // Töröljük a material-t
        await prisma.courseMaterial.delete({
            where: { id: materialId }
        });

        // Töröljük a fájlokat is
        for (const file of material.files) {
            await prisma.file.delete({
                where: { id: file.id }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Hiba a material törlésekor:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a material törlésekor',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
} 