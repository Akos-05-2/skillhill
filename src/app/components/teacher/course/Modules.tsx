"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface Module {
    id: number;
    title: string;
    description: string;
    order: number;
}

interface ModulesProps {
    courseId: string;
    onModuleSelect: (moduleId: number) => void;
}

export function Modules({ courseId, onModuleSelect }: ModulesProps) {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch(`/api/services/teacher/course/${courseId}/modules`);
                if (!response.ok) throw new Error("Nem sikerült betölteni a modulokat");
                const data = await response.json();
                setModules(data);
            } catch (error) {
                console.error("Hiba a modulok betöltése közben:", error);
                toast.error("Nem sikerült betölteni a modulokat");
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (modules.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Még nincs modul a kurzusban. Hozz létre egy újat!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module: any) => (
                <Card 
                    key={module.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onModuleSelect(module.id)}
                >
                    <CardHeader>
                        <CardTitle>{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{module.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}