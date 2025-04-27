'use client';

import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import styles from './edit-name-dialog.module.css';

interface EditNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
}

export function EditNameDialog({ isOpen, onClose, currentName }: EditNameDialogProps) {
  const [newName, setNewName] = useState(currentName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.trim() || currentName }),
      });

      const data = await response.json();

      if (response.ok) {
        if (newName.trim()) {
          await update({
            ...session,
            user: {
              ...session?.user,
              name: newName.trim()
            }
          });
        }
        
        onClose();
        window.location.reload();
      } else {
        setError(data.error || 'Hiba történt a név módosítása során');
      }
    } catch (error) {
      setError('Hiba történt a név módosítása során');
      console.error('Hiba:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Név módosítása
          </DialogTitle>
          <DialogDescription>
            Add meg az új nevedet
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Név
            </label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
              placeholder="Add meg az új nevedet"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Mégse
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
