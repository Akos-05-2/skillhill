import NextAuth, { getServerSession } from 'next-auth';
import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { Role } from '../role/role';

export async function POST(request:  NextRequest){
    const session = await getServerSession(OPTIONS);
    if (!session) {
        return NextResponse.json({ role: Role.GUEST.toString() }, { status: 200 });
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email ?? ''
        },
        select: {
            role: true
        }
    })
    if (user && user.role !== Role.USER){
        return NextResponse.json({error: 'Nem megfelelő szerepkör! A művelet elvégzéséhez szükséges szerepkör: USER!'}, {status: 403});
    }
    const {course_id, user_id} = await request.json();
    if (!course_id || !user_id){
        return NextResponse.json({ error: 'Hiányzó adatok!'}, { status: 400 });
    }
    try{
        const enrollment = await prisma.enrollments.create({
            data: {
                user_id: user_id,
                course_id: course_id
            },
        });
        return NextResponse.json(enrollment, {status: 200});
    }catch{
        console.error('Hiba a csatlakozás során!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    const session = await NextAuth(OPTIONS);
    if (!session){
        return NextResponse.json({error: 'Nem található felhasználó!'}, {status: 404});
    }
    try{
        const {course_id} =  await request.json();
        if (!course_id){
            console.error('Nincs megadott kurzus azonosító!');
            return NextResponse.json({error: 'Nincs megadott kurzus azonosító!'}, {status: 404});
        }
        const enrollment = await prisma.enrollments.findMany({
            where: {
                user_id: session.user.id,
                course_id: course_id
            },
            select: {
                enrollment_id: true
            }
        });
        const enrollment_id = session.enrollment.enrollment_id;
        const index = enrollment.findIndex((enrollment) => enrollment.enrollment_id === enrollment_id);
        if (index !== -1){
            await prisma.enrollments.delete({
                where: {
                    enrollment_id: enrollment[index].enrollment_id
                }
            })
        }
        return NextResponse.json(enrollment, {status: 200});
    }catch{
        console.error('Hiba a csatlakozás során!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}