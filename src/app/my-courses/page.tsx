'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Course {
  course_id: number;
  course_name: string;
  description: string;
  image?: string;
}

export default function MyCourses() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMyCourses = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        setError('A kurzusaid megtekintéséhez be kell jelentkezned!');
        setLoading(false);
        return;
      }

      try {
        console.log('Saját kurzusok lekérése...');
        const response = await fetch('/api/services/enrollment/my-courses');
        if (!response.ok) {
          throw new Error('Hiba történt a kurzusok betöltése során');
        }
        const data = await response.json();
        console.log('Lekért kurzusok:', data);
        if (isMounted) {
          setMyCourses(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Hiba a kurzusok lekérése során:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
          setLoading(false);
        }
      }
    };

    fetchMyCourses();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  const handleOpenCourse = (courseId: number) => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground">Betöltés...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24 bg-primary/5">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Jelentkezéseim</h1>
          <p className="text-lg text-muted-foreground">Itt találod azokat a kurzusokat, amelyekre már jelentkeztél</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {myCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Még nem jelentkeztél egyetlen kurzusra sem.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div key={`my-course-${course.course_id}`} className="rounded-lg border bg-card overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={course.image || `/images/courses/default.jpg`} 
                      alt={course.course_name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{course.course_name}</h3>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    <button 
                      className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => handleOpenCourse(course.course_id)}
                    >
                      Kurzus megnyitása
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