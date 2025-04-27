import { useEffect, useState } from "react";
import Course from "./Course";
import { useRouter } from "next/navigation";
import { Course as CourseType } from "@/app/types";

interface CourseGridProps {
    courses: CourseType[];
    isLoading: boolean;
    searchTerm: string;
}

export default function CourseGrid({ courses, isLoading, searchTerm }: CourseGridProps) {
    const router = useRouter();
    const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    

    useEffect(() => {
        if (selectedCourse) {
            setCourseName(selectedCourse.name);
            setDescription(selectedCourse.description);
            setCategoryId(selectedCourse.category?.id.toString() || '');
        }
    }, [selectedCourse]);

    return (
        <section className="px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-semibold text-white">Saját kurzusok</h2>
                    <button
                        onClick={() => {
                            document.dispatchEvent(new CustomEvent('openNewCourseDialog'));
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Új kurzus létrehozása
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <Course 
                                key={course.id} 
                                course={{
                                    ...course,
                                    createdAt: new Date(),
                                    categoryId: course.category?.id || 0,
                                    email: ''
                                }} 
                            />
                        ))}
                    </div>
                ) : searchTerm ? (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <p className="text-gray-600 mb-4">Nincs találat a keresésre: "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <p className="text-gray-600 mb-4">Még nincs kurzusod létrehozva.</p>
                    </div>
                )}
            </div>
        </section>
    );
}