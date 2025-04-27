'use client';
import { useState } from 'react';
import { Course } from '../types';
import './style.css';

interface CourseCardProps {
    c: Course;
    userId: string;
}

const enrollUser = async (courseId: number, userId: string): Promise<void> => {
    try {
        const response = await fetch('http://localhost:3000/api/services/enrollment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_id: courseId,
                user_id: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Hiba a jelentkezéskor!');
        }

        const data = await response.json();
        console.log('Sikeres jelentkezés:', data);
    } catch (error) {
        console.error('Hiba a jelentkezéskor:', error);
    }
};

const CourseCard: React.FC<CourseCardProps> = ({ c, userId }) => {
    const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);

    const handleEnroll = async () => {
        setEnrollmentStatus(null);
        try {
            await enrollUser(c.id, userId);
            setEnrollmentStatus('A jelentkezés sikeres volt!');
        } catch (error: unknown) {
            setEnrollmentStatus('Hiba a jelentkezéskor! Próbálja újra!');
        }
    };
    
    return (
        <div className='course-card'>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <br />
            <button onClick={handleEnroll}>Jelentkezés</button>
        </div>
    );
};

export default CourseCard; 