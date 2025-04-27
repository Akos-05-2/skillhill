'use client';
import './error.css';
import { CourseError } from '@/app/components/error/course-error';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ marginTop: '100px' }} className="container mx-auto">
      <CourseError error={error} reset={reset} />
    </div>
  );
} 