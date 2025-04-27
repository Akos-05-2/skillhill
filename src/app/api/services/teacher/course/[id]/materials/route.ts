import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Module {
    id: number;
    name: string;
    materials: {
        id: number;
        files: {
            id: number;
            name: string;
            materialId: number | null;
            submissionId: string | null;
            assignmentId: string | null;
        }[];
    }[];
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

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

        const modules = await prisma.courseModule.findMany({
            where: {
                courseId: courseId
            },
            include: {
                materials: {
                    include: {
                        files: true
                    }
                }
            }
        });

        const formattedModules = modules.map((module: Module) => ({
            id: module.id,
            name: module.name,
            materials: module.materials.map((material: any) => ({
                id: material.id,
                file: material.files[0] ? {
                    id: material.files[0].id,
                    name: material.files[0].name,
                    url: `/uploads/${material.files[0].name}`,
                    size: 0,
                    type: 'Other',
                    createdAt: new Date().toISOString()
                } : null
            })).filter(material => material.file !== null)
        }));

        return NextResponse.json(formattedModules);
    } catch (error) {
        console.error('Hiba a modulok betöltésekor:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a modulok betöltésekor',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
} 