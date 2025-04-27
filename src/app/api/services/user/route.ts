import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {auth} from "@/auth";

export const DELETE = auth(async function DELETE(req: NextRequest & { auth: any }) {  
    if (req.auth?.user?.role === 'ADMIN'){
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
})

export const GET = auth(async function GET(req: NextRequest & { auth: any }){
    try{
        const email = req.auth?.user?.email;
        const user = await prisma.user.findUnique({
            where: {email: email ?? ''},
            select: {
                id: false,
                email: true,
                name: true,
                createdAt: true,
                image: true
            }
        });
        return NextResponse.json(user, {status: 200});
    }
    catch{
        console.error('Hiba a felhasználó keresése többen!');
        return NextResponse.json({error: 'Hiba a csatlakozás során!'}, {status: 500});
    }
}) 

export const PUT = auth(async function PUT(req: NextRequest & { auth: any }) {
    if (req.auth?.user?.role === 'ADMIN'){
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
    else{
        console.error('Hiba a modositáskor! Nem megfelelő szerepkör!');
        return NextResponse.json({error: 'Nem megfelelő szerepkör! Szükséges szerepkör: ADMIN!'}, {status: 403});
    }
})