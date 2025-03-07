'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CourseDialog from '../components/course-dialog/page';
import StatsDialog from '../components/stats-dialog/page';
import './page.css';

const Teacher = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.roleId !== 3) {
      router.push('/'); // Ha nem 3-as roleId-val rendelkezik, visszairányítjuk a főoldalra
    }
  }, [status, router, session]);

  const handleCreateCourse = async (courseData: { course_name: string; description: string }) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Hiba történt a kurzus létrehozása során');
      }

      const newCourse = await response.json();
      console.log('Új kurzus létrehozva:', newCourse);
      setIsDialogOpen(false);
      
      // Itt frissíthetnénk a kurzusok listáját
      // TODO: Implementálni a kurzusok listájának frissítését
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a kurzus létrehozása során!');
    }
  };

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Betöltés...</div>
      </div>
    );
  }

  // Ha nincs bejelentkezve vagy nem 3-as roleId-val rendelkezik, ne jelenítse meg a tartalmat
  if (status === 'unauthenticated' || session?.user?.roleId !== 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Tanári felület</h1>
          <p className="mb-8 text-gray-600">Kérjük, jelentkezz be a tanári felület használatához.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tanári vezérlőpult</h1>
      {/* További tanári funkciók ide kerülnek */}
      <CourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateCourse}
      />

      <StatsDialog
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}

export default Teacher;