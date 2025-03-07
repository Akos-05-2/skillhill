import { NextResponse } from 'next/server';
import { ICourse } from '../models/course';

// Példa kurzusok
const courses: ICourse[] = [
    {
        course_id: 1,
        course_name: 'Web fejlesztés alapok',
        description: 'Tanuld meg a web fejlesztés alapjait HTML, CSS és JavaScript használatával.',
    },
    {
        course_id: 2,
        course_name: 'React.js haladó',
        description: 'Fejleszd React.js tudásod és tanulj meg komplex alkalmazásokat készíteni.',
    },
    {
        course_id: 3,
        course_name: 'Node.js és Express',
        description: 'Építs robusztus backend alkalmazásokat Node.js és Express használatával.',
    },
];

export async function GET() {
    return NextResponse.json(courses);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Ellenőrizzük a kötelező mezőket
        if (!body.course_name || !body.description) {
            return NextResponse.json(
                { error: 'A kurzus neve és leírása kötelező!' },
                { status: 400 }
            );
        }

        // Új kurzus létrehozása
        const newCourse: ICourse = {
            course_id: courses.length + 1,
            course_name: body.course_name,
            description: body.description,
        };

        // Hozzáadjuk a listához
        courses.push(newCourse);

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Hiba történt a kurzus létrehozása során!' },
            { status: 500 }
        );
    }
}