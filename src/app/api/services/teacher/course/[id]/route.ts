import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// A kurzus részletes adatait adja vissza, beleértve a beiratkozásokat is
export const GET = auth(async function GET(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.url.split('/').pop() || '');
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        // Ellenőrizzük, hogy a felhasználó tanár-e és hozzáfér-e a kurzushoz
        const user = await prisma.user.findUnique({
            where: { id: req.auth.user.id },
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

        return NextResponse.json({
            id: course.id,
            name: course.name,
            description: course.description,
            isActive: course.isActive || false
        });
    } catch (error) {
        console.error('Hiba a kurzus betöltésekor:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a kurzus betöltésekor',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
})

export const PUT = auth(async function PUT(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.url.split('/').pop() || '');
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        // Ellenőrizzük, hogy a felhasználó tanár-e és hozzáfér-e a kurzushoz
        const user = await prisma.user.findUnique({
            where: { id: req.auth.user.id },
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

        const body = await req.json();
        const { name, description, isActive } = body;

        if (!name || !description) {
            return NextResponse.json({ error: 'A név és a leírás megadása kötelező' }, { status: 400 });
        }

        try {
            const updatedCourse = await prisma.course.update({
                where: { id: courseId },
                data: {
                    name,
                    description,
                    isActive: isActive === undefined ? (course as any).isActive : isActive
                }
            });

            return NextResponse.json({
                id: updatedCourse.id,
                name: updatedCourse.name,
                description: updatedCourse.description,
                isActive: (updatedCourse as any).isActive
            });
        } catch (prismaError) {
            console.error('Prisma hiba a kurzus frissítésekor:', prismaError);
            return NextResponse.json({ 
                error: 'Adatbázis hiba a kurzus frissítésekor',
                details: prismaError instanceof Error ? prismaError.message : 'Ismeretlen Prisma hiba'
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Hiba a kurzus frissítésekor:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a kurzus frissítésekor',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
})

export const DELETE = auth(async function DELETE(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.url.split('/').pop() || '');
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.auth.user.id },
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

        // Töröljük a kurzus fájljait
        const courseMaterialsPath = path.join(process.cwd(), 'public', 'course_materials', courseId.toString());
        if (fs.existsSync(courseMaterialsPath)) {
            fs.rmSync(courseMaterialsPath, { recursive: true, force: true });
        }

        // Töröljük a kurzus adatait az adatbázisból
        await prisma.$transaction([
            // Töröljük a beiratkozásokat
            prisma.enrollment.deleteMany({
                where: { courseId }
            }),
            // Töröljük a modul erőforrásokat
            prisma.moduleResource.deleteMany({
                where: {
                    module: {
                        courseId
                    }
                }
            }),
            // Töröljük a modulokat
            prisma.courseModule.deleteMany({
                where: { courseId }
            }),
            // Töröljük a kurzus anyagokat
            prisma.courseMaterial.deleteMany({
                where: { courseId }
            }),
            // Végül töröljük a kurzust
            prisma.course.delete({
                where: { id: courseId }
            })
        ]);

        return NextResponse.json({ message: 'Kurzus sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a kurzus törlése közben:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a kurzus törlése közben',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
}) 