'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RoleGuard from '@/app/components/auth/RoleGuard';
import Link from 'next/link';
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

// Típusdefiníciók
interface Enrollment {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Course {
  id: string;
  name: string;
  description: string;
  enrollments: Enrollment[];
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params.id as string;

  // Állapotok
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Kurzus adatok betöltése
  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Kurzus adatok lekérése az API-ból
        const response = await fetch(`/api/admin/courses/${courseId}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP hiba! Státusz: ${response.status}, ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Hiba a kurzus adatok betöltése közben:', error);
        setError(`Hiba történt a kurzus adatok betöltése közben: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourseDetails();
    }
  }, [courseId]);

  // Tanuló eltávolítása a kurzusról
  const handleRemoveStudent = async (studentId: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      const res = await fetch(`/api/admin/courses/${courseId}/students/${studentId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Hiba a tanuló eltávolítása során: ${errorData.error || res.statusText}`);
      }

      // Frissítjük a kurzus adatait a felületen
      setCourse(prevCourse => {
        if (!prevCourse) return null;
        
        return {
          ...prevCourse,
          enrollments: prevCourse.enrollments.filter(
            enrollment => enrollment.user.id !== studentId
          )
        };
      });
    } catch (error) {
      console.error('Hiba a tanuló eltávolítása közben:', error);
      setError(`Hiba történt a tanuló eltávolítása során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  // Beiratkozások szűrése a keresési kifejezés alapján
  const filteredEnrollments = course?.enrollments.filter(enrollment => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const userName = (enrollment.user.name || '').toLowerCase();
    const userEmail = (enrollment.user.email || '').toLowerCase();
    
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 mr-2">
                  &larr; Vissza az admin oldalra
                </Link>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Kurzus részletek
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Fő tartalom */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Hiba! </strong>
              <span className="block sm:inline">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Bezárás</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          ) : course ? (
            <>
              {/* Kurzus adatok */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {course.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Beiratkozások listája */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Beiratkozott tanulók</h2>
                
                {/* Kereső */}
                <div className="mb-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Keresés név vagy email alapján..."
                  />
                </div>
                
                {/* Beiratkozások táblázata */}
                <div className="bg-white shadow overflow-hidden rounded-lg">
                  {filteredEnrollments && filteredEnrollments.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Név
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Műveletek
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEnrollments.map((enrollment) => (
                          <tr key={enrollment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {enrollment.user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Eltávolítás
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Biztosan el szeretnéd távolítani ezt a tanulót?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Ez a művelet nem vonható vissza. A tanuló azonnal eltávolításra kerül a kurzusról.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Mégse</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRemoveStudent(enrollment.user.id)}
                                      disabled={isDeleting}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isDeleting ? (
                                        <>
                                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          Eltávolítás...
                                        </>
                                      ) : (
                                        "Eltávolítás"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {course.enrollments.length === 0 
                        ? "Nincs beiratkozott tanuló erre a kurzusra" 
                        : "Nincs a keresési feltételnek megfelelő tanuló"}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Kurzus nem található</div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
} 