import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const POST = auth(async function POST(req: any) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
  }
  try {
    const { name } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: req.auth.user?.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.auth.user?.id },
      data: { name }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Hiba történt a mentés során:', error);
    return NextResponse.json({ error: 'Hiba történt a mentés során' }, { status: 500 });
  }
}) 