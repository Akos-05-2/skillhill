'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';

interface Category {
    category_id: number;
    category_name: string;
}

interface Course {
    id: number;
    name: string;
    description: string;
    category: {
        category_id: number;
        category_name: string;
    };
}

interface Props {
    params: {
        id: string;
    };
}

export default function EditCourse({ params }: Props) {
    const [course, setCourse] = useState<Course | null>(null);
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCourse();
        fetchCategories();
    }, []);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`/api/services/teacher/${params.id}`);
            if (!response.ok) {
                throw new Error('Hiba történt a kurzus betöltése során');
            }
            const data = await response.json();
            setCourse(data);
            setCourseName(data.name);
            setDescription(data.description);
            setCategoryId(data.category.category_id.toString());
        } catch (error) {
            toast.error('Nem sikerült betölteni a kurzust');
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/services/categories');
            if (!response.ok) {
                throw new Error('Hiba történt a kategóriák betöltése során');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            toast.error('Nem sikerült betölteni a kategóriákat');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!courseName || !description || !categoryId) {
            toast.error('Kérlek töltsd ki az összes mezőt');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/services/teacher', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id: parseInt(params.id),
                    course_name: courseName,
                    description,
                    category_id: parseInt(categoryId),
                }),
            });

            if (!response.ok) {
                throw new Error('Hiba történt a kurzus módosítása során');
            }

            toast.success('Kurzus sikeresen módosítva');
            router.push('/teacher');
        } catch (error) {
            toast.error('Nem sikerült módosítani a kurzust');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!course) {
        return <div className="loading">Betöltés...</div>;
    }

    return (
        <div className="create-course">
            <div className="form-header">
                <h1>Kurzus szerkesztése</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Vissza
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-group">
                    <label htmlFor="courseName">Kurzus neve</label>
                    <Input
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Add meg a kurzus nevét"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Leírás</label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add meg a kurzus leírását"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Kategória</label>
                    <Select  value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                            <SelectValue  placeholder="Válassz kategóriát" />
                        </SelectTrigger>
                        <SelectContent style={{ color: 'black' }}>
                            {categories.map((category) => (
                                <SelectItem 
                                    key={category.category_id} 
                                    value={category.category_id.toString()}
                                >
                                    {category.category_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                >
                    {loading ? 'Mentés...' : 'Módosítások mentése'}
                </Button>
            </form>
        </div>
    );
} 