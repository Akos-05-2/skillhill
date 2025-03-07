'use client';
import './page.css';
import Link from 'next/link';
import AuthHeader from './components/auth-header/page';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <AuthHeader />
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
                <Link href="/login" className="btn btn-outline">
                  Bejelentkezés
                </Link>
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
              <h3 className="feature-title">Szakértői oktatók</h3>
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
              <Link href="/login" className="btn btn-primary btn-large">
                Bejelentkezés
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3 className="footer-logo">SkillHill</h3>
              <p className="footer-tagline">
                A jövő technológiáinak oktatása
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h4 className="footer-title">Kurzusok</h4>
              <Link href="/courses/web">Webfejlesztés</Link>
              <Link href="/courses/mobile">Mobilfejlesztés</Link>
              <Link href="/courses/ai">AI és ML</Link>
              <Link href="/courses/data">Adattudomány</Link>
            </div>
            <div className="footer-links">
              <h4 className="footer-title">Információk</h4>
              <Link href="/about">Rólunk</Link>
              <Link href="/teachers">Oktatók</Link>
              <Link href="/pricing">Árak</Link>
              <Link href="/contact">Kapcsolat</Link>
            </div>
            <div className="footer-links">
              <h4 className="footer-title">Jogi</h4>
              <Link href="/privacy">Adatvédelem</Link>
              <Link href="/terms">ÁSZF</Link>
              <Link href="/cookies">Cookie szabályzat</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SkillHill. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}