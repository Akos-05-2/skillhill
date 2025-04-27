import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; fileId: string } }
) {
  try {
    // Session ellenőrzése
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId, fileId } = params;
    console.log('Fájl letöltés kérés:', { courseId, fileId, userEmail: session.user.email });

    // Ellenőrizzük a kurzushoz való hozzáférést
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        OR: [
          {
            enrollments: {
              some: {
                email: session.user.email
              }
            }
          },
          {
            email: session.user.email // A tanár email címe
          }
        ]
      }
    });

    if (!course) {
      console.error('Kurzus nem található vagy nincs hozzáférés');
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Keressük meg a fájlt
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(fileId)
      }
    });

    if (!file) {
      console.error('Fájl nem található');
      return new NextResponse('File not found', { status: 404 });
    }

    // Fájl elérési útja
    const filePath = path.join(process.cwd(), 'public', 'uploads', file.name);
    console.log('Fájl elérési út:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('Fájl nem található a megadott útvonalon:', filePath);
      return new NextResponse('File not found on server', { status: 404 });
    }

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
    } else if (fileExt === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.doc', '.docx'].includes(fileExt)) {
      contentType = 'application/msword';
      disposition = 'attachment';
    } else if (['.zip'].includes(fileExt)) {
      contentType = 'application/zip';
      disposition = 'attachment';
    }

    // Fájl beolvasása
    const fileContent = fs.readFileSync(filePath);

    // Válasz létrehozása
    const response = new NextResponse(fileContent);
    
    // Fejlécek beállítása
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `${disposition}; filename="${file.name}"`);
    
    return response;
  } catch (error) {
    console.error('Szerver hiba:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 