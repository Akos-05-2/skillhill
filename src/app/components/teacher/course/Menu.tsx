"use client";

import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Plus, Book, FileText, Users, Settings, Menu as MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/app/components/ui/sheet";

interface MenuProps {
    activeTab: string;
    onTabChange: (value: string) => void;
    courseId: string;
}

export function Menu({ activeTab, onTabChange, courseId }: MenuProps) {
    const router = useRouter();

    const menuItems = [
        { value: "modules", icon: Book, label: "Modulok" },
        { value: "files", icon: FileText, label: "Fájlok" },
        { value: "students", icon: Users, label: "Diákok" },
        { value: "settings", icon: Settings, label: "Beállítások" },
    ];

    const renderMenuContent = () => (
        <>
            {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        onClick={() => onTabChange(item.value)}
                        className="flex items-center gap-2 px-4 py-2 w-full justify-start"
                    >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </TabsTrigger>
                );
            })}
        </>
    );

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MenuIcon className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[240px] p-4">
                        <div className="flex flex-col gap-2">
                            <Tabs value={activeTab} orientation="vertical" className="w-full">
                                <TabsList className="flex flex-col h-auto">
                                    {renderMenuContent()}
                                </TabsList>
                            </Tabs>
                            <Button
                                onClick={() => router.push(`/teacher/course/${courseId}/module/new`)}
                                className="w-full flex items-center gap-2 mt-4"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Új modul</span>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                <span className="font-medium">{menuItems.find(item => item.value === activeTab)?.label}</span>
                <div className="w-9" />
            </div>

            <div className="hidden sm:flex justify-between items-center gap-4">
                <Tabs value={activeTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 gap-2">
                        {renderMenuContent()}
                    </TabsList>
                </Tabs>
                <Button
                    onClick={() => router.push(`/teacher/course/${courseId}/module/new`)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Új modul</span>
                </Button>
            </div>
        </div>
    );
}