'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useRouter } from 'next/navigation';

interface Course {
  course_id: number;
  course_name: string;
  description: string;
  teacher_name: string;
  image: string | null;
}

export function Courses() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/services/courses');
        if (!response.ok) {
          throw new Error('Hiba történt a kurzusok betöltése során');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/services/enrollment/my-courses');
        if (!response.ok) {
          throw new Error('Hiba történt a jelentkezések betöltése során');
        }
        const data = await response.json();
        const enrolledIds = data.map((course: Course) => course.course_id);
        setEnrolledCourseIds(enrolledIds);
      } catch (err) {
        console.error('Hiba a jelentkezések lekérése során:', err);
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, [session]);

  const handleEnrollment = async (courseId: number) => {
    if (!session?.user?.email) {
      router.push('/auth/signin');
      return;
    }

    setEnrolling(courseId);
    setEnrollmentError(null);
    setEnrollmentSuccess(null);

    try {
      const response = await fetch('/api/services/enrollment/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt a jelentkezés során');
      }

      setEnrollmentSuccess('Sikeresen jelentkeztél a kurzusra!');
      setEnrolledCourseIds(prev => [...prev, courseId]);
      
      // Frissítjük a kurzusok listáját
      const updatedCourses = courses.filter(course => course.course_id !== courseId);
      setCourses(updatedCourses);
      
      setTimeout(() => {
        setEnrollmentSuccess(null);
        router.push('/my-courses');
      }, 2000);
    } catch (err) {
      setEnrollmentError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  // Szűrjük ki azokat a kurzusokat, amelyekre már jelentkezett a felhasználó
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course.course_id));

  if (availableCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Jelenleg nincs elérhető kurzus.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enrollmentError && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {enrollmentError}
        </div>
      )}
      {enrollmentSuccess && (
        <div className="bg-green-500/15 text-green-500 p-4 rounded-md">
          {enrollmentSuccess}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCourses.map((course) => (
          <Card key={course.course_id} className="overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img
                src={course.image || `/images/courses/default.jpg`}
                alt={course.course_name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{course.course_name}</CardTitle>
              <CardDescription>{course.teacher_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleEnrollment(course.course_id)}
                disabled={enrolling === course.course_id}
              >
                {enrolling === course.course_id ? 'Jelentkezés...' : 'Jelentkezés a kurzusra'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 