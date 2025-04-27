import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Enrollment } from '@/app/types';

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const courseId = parseInt(body.courseId);

        if (!courseId || isNaN(courseId)) {
            return NextResponse.json(
                { error: 'Érvénytelen kurzus azonosító' },
                { status: 400 }
            );
        }

        
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json(
                { error: 'A kurzus nem található' },
                { status: 404 }
            );
        }

        
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                email: req.auth.user.email ?? '',
                courseId: courseId
            }
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { error: 'Már beiratkoztál erre a kurzusra' },
                { status: 400 }
            );
        }

        
        const enrollment = await prisma.enrollment.create({
            data: {
                email: req.auth.user.email ?? '',
                courseId: courseId
            },
            include: {
                course: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return NextResponse.json(enrollment);
    } catch (error) {
        console.error('Hiba történt a beiratkozás során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a beiratkozás során' },
            { status: 500 }
        );
    }
});

export const GET = auth(async function GET(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
        }

        
        const enrollments = await prisma.enrollment.findMany({
            where: {
                email: req.auth.user.email ?? ''
            },
            include: {
                course: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return NextResponse.json(enrollments);
    } catch (error) {
        console.error('Hiba történt a beiratkozások lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a beiratkozások lekérése során' },
            { status: 500 }
        );
    }
});

export const DELETE = auth(async function DELETE(req: NextRequest & { auth: any }) {
    if (!req.auth){
        return NextResponse.json({error: 'Nem található felhasználó!'}, {status: 404});
    }
    try{
        const {course_id} =  await req.json();
        if (!course_id){
            console.error('Nincs megadott kurzus azonosító!');
            return NextResponse.json({error: 'Nincs megadott kurzus azonosító!'}, {status: 404});
        }
        const enrollment = await prisma.enrollment.findMany({
            where: {
                email: req.auth.user.email ?? '',
                courseId: course_id
            },
            select: {
                id: true
            }
        });
        const enrollment_id = enrollment[0]?.id;
        if (enrollment_id) {
            await prisma.enrollment.delete({
                where: {
                    id: enrollment_id
                }
            });
        }
        return NextResponse.json({message: 'Beiratkozás sikeresen törölve'}, {status: 200});
    }catch{
        console.error('Hiba a csatlakozás során!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
})