'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthHeader from '../components/auth-header/page';
import CourseDialog from '../components/course-dialog/page';
import StatsDialog from '../components/stats-dialog/page';
import './page.css';

const Teacher = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.roleId !== 3) {
      router.push('/'); // Ha nem 3-as roleId-val rendelkezik, visszairányítjuk a főoldalra
    }
  }, [status, router, session]);

  const handleCreateCourse = async (courseData: { course_name: string; description: string }) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Hiba történt a kurzus létrehozása során');
      }

      const newCourse = await response.json();
      console.log('Új kurzus létrehozva:', newCourse);
      setIsDialogOpen(false);
      
      // Itt frissíthetnénk a kurzusok listáját
      // TODO: Implementálni a kurzusok listájának frissítését
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a kurzus létrehozása során!');
    }
  };

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Betöltés...</div>
      </div>
    );
  }

  // Ha nincs bejelentkezve vagy nem 3-as roleId-val rendelkezik, ne jelenítse meg a tartalmat
  if (status === 'unauthenticated' || session?.user?.roleId !== 3) {
    return null;
  }

  return (
    <main>
      <AuthHeader />
      
      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="hero-content">
            <h1 className="heading-1">Oktatói Felület</h1>
            <p className="text-xl text-muted">
              Üdvözöljük az oktatói felületen! Itt kezelheti kurzusait és követheti tanulói előrehaladását.
            </p>
          </div>
        </div>
      </section>

      {/* Active Courses Section */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="heading-2">Aktív Kurzusok</h2>
          <div className="course-card-container">
            <div className="course-card">
              <div className="course-card-content">
                <h3 className="course-card-title">Webfejlesztés alapok</h3>
                <p className="course-card-description">
                  12 aktív tanuló • 4 modul • 24 lecke
                </p>
                <div className="course-card-footer">
                  <span className="text-muted">Következő óra: 2024.03.08</span>
                  <button className="btn btn-primary">Részletek</button>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-card-content">
                <h3 className="course-card-title">React.js haladó</h3>
                <p className="course-card-description">
                  8 aktív tanuló • 6 modul • 36 lecke
                </p>
                <div className="course-card-footer">
                  <span className="text-muted">Következő óra: 2024.03.10</span>
                  <button className="btn btn-primary">Részletek</button>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-card-content">
                <h3 className="course-card-title">Python adatelemzés</h3>
                <p className="course-card-description">
                  15 aktív tanuló • 5 modul • 30 lecke
                </p>
                <div className="course-card-footer">
                  <span className="text-muted">Következő óra: 2024.03.12</span>
                  <button className="btn btn-primary">Részletek</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="section">
        <div className="container">
          <h2 className="heading-2">Gyors Műveletek</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Új Kurzus</h3>
              <p className="feature-description">
                Hozzon létre új kurzust és töltse fel a tananyagokat
              </p>
              <button 
                className="btn btn-secondary mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                Létrehozás
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Statisztikák</h3>
              <p className="feature-description">
                Tekintse meg a kurzusok és tanulók statisztikáit
              </p>
              <button 
                className="btn btn-secondary mt-4"
                onClick={() => setIsStatsOpen(true)}
              >
                Megtekintés
              </button>
            </div>
          </div>
        </div>
      </section>

      <CourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateCourse}
      />

      <StatsDialog
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </main>
  );
}

export default Teacher;