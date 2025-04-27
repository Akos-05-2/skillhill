"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";

interface File {
    id: number;
    name: string;
    url: string;
    createdAt: string;
}

interface ModuleFilesProps {
    courseId: number;
    moduleId: number;
}

export function ModuleFiles({ courseId, moduleId }: ModuleFilesProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}/module/${moduleId}/files`);
            if (!response.ok) {
                throw new Error("Nem sikerült betölteni a fájlokat");
            }
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error("Hiba a fájlok betöltésekor:", error);
            toast.error("Hiba történt a fájlok betöltésekor");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        try {
            const response = await fetch(
                `/api/services/teacher/course/${courseId}/module/${moduleId}/files?fileId=${fileId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Nem sikerült törölni a fájlt");
            }

            toast.success("Fájl sikeresen törölve");
            fetchFiles();
        } catch (error) {
            console.error("Hiba a fájl törlése közben:", error);
            toast.error("Hiba történt a fájl törlése közben");
        }
    };

    const handleDownloadFile = (url: string, name: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchFiles();
    }, [courseId, moduleId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Modul fájljai</h2>
            {files.length === 0 ? (
                <p className="text-gray-500">Még nincsenek fájlok a modulban.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fájl neve</TableHead>
                            <TableHead>Feltöltve</TableHead>
                            <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownloadFile(file.url, file.name)}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteFile(file.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
} 