import { useState, useEffect, Suspense  } from 'react';
import { CourseCardProps } from '../api/models/coursecardprops';

import {ICourse} from '../api/models/course';
import './style.css';

async function fetchCourses(): Promise<ICourse[]> {
    const course = await fetch('http://localhost:3000/api/services/course', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return course.json();
}

const CourseCard: React.FC<CourseCardProps> = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    useEffect(() => {
        fetchCourses().then(c => setCourses(c));
    }, []);

    return (
            <Suspense fallback={<p>Töltés...</p>}>
                {courses.map(course => (
                    <div key={course.course_id} className="course-card">
                        <h3>{course.course_name}</h3>
                        <p>{course.description}</p>
                    </div>
                ))}
            </Suspense>
    );
};


export default CourseCard;