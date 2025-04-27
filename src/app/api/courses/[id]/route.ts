import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const courseId = parseInt(params.id);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Érvénytelen kurzus azonosító" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e a kurzus
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        materials: true,
        enrollments: true,
        assignments: true,
        submissions: true,
        modules: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: "A kurzus nem található" }, { status: 404 });
    }

    // Tranzakcióban töröljük a kapcsolódó entitásokat
    await prisma.$transaction(async (tx: typeof prisma) => {
      // Töröljük a beiratkozásokat
      await tx.enrollment.deleteMany({
        where: { courseId: courseId }
      });

      // Töröljük a beküldéseket
      await tx.submission.deleteMany({
        where: { courseId: courseId }
      });

      // Töröljük a feladatokat
      await tx.assignment.deleteMany({
        where: { courseId: courseId }
      });

      // Töröljük a modulokat
      await tx.courseModule.deleteMany({
        where: { courseId: courseId }
      });

      // Töröljük a kurzus anyagokat
      await tx.courseMaterial.deleteMany({
        where: { courseId: courseId }
      });

      // Végül töröljük a kurzust
      await tx.course.delete({
        where: { id: courseId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a kurzus törlése során:', error);
    return NextResponse.json(
      { 
        error: "Hiba a kurzus törlése során",
        details: error instanceof Error ? error.message : "Ismeretlen hiba"
      },
      { status: 500 }
    );
  }
} 