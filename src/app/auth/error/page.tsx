"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "OAuthAccountNotLinked":
                return "Ez az email cím már használatban van egy másik fiókkal. Kérjük, jelentkezz be az eredeti fiókjával.";
            case "AccessDenied":
                return "Nincs jogosultsága a bejelentkezéshez.";
            case "Verification":
                return "A verifikációs link lejárt vagy érvénytelen.";
            default:
                return "Hiba történt a bejelentkezés során.";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        Bejelentkezési hiba
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        {getErrorMessage(error)}
                    </p>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => window.location.href = "/auth/signin"}
                            variant="outline"
                        >
                            Vissza a bejelentkezéshez
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 