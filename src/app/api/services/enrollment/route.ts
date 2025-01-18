import { getServerSession } from 'next-auth';
import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { userRole } from '../../export/userrole'
import { IUserRoleResult } from '../../models/userroleresult';

export async function POST(request:  NextRequest){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role.role_name === 'USER'){
        const {course_id} =  await request.json();
        const {user_id} = await request.json();
        const enroll = await prisma.enrollments.create({
            data: {
                user_id: user_id,
                course_id: course_id,
                enrolment_date: new Date(),
            }
        });
        return NextResponse.json(enroll, {status: 200});
    }
    else{
        return NextResponse.json('Nem megfelelő szerepkör! A művelethez szükséges szerepkör: USER!', {status: 403});
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