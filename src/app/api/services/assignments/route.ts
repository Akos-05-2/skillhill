import { getServerSession } from "next-auth";
import { OPTIONS, prisma } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { userRole } from "../../export/userrole";
import { IUserRoleResult } from "../../models/userroleresult";

export async function DELETE(request: Request){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role?.role_name === 'TEACHER'){
        const {assignment_id} = await request.json();
        if (!assignment_id){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const assignment = await prisma.assignments.delete({
                where: {
                    assingment_id: assignment_id
                }
            })
            return NextResponse.json(assignment, {status: 200});
        }catch{    
            console.error('Hiba a csatlakozás során!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
}

export async function POST(request: Request){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    if (userRoleResult && userRoleResult.role?.role_name === 'TEACHER'){
        try{
            const {assignment_name, description, course_id, due_date} = await request.json();
            const assignment = await prisma.assignments.create({
                data: {
                    title: assignment_name,
                    description: description,
                    course_id: course_id,
                    due_date: due_date,
                },
            });
            return NextResponse.json(assignment, {status: 200});
        }catch{
            console.error('Hiba a csatlakozás során!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
    else{
        NextResponse.json({error: 'Nem megfelelő szerepkör! A művelethez szükséges szerepkör: TEACHER!'}, {status: 403});
    }
}