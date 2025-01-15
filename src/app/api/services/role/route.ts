import { getServerSession } from 'next-auth';
import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';


export async function GET(){
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({error: 'Nem található felhasználó!'}, {status: 404});
    }
    const userRole = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? '',
        },
        select: {
            role: true,
        }
    });
    if (userRole && userRole?.role.role_name === 'ADMIN'){
        try{
            const roles = await prisma.roles.findMany({
                select: {
                    role_name: true,
                }
            });
            return NextResponse.json(roles, {status: 200});
        }catch{
            return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
        }
    }
    else{
        return NextResponse.json('Nem megfelelő szerepkör! A végrehajtáshoz szükséges szerepkör: ADMIN!', {status: 403});
    }
}