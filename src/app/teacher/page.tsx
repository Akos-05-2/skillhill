"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Plus, Search, BookOpen, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import RoleGuard from '@/app/components/auth/RoleGuard';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated, role } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCoursesLoading, setIsCoursesLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const response = await fetch("/api/services/teacher/courses");
            if (!response.ok) throw new Error("Nem sikerült betölteni a kurzusokat");
            const data = await response.json();
            
            const formattedCourses = data.map((course: any) => ({
                ...course,
                is_active: course.isActive
            }));
            
            setCourses(formattedCourses);
        } catch (error) {
            console.error("Hiba a kurzusok betöltése közben:", error);
            toast.error("Nem sikerült betölteni a kurzusokat");
        } finally {
            setIsCoursesLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || isLoading) return;

        if (role === 'teacher' || role === 'admin' || role === 'super_admin') {
            fetchCourses();
        }
    }, [isAuthenticated, isLoading, role]);

    useEffect(() => {
        const handleStatusChange = () => {
            fetchCourses();
        };

        window.addEventListener('courseStatusChanged', handleStatusChange);
        return () => {
            window.removeEventListener('courseStatusChanged', handleStatusChange);
        };
    }, []);

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading || isCoursesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <RoleGuard allowedRoles={['teacher', 'admin', 'super_admin']}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kurzusaim</h1>
                        <p className="text-gray-500">Itt kezelheted a kurzusaidat és a tanulókat</p>
                    </div>
                    <Button 
                        onClick={() => router.push("/teacher/course/new")}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Új kurzus
                    </Button>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Keresés kurzusok között..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full md:w-96"
                    />
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Nincs kurzus</h3>
                        <p className="mt-1 text-sm text-gray-500">Hozz létre egy új kurzust a kezdéshez</p>
                        <Button 
                            onClick={() => router.push("/teacher/course/new")}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Új kurzus létrehozása
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map((course) => (
                            <Card 
                                key={course.id} 
                                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                onClick={() => router.push(`/teacher/course/${course.id}`)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl">{course.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            {course.modules?.length || 0} modul
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {course.enrollments?.length || 0} tanuló
                                        </div>
                                        <div className="flex items-center">
                                            <FileText className="h-4 w-4 mr-1" />
                                            {course.resources?.length || 0} fájl
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <span className={`text-sm ${course.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {course.is_active ? 'Aktív' : 'Inaktív'}
                                    </span>
                                    <Button 
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/teacher/course/${course.id}`);
                                        }}
                                    >
                                        Kezelés
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
