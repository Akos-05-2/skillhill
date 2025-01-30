import { prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const courses = await prisma.courses.findMany({
        select: {
            course_name: true,
        }
    })
    const url = new URL(request.url);
    const query = url.searchParams.get('query');

    if (!query || typeof query !== 'string') {
        return NextResponse.json({ message: 'Adat beírása szükséges'}, { status: 400 });
    }

    const filteredCourses = courses.filter((course) => course.course_name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    return NextResponse.json(filteredCourses, {status: 200});
}