import { prisma } from '../src/auth';

async function main() {
    // Töröljük a meglévő szerepköröket
    await prisma.roles.deleteMany();

    // Létrehozzuk az alapértelmezett szerepköröket
    const roles = await Promise.all([
        prisma.roles.create({
            data: {
                role_name: 'super_admin'
            }
        }),
        prisma.roles.create({
            data: {
                role_name: 'admin'
            }
        }),
        prisma.roles.create({
            data: {
                role_name: 'teacher'
            }
        }),
        prisma.roles.create({
            data: {
                role_name: 'user'
            }
        })
    ]);

    console.log('Szerepkörök létrehozva:', roles);

    // Admin felhasználó létrehozása
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@skillhill.com' },
        update: {},
        create: {
            email: 'admin@skillhill.com',
            name: 'Admin',
            roleId: 1, // admin szerepkör
            isSubscribed: true,
        },
    });

    console.log('Admin felhasználó létrehozva:', adminUser);

    // Tanár felhasználó létrehozása
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@skillhill.com' },
        update: {},
        create: {
            email: 'teacher@skillhill.com',
            name: 'Minta Tanár',
            roleId: 3, // teacher szerepkör
            isSubscribed: true,
        },
    });

    console.log('Tanár felhasználó létrehozva:', teacherUser);

    // Kategóriák létrehozása
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Programozás' },
            { name: 'Webfejlesztés' },
            { name: 'Adatbázisok' },
            { name: 'DevOps' },
            { name: 'UI/UX Design' },
            { name: 'Mesterséges Intelligencia' },
        ],
        skipDuplicates: true,
    });

    console.log('Kategóriák létrehozva:', categories);

    // Minta kurzusok létrehozása
    const courses = await Promise.all([
        prisma.course.create({
            data: {
                name: 'JavaScript Alapok',
                description: 'Ismerkedj meg a JavaScript programozási nyelv alapjaival, a modern webfejlesztés egyik legfontosabb eszközével.',
                categoryId: 1,
                email: teacherUser.email || '',
                materials: {
                    create: {
                        files: {
                            create: {
                                name: 'JavaScript bevezetés.pdf'
                            }
                        }
                    }
                }
            }
        }),
        prisma.course.create({
            data: {
                name: 'React Frontend Fejlesztés',
                description: 'Tanuld meg a React könyvtár használatát és építs modern webalkalmazásokat.',
                categoryId: 2,
                email: teacherUser.email || '',
                materials: {
                    create: {
                        files: {
                            create: {
                                name: 'React komponensek.pdf'
                            }
                        }
                    }
                }
            }
        }),
        prisma.course.create({
            data: {
                name: 'SQL és NoSQL Adatbázisok',
                description: 'Ismerkedj meg a különböző adatbázis-kezelő rendszerekkel és tanuld meg az SQL nyelv használatát.',
                categoryId: 3,
                email: teacherUser.email || '',
                materials: {
                    create: {
                        files: {
                            create: {
                                name: 'Adatbázis alapok.pdf'
                            }
                        }
                    }
                }
            }
        })
    ]);

    console.log('Kurzusok létrehozva:', courses);

    // Minta diák felhasználók létrehozása
    const students = await Promise.all([
        prisma.user.create({
            data: {
                email: 'student1@example.com',
                name: 'Minta Diák 1',
                roleId: 2, // user szerepkör
                isSubscribed: false,
                enrollments: {
                    create: {
                        courseId: courses[0].id
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                email: 'student2@example.com',
                name: 'Minta Diák 2',
                roleId: 2, // user szerepkör
                isSubscribed: true,
                enrollments: {
                    create: [
                        { courseId: courses[0].id },
                        { courseId: courses[1].id }
                    ]
                }
            }
        })
    ]);

    console.log('Diák felhasználók létrehozva:', students);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 