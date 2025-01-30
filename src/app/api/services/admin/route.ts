import {prisma, OPTIONS} from '../../auth/[...nextauth]/route'
import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {userRole} from '../../export/userrole'
import {IUserRoleResult} from '../../models/userroleresult'

export async function GET(request: NextRequest) {
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200})
    }
    const response = await userRole();
    const userRoleResult: IUserRoleResult = await response.json();
    const {email}: {email: string} = await request.json(); 
    if (userRoleResult && userRoleResult.role.role_name == 'ADMIN'){
        const user = await prisma.user.findUnique({
            where: {
                email: email as string
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        role_name: true
                    }
                }
            }
        })
        return NextResponse.json(user, {status: 200});
    }
}