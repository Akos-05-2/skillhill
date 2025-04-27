"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Modules } from "@/app/components/teacher/course/Modules";
import { Files } from "@/app/components/teacher/course/Files";
import { Menu } from "@/app/components/teacher/course/Menu";
import { Students } from "@/app/components/teacher/course/Students";
import { ModuleFiles } from "@/app/components/teacher/course/ModuleFiles";
import { Loader2, Trash2 } from "lucide-react";
import { CourseSettings } from "@/app/components/teacher/course/CourseSettings";
import { Button } from "@/app/components/ui/button";
import { TableCell } from "@/app/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

interface ApiCourse {
    id: string;
    name: string;
    description: string;
    email: string;
    categoryId: string;
    category: {
        id: string;
        name: string;
    };
    enrollments: {
        id: string;
    }[];
}

export default function TeacherCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [course, setCourse] = useState<ApiCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("modules");
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/services/teacher/course/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Nem sikerült betölteni a kurzus adatait");
                }
                
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                console.error("Error loading course:", error);
                toast.error(error instanceof Error ? error.message : "Nem sikerült betölteni a kurzus adatait");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleDeleteCourse = async () => {
        if (!course) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/services/teacher/course/${course.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Nem sikerült törölni a kurzust");
            }

            toast.success("Kurzus sikeresen törölve");
            router.push("/teacher/courses");
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error(error instanceof Error ? error.message : "Nem sikerült törölni a kurzust");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Kurzus nem található</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">{course.name}</h1>
                    <p className="text-gray-600">{course.description}</p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Kurzus törlése
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Biztosan törölni szeretnéd a kurzust?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ez a művelet nem vonható vissza. A kurzus és minden hozzá tartozó adat véglegesen törlődik.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Mégse</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteCourse}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Törlés...
                                    </>
                                ) : (
                                    "Törlés"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
            <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
            >
                <Menu 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    courseId={course.id} 
                />
                <TabsContent value="modules">
                    <Modules 
                        courseId={course.id} 
                        onModuleSelect={setSelectedModuleId} 
                    />
                    {selectedModuleId && (
                        <div className="mt-8">
                            <ModuleFiles 
                                courseId={parseInt(course.id)} 
                                moduleId={selectedModuleId} 
                            />
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="files">
                    <Files courseId={course.id} />
                </TabsContent>
                <TabsContent value="students">
                    <Students courseId={Number(course.id)} />
                </TabsContent>
                <TabsContent value="settings">
                    <CourseSettings courseId={course.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 