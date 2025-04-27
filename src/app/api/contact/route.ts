import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

// Ellenőrizzük, hogy van-e Resend API kulcs
if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY nincs beállítva a környezeti változókban");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        console.log("API hívás kezdete");
        
        const { name, email, subject, message } = await request.json();
        console.log("Fogadott adatok:", { name, email, subject, message });

        // Ellenőrizzük a kötelező mezőket
        if (!name || !email || !subject || !message) {
            console.error("Hiányzó mezők:", { name, email, subject, message });
            return NextResponse.json(
                { error: "Minden mező kitöltése kötelező" },
                { status: 400 }
            );
        }

        // Ellenőrizzük az email formátumát
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error("Érvénytelen email formátum:", email);
            return NextResponse.json(
                { error: "Érvénytelen email cím formátum" },
                { status: 400 }
            );
        }

        // Ellenőrizzük, hogy van-e Resend API kulcs
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY nincs beállítva");
            return NextResponse.json(
                { error: "Email szolgáltatás nincs konfigurálva" },
                { status: 500 }
            );
        }

        // Először lekérjük a super_admin szerepkör ID-ját
        const superAdminRole = await prisma.roles.findFirst({
            where: {
                role_name: "super_admin"
            }
        });

        if (!superAdminRole) {
            console.error("Nincs super_admin szerepkör a rendszerben");
            return NextResponse.json(
                { error: "Nincs super_admin szerepkör a rendszerben" },
                { status: 500 }
            );
        }

        // Ellenőrizzük, hogy van-e super_admin felhasználó
        const superAdmins = await prisma.user.findMany({
            where: {
                roleId: superAdminRole.id
            },
            select: {
                email: true
            }
        });

        if (superAdmins.length === 0) {
            console.error("Nincs super_admin felhasználó a rendszerben");
            return NextResponse.json(
                { error: "Nincs super_admin felhasználó a rendszerben" },
                { status: 500 }
            );
        }

        console.log("Super admin felhasználók:", superAdmins);

        // Email küldése minden super_admin felhasználónak
        const emailPromises = superAdmins
            .filter((admin: { email: string | null }) => admin.email !== null)
            .map((admin: { email: string }) => 
                resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: admin.email as string, // Type assertion, mivel már kizártuk a null értékeket
                    subject: `Új kapcsolati űrlap üzenet: ${subject}`,
                    html: `
                        <h2>Új kapcsolati űrlap üzenet</h2>
                        <p><strong>Feladó:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Tárgy:</strong> ${subject}</p>
                        <p><strong>Üzenet:</strong></p>
                        <p>${message}</p>
                    `
                })
            );

        console.log("Email küldés indítása...");
        const results = await Promise.allSettled(emailPromises);
        console.log("Email küldés eredménye:", results);
        
        // Ellenőrizzük, hogy minden email sikeresen elküldődött-e
        const failedEmails = results.filter(result => result.status === 'rejected');
        if (failedEmails.length > 0) {
            console.error("Nem sikerült minden emailt elküldeni:", failedEmails);
            return NextResponse.json(
                { error: "Nem sikerült minden emailt elküldeni", details: failedEmails },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Email sikeresen elküldve" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Hiba az email küldése során:", error);
        return NextResponse.json(
            { error: "Hiba történt az email küldése során", details: error instanceof Error ? error.message : "Ismeretlen hiba" },
            { status: 500 }
        );
    }
} 