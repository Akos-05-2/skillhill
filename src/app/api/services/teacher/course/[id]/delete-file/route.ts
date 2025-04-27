import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Node.js runtime-ot használunk, mivel fájlrendszeri műveleteket végzünk
export const runtime = 'nodejs';

// Alternatív Prisma kliens létrehozása, ha az eredeti nem működik
const newPrismaClient = new PrismaClient();

// Közös segédfüggvények a jogosultság-ellenőrzéshez
async function validateTeacherAccess(userId: string, courseId: number) {
    const prismaToUse = prisma.user ? prisma : newPrismaClient;
    
    // Felhasználó jogosultságainak ellenőrzése
    const user = await prismaToUse.user.findUnique({
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
    const course = await prismaToUse.course.findUnique({
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

// Fájl törlése
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Felhasználó ellenőrzése
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        // Jogosultság ellenőrzése
        const validation = await validateTeacherAccess(session.user.id as string, courseId);
        if ('error' in validation) {
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }

        // URL paraméterek lekérése
        const searchParams = request.nextUrl.searchParams;
        const fileUrl = searchParams.get('fileUrl');
        const fileId = searchParams.get('fileId') ? parseInt(searchParams.get('fileId') as string) : null;

        if (!fileUrl) {
            return NextResponse.json({ error: 'Hiányzó fileUrl paraméter' }, { status: 400 });
        }

        console.log(`Fájl törlési kérés: fileUrl=${fileUrl}, fileId=${fileId}`);

        // Fájl nevének kinyerése az URL-ből
        let fileName = '';
        if (fileUrl.startsWith('/uploads/')) {
            // Az URL formátuma: /uploads/courseId/fileName
            fileName = fileUrl.split('/').pop() || '';
            
            // Fájl törlése a fájlrendszerből
            const filePath = path.join(process.cwd(), 'public', 'uploads', courseId.toString(), fileName);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Fájl törölve a fájlrendszerből: ${filePath}`);
            } else {
                console.warn(`Fájl nem található a fájlrendszerben: ${filePath}`);
            }
        } else {
            console.warn(`Ismeretlen fájl formátum: ${fileUrl}`);
        }
        
        // Ha van fileId, töröljük az adatbázisból is
        if (fileId) {
            const prismaToUse = prisma.file ? prisma : newPrismaClient;
            
            try {
                // Töröljük a modul-fájl kapcsolatot, ha létezik
                await prismaToUse.$executeRaw`
                    DELETE FROM module_resource WHERE file_id = ${fileId}
                `;
                console.log(`Modul-fájl kapcsolat törölve: file_id=${fileId}`);
            } catch (err) {
                console.log('Nem sikerült törölni a modul-fájl kapcsolatot:', err);
                // Folytatjuk a folyamatot, nem állítjuk le
            }
            
            // Töröljük a fájl rekordot az adatbázisból
            await prismaToUse.file.delete({
                where: { id: fileId }
            });
            
            console.log(`Fájl törölve az adatbázisból: id=${fileId}`);
        }

        return NextResponse.json({ success: true, message: 'Fájl sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a fájl törlése közben:', error);
        return NextResponse.json({ error: 'Szerver hiba a fájl törlése közben' }, { status: 500 });
    }
} 