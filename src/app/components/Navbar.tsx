"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-background border-b relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold">
                                SkillHill
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className={`${
                                    pathname === "/"
                                        ? "border-primary text-foreground"
                                        : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Főoldal
                            </Link>
                            <Link
                                href="/courses"
                                className={`${
                                    pathname === "/courses"
                                        ? "border-primary text-foreground"
                                        : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Kurzusok
                            </Link>
                            {role === 'teacher' && (
                                <Link
                                    href="/teacher/courses"
                                    className={`${
                                        pathname === "/teacher/courses"
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Kurzusaim
                                </Link>
                            )}
                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className={`${
                                        pathname === "/admin"
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-4">
                            {session ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className={`${
                                            pathname === "/profile"
                                                ? "border-primary text-foreground"
                                                : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        {session.user.name}
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-foreground/60 hover:text-foreground text-sm font-medium"
                                    >
                                        Kijelentkezés
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className={`${
                                        pathname === "/auth/login"
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Bejelentkezés
                                </Link>
                            )}
                        </div>
                        <ThemeToggle />
                        <button className="sm:hidden" onClick={toggleMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
                    <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-xl">
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Menü</h2>
                                <button onClick={toggleMobileMenu} className="p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <div className="px-4 py-2 space-y-1">
                                    <Link href="/" className="block py-2 text-foreground/60 hover:text-foreground">
                                        Főoldal
                                    </Link>
                                    <Link href="/courses" className="block py-2 text-foreground/60 hover:text-foreground">
                                        Kurzusok
                                    </Link>
                                    {role === 'teacher' && (
                                        <Link href="/teacher/courses" className="block py-2 text-foreground/60 hover:text-foreground">
                                            Kurzusaim
                                        </Link>
                                    )}
                                    {role === 'admin' && (
                                        <Link href="/admin" className="block py-2 text-foreground/60 hover:text-foreground">
                                            Admin
                                        </Link>
                                    )}
                                </div>
                                {session?.user && (
                                    <div className="border-t mt-4 px-4 py-4">
                                        <div className="mb-4">
                                            <Link href="/profile" className="block py-2 text-foreground font-medium">
                                                {session.user.name}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                toggleMobileMenu();
                                            }}
                                            className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                        >
                                            Kijelentkezés
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
} 