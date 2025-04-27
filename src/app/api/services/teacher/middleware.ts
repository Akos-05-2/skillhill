import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface CustomUser {
    id: string;
    email: string;
    name: string;
    role: {
        role_name: string;
    };
}

interface CustomSession {
    user?: CustomUser;
}

export async function validateTeacherAccess(req: Request) {
    const session = await auth() as CustomSession | null;

    if (!session?.user) {
        return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
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

    return { user };
}

export const config = {
    matcher: '/api/services/teacher/:path*'
}; 