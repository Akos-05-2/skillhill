import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
        }

        if (course.email !== session.user.email) {
            return NextResponse.json({ error: 'Nincs jogosultság ehhez a kurzushoz' }, { status: 403 });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        const students = enrollments.map(enrollment => ({
            id: enrollment.user.id,
            name: enrollment.user.name,
            email: enrollment.user.email,
            enrollmentId: enrollment.id
        }));

        return NextResponse.json(students);
    } catch (error) {
        console.error('Hiba a diákok lekérdezése közben:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a diákok lekérdezése közben',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Kurzus nem található' }, { status: 404 });
        }

        if (course.email !== session.user.email) {
            return NextResponse.json({ error: 'Nincs jogosultság ehhez a kurzushoz' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const enrollmentId = parseInt(searchParams.get('enrollmentId') || '');

        if (!enrollmentId || isNaN(enrollmentId)) {
            return NextResponse.json({ error: 'Érvénytelen beiratkozás azonosító' }, { status: 400 });
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                id: enrollmentId,
                courseId: courseId
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Beiratkozás nem található' }, { status: 404 });
        }

        await prisma.enrollment.delete({
            where: { id: enrollmentId }
        });

        return NextResponse.json({ message: 'Diák sikeresen eltávolítva a kurzusról' });
    } catch (error) {
        console.error('Hiba a diák eltávolítása közben:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
} 