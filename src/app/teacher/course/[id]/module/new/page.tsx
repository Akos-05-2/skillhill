"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";

export default function NewModulePage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/services/teacher/course/${params.id}/module`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Hiba történt a modul létrehozásakor");
            }

            toast.success("Modul sikeresen létrehozva");
            router.push(`/teacher/course/${params.id}`);
        } catch (error) {
            console.error("Error creating module:", error);
            toast.error(error instanceof Error ? error.message : "Hiba történt a modul létrehozásakor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Új modul létrehozása</h1>
            
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        Modul címe
                    </label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Leírás
                    </label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Vissza
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Folyamatban..." : "Létrehozás"}
                    </Button>
                </div>
            </form>
        </div>
    );
} 