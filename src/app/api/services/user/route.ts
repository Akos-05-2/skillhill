import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { userRole } from '../../export/userrole';
import { IUserRoleResult } from '../../models/userroleresult';

export async function DELETE(req: Request) {  
    const session = await getServerSession(OPTIONS);
    if (!session){
        NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResponse: IUserRoleResult = await response.json();
    if (userRoleResponse && userRoleResponse?.role.role_name === 'ADMIN'){
        const {user_id} = await req.json();
        if (!user_id){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const user = await prisma.user.delete({
                where: {
                    id: user_id
                },
                select: {
                    id: true
                }
            });
            return NextResponse.json(user, {status: 200});
        }catch{
            console.error('Hiba a felhasználó törlésekor!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
    else{
        console.error('Hiba a törléskor! Nem megfelelő szerepkör!');
        return NextResponse.json({error: 'Nem megfelelő szerepkör! Szükséges szerepkör: ADMIN!'}, {status: 403});
    }
}

export async function GET(){
    const session = await getServerSession(OPTIONS);
    console.log(session);
    try{
        const users = await prisma.user.findMany({
            select: {
                id: false,
                name: true,
                email: true,
                role: {
                    select: {
                        role_name: true
                    }
                }
            }
        });
        return NextResponse.json(users, {status: 200});
    }catch{
        console.error('Hiba a felhasználó keresése többen!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}

export async function PUT(req: NextRequest){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200});
    }
    const response = await userRole();
    const userRoleResponse: IUserRoleResult = await response.json();
    if (userRoleResponse && userRoleResponse?.role.role_name === 'ADMIN'){
        const {user_id, role} = await req.json();
        if (!user_id || !role){
            return NextResponse.json({error: 'Hiányzó adatok!'}, {status: 400});
        }
        try{
            const user = await prisma.user.update({
                where: {
                    id: user_id
                },
                data: {
                    role: role
                },
                select: {
                    id: true
                }
            });
            return NextResponse.json(user, {status: 200});
        }catch{
            console.error('Hiba a felhasználó modositáskor!');
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
}