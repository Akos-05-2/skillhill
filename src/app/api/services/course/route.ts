import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import NextAuth, { getServerSession } from 'next-auth';
import { userRole } from '../../export/userrole';
import { IUserRoleResult } from '../../models/userroleresult';

export async function GET(){
    const session = await NextAuth(OPTIONS);
    if (!session){
        return NextResponse.json({error: 'Nem található felhasználó!'}, {status: 404});
    }
    try{
        const courses = await prisma.courses.findMany({
            select: {
                course_id: false,
                course_name: true,
                description: true
            }
        });
        return NextResponse.json(courses, {status: 200});
    }catch{
        console.error('Hiba a csatlakozás során!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}

export async function POST(req: NextResponse){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult?.role.role_name === 'ADMIN' || userRoleResult?.role.role_name === 'TEACHER'){
        const {course_name, description} = await req.json();
        if (!course_name || !description){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const course = await prisma.courses.create({
                data: {
                    course_name: course_name,
                    description: description
                },
                select: {
                    course_id: true
                }
            });
            return NextResponse.json(course, {status: 200});
        }catch{
            console.error('Hiba a kurzus menteşkor!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
}

export async function DELETE(req: Request){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role.role_name === 'ADMIN' || userRoleResult.role.role_name === 'TEACHER'){
        const {course_id} = await req.json();
        if (!course_id){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const course = await prisma.courses.delete({
                where: {
                    course_id: course_id
                },
                select: {
                    course_id: true
                }
            });
            return NextResponse.json(course, {status: 200});
        }catch{
            console.error('Hiba a kurzus törlésekor!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
}