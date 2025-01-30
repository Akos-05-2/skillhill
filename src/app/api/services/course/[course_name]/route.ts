import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../auth/[...nextauth]/route';
export async function GET(request: NextRequest) {
    const courseName = request.nextUrl.searchParams.get('course_name');
    if (!courseName){
        return NextResponse.json({ error: 'Adat beírása szükséges'}, { status: 400 });
    }
    const course = await prisma.user.findMany({
        where: {
            name: {
                contains: courseName,
            }
        }
    });
    return NextResponse.json({ course }, { status: 200 });
}