import { getServerSession } from "next-auth";
import { OPTIONS, prisma } from "../../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(OPTIONS);
    if (!session){
        return NextResponse.json({role: 'GUEST'}, {status: 200})
    }
    const url = new URL(request.url);
    const email = url.searchParams.get('email')?.toString();
    console.log(email);
    try{
        const response = await prisma.user.findUniqueOrThrow({
            where: {
                email: email
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
        });
        console.log(response);
        return NextResponse.json(response, {status: 200});
    }catch{
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}