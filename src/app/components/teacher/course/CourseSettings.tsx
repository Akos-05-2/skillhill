"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { Loader2 } from "lucide-react";

interface Course {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}

export function CourseSettings({ courseId }: { courseId: string }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: false
    });

    const fetchCourse = async () => {
        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}`);
            if (!response.ok) {
                throw new Error("Nem sikerült betölteni a kurzust");
            }
            const data = await response.json();
            setCourse(data);
            setFormData({
                name: data.name,
                description: data.description,
                isActive: data.isActive || false
            });
        } catch (error) {
            console.error("Hiba a kurzus betöltésekor:", error);
            toast.error("Hiba történt a kurzus betöltésekor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    isActive: formData.isActive
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Szerver válasz:', errorData);
                throw new Error(errorData.details || errorData.error || "Nem sikerült menteni a változtatásokat");
            }

            toast.success("Kurzus beállításai sikeresen frissítve");
            await fetchCourse();
            window.dispatchEvent(new CustomEvent('courseStatusChanged'));
        } catch (error) {
            console.error("Hiba a kurzus mentésekor:", error);
            toast.error(error instanceof Error ? error.message : "Hiba történt a kurzus mentésekor");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kurzus beállítások</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Kurzus neve
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Leírás
                            </label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">
                                Kurzus aktív
                            </label>
                        </div>
                    </div>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mentés...
                            </>
                        ) : (
                            "Mentés"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 