import { auth, prisma } from '@/auth';
import { NextResponse } from 'next/server';

const dummyCategories = [
    { category_id: 1, category_name: 'Programozás' },
    { category_id: 2, category_name: 'Webfejlesztés' },
    { category_id: 3, category_name: 'Adatbázisok' },
    { category_id: 4, category_name: 'DevOps' },
    { category_id: 5, category_name: 'UI/UX Design' }
];

const dummyCourses = [
    {
        name: 'JavaScript Alapok',
        description: 'Ismerkedj meg a JavaScript programozási nyelv alapjaival, és építs interaktív weboldalakat.',
        category_id: 1,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'React Frontend Fejlesztés',
        description: 'Tanuld meg a modern frontend fejlesztést a React könyvtár segítségével.',
        category_id: 2,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'SQL és NoSQL Adatbázisok',
        description: 'Ismerkedj meg a különböző adatbázis típusokkal és azok használatával.',
        category_id: 3,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'Docker és Kubernetes',
        description: 'Tanuld meg a konténerizációt és az alkalmazások skálázását.',
        category_id: 4,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'Figma Design Alapok',
        description: 'Sajátítsd el a modern UI tervezés alapjait a Figma eszköz segítségével.',
        category_id: 5,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'Python Programozás',
        description: 'Ismerkedj meg a Python programozási nyelv alapjaival és használatával.',
        category_id: 1,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'Node.js Backend Fejlesztés',
        description: 'Építs skálázható backend alkalmazásokat Node.js segítségével.',
        category_id: 2,
        email: 'skillhillcourse@gmail.com'
    },
    {
        name: 'MongoDB a Gyakorlatban',
        description: 'Tanuld meg a NoSQL adatbázisok használatát a MongoDB példáján keresztül.',
        category_id: 3,
        email: 'skillhillcourse@gmail.com'
    }
];

export const POST = auth(async function POST(req: any) {
    if (req.auth?.user?.roleId.roleId < 3) {
        return NextResponse.json({ error: 'Nincs jogosultságod az adatok feltöltéséhez' }, { status: 401 });
    }

    try {
        for (const category of dummyCategories) {
            await prisma.category.upsert({
                where: { id: category.category_id },
                update: {},
                create: { id: category.category_id, name: category.category_name }
            });
        }

        for (const course of dummyCourses) {
            const category = await prisma.category.findUnique({
                where: { id: course.category_id }
            });

            if (category) {
                await prisma.course.create({
                    data: {
                        name: course.name,
                        description: course.description,
                        categoryId: category.id,
                        email: req.auth?.user?.email,
                        createdAt: new Date(),
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Dummy adatok sikeresen feltöltve' });
    } catch (error) {
        console.error('Hiba a dummy adatok feltöltése során:', error);
        return NextResponse.json(
            { error: 'Hiba történt a dummy adatok feltöltése során' },
            { status: 500 }
        );
    }
}); 