'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  isActive: boolean;
  teacher: {
    name: string;
    email: string;
  };
}

interface CourseEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  onSave: () => void;
  isNew?: boolean;
}

export default function CourseEditDialog({
  isOpen,
  onClose,
  course,
  onSave,
  isNew = false
}: CourseEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description);
      setIsActive(course.isActive);
      setTeacherId(course.teacherId);
    } else {
      setName('');
      setDescription('');
      setIsActive(true);
      setTeacherId('');
    }
  }, [course]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get('/api/services/users?role=3');
        setTeachers(data);
        if (data.length > 0 && !teacherId && isNew) {
          setTeacherId(data[0].id);
        }
      } catch (error) {
        console.error('Hiba a tanárok betöltése során:', error);
        setError('Nem sikerült betölteni a tanárokat');
      }
    };

    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen, isNew, teacherId]);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!name.trim() || !description.trim() || !teacherId) {
        setError('Kérlek tölts ki minden mezőt!');
        return;
      }

      const courseData = {
        name: name.trim(),
        description: description.trim(),
        teacherId,
        isActive
      };

      if (isNew) {
        await axios.post('/api/courses', courseData);
      } else if (course) {
        await axios.put('/api/courses', {
          courseId: course.id,
          ...courseData
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Hiba a kurzus mentése során:', error);
      setError('Nem sikerült menteni a kurzust');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Új kurzus létrehozása' : 'Kurzus szerkesztése'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kurzus neve</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add meg a kurzus nevét"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Leírás</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add meg a kurzus leírását"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Oktató</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Válassz oktatót" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Aktív kurzus</Label>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Mégse
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
