'use client';

import React from 'react';
import { Material } from '@/app/types/course';

interface MaterialCardProps {
  material: Material;
  handleFileClick: (materialId: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, handleFileClick }) => {
  
  const getIconByFileType = (fileType: string) => {
    // Egyszerű ikonok szöveggel
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'mp4':
      case 'mov':
      case 'avi':
        return '🎬';
      case 'mp3':
      case 'wav':
        return '🎵';
      default:
        return '📁';
    }
  };

  return (
    <div 
      className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => handleFileClick(material.id)}
    >
      <div className="flex items-center">
        <div className="text-4xl mr-3">
          {getIconByFileType(material.fileType)}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{material.title}</h3>
          {material.description && (
            <p className="text-sm text-gray-500">{material.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard; 