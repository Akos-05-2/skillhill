import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const session = await auth();
    const headersList = headers();
    const path = headersList.get("x-invoke-path") || "";
    
    console.log('Request path:', path);
    console.log('Session:', JSON.stringify(session, null, 2));
    
    if (!session) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    console.log('Fetching courses from database...');
    const courses = await prisma.course.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true,
        user: true,
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    console.log('Raw courses from database:', JSON.stringify(courses, null, 2));

    if (!courses || courses.length === 0) {
      console.log('No courses found');
      return NextResponse.json([]);
    }

    // Ha az admin oldalról jön a kérés, visszaadjuk a teljes adatszerkezetet
    if (path.includes("/admin")) {
      console.log('Formatting courses for admin page...');
      const formattedAdminCourses = courses.map((course) => {
        // Ellenőrizzük, hogy minden szükséges adat megvan-e
        if (!course.category || !course.user) {
          console.log('Missing category or user data for course:', course.id);
          return null;
        }

        return {
          id: course.id,
          name: course.name,
          description: course.description,
          createdAt: course.createdAt.toISOString(),
          image: course.image,
          category: {
            name: course.category.name
          },
          user: {
            name: course.user.name,
            email: course.user.email
          },
          enrollments: course.enrollments?.map(enrollment => ({
            id: enrollment.id,
            enrolledAt: enrollment.created_at.toISOString(),
            user: {
              name: enrollment.user?.name || null,
              email: enrollment.user?.email
            }
          }))
        };
      }).filter(Boolean); // Kiszűrjük a null értékeket
      
      console.log('Formatted admin courses:', JSON.stringify(formattedAdminCourses, null, 2));
      return NextResponse.json(formattedAdminCourses);
    }

    // A /courses oldalra egyszerűsített formátumot küldünk
    console.log('Formatting courses for public page...');
    const formattedCourses = courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      image: course.image,
      category: course.category?.name || 'Kategória nélkül',
      teacherName: course.user?.name || 'Ismeretlen oktató',
      enrollmentCount: course.enrollments?.length || 0
    }));

    console.log('Formatted public courses:', JSON.stringify(formattedCourses, null, 2));
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Hiba a kurzusok lekérése során:', error);
    return NextResponse.json(
      { error: "Hiba a kurzusok lekérése során" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Nincs bejelentkezett felhasználó" },
        { status: 401 }
      );
    }

    // FormData feldolgozása
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const email = formData.get('email') as string;
    const imageFile = formData.get('image') as File | null;

    // Adatok ellenőrzése
    if (!name || !description || !categoryId || !email) {
      return NextResponse.json(
        { error: "Hiányzó adatok" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a kiválasztott email címmel létezik-e felhasználó
    const teacher = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "A kiválasztott oktató nem található" },
        { status: 404 }
      );
    }

    // Ellenőrizzük, hogy a kiválasztott felhasználó megfelelő szerepkörrel rendelkezik
    if (!['teacher', 'admin', 'super_admin'].includes(teacher.role.role_name)) {
      return NextResponse.json(
        { error: "A kiválasztott felhasználó nem oktató" },
        { status: 400 }
      );
    }

    // Kép feldolgozása és mentése
    let imagePath = null;
    if (imageFile) {
      // Ellenőrizzük, hogy valóban kép-e
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: "Csak képfájlok feltöltése engedélyezett" },
          { status: 400 }
        );
      }

      // Egyedi fájlnév generálása
      const fileExtension = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `course-${uuidv4()}.${fileExtension}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'courses');
      const filePath = join(uploadDir, fileName);

      // Biztosítsuk, hogy a könyvtár létezik
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Ha a könyvtár már létezik, nem probléma
        console.log('Könyvtár már létezik vagy nem sikerült létrehozni:', error);
      }

      // Kép adatainak kiolvasása
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Kép mentése a fájlrendszerbe
      try {
        await writeFile(filePath, buffer);
        imagePath = `/uploads/courses/${fileName}`;
      } catch (error) {
        console.error('Hiba a fájl mentése során:', error);
        return NextResponse.json(
          { error: "Hiba a kép feltöltése során" },
          { status: 500 }
        );
      }
    }

    // Prisma típusdefiníciónak megfelelő adatok létrehozása
    const courseData = {
      name,
      description,
      categoryId: parseInt(categoryId),
      email,
      isActive: true
    };

    // Ha van kép, hozzáadjuk a kurzus adatokhoz
    if (imagePath) {
      Object.assign(courseData, { image: imagePath });
    }

    // Kurzus létrehozása adatbázisban
    const course = await prisma.course.create({
      data: courseData,
      include: {
        category: true,
        user: true,
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    // Az admin oldalról létrehozott kurzusokhoz a teljes adatszerkezetet adjuk vissza
    const headersList = headers();
    const path = headersList.get("x-invoke-path") || "";

    const courseWithImage = course as any; // Type assertion a property eléréshez

    if (path.includes("/admin")) {
      const formattedAdminCourse = {
        id: course.id,
        name: course.name,
        description: course.description,
        createdAt: course.createdAt.toISOString(),
        image: courseWithImage.image || null,
        category: {
          name: course.category?.name || 'Kategória nélkül'
        },
        user: {
          name: course.user?.name || 'Ismeretlen felhasználó',
          email: course.user?.email || ''
        },
        enrollments: course.enrollments?.map((enrollment) => ({
          id: enrollment.id,
          enrolledAt: enrollment.created_at.toISOString(),
          user: {
            name: enrollment.user?.name || null,
            email: enrollment.user?.email || null
          }
        })) || []
      };
      return NextResponse.json(formattedAdminCourse);
    }

    // Egyébként az egyszerűsített formátumot küldjük
    const formattedCourse = {
      id: course.id,
      name: course.name,
      description: course.description,
      image: courseWithImage.image || null,
      category: course.category?.name || 'Kategória nélkül',
      teacherName: course.user?.name || 'Ismeretlen oktató',
      enrollmentCount: course.enrollments?.length || 0
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error('Hiba a kurzus létrehozása során:', error);
    return NextResponse.json(
      { error: "Hiba a kurzus létrehozása során" },
      { status: 500 }
    );
  }
} 