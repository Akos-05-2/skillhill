import Link from "next/link";
export default function PopularCourses(){
    return(
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
                  <Link href="/courses/ai-ml" className="btn btn-secondary">
                    Részletek
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
}