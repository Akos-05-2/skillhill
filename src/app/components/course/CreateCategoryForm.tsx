'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

interface CreateCategoryFormProps {
  onSuccess?: () => void;
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Hiba a kategória létrehozása során');
      }

      toast.success('Kategória sikeresen létrehozva');
      setName('');
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Hiba:', error);
      toast.error('Hiba történt a kategória létrehozása során');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Név</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Feldolgozás...' : 'Kategória létrehozása'}
      </Button>
    </form>
  );
} 