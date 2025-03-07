import { OPTIONS, prisma } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(OPTIONS);
        if (!session) {
            return NextResponse.json({ error: 'Nincs bejelentkezve!' }, { status: 401 });
        }

        // Ellenőrizzük, hogy admin-e a felhasználó
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user?.email ?? '' },
            select: { roleId: true }
        });

        if (!currentUser || (currentUser.roleId !== 4 && currentUser.roleId !== 5)) {
            return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 403 });
        }

        // Email alapján keresés
        const searchParams = req.nextUrl.searchParams;
        const email = searchParams.get('email');

        if (email) {
            // Ha van email paraméter, keresünk egy felhasználót
            const user = await prisma.user.findFirst({
                where: {
                    email: {
                        equals: email,
                        mode: 'insensitive' // Case-insensitive keresés
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    roleId: true,
                    role: {
                        select: {
                            role_name: true
                        }
                    }
                }
            });

            if (!user) {
                return NextResponse.json({ error: 'Felhasználó nem található!' }, { status: 404 });
            }

            return NextResponse.json(user, { status: 200 });
        } else {
            // Ha nincs email paraméter, visszaadjuk az összes felhasználót
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    roleId: true,
                    role: {
                        select: {
                            role_name: true
                        }
                    }
                }
            });

            return NextResponse.json(users, { status: 200 });
        }
    } catch (error) {
        console.error('Hiba a felhasználó keresése során:', error);
        return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(OPTIONS);
        if (!session) {
            return NextResponse.json({ error: 'Nincs bejelentkezve!' }, { status: 401 });
        }

        // Ellenőrizzük, hogy admin-e a felhasználó
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user?.email ?? '' },
            select: { roleId: true }
        });

        if (!currentUser || (currentUser.roleId !== 4 && currentUser.roleId !== 5)) {
            return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 403 });
        }

        const { user_id, roleId } = await req.json();
        if (!user_id || !roleId) {
            return NextResponse.json({ error: 'Hiányzó adatok!' }, { status: 400 });
        }

        // Ellenőrizzük, hogy létezik-e a szerepkör
        const roleExists = await prisma.roles.findUnique({
            where: { id: roleId }
        });

        if (!roleExists) {
            return NextResponse.json({ error: 'A megadott szerepkör nem létezik!' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                roleId: roleId
            },
            select: {
                id: true,
                roleId: true,
                role: {
                    select: {
                        role_name: true
                    }
                }
            }
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Hiba a felhasználó módosításakor:', error);
        return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(OPTIONS);
        if (!session) {
            return NextResponse.json({ error: 'Nincs bejelentkezve!' }, { status: 401 });
        }

        // Ellenőrizzük, hogy admin-e a felhasználó
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user?.email ?? '' },
            select: { roleId: true }
        });

        if (!currentUser || (currentUser.roleId !== 4 && currentUser.roleId !== 5)) {
            return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 403 });
        }

        const { user_id } = await req.json();
        if (!user_id) {
            return NextResponse.json({ error: 'Hiányzó adatok!' }, { status: 400 });
        }

        // Ellenőrizzük, hogy létezik-e a felhasználó
        const userExists = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!userExists) {
            return NextResponse.json({ error: 'A felhasználó nem található!' }, { status: 404 });
        }

        // Ne engedjük törölni a super admin felhasználót
        if (userExists.roleId === 5) {
            return NextResponse.json({ error: 'A super admin felhasználó nem törölhető!' }, { status: 403 });
        }

        const user = await prisma.user.delete({
            where: {
                id: user_id
            },
            select: {
                id: true
            }
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Hiba a felhasználó törlésekor:', error);
        return NextResponse.json({ error: 'Szerver hiba történt!' }, { status: 500 });
    }
}