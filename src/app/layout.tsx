import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SkillHill",
    description: "Online oktatási platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="hu" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <div className="flex min-h-screen flex-col justify-between">
                        <div>
                            <Header />
                            <main>
                                {children}
                            </main>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
