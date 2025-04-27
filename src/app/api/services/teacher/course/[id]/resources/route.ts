import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Kurzus forrásainak lekérése
export const GET = auth(async function GET(
    req: NextRequest & { auth: any }
) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(req.url.split('/').pop() || '');
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const resources = await prisma.moduleResource.findMany({
            where: {
                module: {
                    courseId: courseId
                }
            },
            include: {
                file: true,
                module: true
            }
        });

        const formattedResources = resources.map((resource: any) => ({
            id: resource.id,
            name: resource.file.name,
            url: `/uploads/${resource.file.name}`,
            module_id: resource.moduleId,
            module_name: resource.module.name
        }));

        return NextResponse.json(formattedResources);
    } catch (error) {
        console.error('Hiba a források lekérdezése közben:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a források lekérdezése közben',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
})