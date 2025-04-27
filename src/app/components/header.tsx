"use client";

import { useSession, signOut } from 'next-auth/react';
import { LoginDialog } from './LoginDialog';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { EditNameDialog } from './edit-name-dialog/edit-name-dialog';
import { usePathname } from 'next/navigation';
import NavigationGuard from '@/app/components/navigation/NavigationGuard';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './theme-toggle';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
    const { data: session } = useSession();
    const { role } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isEditNameOpen, setIsEditNameOpen] = useState(false);
    const pathname = usePathname();
    const isTeacherPage = pathname.startsWith('/teacher');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };
        
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const menuItems = () => (
        <>
            {role === 'admin' || role === 'super_admin' ? (
                <>
                    <Link 
                        href="/admin" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname.startsWith("/admin") ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Admin felület
                    </Link>
                    <Link 
                        href="/about" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Rólunk
                    </Link>
                </>
            ) : role === 'teacher' ? (
                <>
                    <Link 
                        href="/teacher" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname.startsWith("/teacher") ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Tanári felület
                    </Link>
                    <Link 
                        href="/about" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Rólunk
                    </Link>
                </>
            ) : role === 'user' ? (
                <>
                    <Link 
                        href="/courses" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/courses" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Kurzusok
                    </Link>
                    <Link 
                        href="/my-courses" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/my-courses" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Jelentkezéseim
                    </Link>
                    <Link 
                        href="/about" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Rólunk
                    </Link>
                </>
            ) : (
                <>
                    <Link 
                        href="/courses" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/courses" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Kurzusok
                    </Link>
                    <Link 
                        href="/about" 
                        className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                            pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Rólunk
                    </Link>
                </>
            )}
        </>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold">SkillHill</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        {menuItems()}
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    {session ? (
                        <>
                            <button
                                onClick={() => setIsEditNameOpen(true)} 
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {session.user?.name || 'Felhasználó'}
                            </button>
                            <button 
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Kijelentkezés
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsLoginOpen(true)}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Bejelentkezés
                        </button>
                    )}
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>
            
            <div 
                className={`md:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen 
                        ? 'max-h-[500px] opacity-100 transform translate-y-0' 
                        : 'max-h-0 opacity-0 transform -translate-y-2'
                }`}
            >
                <div className="container py-4 flex flex-col space-y-4">
                    {menuItems()}
                </div>
            </div>

            <LoginDialog 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                onLoginSuccess={() => setIsLoginOpen(false)} 
            />
            <EditNameDialog
                isOpen={isEditNameOpen} 
                onClose={() => setIsEditNameOpen(false)}
            />
        </nav>
    );
} 