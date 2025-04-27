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

// Fájl letöltése
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; fileId: string } }
) {
    try {
        // Felhasználó ellenőrzése
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        const fileId = parseInt(params.fileId);
        
        if (isNaN(courseId) || isNaN(fileId)) {
            return NextResponse.json({ error: 'Érvénytelen azonosítók' }, { status: 400 });
        }

        // A megfelelő Prisma kliensre bízzuk a választást
        const prismaToUse = prisma.file ? prisma : newPrismaClient;

        // Fájl adatainak lekérdezése
        const file = await prismaToUse.file.findUnique({
            where: { id: fileId },
            include: {
                courseMaterial: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!file) {
            return NextResponse.json({ error: 'A fájl nem található' }, { status: 404 });
        }

        if (!file.courseMaterial) {
            return NextResponse.json({ error: 'A fájl nincs hozzárendelve egy kurzus anyaghoz' }, { status: 404 });
        }

        // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve a kurzusra
        const enrollment = await prismaToUse.enrollment.findFirst({
            where: {
                user: {
                    id: session.user.id as string
                },
                course: {
                    id: file.courseMaterial.courseId
                }
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Nincs jogosultság a fájl megtekintéséhez' }, { status: 403 });
        }

        // Fájl elérési útja
        const filePath = path.join(process.cwd(), 'public', 'uploads', courseId.toString(), file.name);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'A fájl nem található a szerveren' }, { status: 404 });
        }

        // Fájl beolvasása
        const fileContent = fs.readFileSync(filePath);
        
        // Fájl típusának meghatározása
        const fileExt = path.extname(file.name).toLowerCase();
        let contentType = 'application/octet-stream';
        let disposition = 'inline';
        
        if (['.jpg', '.jpeg'].includes(fileExt)) {
            contentType = 'image/jpeg';
        } else if (fileExt === '.png') {
            contentType = 'image/png';
        } else if (fileExt === '.gif') {
            contentType = 'image/gif';
        } else if (fileExt === '.webp') {
            contentType = 'image/webp';
        } else if (fileExt === '.pdf') {
            contentType = 'application/pdf';
        } else if (['.doc', '.docx'].includes(fileExt)) {
            contentType = 'application/msword';
            disposition = 'attachment';
        } else if (['.ppt', '.pptx'].includes(fileExt)) {
            contentType = 'application/vnd.ms-powerpoint';
            disposition = 'attachment';
        } else if (fileExt === '.html') {
            contentType = 'text/html';
        } else if (fileExt === '.css') {
            contentType = 'text/css';
        } else if (fileExt === '.js') {
            contentType = 'text/javascript';
        } else if (fileExt === '.ts') {
            contentType = 'text/plain';
        } else if (fileExt === '.cs') {
            contentType = 'text/plain';
        } else if (['.cpp', '.c'].includes(fileExt)) {
            contentType = 'text/plain';
        } else if (['.xml', '.xaml'].includes(fileExt)) {
            contentType = 'text/xml';
        } else if (['.mp4'].includes(fileExt)) {
            contentType = 'video/mp4';
        } else if (['.webm'].includes(fileExt)) {
            contentType = 'video/webm';
        } else if (['.mov'].includes(fileExt)) {
            contentType = 'video/quicktime';
        } else if (['.avi'].includes(fileExt)) {
            contentType = 'video/x-msvideo';
        } else if (fileExt === '.zip') {
            contentType = 'application/zip';
            disposition = 'attachment';
        }

        // Válasz küldése a fájllal
        return new NextResponse(fileContent, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `${disposition}; filename="${file.name}"`,
                'Cache-Control': 'public, max-age=31536000',
                'Accept-Ranges': 'bytes'
            }
        });
    } catch (error) {
        console.error('Hiba a fájl letöltése közben:', error);
        return NextResponse.json({ error: 'Szerver hiba a fájl letöltése közben' }, { status: 500 });
    }
} 