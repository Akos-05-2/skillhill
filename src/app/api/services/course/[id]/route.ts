import { Module, Material } from '@/app/types';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req: any, ctx: any) {
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }

    try {
        const id = ctx.params?.id;
        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const courseId = parseInt(id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        // Ellenőrizzük, hogy a felhasználó jelentkezett-e a kurzusra
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                email: req.auth.user?.email ?? '',
                courseId: courseId
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Nem vagy jelentkezve erre a kurzusra' }, { status: 403 });
        }

        // Lekérjük a kurzus adatait
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                modules: {
                    include: {
                        materials: {
                            include: {
                                files: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'A kurzus nem található' }, { status: 404 });
        }

        // Összeállítjuk a választ
        const response = {
            id: course.id,
            name: course.name,
            description: course.description,
            category: {
                category_name: course.category.name
            },
            modules: course.modules.map((module: any) => ({
                id: module.id,
                title: module.name,
                description: module.description || '',
                materials: module.materials?.map((material: any) => {
                    const file = material.files && material.files.length > 0 ? material.files[0] : null;
                    return {
                        id: material.id,
                        title: file?.name || 'Névtelen anyag',
                        type: 'document',
                        completed: false,
                        description: '',
                        file: file ? {
                            id: file.id,
                            name: file.name,
                            url: `/api/services/course/${course.id}/file/${file.id}`
                        } : undefined
                    };
                }) || []
            })) || []
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Hiba a kurzus lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba a kurzus lekérése során' },
            { status: 500 }
        );
    }
}); 