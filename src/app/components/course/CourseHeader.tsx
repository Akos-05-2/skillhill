'use client';

import { Course } from '@/app/types/course';

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h1>
      <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">{course.category.category_name}</div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
    </div>
  );
} 