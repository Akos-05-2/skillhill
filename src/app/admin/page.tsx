import { getServerSession } from 'next-auth';
import { OPTIONS } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '../api/auth/[...nextauth]/route';
import AdminPageClient from './client';
import './page.css';

export default async function AdminPage() {
    const session = await getServerSession(OPTIONS);
    if (!session) {
        redirect('/login');
    }

    // Ellenőrizzük a felhasználó szerepkörét
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? '' },
        select: { roleId: true }
    });

    if (!user || (user.roleId !== 4 && user.roleId !== 5)) {
        redirect('/');
    }

    return <AdminPageClient />;
}