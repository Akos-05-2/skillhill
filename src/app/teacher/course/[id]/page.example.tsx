'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FilePreview from '@/components/FilePreview';

// Példa típus a feltöltött fájlokhoz
type ResourceFile = {
  id: number;
  name: string;
  type: string;
  url: string;
  module_id: number;
};

// Példa típus a modulokhoz
type Module = {
  id: number;
  name: string;
  description?: string;
};

export default function TeacherCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  // Állapot a feltöltött fájlok tárolásához
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fájlok betöltése
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // API hívás helyett csak példa adatok
        // Valóságban: const response = await fetch(`/api/services/teacher/course/${courseId}/resources`);
        
        // Példa adatok
        const exampleResources: ResourceFile[] = [
          { id: 1, name: 'JavaScript alapok.pdf', type: 'pdf', url: '/files/10/javascript-alapok.pdf', module_id: 1 },
          { id: 2, name: 'HTML tutorial.html', type: 'html', url: '/files/10/html-tutorial.html', module_id: 1 },
          { id: 3, name: 'CSS példák.css', type: 'css', url: '/files/10/css-peldak.css', module_id: 2 },
        ];
        
        const exampleModules: Module[] = [
          { id: 1, name: 'Webfejlesztés alapjai', description: 'HTML, CSS és JavaScript alapok' },
          { id: 2, name: 'Haladó webtechnológiák', description: 'Frameworkök és modern technikák' },
        ];
        
        setResources(exampleResources);
        setModules(exampleModules);
      } catch (err) {
        console.error('Hiba a fájlok betöltése közben:', err);
        setError('Nem sikerült betölteni a fájlokat. Kérjük, próbálja újra később.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [courseId]);
  
  // Fájl törlése
  const handleDeleteFile = async (file: ResourceFile) => {
    try {
      // API hívás a fájl törléséhez
      const response = await fetch(
        `/api/services/teacher/course/${courseId}/delete-file?fileUrl=${encodeURIComponent(file.url)}&fileId=${file.id}`, 
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Hiba a törlés során');
      }
      
      // Sikeres törlés esetén frissítjük a listát
      setResources(prevResources => prevResources.filter(resource => resource.id !== file.id));
      
      // Jelezzük a felhasználónak a sikeres törlést
      alert('A fájl sikeresen törölve lett.');
    } catch (err) {
      console.error('Hiba a fájl törlése közben:', err);
      alert('Nem sikerült törölni a fájlt. Kérjük, próbálja újra később.');
    }
  };
  
  // Fájl feltöltési form egy példája
  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      // Itt lenne a valódi feltöltési logika
      // const response = await fetch(`/api/services/teacher/course/${courseId}/upload`, {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Példa a sikeres feltöltés szimulálására
      alert('A fájl feltöltés példája - ez csak egy szemléltető kód');
    } catch (err) {
      console.error('Hiba a fájl feltöltése közben:', err);
      alert('Nem sikerült feltölteni a fájlt. Kérjük, próbálja újra később.');
    }
  };
  
  if (loading) {
    return <div className="p-4">Betöltés...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Kurzus anyagok</h1>
      
      {/* Modulok és fájlok listája */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Modulok</h2>
        
        {modules.map(module => (
          <div key={module.id} className="mb-6 border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">{module.name}</h3>
            {module.description && <p className="text-gray-600 mb-4">{module.description}</p>}
            
            <h4 className="font-medium mb-2">Anyagok:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.filter(resource => resource.module_id === module.id).map(file => (
                <FilePreview 
                  key={file.id} 
                  file={file} 
                  onDelete={handleDeleteFile}
                  className="h-full"
                />
              ))}
              
              {resources.filter(resource => resource.module_id === module.id).length === 0 && (
                <p className="text-gray-500">Nincs anyag ehhez a modulhoz</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Fájl feltöltési űrlap */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Fájl feltöltése</h2>
        
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Fájl neve:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="w-full border rounded p-2" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="moduleId" className="block mb-1">Modul:</label>
            <select 
              id="moduleId" 
              name="module_id" 
              className="w-full border rounded p-2" 
              required
            >
              <option value="">Válassz modult</option>
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="file" className="block mb-1">Fájl:</label>
            <input 
              type="file" 
              id="file" 
              name="file" 
              className="w-full border rounded p-2" 
              required 
            />
            <p className="text-sm text-gray-500 mt-1">
              Támogatott formátumok: .pdf, .doc, .docx, .jpg, .png, .html, .css, .js, .ts, .cs, .cpp, .c, .xml, .xaml, .zip
            </p>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Feltöltés
          </button>
        </form>
      </div>
      
      {/* Az összes feltöltött fájl listája */}
      <div className="mt-8 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Összes feltöltött fájl</h2>
        
        {resources.length === 0 ? (
          <p className="text-gray-500">Nincsenek feltöltött fájlok</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(file => (
              <FilePreview 
                key={file.id} 
                file={file} 
                onDelete={handleDeleteFile}
                className="h-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 