import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
    try {
        if (!req.auth) {
            return NextResponse.json({ error: 'Nincs bejelentkezve' }, { status: 401 });
        }

        if (!req.auth.user?.email) {
            return NextResponse.json(
                { error: "Nincs bejelentkezve" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: req.auth.user.email },
            include: { role: true }
        });

        if (!user || user.role.role_name !== "teacher") {
            return NextResponse.json(
                { error: "Nincs jogosultsága a művelethez" },
                { status: 403 }
            );
        }

        const courseId = parseInt(req.nextUrl.pathname.split('/')[5]);

        if (isNaN(courseId)) {
            return NextResponse.json(
                { error: "Érvénytelen kurzus azonosító" },
                { status: 400 }
            );
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json(
                { error: "Kurzus nem található" },
                { status: 404 }
            );
        }

        if (course.email !== user.email) {
            return NextResponse.json(
                { error: "Nincs jogosultsága a kurzus módosításához" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: "Hiányzó kötelező mezők" },
                { status: 400 }
            );
        }

        const module = await prisma.courseModule.create({
            data: {
                name: title,
                description,
                courseId
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error("Error in POST /api/services/teacher/course/[id]/module:", error);
        return NextResponse.json(
            { error: "Belső szerverhiba" },
            { status: 500 }
        );
    }
})