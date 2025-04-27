import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true }
    });

    if (!user || (user.role.role_name !== "admin" && user.role.role_name !== "super_admin")) {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const data = await request.json();
    const { subject, message } = data;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "A tárgy és az üzenet megadása kötelező" },
        { status: 400 }
      );
    }

    const subscribers = await prisma.user.findMany({
      where: {
        isSubscribed: true
      },
      select: {
        email: true,
        name: true
      }
    });

    if (!subscribers.length) {
      return NextResponse.json(
        { error: "Nincsenek feliratkozott felhasználók" },
        { status: 404 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const failedEmails = [];
    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: 'noreply@skillhill.com',
          to: subscriber.email,
          subject: subject,
          html: message
        });
      } catch (error) {
        console.error(`Hiba az email küldése során ${subscriber.email} címre:`, error);
        failedEmails.push(subscriber.email);
      }
    }

    if (failedEmails.length > 0) {
      return NextResponse.json({
        message: "Néhány email küldése sikertelen volt",
        failedEmails
      }, { status: 207 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a hírlevél küldése során:', error);
    return NextResponse.json(
      { error: "Hiba történt a hírlevél küldése során" },
      { status: 500 }
    );
  }
} 