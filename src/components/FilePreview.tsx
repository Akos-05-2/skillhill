import React, { memo } from 'react';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface FilePreviewProps {
  file: {
    id: number;
    name: string;
    type?: string;
    url: string;
    module_id?: number;
  };
  onDelete?: (file: any) => Promise<void> | void;
  showDelete?: boolean;
  className?: string;
}

type FileType = 'image' | 'video' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'html' | 'css' | 'js' | 'ts' | 'cs' | 'cpp' | 'xml' | 'archive' | 'document';

// Fájl kiterjesztés kinyerése az URL-ből
const getFileExtension = (url: string): string => {
  const filename = url.split('/').pop() || '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Fájl típusának meghatározása a kiterjesztés alapján
const getFileTypeFromExtension = (url: string): FileType => {
  const ext = getFileExtension(url);
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return 'image';
  } else if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
    return 'video';
  } else if (['pdf'].includes(ext)) {
    return 'pdf';
  } else if (['doc', 'docx'].includes(ext)) {
    return 'docx';
  } else if (['ppt', 'pptx'].includes(ext)) {
    return 'pptx';
  } else if (['html'].includes(ext)) {
    return 'html';
  } else if (['css'].includes(ext)) {
    return 'css';
  } else if (['js'].includes(ext)) {
    return 'js';
  } else if (['ts'].includes(ext)) {
    return 'ts';
  } else if (['cs'].includes(ext)) {
    return 'cs';
  } else if (['cpp', 'c'].includes(ext)) {
    return 'cpp';
  } else if (['xml', 'xaml'].includes(ext)) {
    return 'xml';
  } else if (['zip', 'rar', '7z'].includes(ext)) {
    return 'archive';
  }
  return 'document';
};

// Memo-izált komponens a felesleges újrarenderelések elkerülésére
const FilePreview: React.FC<FilePreviewProps> = memo(({ 
  file, 
  onDelete, 
  showDelete = true,
  className = '' 
}) => {
  // Csak fejlesztési környezetben naplózunk
  if (process.env.NODE_ENV === 'development') {
    console.log('FilePreview rendering:', file.name);
  }
  
  // A fájl típusa vagy az URL-ből generáljuk
  const fileType: FileType = file.type as FileType || getFileTypeFromExtension(file.url);
  const fileExtension = getFileExtension(file.url);
  
  // Teljes URL építése szükség esetén (relatív URL esetén)
  // Fontos: Next.js csak akkor tud fájlokat kiszolgálni a public mappából, 
  // ha közvetlenül a gyökérből érhető el (/ kezdőponttal)
  const fileUrl = file.url.startsWith('http') 
    ? file.url 
    : `${window.location.origin}${file.url}`; 
  
  // A fájl nevének kinyerése az URL-ből, ha nincs megadva név
  const fileName = file.name || file.url.split('/').pop() || 'letöltés';
  
  // Fejlesztési környezetben naplózzuk az URL-t
  if (process.env.NODE_ENV === 'development') {
    console.log('FilePreview URL:', fileUrl);
  }
  
  // Fájl kezelése
  const handleFileAction = () => {
    try {
      switch (fileType) {
        case 'archive':
        case 'docx':
        case 'pptx':
          // Letöltendő fájltípusok
          saveAs(fileUrl, fileName);
          toast.success('A letöltés megkezdődött');
          break;
          
        case 'pdf':
        case 'image':
        case 'video':
          // Előnézettel megnyitható fájlok
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
          break;
          
        default:
          // Egyéb fájlok esetén megkérdezzük a felhasználót
          if (window.confirm('Szeretné letölteni ezt a fájlt?')) {
            saveAs(fileUrl, fileName);
            toast.success('A letöltés megkezdődött');
          }
      }
    } catch (error) {
      console.error('Hiba a fájl kezelése közben:', error);
      toast.error('Hiba történt a fájl kezelése közben. Kérjük, próbálja újra később.');
    }
  };
  
  // Törlés kezelése
  const handleDelete = async () => {
    if (onDelete && window.confirm('Biztosan törölni szeretné ezt a fájlt?')) {
      await onDelete(file);
    }
  };
  
  // Különböző fájltípusok előnézete
  const renderPreview = () => {
    const isArchive = fileType === 'archive';
    
    switch (fileType) {
      case 'image':
        return (
          <button 
            onClick={handleFileAction}
            className="w-full cursor-pointer"
          >
            <div className="relative w-full h-40 bg-slate-100 rounded overflow-hidden">
              <Image 
                src={fileUrl} 
                alt={file.name} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder-image.png';
                  console.error('Kép betöltési hiba:', fileUrl);
                }}
              />
            </div>
          </button>
        );
        
      case 'video':
        return (
          <button 
            onClick={handleFileAction}
            className="w-full cursor-pointer"
          >
            <div className="w-full bg-slate-100 rounded overflow-hidden">
              <video 
                controls 
                className="w-full h-auto max-h-40"
                preload="metadata"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={fileUrl} />
                A böngésző nem támogatja a videó lejátszását.
              </video>
            </div>
          </button>
        );
        
      case 'archive':
        return (
          <button 
            onClick={handleFileAction}
            className="w-full cursor-pointer"
          >
            <div className="flex items-center justify-center w-full h-32 bg-slate-100 rounded hover:bg-slate-200 transition-colors">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-yellow-500" viewBox="0 0 16 16">
                  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM3 9h4v1H3v1h4v1H3v1h4v1H3v-1h4v-1H3v-1h4V9H3z"/>
                </svg>
                <span className="text-blue-600 hover:underline mt-2">
                  Letöltés
                </span>
              </div>
            </div>
          </button>
        );
        
      case 'pdf':
        return (
          <button 
            onClick={handleFileAction}
            className="w-full cursor-pointer"
          >
            <div className="flex items-center justify-center w-full h-32 bg-slate-100 rounded hover:bg-slate-200 transition-colors">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-red-500" viewBox="0 0 16 16">
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2z"/>
                  <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
                </svg>
                <span className="text-blue-600 hover:underline mt-2">
                  Megtekintés
                </span>
              </div>
            </div>
          </button>
        );
        
      default:
        return (
          <button 
            onClick={handleFileAction}
            className="w-full cursor-pointer"
          >
            <div className="flex items-center justify-center w-full h-32 bg-slate-100 rounded hover:bg-slate-200 transition-colors">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                </svg>
                <span className="text-blue-600 hover:underline mt-2">
                  Megtekintés
                </span>
              </div>
            </div>
          </button>
        );
    }
  };
  
  return (
    <div className={`bg-[#1a1a1a] border-[#2a2a2a] border rounded-lg overflow-hidden shadow-md h-full flex flex-col ${className}`}>
      <div className="flex-1">
        {renderPreview()}
      </div>
      <div className="p-3 bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-gray-200 truncate flex-1" title={file.name}>
              {file.name}
            </h3>
            {showDelete && onDelete && (
              <button 
                onClick={handleDelete}
                className="text-sm text-red-400 hover:text-red-300 flex-shrink-0 p-1 rounded hover:bg-[#2a2a2a] transition-colors"
                title="Törlés"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {fileExtension.toUpperCase()}
            </span>
            <button 
              onClick={handleFileAction}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 p-1 rounded hover:bg-[#2a2a2a] transition-colors"
            >
              {fileType === 'archive' ? 'Letöltés' : 'Megtekintés'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Név hozzáadása a komponenshez a fejlesztőeszközök számára
FilePreview.displayName = 'FilePreview';

export default FilePreview; 