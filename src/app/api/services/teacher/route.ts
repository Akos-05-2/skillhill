import { NextRequest, NextResponse } from 'next/server';
import { 
    TeacherRequest, 
    CourseCreateBody, 
    CourseUpdateBody, 
    CourseWithStats 
} from './types';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; 
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

interface Course {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    email: string;
    enrollments: any[];
    category: any;
}

export const GET = auth(async function GET(req: NextRequest & { auth: any }) {
    if (!req.auth?.user?.email) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            where: {
                email: req.auth.user.email
            },
            include: {
                category: true,
                enrollments: true
            }
        });

        const coursesWithStats = courses.map((course: Course) => ({
            ...course,
            is_active: true, 
            enrollment_count: course.enrollments.length
        }));

        return NextResponse.json(coursesWithStats);
    } catch (error) {
        console.error('Hiba történt a kurzusok lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a kurzusok lekérése során' },
            { status: 500 }
        );
    }
});

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
    if (!req.auth?.user?.email) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: req.auth.user.email },
        include: { role: true }
    });

    try {
        const formData = await req.formData();
        const course_name = formData.get('course_name') as string;
        const description = formData.get('description') as string;
        const category_id = parseInt(formData.get('category_id') as string);
        const image = formData.get('image') as File;

        if (!course_name || !description || !category_id) {
            return NextResponse.json({ 
                error: 'Hiányzó adatok: kurzus név, leírás és kategória kötelező' 
            }, { status: 400 });
        }

        let imagePath = null;
        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = 'public/uploads';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const uniqueFilename = `${Date.now()}-${image.name}`;
            const filePath = path.join(uploadDir, uniqueFilename);
            
            await writeFile(filePath, buffer);
            imagePath = `/uploads/${uniqueFilename}`;
        }

        const course = await prisma.course.create({
            data: {
                name: course_name,
                description,
                categoryId: category_id,
                email: req.auth.user.email,
                image: imagePath
            },
            include: {
                category: true
            }
        });

        return NextResponse.json({
            message: 'Kurzus sikeresen létrehozva',
            course: course
        });
    } catch (error) {
        console.error('Hiba történt a kurzus létrehozása során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a kurzus létrehozása során' },
            { status: 500 }
        );
    }
});

export const PUT = auth(async function PUT(req: NextRequest & { auth: any }) {
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

        const body = await req.json() as CourseUpdateBody;
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
        const { searchParams } = new URL(req.url);
        const course_id = parseInt(searchParams.get('course_id') || '');

        if (!course_id || isNaN(course_id)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const existingCourse = await prisma.course.findUnique({
            where: { id: course_id }
        });

        if (!existingCourse) {
            return NextResponse.json({ error: 'A kurzus nem található' }, { status: 404 });
        }

        await prisma.course.delete({
            where: { id: course_id }
        });

        return NextResponse.json({ message: 'Kurzus sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a kurzus törlése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a kurzus törlése során' },
            { status: 500 }
        );
    }
})