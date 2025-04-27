import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const GET = auth(async function GET(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.nextUrl.pathname.split('/')[5]);
        const moduleId = parseInt(req.nextUrl.pathname.split('/')[7]);

        if (isNaN(courseId) || isNaN(moduleId)) {
            return NextResponse.json({ error: 'Érvénytelen azonosító' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
        }

        if (course.email !== req.auth.user.email) {
            return NextResponse.json({ error: 'Nincs jogosultság ehhez a kurzushoz' }, { status: 403 });
        }

        const module = await prisma.courseModule.findUnique({
            where: { id: moduleId }
        });

        if (!module || module.courseId !== courseId) {
            return NextResponse.json({ error: 'Modul nem található' }, { status: 404 });
        }

        const moduleResources = await prisma.moduleResource.findMany({
            where: { moduleId },
            include: {
                file: true
            }
        });

        const files = moduleResources.map((resource: any) => ({
            id: resource.file.id,
            name: resource.file.name,
            url: `/uploads/${resource.file.name}`,
            createdAt: resource.file.created_at
        }));

        return NextResponse.json(files);
    } catch (error) {
        console.error('Hiba a fájlok lekérdezése közben:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
})

export const DELETE = auth(async function DELETE(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.nextUrl.pathname.split('/')[5]);
        const moduleId = parseInt(req.nextUrl.pathname.split('/')[7]);

        if (isNaN(courseId) || isNaN(moduleId)) {
            return NextResponse.json({ error: 'Érvénytelen azonosító' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
        }

        if (course.email !== req.auth.user.email) {
            return NextResponse.json({ error: 'Nincs jogosultság ehhez a kurzushoz' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const fileId = parseInt(searchParams.get('fileId') || '');

        if (!fileId || isNaN(fileId)) {
            return NextResponse.json({ error: 'Érvénytelen fájl azonosító' }, { status: 400 });
        }

        const moduleResource = await prisma.moduleResource.findFirst({
            where: {
                moduleId,
                fileId
            }
        });

        if (!moduleResource) {
            return NextResponse.json({ error: 'Fájl nem található a modulban' }, { status: 404 });
        }

        await prisma.moduleResource.delete({
            where: { id: moduleResource.id }
        });

        await prisma.file.delete({
            where: { id: fileId }
        });

        return NextResponse.json({ message: 'Fájl sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a fájl törlése közben:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
})