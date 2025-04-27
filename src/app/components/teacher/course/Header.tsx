import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

interface Course {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    category?: {
        category_id: number;
        category_name: string;
    };
}

export default function Header({course}: {course: Course}){
    const router = useRouter();
    const handlePreview = () => {
        router.push(`/teacher/course/${course.id}/preview`);
    };
    return(
        <header style={{marginTop: '-30px'}} className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => router.push('/teacher')}
                                    className="mr-4 text-gray-700 hover:text-gray-900"
                                >
                                    ← Vissza
                                </button>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {course?.name}
                                </h1>
                            </div>
                            <div className="flex space-x-2">
                                <Button 
                                    onClick={handlePreview}
                                    variant="default"
                                    className="bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Előnézet
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
    );
}