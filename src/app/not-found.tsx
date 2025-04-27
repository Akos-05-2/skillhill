import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <FileQuestion className="h-6 w-6" />
            <CardTitle>Oldal nem található</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-black">Lehetséges okok:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Hibás URL cím</li>
                <li>Az oldal áthelyezésre került</li>
                <li>Az oldal törlésre került</li>
                <li>Ideiglenes technikai probléma</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/">
              Vissza a főoldalra
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 