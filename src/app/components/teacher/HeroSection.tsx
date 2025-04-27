import { Input } from "@/app/components/ui/input";
import { Course } from "@/app/types";

interface HeroSectionProps {
    courses: Course[];
    searchTerm: string;
    onSearch: (value: string) => void;
}

export default function HeroSection({ courses, searchTerm, onSearch }: HeroSectionProps) {
    const stats = {
        total: courses.length,
        active: courses.filter(course => course.is_active).length,
        students: courses.reduce((acc, course) => acc + (course.enrollments?.length || 0), 0)
    };

    return (
        <section className="pt-24 pb-12 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div className="text-white mb-6 md:mb-0">
                        <h1 className="text-4xl font-bold mb-4">Tanári Vezérlőpult</h1>
                        <div className="flex flex-wrap gap-6 text-lg">
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                                <span className="block text-white/80 text-sm font-medium">Összes kurzus</span>
                                <span className="text-2xl font-bold">{stats.total}</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                                <span className="block text-white/80 text-sm font-medium">Aktív kurzusok</span>
                                <span className="text-2xl font-bold">{stats.active}</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                                <span className="block text-white/80 text-sm font-medium">Tanulói létszám</span>
                                <span className="text-2xl font-bold">{stats.students}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mb-8">
                    <Input
                        placeholder="Keresés kurzusok között..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full md:max-w-md bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border-white/20 focus:border-white/40"
                    />
                </div>
            </div>
        </section>
    );
}
