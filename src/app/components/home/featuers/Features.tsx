export default function Features(){
    return(
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
    );
}