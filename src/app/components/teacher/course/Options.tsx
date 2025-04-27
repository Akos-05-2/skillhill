import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { useCallback, useState } from "react";
import { CourseSettingsState } from "@/app/types";
import { toast } from "sonner";
import { useParams } from "next/navigation";
export default function Options() {
    const params = useParams();
    const courseId = params.id as string;
    const [courseSettings, setCourseSettings] = useState<CourseSettingsState>({
        name: '',
        description: '',
        isActive: false,
        isSaving: false
    });

    const updateCourseSettings = useCallback((field: keyof CourseSettingsState, value: string | number) => {
        setCourseSettings(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const handleSaveSettings = useCallback(async () => {
        setCourseSettings(prev => ({ ...prev, isSaving: true }));
        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}/update-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseSettings)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API hiba a beállítások mentésekor:', response.status, errorData);
                throw new Error(`Hiba történt a beállítások mentése során: ${response.status}`);
            }

            toast.success('Kurzus beállítások sikeresen mentve');
        } catch (error) {
            console.error('Hiba a beállítások mentése közben:', error);
            toast.error('Nem sikerült a beállítások mentése. Kérjük, próbálja újra később.');
        } finally {
            setCourseSettings(prev => ({ ...prev, isSaving: false }));
        }
    }, [courseId, courseSettings]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Kurzus beállítások</h2>                    
                <div className="space-y-6">
                    <div>
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                            Kurzus neve
                        </label>
                        <Input
                            id="courseName"
                            value={courseSettings.name}
                            onChange={(e) => updateCourseSettings('name', e.target.value)}
                            className="w-full text-gray-800"
                        />
                    </div>                
                    <div>
                        <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Leírás
                        </label>
                        <Textarea
                            id="courseDescription"
                            value={courseSettings.description}
                            onChange={(e) => updateCourseSettings('description', e.target.value)}
                            className="w-full min-h-[150px] text-gray-800"
                        />
                    </div>                
                    <div className="flex items-center">
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={courseSettings.isActive}
                            onChange={(e) => updateCourseSettings('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Kurzus aktív
                        </label>
                    </div>            
                    <div className="pt-4">
                        <Button 
                            onClick={handleSaveSettings}
                            disabled={courseSettings.isSaving}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm"
                        >
                            {courseSettings.isSaving ? 
                                <div className="flex items-center">
                                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></span>
                                        Mentés...
                                </div> : 
                                    'Beállítások mentése'
                            }
                        </Button>
                    </div>
                </div>
        </div>
    );
}
