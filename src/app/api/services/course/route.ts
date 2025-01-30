import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextResponse, NextRequest } from 'next/server';
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
                course_id: true,
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

export async function POST(request: NextRequest) {
    const session = await getServerSession(OPTIONS);
    if (!session) {
        return NextResponse.json({ role: 'GUEST' }, { status: 200 });
    }

    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();

    if (userRoleResult && userRoleResult.role.role_name === 'USER') {
        try{
            const body = await request.json();
            const { course_id, email } = body;
            console.log('Kapott adatok:', { course_id, email }); // Debugging log
        
            if (!course_id || !email) {
                return NextResponse.json({ error: "Course ID and email are required." }, { status: 400 });
            }
                const enroll = await prisma.enrollments.create({
                    data: {
                        email,
                        course_id,
                        enrolment_date: new Date(), // Ellenőrizd, hogy az adatbázisban milyen mezőt használsz
                    }
                });

                console.log("Beiratkozás sikeres:", enroll); // Sikeres beiratkozás log
                return NextResponse.json(enroll, { status: 200 });
            } catch (error) {
                console.error("Error during enrollment:", error);
                return NextResponse.json({ error: "Failed to create enrollment." }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Nem megfelelő szerepkör! A művelethez szükséges szerepkör: USER!' }, { status: 403 });
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