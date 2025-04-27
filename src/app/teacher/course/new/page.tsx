"use client";

import NewCourse from "@/app/components/teacher/NewCourse";
import { useEffect } from "react";

export default function NewCoursePage() {
    useEffect(() => {
        const event = new CustomEvent('openNewCourseDialog');
        document.dispatchEvent(event);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <NewCourse />
        </div>
    );
} 