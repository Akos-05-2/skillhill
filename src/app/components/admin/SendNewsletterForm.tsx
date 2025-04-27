'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';

export function SendNewsletterForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt a hírlevél küldése során');
      }

      toast.success('Hírlevél sikeresen elküldve');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Hiba történt a hírlevél küldése során');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Tárgy
        </label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Hírlevél tárgya"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Üzenet
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hírlevél tartalma"
          required
          className="min-h-[200px]"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Küldés...' : 'Küldés'}
      </Button>
    </form>
  );
} 