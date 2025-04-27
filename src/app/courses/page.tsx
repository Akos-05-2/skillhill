'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CourseError } from '@/app/components/error/course-error';

interface Course {
  id: number;
  name: string;
  description: string;
  category: string;
  teacherName: string;
  enrollmentCount: number;
  image?: string;
}

export default function Courses() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<{[key: number]: string}>({});

  const fetchEnrolledCourses = async () => {
    if (session?.user?.email) {
      try {
        console.log('Beiratkozott kurzusok lekérése...');
        const response = await fetch(`/api/services/enrollment`);
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni a jelentkezett kurzusokat');
        }
        const data = await response.json();
        console.log('Beiratkozott kurzusok:', data);
        const enrolledIds = data.map((enrollment: any) => enrollment.course_id);
        console.log('Beiratkozott kurzus ID-k:', enrolledIds);
        setEnrolledCourseIds(enrolledIds);
      } catch (err) {
        console.error('Hiba a jelentkezett kurzusok lekérése során:', err);
        setError(err instanceof Error ? err : new Error('Hiba a jelentkezett kurzusok lekérése során'));
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    Promise.all([fetchCourses(), fetchEnrolledCourses()]);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Nem sikerült betölteni a kurzusokat');
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Hiba történt a kurzusok betöltése során'));
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      try {
        await Promise.all([fetchCourses(), fetchEnrolledCourses()]);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Hiba történt az oldal betöltése során'));
          setLoading(false);
        }
      }
    };

    initializePage();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const availableCourses = courses.filter(course => 
    !enrolledCourseIds.includes(course.id)
  );

  const filteredCourses = availableCourses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollment = async (courseId: number) => {
    if (!session?.user?.email) {
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: 'A jelentkezéshez be kell jelentkezned!'
      }));
      return;
    }

    try {
      const response = await fetch('/api/services/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Hiba történt a beiratkozás során');
      }

      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: 'Sikeres beiratkozás!'
      }));
      
      setEnrolledCourseIds(prev => [...prev, courseId]);
      
      setTimeout(() => {
        setEnrollmentStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[courseId];
          return newStatus;
        });
      }, 2000);

    } catch (err) {
      console.error('Hiba történt a beiratkozás során:', err);
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: err instanceof Error ? err.message : 'Hiba történt a beiratkozás során'
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground">Betöltés...</div>
      </div>
    );
  }

  if (error) {
    return <CourseError error={error} reset={handleRetry} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24 bg-primary/5">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Fedezd fel kurzusainkat</h1>
          <p className="text-lg text-muted-foreground">Válassz szakmai képzéseink közül és kezdd el karriered építését még ma!</p>
          {session ? (
            <p className="mt-2 text-md text-primary">Csak azok a kurzusok jelennek meg, amelyekbe még nem iratkoztál be.</p>
          ) : (
            <p className="mt-2 text-md text-primary">Jelentkezz be, hogy beiratkozhass a kurzusokra!</p>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Keresés a kurzusok között..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {session ? 
                  "Nincs olyan kurzus, amire még nem iratkoztál be, vagy ami megfelelne a keresési feltételeknek." :
                  "Nem található kurzus a megadott keresési feltételekkel."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={`course-${course.id}`} className="rounded-lg border bg-card overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={course.image || `/images/courses/default.jpg`} 
                      alt={course.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{course.name}</h3>
                    <p className="text-muted-foreground mb-2">{course.description}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Kategória: {course.category}</p>
                      <p>Oktató: {course.teacherName}</p>
                      <p>Beiratkozottak: {course.enrollmentCount}</p>
                    </div>
                    <button 
                      onClick={() => handleEnrollment(course.id)}
                      className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      disabled={!!enrollmentStatus[course.id]}
                    >
                      {enrollmentStatus[course.id] || 'Jelentkezés'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 