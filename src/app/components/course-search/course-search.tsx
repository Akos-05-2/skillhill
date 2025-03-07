'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  isActive: boolean;
  createdAt: string;
  teacher: {
    name: string;
    email: string;
    image: string;
  };
  _count: {
    students: number;
  };
}

export default function CourseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showActive, setShowActive] = useState<boolean | undefined>(undefined);

  const searchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (showActive !== undefined) params.append('isActive', String(showActive));

      const { data } = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(data);
    } catch (error) {
      console.error('Hiba a kurzusok keresése során:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Kérjük jelentkezzen be újra!');
        } else {
          setError('Hiba történt a kurzusok keresése során!');
        }
      } else {
        setError('Ismeretlen hiba történt!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchCourses();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, showActive]);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Keresés név, leírás vagy tanár alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <select
          className="p-2 border rounded"
          value={showActive === undefined ? '' : String(showActive)}
          onChange={(e) => {
            const value = e.target.value;
            setShowActive(value === '' ? undefined : value === 'true');
          }}
        >
          <option value="">Minden kurzus</option>
          <option value="true">Aktív kurzusok</option>
          <option value="false">Inaktív kurzusok</option>
        </select>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center">Betöltés...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{course.description}</p>
              <div className="text-sm">
                <p>Tanár: {course.teacher.name}</p>
                <p>Diákok száma: {course._count.students}</p>
                <p>Státusz: {course.isActive ? 'Aktív' : 'Inaktív'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
