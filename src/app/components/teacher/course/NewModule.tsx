import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface NewModuleProps {
    courseId: number;
    isOpen: boolean;
    onClose: () => void;
    onModuleCreated: () => void;
}

export default function NewModule({ courseId, isOpen, onClose, onModuleCreated }: NewModuleProps) {
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/services/teacher/course/${courseId}/modules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: moduleName,
                    description: description
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Sikertelen modul létrehozás");
            }

            toast.success("Modul sikeresen létrehozva");
            setModuleName("");
            setDescription("");
            onModuleCreated();
            onClose();
        } catch (error) {
            console.error("Hiba a modul létrehozásakor:", error);
            toast.error(error instanceof Error ? error.message : "Sikertelen modul létrehozás");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 mb-6">
                        Új modul létrehozása
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateModule} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Modul neve
                        </label>
                        <Input
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                            placeholder="Add meg a modul nevét"
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Leírás
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add meg a modul leírását"
                            className="w-full min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-black"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Mégse
                        </Button>
                        <Button 
                            type="submit" 
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Létrehozás...' : 'Modul létrehozása'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 