'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import FilePreview from '@/components/FilePreview';

interface Module {
    id: number;
    name: string;
    description: string;
}

interface Resource {
    id: number;
    name: string;
    type: string;
    url: string;
    module_id: number;
}

interface Course {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    email?: string;
    category: {
        category_id: number;
        category_name: string;
    };
    teacher?: {
        id: string;
        name: string;
        email: string;
    };
}

export default function CourseView() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = params.id as string;
    const refresh = searchParams.get('refresh') === 'true';
    const { data: session } = useSession();
    const { isLoading: authLoading, isAuthenticated, role } = useAuth();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [allResources, setAllResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [teacherName, setTeacherName] = useState<string>('');
    
    useEffect(() => {
        async function fetchCourseData() {
            try {
                setLoading(true);
                
                // Párhuzamos API kérések a gyorsabb betöltés érdekében
                const [courseResponse, modulesResponse, resourcesResponse] = await Promise.all([
                    fetch(`/api/services/teacher/course/${courseId}?refresh=${refresh}`),
                    fetch(`/api/services/teacher/course/${courseId}/modules?refresh=${refresh}`),
                    fetch(`/api/services/teacher/course/${courseId}/resources?refresh=${refresh}`)
                ]);
                
                // Ellenőrizzük a válaszokat és kezeljük a hibákat
                if (!courseResponse.ok) {
                    throw new Error('Nem sikerült betölteni a kurzus adatait');
                }
                if (!modulesResponse.ok) {
                    throw new Error('Nem sikerült betölteni a modulokat');
                }
                if (!resourcesResponse.ok) {
                    throw new Error('Nem sikerült betölteni a forrásokat');
                }
                
                // Párhuzamosan feldolgozzuk a válaszokat
                const [courseData, modulesData, resourcesData] = await Promise.all([
                    courseResponse.json(),
                    modulesResponse.json(),
                    resourcesResponse.json()
                ]);
                
                setCourse(courseData);
                setModules(modulesData);
                setAllResources(resourcesData);
                
                // Ha vannak modulok, alapértelmezetten az első modul forrásait mutassuk
                if (modulesData.length > 0) {
                    const firstModuleResources = resourcesData.filter((r: Resource) => r.module_id === modulesData[0].id);
                    setFilteredResources(firstModuleResources);
                }
                
                // Csak akkor kérjük le az oktató nevét, ha még nem ismerjük és van email
                if (courseData.email && !courseData.teacher?.name) {
                    try {
                        const teacherResponse = await fetch(`/api/services/user/byEmail?email=${encodeURIComponent(courseData.email)}`);
                        if (teacherResponse.ok) {
                            const teacherData = await teacherResponse.json();
                            setTeacherName(teacherData.name || 'Ismeretlen oktató');
                        } else {
                            setTeacherName('Ismeretlen oktató');
                        }
                    } catch (error) {
                        console.error('Hiba az oktató adatainak lekérése közben:', error);
                        setTeacherName('Ismeretlen oktató');
                    }
                } else if (courseData.teacher?.name) {
                    setTeacherName(courseData.teacher.name);
                }
            } catch (error) {
                console.error('Hiba a kurzus adatok betöltése közben:', error);
                toast.error('Nem sikerült betölteni a kurzus adatait');
            } finally {
                setLoading(false);
            }
        }
        
        fetchCourseData();
    }, [courseId, refresh]);
    
    // Modul kiválasztási kezelő
    const handleModuleClick = (moduleId: number) => {
        // Optimalizált szűrés - csak egyszer futtatjuk
        setFilteredResources(
            allResources.filter((r: Resource) => r.module_id === moduleId)
        );
    };
    
    // Lapozási kezelők
    const handleNavigateToTeacher = () => {
        router.push(`/teacher/course/${courseId}`);
    };
    
    const handleNavigateToAdmin = () => {
        router.push(`/admin/courses/${courseId}`);
    };
    
    // Memorizált Betöltési komponens - csak akkor készül újra, ha a loading változik
    const LoadingComponent = useMemo(() => (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-800 font-medium">Kurzus betöltése...</p>
            </div>
        </div>
    ), []);
    
    if (loading || authLoading) {
        return LoadingComponent;
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header style={{ marginTop: '-30px' }} className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">{course?.name || 'Kurzus betöltése...'}</h1>
                    <div className="mt-2 flex items-center">
                        <span className="bg-blue-500 px-2 py-1 rounded text-sm font-medium">
                            {course?.category?.category_name || 'Nincs kategória'}
                        </span>
                        <span className="ml-4 text-sm font-medium">
                            Oktató: {teacherName || course?.email || 'Nincs megadva'}
                        </span>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-white shadow-sm mb-6 p-1">
                        {/* Tanároknak speciális menüpont - csak nekik jelenik meg */}
                        {role === 'teacher' ? (
                            <TabsTrigger 
                                value="teacher_panel" 
                                className="text-gray-800 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold"
                                onClick={handleNavigateToTeacher}
                            >
                                Tanár felület
                            </TabsTrigger>
                        ) : (role === 'admin' || role === 'super_admin') ? (
                            /* Admin és super_admin felhasználóknak csak az admin menüpont jelenik meg */
                            <TabsTrigger 
                                value="admin_panel" 
                                className="text-gray-800 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold"
                                onClick={handleNavigateToAdmin}
                            >
                                Admin felület
                            </TabsTrigger>
                        ) : (
                            /* Diákok és vendégek csak az alap menüpontokat látják */
                            <>
                                <TabsTrigger 
                                    value="overview" 
                                    className="text-gray-800 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold"
                                >
                                    Áttekintés
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="content" 
                                    className="text-gray-800 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold"
                                >
                                    Tartalom
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="resources" 
                                    className="text-gray-800 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold"
                                >
                                    Anyagok
                                </TabsTrigger>
                            </>
                        )}
                    </TabsList>
                    
                    {/* Csak role === 'student' vagy egyéb (nem tanár, nem admin) esetén jelennek meg a tabok tartalmai */}
                    {!(role === 'teacher' || role === 'admin' || role === 'super_admin') && (
                        <>
                            <TabsContent value="overview">
                                <Card className="shadow-md border-t-2 border-t-blue-500">
                                    <CardHeader className="border-b pb-4">
                                        <CardTitle className="text-xl font-bold text-gray-900">Kurzus leírás</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-5">
                                        <p className="text-gray-800 leading-relaxed">{course?.description}</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="content">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="col-span-1">
                                        <Card className="shadow-md">
                                            <CardHeader className="border-b pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900">Modulok</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <nav className="space-y-3">
                                                    {modules.map(module => (
                                                        <button
                                                            key={module.id}
                                                            onClick={() => handleModuleClick(module.id)}
                                                            className={`block w-full text-left px-3 py-2 rounded border font-medium ${
                                                                filteredResources.some(r => r.module_id === module.id)
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm'
                                                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {module.name}
                                                        </button>
                                                    ))}
                                                </nav>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    
                                    <div className="col-span-3">
                                        <Card className="shadow-md">
                                            <CardHeader className="border-b pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900">Modul tartalom</CardTitle>
                                                <CardDescription className="text-gray-700">
                                                    Válassz egy modult a bal oldali listából
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {filteredResources.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {filteredResources.map(resource => (
                                                            <FilePreview 
                                                                key={resource.id}
                                                                file={resource}
                                                                showDelete={false}
                                                                className="h-full"
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-gray-700 font-medium">Válassz egy modult a tartalom megtekintéséhez</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="resources">
                                <Card className="shadow-md border-t-2 border-t-blue-500">
                                    <CardHeader className="border-b pb-4">
                                        <CardTitle className="text-xl font-bold text-gray-900">Összes anyag</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {allResources.map(resource => (
                                                <FilePreview 
                                                    key={resource.id}
                                                    file={resource}
                                                    showDelete={false}
                                                    className="h-full"
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </main>
        </div>
    );
} 