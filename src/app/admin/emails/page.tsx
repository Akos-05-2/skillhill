"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Container } from "@/app/components/ui/container";

export default function EmailKuldes() {
    const [formData, setFormData] = useState({
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Hiba történt az email küldése során");
            }

            toast.success("Email sikeresen elküldve!");
            setFormData({
                subject: "",
                message: ""
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Hiba történt az email küldése során";
            toast.error(errorMessage);
            console.error("Hiba részletei:", error);
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

    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Email küldés</h1>
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Új email küldése</CardTitle>
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
                                    placeholder="Email tárgya"
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
                                    placeholder="Email szövege"
                                    className="min-h-[200px]"
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Küldés..." : "Email küldése"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
} 