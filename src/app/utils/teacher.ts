import { prisma } from '@/lib/prisma';

export async function validateTeacherAccess(userId: string, courseId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        if (!user || !user.role) {
            return { error: 'Felhasználó nem található vagy nincs szerepköre', status: 404 };
        }

        if (!['teacher', 'admin', 'super_admin'].includes(user.role.role_name)) {
            return { error: 'Nincs megfelelő jogosultság', status: 403 };
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return { error: 'Kurzus nem található', status: 404 };
        }

        if (user.role.role_name === 'teacher' && user.email !== course.email) {
            return { error: 'Nincs jogosultság ehhez a kurzushoz', status: 403 };
        }

        return { user, course };
    } catch (error) {
        console.error('Hiba a jogosultság ellenőrzése során:', error);
        return { error: 'Szerver hiba a jogosultság ellenőrzése során', status: 500 };
    }
} 