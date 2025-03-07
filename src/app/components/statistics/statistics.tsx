'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Statistics {
  overview: {
    totalCourses: number;
    activeCourses: number;
    inactiveCourses: number;
    totalUsers: number;
    totalTeachers: number;
    totalStudents: number;
    averageStudentsPerCourse: number;
  };
  topCourses: {
    id: string;
    name: string;
    studentCount: number;
  }[];
}

export default function Statistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await axios.get('/api/services/statistics');
        setStats(data);
      } catch (error) {
        console.error('Hiba a statisztikák betöltése során:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError('Kérjük jelentkezzen be újra!');
          } else {
            setError('Hiba történt a statisztikák betöltése során!');
          }
        } else {
          setError('Ismeretlen hiba történt!');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) return <div className="text-center p-4">Betöltés...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!stats) return null;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Kurzusok</h3>
          <div className="space-y-2">
            <p>Összes: {stats.overview.totalCourses}</p>
            <p>Aktív: {stats.overview.activeCourses}</p>
            <p>Inaktív: {stats.overview.inactiveCourses}</p>
          </div>
        </div>

        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Felhasználók</h3>
          <div className="space-y-2">
            <p>Összes: {stats.overview.totalUsers}</p>
            <p>Tanárok: {stats.overview.totalTeachers}</p>
            <p>Diákok: {stats.overview.totalStudents}</p>
          </div>
        </div>

        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Átlagok</h3>
          <p>Átlagos diákszám kurzusonként: {stats.overview.averageStudentsPerCourse}</p>
        </div>
      </div>

      <div className="border rounded p-4 bg-white shadow">
        <h3 className="text-lg font-semibold mb-4">Top 5 Legnépszerűbb Kurzus</h3>
        <div className="space-y-2">
          {stats.topCourses.map((course, index) => (
            <div key={course.id} className="flex justify-between items-center">
              <span>{index + 1}. {course.name}</span>
              <span className="text-gray-600">{course.studentCount} diák</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
