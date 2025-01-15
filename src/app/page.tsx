'use client'
import LogOut from './logout/page';
import React, { useEffect, useState } from 'react';
import CourseCard from './coursecard/page';
import { ICourse } from './api/models/course';
//import { Role } from './api/services/role/role';
import './page.css';

export default function Home() {
    const [courses, setCourses] = useState<ICourse[]>([]);

    useEffect(() => {
      const fetchCourses = async () => {
        try{
          const response = await fetch('http://localhost:3000/api/services/course', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const data = await response.json();
          setCourses(data);
        }catch{
          console.error('Hiba a csatlakozás során!');
        } 
      };
      fetchCourses();
    }, []);

    return(
      <div>
        <h1>Kurzusok</h1>
        <div className='logout'>
          <LogOut />
        </div>
        <div className='course-card-container'>
          {courses.map((c) => {
            if (c === undefined) return null;
            return <CourseCard key={c.course_id} c={c} />
          })}
        </div>
      </div>
    );
}
