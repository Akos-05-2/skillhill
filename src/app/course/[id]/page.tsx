'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

interface Material {
  id: number;
  title: string;
  type: 'document' | 'video' | 'quiz';
  description: string;
  duration?: string;
  file?: {
    id: number;
    name: string;
    url: string;
  };
}

interface Module {
  id: number;
  title: string;
  description: string;
  materials: Material[];
}

interface Course {
  id: number;
  name: string;
  description: string;
  category: {
    category_name: string;
  };
  modules: Module[];
}

export default function CourseDetails() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course>({ 
    id: 0, 
    name: '', 
    description: '', 
    category: { category_name: '' },
    modules: []
  });
  const [selectedModule, setSelectedModule] = useState(0);
  const [unenrollStatus, setUnenrollStatus] = useState<string | null>(null);

  const courseId = params?.id;
  const currentModule = course.modules[selectedModule] || { id: 0, title: '', description: '', materials: [] };
  const currentModuleIndex = selectedModule;

  const handleFileClick = async (url: string, fileName: string) => {
    try {
      console.log('Fájl kezelés kezdése:', { url, fileName });
      
      // Egyszerűbb megközelítés a fájl kezelésére
      if (fileName.toLowerCase().endsWith('.zip')) {
        // ZIP fájlok esetén letöltés
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Hiba a fájl letöltése során');
        }
        
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          window.URL.revokeObjectURL(objectUrl);
        }, 1000);
        
        toast.success('Fájl letöltése sikeres');
      } else {
        // Egyéb fájlok esetén megnyitás új ablakban
        window.open(url, '_blank');
        toast.success('Fájl megnyitása sikeres');
      }
    } catch (error) {
      console.error('Hiba a fájl kezelése során:', error);
      toast.error(error instanceof Error ? error.message : 'Hiba történt a fájl kezelése során');
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!session?.user?.email) {
        setError('A kurzus megtekintéséhez be kell jelentkezned!');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/services/course/${courseId}`);
        if (!response.ok) {
          throw new Error('Hiba történt a kurzus betöltése során');
        }
        const data = await response.json();
        console.log('Nyers kurzus adat:', data);
        
        // Átalakítjuk a modulokat a frontend által várt formátumra
        const transformedModules = data.modules?.map((module: any) => {
            console.log('Modul feldolgozása:', module);
            return {
                title: module.title || module.name,
                description: module.description || '',
                materials: module.materials?.map((material: any) => {
                    console.log('Anyag feldolgozása:', material);
                    const file = material.file || (material.files && material.files.length > 0 ? material.files[0] : null);
                    console.log('Feldolgozott fájl:', file);
                    return {
                        id: material.id,
                        title: material.title || file?.name || 'Névtelen anyag',
                        type: 'document',
                        description: material.description || '',
                        file: file ? {
                            id: file.id,
                            name: file.name,
                            url: `/api/download/${courseId}/${file.id}`
                        } : undefined
                    };
                }) || []
            };
        }) || [];

        console.log('Átalakított modulok:', transformedModules);

        setCourse({
            ...data,
            modules: transformedModules
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, session]);

  const handleUnenroll = async () => {
    if (!session?.user?.email || !course) return;

    try {
      const response = await fetch('/api/services/enrollment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Hiba történt a lejelentkezés során');
      }

      setUnenrollStatus('Sikeres lejelentkezés! Átirányítás...');
      
      setTimeout(() => {
        router.push('/courses');
      }, 2000);
    } catch (error) {
      setUnenrollStatus(error instanceof Error ? error.message : 'Hiba történt a lejelentkezés során');
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'document':
        return '📄';
      case 'quiz':
        return '✍️';
      default:
        return '📌';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-lg text-gray-600 dark:text-gray-300">Betöltés...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          A kurzus nem található vagy nincsenek modulok
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Kurzus fejléc */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h1>
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">{course.category.category_name}</div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bal oldali menü */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modulok</h2>
            <nav className="space-y-2">
              {course.modules.map((module, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedModule(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentModuleIndex === index 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <h3 className="font-medium">{module.title}</h3>
                  <div className="text-sm mt-1">
                    {(module.materials || []).length} anyag
                  </div>
                </button>
              ))}
            </nav>

            <button 
              onClick={handleUnenroll}
              disabled={!!unenrollStatus}
              className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg shadow transition-colors duration-200"
            >
              {unenrollStatus || 'Kiiratkozás a kurzusról'}
            </button>
          </div>
        </div>

        {/* Jobb oldali tartalom */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentModule.title}
            </h2>
            
            <div className="space-y-6">
              {(currentModule.materials || []).map((material, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{material.title || material.file?.name || 'Névtelen anyag'}</h3>
                    
                    {material.file && (
                      <div className="w-full sm:w-auto">
                        {material.file.name.toLowerCase().endsWith('.zip') ? (
                          <button 
                            onClick={() => handleFileClick(material.file!.url, material.file!.name)}
                            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-600 transition-colors"
                          >
                            <span>📦</span>
                            <span>Letöltés</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleFileClick(material.file!.url, material.file!.name)}
                            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-600 transition-colors"
                          >
                            <span>👁️</span>
                            <span>Megtekintés</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {material.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{material.description}</p>
                  )}
                  
                  {material.duration && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Időtartam: {material.duration} perc
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 