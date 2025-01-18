'use client';
import CourseCard from './coursecard/page';
import Header from './header/page';
import Footer from './footer/page';
import './page.css';

export default function Home() {
    return (
        <div>
            <div className='header'>
                <Header />
            </div>
            <div className='course-card-container'>
                <CourseCard />
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
}