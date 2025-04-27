"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/app/types";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus } from "lucide-react";

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/services/teacher/courses");
                if (!response.ok) throw new Error("Nem sikerült betölteni a kurzusokat");
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Hiba a kurzusok betöltése közben:", error);
                toast.error("Nem sikerült betölteni a kurzusokat");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Kurzusaim</h1>
                <Button onClick={() => router.push("/teacher/courses/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Új kurzus
                </Button>
            </div>

            {courses.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            Még nincs kurzusod. Hozz létre egy újat a fenti gombbal!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => router.push(`/teacher/course/${course.id}`)}
                        >
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{course.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        {course.category?.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {course.enrollments?.length} tanuló
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 