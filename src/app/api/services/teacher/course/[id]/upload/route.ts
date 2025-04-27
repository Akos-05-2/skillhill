import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { validateTeacherAccess } from '@/app/utils/teacher';
import { getFileType } from '@/app/utils/file';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Érvénytelen kurzus azonosító' }, { status: 400 });
        }

        const validation = await validateTeacherAccess(session.user.id as string, courseId);
        if ('error' in validation) {
            return NextResponse.json({ error: validation.error }, { status: validation.status });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const name = formData.get('name') as string;
        const moduleId = formData.get('module_id') as string;
        
        if (!file) {
            return NextResponse.json({ error: 'Nincs fájl megadva' }, { status: 400 });
        }

        if (!name) {
            return NextResponse.json({ error: 'Nincs név megadva' }, { status: 400 });
        }

        if (!moduleId) {
            return NextResponse.json({ error: 'Nincs modul azonosító megadva' }, { status: 400 });
        }

        const fileType = getFileType(file.name);
        const fileName = `${Date.now()}-${file.name}`;
        
        const uploadsPath = path.join(process.cwd(), 'public', 'uploads', fileName);
        await writeFile(uploadsPath, Buffer.from(await file.arrayBuffer()));
        
        const courseMaterialsPath = path.join(process.cwd(), 'public', 'course_materials', courseId.toString(), fileName);
        const courseMaterialsDir = path.dirname(courseMaterialsPath);
        
        if (!fs.existsSync(courseMaterialsDir)) {
            fs.mkdirSync(courseMaterialsDir, { recursive: true });
        }
        
        await writeFile(courseMaterialsPath, Buffer.from(await file.arrayBuffer()));
        
        const fileRecord = await prisma.file.create({
            data: {
                name: fileName
            }
        });

        const moduleResource = await prisma.moduleResource.create({
            data: {
                file: {
                    connect: {
                        id: fileRecord.id
                    }
                },
                module: {
                    connect: {
                        id: parseInt(moduleId)
                    }
                }
            },
            include: {
                file: true,
                module: true
            }
        });

        await prisma.courseMaterial.create({
            data: {
                files: {
                    connect: {
                        id: fileRecord.id
                    }
                },
                course: {
                    connect: {
                        id: courseId
                    }
                },
                module: {
                    connect: {
                        id: parseInt(moduleId)
                    }
                }
            }
        });
        
        return NextResponse.json({
            id: moduleResource.id,
            name,
            type: fileType,
            url: `/uploads/${fileName}`,
            module_id: moduleResource.module.id,
            module_name: moduleResource.module.name,
            created_at: (moduleResource.file as any).created_at
        });
    } catch (error) {
        console.error('Hiba a fájl feltöltés közben:', error);
        return NextResponse.json({ 
            error: 'Szerver hiba a fájl feltöltés közben',
            details: error instanceof Error ? error.message : 'Ismeretlen hiba'
        }, { status: 500 });
    }
} 