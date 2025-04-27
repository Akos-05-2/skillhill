'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Hiba történt:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Hiba történt</CardTitle>
          </div>
          <CardDescription>
            Sajnos hiba történt az alkalmazás működése során.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Hibaüzenet:</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {error.message || 'Ismeretlen hiba történt'}
              </p>
            </div>
            {error.digest && (
              <div>
                <h3 className="font-semibold mb-1">Hiba azonosító:</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {error.digest}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Vissza a főoldalra
          </Button>
          <Button
            onClick={reset}
          >
            Újrapróbálás
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 