"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2, Trash2, Upload } from "lucide-react";

interface Module {
    id: number;
    name: string;
    materials: {
        id: number;
        file: {
            id: number;
            name: string;
            url: string;
            size: number;
            type: string;
            createdAt: string;
        };
    }[];
}

export function Files({ courseId }: { courseId: string }) {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchModules = async () => {
        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}/materials`);
            if (!response.ok) {
                throw new Error("Nem sikerült betölteni a modulokat");
            }
            const data = await response.json();
            setModules(data || []);
        } catch (error) {
            console.error("Hiba a modulok betöltésekor:", error);
            toast.error("Hiba történt a modulok betöltésekor");
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, [courseId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Válassz ki egy fájlt a feltöltéshez");
            return;
        }

        if (!selectedModuleId) {
            toast.error("Válassz ki egy modult a feltöltéshez");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("name", selectedFile.name);
            formData.append("module_id", selectedModuleId.toString());

            const response = await fetch(`/api/services/teacher/course/${courseId}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = "Nem sikerült feltölteni a fájlt";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                }
                throw new Error(errorMessage);
            }

            toast.success("Fájl sikeresen feltöltve");
            setSelectedFile(null);
            setSelectedModuleId(null);
            await fetchModules();
        } catch (error) {
            console.error("Hiba a fájl feltöltésekor:", error);
            toast.error(error instanceof Error ? error.message : "Hiba történt a fájl feltöltésekor");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (materialId: number) => {
        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}/material/${materialId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Nem sikerült törölni a fájlt");
            }

            toast.success("Fájl sikeresen törölve");
            await fetchModules();
        } catch (error) {
            console.error("Hiba a fájl törlésekor:", error);
            toast.error("Hiba történt a fájl törlésekor");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Új fájl feltöltése</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <select
                                value={selectedModuleId || ""}
                                onChange={(e) => setSelectedModuleId(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Válassz modult a feltöltéshez</option>
                                {modules.map((module) => (
                                    <option 
                                        key={module.id} 
                                        value={module.id}
                                    >
                                        {module.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-4">
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="flex-1"
                                />
                                <Button 
                                    onClick={handleUpload} 
                                    disabled={!selectedFile || !selectedModuleId || uploading}
                                    className="flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    Feltöltés
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {modules.map((module) => (
                <Card key={module.id}>
                    <CardHeader>
                        <CardTitle>{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {module.materials && module.materials.length > 0 ? (
                            <div className="space-y-4">
                                {module.materials.map((material) => (
                                    <div 
                                        key={material.id} 
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{material.file.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(material.file.createdAt).toLocaleDateString()} - 
                                                {(material.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(material.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nincsenek fájlok ebben a modulban.</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}