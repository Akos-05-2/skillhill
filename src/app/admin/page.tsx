'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminSearchBar from '../components/admin-searchbar/adminsearch';
import CourseEditDialog from '../components/course-edit-dialog/course-edit-dialog';
import axios from 'axios';

interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  isActive: boolean;
  teacher: {
    name: string;
    email: string;
    image: string;
  };
  _count: {
    students: number;
  };
}

interface CourseStats {
  total: number;
  active: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/');
    },
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats>({ total: 0, active: 0 });

  // Check for admin or superadmin role
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.roleId !== 4 && session?.user?.roleId !== 5) {
      router.replace('/');
    }
  }, [status, session, router]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(data);
    } catch (error) {
      console.error('Hiba a kurzusok betöltése során:', error);
      setError('Nem sikerült betölteni a kurzusokat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      const delayDebounceFn = setTimeout(() => {
        fetchCourses();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [status, searchTerm]);

  useEffect(() => {
    const fetchCourseStats = async () => {
      try {
        const response = await axios.get('/api/services/statistics');
        const { courses } = response.data;
        setCourseStats({
          total: courses.length,
          active: courses.filter((course: any) => course.isActive).length
        });
      } catch (error) {
        console.error('Error fetching course statistics:', error);
      }
    };

    fetchCourseStats();
  }, []);

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setIsNewCourse(true);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsNewCourse(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
    setIsNewCourse(false);
  };

  if (status !== 'authenticated') {
    return <div className="text-center p-4">Betöltés...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Felület</h1>
      
      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Kurzusok</TabsTrigger>
          <TabsTrigger value="users">Felhasználók</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Összes kurzus
              </h3>
              <p className="text-3xl font-bold text-blue-600">{courseStats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Aktív kurzusok
              </h3>
              <p className="text-3xl font-bold text-green-600">{courseStats.active}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Keresés kurzusok között..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateCourse} className="ml-4">
                Új kurzus
              </Button>
            </div>

            {error && (
              <div className="text-red-500">{error}</div>
            )}

            {isLoading ? (
              <div className="text-center">Betöltés...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleEditCourse(course)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                    <div className="text-sm">
                      <p>Oktató: {course.teacher.name}</p>
                      <p>Diákok száma: {course._count.students}</p>
                      <p>Státusz: {course.isActive ? 'Aktív' : 'Inaktív'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Felhasználók kezelése</h2>
            <AdminSearchBar onUserFound={(users) => console.log('Users found:', users)} />
          </div>
        </TabsContent>
      </Tabs>

      <CourseEditDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        course={selectedCourse}
        onSave={fetchCourses}
        isNew={isNewCourse}
      />
    </div>
  );
}