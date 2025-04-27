'use client';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseErrorProps {
  error: Error;
  reset?: () => void;
}

export function CourseError({ error, reset }: CourseErrorProps) {
  const router = useRouter();
  
  return (
    <div className="w-full p-4">
      <Card className="error-card p-6 border-red-200 bg-red-50">
        <div className="flex items-start gap-4">
          <AlertCircle className="error-icon h-5 w-5 text-red-500 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Hiba történt a kurzusok betöltése során
            </h3>
            <p className="text-sm text-red-600 mb-4">
              {error.message || 'Nem sikerült betölteni a kurzusokat. Kérjük, próbálja újra később.'}
            </p>
            <div className="flex gap-2">
              {reset && (
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/')}
                  className="error-button bg-white text-black"
                >
                  Főoldal
                </Button>
              )}
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                className="error-button bg-red-600 hover:bg-red-700"
              >
                Oldal újratöltése
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 