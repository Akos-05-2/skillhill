import { getServerSession } from 'next-auth';
import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { userRole } from '../../export/userrole'
import { IUserRoleResult } from '../../models/userroleresult';

interface EnrollmentData{
    course_id: number;
    email: string;
    enrollment_date: Date;
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(OPTIONS);
    if (!session) {
        return NextResponse.json({ role: 'GUEST' }, { status: 200 });
    }

    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();

    if (userRoleResult && userRoleResult.role.role_name === 'USER') {
        const { course_id, email}: EnrollmentData = await request.json().then((body) => body);
        
        if (!course_id || !email) {
            return NextResponse.json({ error: "Hiányos adatok." }, { status: 400 });
        }

        try {
            const enroll = await prisma.enrollments.create({
                data: {
                    email,
                    course_id: course_id,
                    enrolment_date: new Date(),
                } 
            });
            console.log(email)
            console.log(course_id);
            return NextResponse.json(enroll, { status: 200 });
        } catch (error) {
            console.error("hiba:", error);
            return NextResponse.json({ error: "Hiba a beiratkozás közben." }, { status: 500 });
        }
    } else {
        return NextResponse.json('Nem megfelelő szerepkör! A művelethez szükséges szerepkör: USER!', { status: 403 });
    }
}


export async function DELETE(request: NextRequest) {
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role.role_name === 'TEACHER' || userRoleResult?.role.role_name === 'ADMIN'){
        const {enrollment_id} = await request.json();
        if (!enrollment_id){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const enrollment = await prisma.enrollments.delete({
                where: {
                    enrollment_id: enrollment_id
                }
            });
            return NextResponse.json(enrollment, {status: 200});
        }catch{
            console.error('Hiba a csatlakozás során!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
}

/*export async function GET(request: Request){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200})
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role.role_name == 'USER'){
        const {enrollment_id} = await request.json();
        const {user_id} = await request.json();
        if (!enrollment_id){
            return NextResponse.json({error: 'Nincs megjelenítendő kurzus!'}, {status: 400})
        }
        try{
            const myCourse = await prisma.enrollments.findMany({
                where: {
                    user_id: user_id,
                    enrollment_id: enrollment_id
                }
            })
        }
    }
}*/