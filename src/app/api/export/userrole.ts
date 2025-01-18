import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { OPTIONS, prisma } from '../auth/[...nextauth]/route';

export const userRole = async () => {
    const session = await getServerSession(OPTIONS);
    const userRole = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? ''
        },
        select: {
            role: true
        }
    })
    return NextResponse.json(userRole, {status: 200});
}