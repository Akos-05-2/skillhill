import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    if (!req.auth?.user?.email) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }
    
    // Ellenőrizzük, hogy a course_id meg van-e adva
    const { searchParams } = new URL(req.url);
    const courseId = parseInt(searchParams.get('course_id') || '');
    
    if (!courseId || isNaN(courseId)) {
        return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
    }
    
    console.log(`Kép feltöltése a ${courseId} azonosítójú kurzushoz`);
    
    // Ellenőrizzük, hogy a felhasználó rendelkezik-e jogosultsággal a kurzushoz
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        
        if (!course) {
            return NextResponse.json({ error: 'A kurzus nem található' }, { status: 404 });
        }
        
        if (course.email !== req.auth.user.email) {
            return NextResponse.json({ error: 'Nincs jogosultságod ehhez a kurzushoz' }, { status: 403 });
        }
        
        // Feldolgozzuk a formData-t
        try {
            const formData = await req.formData();
            const imageFile = formData.get('image');
            
            if (!imageFile) {
                return NextResponse.json({ error: 'Nem található kép a kérésben' }, { status: 400 });
            }
            
            // Ellenőrizzük, hogy a fájl valóban kép-e
            if (!(imageFile as any).type.startsWith('image/')) {
                return NextResponse.json({ error: 'Csak képfájlok feltöltése engedélyezett' }, { status: 400 });
            }
            
            try {
                // Egyedi fájlnév létrehozása
                const timestamp = Date.now();
                const originalName = (imageFile as any).name || 'kep.jpg';
                const fileExtension = originalName.split('.').pop() || 'jpg';
                const fileName = `course-${courseId}-${timestamp}.${fileExtension}`;
                
                // Könyvtár létrehozása
                const uploadDir = join(process.cwd(), 'public', 'uploads', 'courses');
                try {
                    await mkdir(uploadDir, { recursive: true });
                } catch (mkdirError) {
                    console.error('Hiba a könyvtár létrehozása során:', mkdirError);
                }
                
                const filePath = join(uploadDir, fileName);
                
                // Fájl tartalmának kiolvasása és mentése
                const arrayBuffer = await (imageFile as any).arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                await writeFile(filePath, buffer);
                
                // Képútvonal mentése az adatbázisba SQL segítségével
                const imagePath = `/uploads/courses/${fileName}`;
                
                await prisma.$executeRawUnsafe(`UPDATE courses SET image = '${imagePath}' WHERE course_id = ${courseId}`);
                
                return NextResponse.json({
                    success: true,
                    message: 'Kép sikeresen feltöltve',
                    image_url: imagePath
                });
            } catch (fileError) {
                console.error('Hiba a fájl mentése során:', fileError);
                return NextResponse.json({
                    error: 'Hiba a kép feltöltése során',
                    details: fileError instanceof Error ? fileError.message : 'Ismeretlen hiba'
                }, { status: 500 });
            }
        } catch (formDataError) {
            console.error('Hiba a formData feldolgozása során:', formDataError);
            return NextResponse.json({
                error: 'Hiba a kérés feldolgozása során',
                details: formDataError instanceof Error ? formDataError.message : 'Ismeretlen hiba'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Általános hiba:', error);
        return NextResponse.json({
            error: 'Hiba a kép feltöltése során',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
}); 