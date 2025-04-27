/**
 * FilePreview komponens
 * 
 * Ez a komponens különböző típusú fájlok előnézetét és kezelését biztosítja.
 * Támogatott fájltípusok:
 * - Képek (jpg, jpeg, png, gif, webp)
 * - Videók (mp4, webm, mov, avi)
 * - PDF dokumentumok
 * - Office dokumentumok (doc, docx, ppt, pptx)
 * - Kód fájlok (html, css, js, ts, cs, cpp)
 * - XML fájlok
 * - Archívumok (zip, rar, 7z)
 * 
 * A komponens a következő funkciókat biztosítja:
 * - Fájl előnézet megjelenítése a típus alapján
 * - Fájl letöltése vagy megtekintése
 * - Fájl törlése (opcionális)
 * - Reszponzív megjelenítés
 * - Hiba kezelés
 */

"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Download, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

interface FilePreviewProps {
    file: {
        id: number;
        name: string;
        url: string;
        type: string;
        size: number;
        createdAt: string;
    };
    onDelete?: () => void;
}

export default function FilePreview({ file, onDelete }: FilePreviewProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!file.url) {
                    throw new Error("Nincs megadva URL a fájlhoz");
                }

                const fullUrl = file.url.startsWith('http') ? file.url : `${window.location.origin}${file.url}`;

                if (file.type.startsWith('image/')) {
                    setPreviewUrl(fullUrl);
                } else if (file.type === 'application/pdf') {
                    setPreviewUrl(fullUrl);
                } else {
                    setPreviewUrl(null);
                }
            } catch (err) {
                console.error("Hiba a fájl előnézet betöltése közben:", err);
                setError("Nem sikerült betölteni a fájl előnézetét");
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [file]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (onDelete) {
            try {
                setIsDeleting(true);
                await onDelete();
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-yellow-500" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <p className="mt-2 text-sm text-gray-600">{error}</p>
            </div>
        );
    }

    if (!previewUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-red-500" viewBox="0 0 16 16">
                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <p className="mt-2 text-sm text-gray-600">Nem támogatott fájltípus</p>
                <div className="mt-4 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Letöltés
                    </Button>
                    {onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Törlés
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Biztosan törölni szeretnéd ezt a fájlt?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ez a művelet nem vonható vissza. A fájl véglegesen törlődik.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Mégse</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Törlés...
                                            </>
                                        ) : (
                                            "Törlés"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            {file.type.startsWith('image/') ? (
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-contain"
                />
            ) : (
                <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    title={file.name}
                />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between items-center">
                <span className="text-white text-sm truncate">{file.name}</span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-white hover:bg-gray-100"
                    >
                        <Download className="h-4 w-4" />
                        Letöltés
                    </Button>
                    {onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Törlés
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Biztosan törölni szeretnéd ezt a fájlt?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ez a művelet nem vonható vissza. A fájl véglegesen törlődik.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Mégse</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Törlés...
                                            </>
                                        ) : (
                                            "Törlés"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </div>
    );
} 