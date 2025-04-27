"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Container } from "@/app/components/ui/container";
import Link from "next/link";

interface Page {
    title: string;
    path: string;
    roles: string[];
    children?: Page[];
}

const siteMap: Page[] = [
    {
        title: "Főoldal",
        path: "/",
        roles: ["all"]
    },
    {
        title: "Tanfolyamok",
        path: "/tanfolyamok",
        roles: ["all"],
        children: [
            {
                title: "Kategóriák",
                path: "/kategoriak",
                roles: ["all"]
            },
            {
                title: "Akciók",
                path: "/akciok",
                roles: ["all"]
            }
        ]
    },
    {
        title: "Felhasználói fiók",
        path: "/profil",
        roles: ["all"],
        children: [
            {
                title: "Beállítások",
                path: "/profil/beallitasok",
                roles: ["all"]
            },
            {
                title: "Jelszó módosítás",
                path: "/profil/jelszo",
                roles: ["all"]
            }
        ]
    },
    {
        title: "Tanár",
        path: "/teacher",
        roles: ["teacher", "admin", "super_admin"],
        children: [
            {
                title: "Kurzusaim",
                path: "/teacher/courses",
                roles: ["teacher", "admin", "super_admin"]
            },
            {
                title: "Diákjaim",
                path: "/teacher/students",
                roles: ["teacher", "admin", "super_admin"]
            },
            {
                title: "Statisztikák",
                path: "/teacher/stats",
                roles: ["teacher", "admin", "super_admin"]
            }
        ]
    },
    {
        title: "Admin",
        path: "/admin",
        roles: ["admin", "super_admin"],
        children: [
            {
                title: "Felhasználók",
                path: "/admin/users",
                roles: ["admin", "super_admin"]
            },
            {
                title: "Kurzusok",
                path: "/admin/courses",
                roles: ["admin", "super_admin"]
            },
            {
                title: "Email küldés",
                path: "/admin/emails",
                roles: ["admin", "super_admin"]
            }
        ]
    },
    {
        title: "Jogi információk",
        path: "/jogi",
        roles: ["all"],
        children: [
            {
                title: "Adatvédelmi irányelvek",
                path: "/adatvedelmi-iranyelvek",
                roles: ["all"]
            },
            {
                title: "Felhasználási feltételek",
                path: "/felhasznalasi-feltetelek",
                roles: ["all"]
            },
            {
                title: "Cookie szabályzat",
                path: "/cookie-szabalyzat",
                roles: ["all"]
            }
        ]
    }
];

export default function Oldalterkep() {
    const { data: session } = useSession();
    const [accessiblePages, setAccessiblePages] = useState<Page[]>([]);

    useEffect(() => {
        if (session?.user?.role) {
            const role = session.user.role;
            const filteredPages = siteMap.filter(page => 
                page.roles.includes("all") || 
                page.roles.includes(role)
            ).map(page => ({
                ...page,
                children: page.children?.filter(child => 
                    child.roles.includes("all") || 
                    child.roles.includes(role)
                )
            }));
            setAccessiblePages(filteredPages);
        }
    }, [session]);

    const renderPage = (page: Page, level: number = 0) => {
        const hasChildren = page.children && page.children.length > 0;
        const marginLeft = level * 4;

        return (
            <div key={page.path} className="mb-4">
                <div className={`flex items-center ${hasChildren ? 'font-bold' : ''}`} style={{ marginLeft: `${marginLeft}rem` }}>
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <Link href={page.path} className="hover:text-primary transition-colors">
                        {page.title}
                    </Link>
                </div>
                {hasChildren && (
                    <div className="ml-4">
                        {page.children?.map(child => renderPage(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Oldaltérkép</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Navigáció</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {accessiblePages.map(page => renderPage(page))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
} 