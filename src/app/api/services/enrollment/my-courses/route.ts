import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Enrollment {
    course: {
        id: number;
        name: string;
        description: string;
        image: string | null;
    };
}

export const GET = auth(async function GET(req: {auth: any}) {
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }

    try {
        const email = req.auth.user?.email;

        const enrollments = await prisma.enrollment.findMany({
            where: {
                email: email
            },
            include: {
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        image: true
                    }
                }
            }
        });

        const courses = enrollments.map((enrollment: Enrollment) => ({
            course_id: enrollment.course.id,
            course_name: enrollment.course.name,
            description: enrollment.course.description,
            image: enrollment.course.image
        }));

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Hiba a kurzusok lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba a kurzusok lekérése során' },
            { status: 500 }
        );
    }
}); 