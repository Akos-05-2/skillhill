'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CourseEditDialog from '../course-edit-dialog/course-edit-dialog';
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

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await axios.get(`/api/courses?${params.toString()}`);
      setCourses(data);
      setError(null);
    } catch (error) {
      console.error('Hiba a kurzusok betöltése során:', error);
      setError('Nem sikerült betölteni a kurzusokat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
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
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center">Betöltés...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
