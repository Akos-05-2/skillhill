'use client';

import { Module } from '@/app/types/course';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import MaterialCard from './MaterialCard';

interface ModuleListProps {
  modules: Module[];
  handleFileClick: (fileId: string) => void;
}

export function ModuleList({ modules, handleFileClick }: ModuleListProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (!modules || modules.length === 0) {
    return <div className="text-center text-gray-500 my-8">Ez a kurzus még nem tartalmaz modulokat.</div>;
  }

  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <div key={module.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => toggleModule(module.id)}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{module.title || module.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {module.materials.length} anyag
              </p>
            </div>
            {openModules[module.id] ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {openModules[module.id] && (
            <div className="p-4 space-y-4">
              {module.materials.map((material) => (
                <MaterialCard 
                  key={material.id} 
                  material={material} 
                  handleFileClick={(materialId) => handleFileClick(materialId)} 
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 