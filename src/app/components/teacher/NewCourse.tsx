import { Dialog, DialogTitle, DialogHeader, DialogContent } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { Category } from "@/app/types";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

export default function NewCourse() {
    const [isNewCourseDialogOpen, setIsNewCourseDialogOpen] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/services/categories");
                if (!response.ok) throw new Error("Nem sikerült betölteni a kategóriákat");
                const data = await response.json();
                if (Array.isArray(data)) {
                    const formattedCategories = data.map(category => ({
                        id: category.category_id,
                        name: category.category_name,
                        courses: []
                    }));
                    setCategories(formattedCategories);
                } else {
                    console.error("A válasz nem tömb:", data);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Hiba a kategóriák betöltése közben:", error);
                toast.error("Nem sikerült betölteni a kategóriákat");
            }
        };
        fetchCategories();

        const handleOpenDialog = () => {
            setIsNewCourseDialogOpen(true);
        };

        document.addEventListener('openNewCourseDialog', handleOpenDialog);
        return () => {
            document.removeEventListener('openNewCourseDialog', handleOpenDialog);
        };
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Csak képfájlok feltöltése engedélyezett');
            return;
        }

        setSelectedImage(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setImagePreview(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!categoryId) {
                throw new Error("Válassz kategóriát");
            }
            
            const formData = new FormData();
            formData.append('course_name', courseName);
            formData.append('description', description);
            formData.append('category_id', categoryId.toString());
            
            if (selectedImage) {
                formData.append('image', selectedImage);
            }
            
            const response = await fetch("/api/services/teacher", {
                method: "POST",
                body: formData
            });

            let responseData;
            try {
                responseData = await response.json();
                console.log('Szerver válasza:', responseData);
            } catch (jsonError) {
                console.error('Hiba a szerver válasz feldolgozása során:', jsonError);
                throw new Error('A szerver válasza nem értelmezhető');
            }

            if (!response.ok) {
                const hibaUzenet = responseData?.error || "Sikertelen kurzus létrehozás";
                console.error('Hibás válasz a szervertől:', hibaUzenet, responseData?.details || '');
                throw new Error(hibaUzenet);
            }

            console.log('Sikeres kurzus létrehozás');
            toast.success("Kurzus sikeresen létrehozva");
            
            setIsNewCourseDialogOpen(false);
            setCourseName("");
            setDescription("");
            setCategoryId(null);
            setSelectedImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            window.location.href = "/teacher";
        } catch (error) {
            console.error("Hiba a kurzus létrehozásakor:", error);
            toast.error(error instanceof Error ? error.message : "Sikertelen kurzus létrehozás");
        } finally {
            setLoading(false);
        }
    };

    const openNewCourseDialog = () => {
        setIsNewCourseDialogOpen(true);
    };

    return (
        <Dialog open={isNewCourseDialogOpen} onOpenChange={(open) => {
            setIsNewCourseDialogOpen(open);
            if (!open) {
                window.location.href = "/teacher";
            }
        }}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Új kurzus létrehozása
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kurzus neve
                        </label>
                        <Input
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Add meg a kurzus nevét"
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black dark:text-white dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Leírás
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add meg a kurzus leírását"
                            className="w-full min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-black dark:text-white dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kategória
                        </label>
                        <Select 
                            value={categoryId?.toString() || ""} 
                            onValueChange={(value) => setCategoryId(parseInt(value))}
                        >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-offset-2">
                                <SelectValue placeholder="Válassz kategóriát" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kurzus képe
                        </label>
                        <div className="flex items-center space-x-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="flex-1"
                            />
                            {imagePreview && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleImageRemove}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Kurzus kép előnézet"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsNewCourseDialogOpen(false)}
                        >
                            Mégse
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Folyamatban...
                                </>
                            ) : (
                                "Létrehozás"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}