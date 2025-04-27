import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseProps {
    course: {
        name: string;
        id: number;
        description: string;
        createdAt: Date;
        categoryId: number;
        email: string;
    };
}

export default function Course({ course }: CourseProps) {
    const router = useRouter();
    const [selectedCourse, setSelectedCourse] = useState<CourseProps['course'] | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleCourseClick = () => {
        router.push(`/teacher/course/${course.id}?refresh=true`);
    };

    return (
        <Card 
            key={course.id}
            className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={handleCourseClick}
        >
            <CardHeader>
                <CardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginTop: '-20px', textAlign: 'center' }}>{course.name}</CardTitle>
                <div className="flex items-center justify-between">
                    {/*<span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {course.is_active ? 'Aktív' : 'Inaktív'}
                    </span>*/}
                    <button 
                        style={{ marginLeft: '150px', marginTop: '10px' }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setIsEditDialogOpen(true);
                        }}
                    >
                        Szerkesztés
                    </button>
                </div>
            </CardHeader>
        </Card>
    );
}