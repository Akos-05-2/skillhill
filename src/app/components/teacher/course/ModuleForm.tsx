import { Textarea } from "../../ui/textarea";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Module } from "@/app/types";
import { ModuleFormState } from "@/app/types";

export default function ModuleForm(){
    const params = useParams();
    const courseId = params.id as string;
    const [moduleForm, setModuleForm] = useState<ModuleFormState>({
        name: '',
        description: '',
        isCreating: false
    });

    const updateModuleForm = (field: keyof ModuleFormState, value: string) => {
        setModuleForm(prev => ({ ...prev, [field]: value }));
    };
    
    const handleCreateModule = useCallback(async () => {
        if (!moduleForm.name.trim()) {
            toast.error('A modul nevének kitöltése kötelező');
            return;
        }

        try {
            setModuleForm(prev => ({ ...prev, isCreating: true }));

            const moduleData = {
                name: moduleForm.name,
                description: moduleForm.description,
                order: 1, // Az API fogja beállítani a megfelelő sorrendet
            };
            
            const response = await fetch(`/api/services/teacher/course/${courseId}/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API hiba a modul létrehozásánál:', response.status, errorData);
                throw new Error(`Hiba történt az új modul létrehozása során: ${response.status}`);
            }

            toast.success('Új modul sikeresen létrehozva');
            setModuleForm({ name: '', description: '', isCreating: false });
            
            // Oldal újratöltése a friss modullal
            window.location.reload();
        } catch (error) {
            console.error('Hiba az új modul létrehozása közben:', error);
            toast.error('Nem sikerült létrehozni az új modult');
            setModuleForm(prev => ({ ...prev, isCreating: false }));
        }
    }, [moduleForm, courseId]);
    
    return (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg text-black font-medium mb-4">Új modul létrehozása</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Modul neve
                    </label>
                    <Input
                        id="moduleName"
                        value={moduleForm.name}
                        onChange={(e) => updateModuleForm('name', e.target.value)}
                        placeholder="Add meg a modul nevét"
                        className="w-full text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Leírás
                    </label>
                    <Textarea
                        id="moduleDescription"
                        value={moduleForm.description}
                        onChange={(e) => updateModuleForm('description', e.target.value)}
                        placeholder="Add meg a modul leírását"
                        className="w-full min-h-[100px] text-gray-800"
                    />
                </div>
                <Button 
                    onClick={handleCreateModule}
                    disabled={moduleForm.isCreating || !moduleForm.name.trim()}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {moduleForm.isCreating ? 'Létrehozás...' : 'Új modul létrehozása'}
                </Button>
            </div>
        </div>
    );
}