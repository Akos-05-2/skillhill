'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Image as ImageIcon, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Teacher {
  id: string;
  name: string | null;
  email: string;
}

interface CreateCourseFormProps {
  onSuccess?: () => void;
}

export function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    teacherEmail: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kategóriák betöltése
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (!response.ok) {
          throw new Error('Hiba a kategóriák lekérése során');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Hiba:', error);
        toast.error('Hiba történt a kategóriák betöltése során');
      }
    };

    fetchCategories();
  }, []);

  // Tanárok betöltése
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Hiba a felhasználók lekérése során');
        }
        const data = await response.json();
        // Csak a tanárokat szűrjük ki
        const teacherUsers = data.filter((user: any) => 
          user.role.role_name === 'teacher'
        );
        setTeachers(teacherUsers);
      } catch (error) {
        console.error('Hiba:', error);
        toast.error('Hiba történt a tanárok betöltése során');
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Formázott adatok létrehozása
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('email', formData.teacherEmail);

      // Ha van kiválasztott kép, hozzáadjuk a FormData-hoz
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Hiba a kurzus létrehozása során');
      }

      toast.success('Kurzus sikeresen létrehozva');
      router.refresh();
      onSuccess?.();
      
      // Form mezők alaphelyzetbe állítása
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        teacherEmail: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Hiba:', error);
      toast.error(error instanceof Error ? error.message : 'Hiba történt a kurzus létrehozása során');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ellenőrizzük, hogy kép-e a fájl
    if (!file.type.startsWith('image/')) {
      toast.error('Csak képfájlok feltöltése engedélyezett');
      return;
    }

    setSelectedImage(file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImagePreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Kurzus neve
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Add meg a kurzus nevét"
          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black dark:text-white dark:bg-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Leírás
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add meg a kurzus leírását"
          className="w-full min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-black dark:text-white dark:bg-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Kategória
        </Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          required
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-offset-2">
            <SelectValue placeholder="Válassz kategóriát" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id.toString()}
                className="cursor-pointer text-black dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 focus:text-blue-600 dark:focus:text-blue-400 py-2 px-3"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Oktató
        </Label>
        <Select
          value={formData.teacherEmail}
          onValueChange={(value) => setFormData({ ...formData, teacherEmail: value })}
          required
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-offset-2">
            <SelectValue placeholder="Válassz oktatót" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
            {teachers.map((teacher) => (
              <SelectItem 
                key={teacher.id} 
                value={teacher.email}
                className="cursor-pointer text-black dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 focus:text-blue-600 dark:focus:text-blue-400 py-2 px-3"
              >
                {teacher.name || teacher.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseImage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Kurzus kép
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="courseImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-offset-2"
          />
          {selectedImage && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleImageRemove}
              className="text-red-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Mégse
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Folyamatban...
            </>
          ) : (
            'Kurzus létrehozása'
          )}
        </Button>
      </div>
    </form>
  );
} 