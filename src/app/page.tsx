'use client';
import './page.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LoginDialog } from './components/login-dialog/login-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Tanulj a jövő technológiáit</h1>
              <p className="hero-subtitle">
                Csatlakozz a SkillHill közösségéhez és fejleszd készségeidet a legújabb technológiákkal
              </p>
              <div className="hero-buttons">
                <Link href="/courses" className="btn btn-primary">
                  Fedezd fel a kurzusokat
                </Link>
                {!session && (
                  <button className="btn btn-outline" onClick={() => setShowLogin(true)}>
                    Bejelentkezés
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">Miért válassz minket?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎓</div>
                <h3 className="feature-title">Hozzáértő oktatók</h3>
                <p className="feature-text">
                  Tapasztalt szakemberektől tanulhatsz, akik napi szinten használják a technológiákat
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💻</div>
                <h3 className="feature-title">Gyakorlati tudás</h3>
                <p className="feature-text">
                  Valós projekteken keresztül sajátíthatod el a legkeresettebb technológiákat
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 className="feature-title">Karriertámogatás</h3>
                <p className="feature-text">
                  Segítünk az álláskeresésben és a karriered építésében
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="courses">
          <div className="container">
            <h2 className="section-title">Népszerű kurzusaink</h2>
            <div className="courses-grid">
              <div className="course-card">
                <div className="course-image">
                  <img src="/images/web-dev.jpg" alt="Webfejlesztés" />
                  <div className="course-badge">Legnépszerűbb</div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Modern Webfejlesztés</h3>
                  <p className="course-text">
                    Sajátítsd el a modern webes technológiákat és építs full-stack alkalmazásokat
                  </p>
                  <div className="course-meta">
                    <span>⭐ 4.9 (128 értékelés)</span>
                    <span>👥 312 tanuló</span>
                  </div>
                  <Link href="/courses/web-dev" className="btn btn-secondary">
                    Részletek
                  </Link>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image">
                  <img src="/images/mobile-dev.jpg" alt="Mobilfejlesztés" />
                  <div className="course-badge">Új</div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Mobilalkalmazás Fejlesztés</h3>
                  <p className="course-text">
                    Tanulj meg natív iOS és Android alkalmazásokat fejleszteni
                  </p>
                  <div className="course-meta">
                    <span>⭐ 4.8 (96 értékelés)</span>
                    <span>👥 248 tanuló</span>
                  </div>
                  <Link href="/courses/mobile-dev" className="btn btn-secondary">
                    Részletek
                  </Link>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image">
                  <img src="/images/ai-ml.jpg" alt="AI és ML" />
                  <div className="course-badge">Haladó</div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">AI és Gépi Tanulás</h3>
                  <p className="course-text">
                    Ismerkedj meg a mesterséges intelligencia és gépi tanulás alapjaival
                  </p>
                  <div className="course-meta">
                    <span>⭐ 4.9 (84 értékelés)</span>
                    <span>👥 196 tanuló</span>
                  </div>
                  <Link href="/courses/ai-ml" className="btn btn-secondary">
                    Részletek
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Kezdd el a tanulást még ma!</h2>
              <p className="cta-text">
                Csatlakozz több mint 1000 elégedett tanulónkhoz és kezdd el építeni a jövőd
              </p>
              {!session && (
                <button className="btn btn-primary btn-large" onClick={() => setShowLogin(true)}>
                  Bejelentkezés
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SkillHill</h3>
              <p className="text-gray-400">
                Modern oktatási platform a jövő technológiáinak elsajátításához
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kurzusok</h4>
              <ul className="space-y-2">
                <li><Link href="/courses/web-dev" className="text-gray-400 hover:text-white">Webfejlesztés</Link></li>
                <li><Link href="/courses/mobile-dev" className="text-gray-400 hover:text-white">Mobilfejlesztés</Link></li>
                <li><Link href="/courses/ai-ml" className="text-gray-400 hover:text-white">AI és ML</Link></li>
                <li><Link href="/courses" className="text-gray-400 hover:text-white">Összes kurzus</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Információk</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">Rólunk</Link></li>
                <li><Link href="/instructors" className="text-gray-400 hover:text-white">Oktatók</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">GYIK</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Kapcsolat</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Jogi</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white">ÁSZF</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Adatvédelem</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie szabályzat</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SkillHill. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>

      <LoginDialog 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
}