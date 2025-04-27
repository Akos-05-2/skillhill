import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Debug: Ellenőrizzük a Prisma objektumot
console.log('Prisma objektum:', prisma);
console.log('Prisma courseModule:', prisma?.courseModule);

// Közös segédfüggvények a jogosultság-ellenőrzéshez
async function validateTeacherAccess(userId: string, courseId: number) {
    // Felhasználó jogosultságainak ellenőrzése
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
    });

    if (!user || !user.role) {
        return { error: 'Felhasználó nem található vagy nincs szerepköre', status: 404 };
    }

    // Csak tanár, admin vagy super_admin férhet hozzá
    if (!['teacher', 'admin', 'super_admin'].includes(user.role.role_name)) {
        return { error: 'Nincs megfelelő jogosultság', status: 403 };
    }

    // Ellenőrizzük, hogy a kurzus létezik
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        return { error: 'Kurzus nem található', status: 404 };
    }

    // Ellenőrizzük, hogy a felhasználó jogosult-e a kurzus adataihoz (ha tanár)
    if (user.role.role_name === 'teacher' && user.email !== course.email) {
        return { error: 'Nincs jogosultság ehhez a kurzushoz', status: 403 };
    }

    return { user, course };
}

// Alternatív Prisma kliens létrehozása, ha az eredeti nem működik
const newPrismaClient = new PrismaClient();
console.log('Új Prisma kliens létrehozva:', newPrismaClient);
console.log('Új Prisma courseModule:', newPrismaClient?.courseModule);

// Kurzus moduljainak lekérése
export const GET = auth(async function GET(req: NextRequest & { auth: any }) {
    try {
        // Felhasználó ellenőrzése
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.nextUrl.pathname.split('/')[5]);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        // Jogosultság ellenőrzése
        const validation = await validateTeacherAccess(req.auth.user.id as string, courseId);
        if ('error' in validation) {
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }

        // A megfelelő Prisma kliensre bízzuk a választást
        const prismaToUse = prisma.courseModule ? prisma : newPrismaClient;
        
        // Modulok lekérése az adatbázisból
        const modules = await prismaToUse.courseModule.findMany({
            where: { courseId: courseId },
            orderBy: { id: 'asc' }
        });
        
        console.log(`${modules.length} modul sikeresen lekérve a(z) ${courseId} azonosítójú kurzushoz`);
        console.log('Lekért modulok adatai:', JSON.stringify(modules, null, 2));
        return NextResponse.json(modules);
    } catch (error) {
        console.error('Hiba a modulok API-ban:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
})

// Új modul létrehozása
export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
    try {
        // 1. Autentikáció ellenőrzése
        if (!req.auth) {
            return NextResponse.json(
                { error: 'Nincs bejelentkezve!' },
                { status: 401 }
            );
        }

        const courseId = parseInt(req.nextUrl.pathname.split('/')[5]);
        if (isNaN(courseId)) {
            return NextResponse.json(
                { error: 'Érvénytelen kurzus azonosító!' },
                { status: 400 }
            );
        }

        // 3. Kurzus létezésének ellenőrzése
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json(
                { error: 'A kurzus nem található!' },
                { status: 404 }
            );
        }

        // 4. Jogosultság ellenőrzése - csak a kurzus tanára hozhat létre modult
        if (course.email !== req.auth.user.email) {
            return NextResponse.json(
                { error: 'Nincs jogosultságod modul létrehozásához!' },
                { status: 403 }
            );
        }

        // 5. Modul létrehozása
        const body = await req.json();
        const { name, description } = body;

        if (!name || !description) {
            return NextResponse.json(
                { error: 'A modul neve és leírása kötelező!' },
                { status: 400 }
            );
        }

        const module = await prisma.courseModule.create({
            data: {
                name,
                description,
                courseId
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error('Hiba a modul létrehozása során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a modul létrehozása során' },
            { status: 500 }
        );
    }
})