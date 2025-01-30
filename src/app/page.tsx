'use client';
import CourseCard from './components/coursecard/page';
import Header from './components/header/page';
import Footer from './components/footer/page';
import './page.css';
import { useState, useEffect } from 'react';
import { ICourse } from './api/models/course';
import { fetchCourses } from './components/coursecard/page';
import { SessionProvider } from 'next-auth/react';

export default function Home() {
    const [allCourses, setAllCourses] = useState<ICourse[]>([]); 

    useEffect(() => {
        const getCourses = async () => {
            try {
                const courses = await fetchCourses();
                console.log("Fetched courses:", courses);
                setAllCourses(courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        getCourses();
    }, []);

    return (
        <SessionProvider>
            <div>
                <div className='header'>
                    <Header />
                </div>
                <div className='course-card-container'>
                    <CourseCard c={allCourses} />
                </div>
                <div className='footerFront'>
                    <Footer />
                </div>
            </div>
        </SessionProvider>
    );
}