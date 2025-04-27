import React from 'react';
import { Module } from '@/app/types/course';
import MaterialCard from './MaterialCard';

interface ModuleCardProps {
  module: Module;
  handleFileClick: (materialId: string) => void;
  isExpanded: boolean;
  toggleModule: (moduleId: string) => void;
}

export function ModuleCard({ module, handleFileClick, isExpanded, toggleModule }: ModuleCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
      <div
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={() => toggleModule(module.id)}
      >
        <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
        <span className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-3 bg-white">
          {module.description && (
            <p className="text-gray-600 mb-4">{module.description}</p>
          )}
          
          {module.materials && module.materials.length > 0 ? (
            <div className="space-y-3">
              {module.materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  handleFileClick={handleFileClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Nincsenek anyagok ebben a modulban</p>
          )}
        </div>
      )}
    </div>
  );
} 