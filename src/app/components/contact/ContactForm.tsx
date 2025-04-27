"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export function ContactForm() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: session?.user?.name,
                    email: session?.user?.email,
                    ...formData
                }),
            });

            if (response.ok) {
                toast.success("Üzenet sikeresen elküldve!");
                setFormData({
                    subject: "",
                    message: ""
                });
            } else {
                toast.error("Hiba történt az üzenet küldése során.");
            }
        } catch (error) {
            toast.error("Hiba történt az üzenet küldése során.");
            console.error("Hiba:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!session) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Kapcsolat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        Kérlek jelentkezz be az üzenet küldéséhez.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Kapcsolat</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Tárgy
                        </label>
                        <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Üzenet tárgya"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                            Üzenet
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Üzeneted"
                            className="min-h-[150px]"
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Küldés..." : "Üzenet küldése"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 