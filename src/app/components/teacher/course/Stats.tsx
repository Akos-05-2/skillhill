import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Course } from "@/app/types";
import { Users, FileText, BookOpen } from "lucide-react";

interface StatsProps {
    course: Course;
}

export default function Stats({ course }: StatsProps) {
    if (!course) {
        return null;
    }

    const stats = [
        {
            title: "Modulok",
            value: course.modules?.length || 0,
            description: "Összes modul",
            icon: BookOpen,
            color: "text-blue-500 dark:text-blue-400"
        },
        {
            title: "Fájlok",
            value: course.resources?.length || 0,
            description: "Összes fájl",
            icon: FileText,
            color: "text-green-500 dark:text-green-400"
        },
        {
            title: "Felhasználók",
            value: course.enrollments?.length || 0,
            description: "Regisztrált felhasználók",
            icon: Users,
            color: "text-purple-500 dark:text-purple-400"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card 
                        key={index} 
                        className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}