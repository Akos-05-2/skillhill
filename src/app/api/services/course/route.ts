import { auth, prisma } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = auth(async function GET(req: NextRequest & { auth: any }){
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }
    
    try{
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                name: true,
                description: true
            }
        });
        return NextResponse.json(courses, {status: 200});
    }catch{
        console.error('Hiba a csatlakozás során!');
    }
})

export const POST = auth(async function POST(req: NextRequest & { auth: any }){
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
        where: { email: req.auth.user.email ?? '' },
        include: { role: true }
    });

    if (!user?.role || user.role.roleId > 3) {
        return NextResponse.json({ error: 'Nem megfelelő szerepkör! A művelet elvégzéséhez szükséges szerepkör: SUPERADMIN, ADMIN vagy TEACHER!' }, { status: 403 });
    }

    const { course_name, description } = await req.json();
    if (!course_name || !description) {
        return NextResponse.json({ error: 'Hiányzó adatok!' }, { status: 400 });
    }

    try {
        const course = await prisma.course.create({
            data: {
                name: course_name,
                description: description,
                category: {
                    connect: {
                        id: 1
                    }
                },
                user: {
                    connect: {
                        id: req.auth.user.id
                    }
                }
            }
        });
        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        console.error('Hiba a kurzus mentésekor!', error);
        return NextResponse.json({ error: 'Hiba a csatlakozás során!' }, { status: 500 });
    }
})

export const DELETE = auth(async function DELETE(req: NextRequest & { auth: any }){
    if (!req.auth) {
        return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }
    
    if (req.auth.user?.role === 'ADMIN' || req.auth.user?.role === 'TEACHER'){
        const {course_id} = await req.auth.user.id;

        if (!course_id){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const course = await prisma.course.delete({
                where: {
                    id: course_id
                },
                select: {
                    id: true
                }
            });
            return NextResponse.json(course, {status: 200});
        }catch{
            console.error('Hiba a kurzus törlésekor!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
    else{
        return NextResponse.json({error: 'Nem megfelelő szerepkör! A művelet elvégzéséhez szükséges szerepkör: SUPERADMIN, ADMIN vagy TEACHER!'}, {status: 403});
    }
        
    })