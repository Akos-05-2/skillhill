import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { role: true }
        });

        if (!user || !user.role || !user.email) {
            return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
        }

        const allowedRoles = ['teacher', 'admin', 'super_admin'];
        if (!allowedRoles.includes(user.role.role_name)) {
            return NextResponse.json({ error: 'Nincs jogosultságod' }, { status: 403 });
        }

        const courses = await prisma.course.findMany({
            where: {
                email: user.email
            },
            include: {
                category: true,
                modules: true,
                enrollments: true
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Hiba a kurzusok lekérése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a kurzusok lekérése során' },
            { status: 500 }
        );
    }
} 