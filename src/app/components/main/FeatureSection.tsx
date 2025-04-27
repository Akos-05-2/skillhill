'use client';

export default function FeatureSection(){
    return(
        <section className="py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <div className="group rounded-lg border bg-card p-4 sm:p-6 transition-colors hover:bg-accent">
              <h3 className="mb-2 text-base md:text-lg lg:text-xl font-semibold">Modern technológiák</h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                Naprakész tudás a legújabb technológiákról és fejlesztési módszerekről.
              </p>
            </div>
            <div className="group rounded-lg border bg-card p-4 sm:p-6 transition-colors hover:bg-accent">
              <h3 className="mb-2 text-base md:text-lg lg:text-xl font-semibold">Gyakorlatorientált oktatás</h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                Valós projekteken keresztül tanulhatsz, szakértő oktatók segítségével.
              </p>
            </div>
            <div className="group rounded-lg border bg-card p-4 sm:p-6 transition-colors hover:bg-accent">
              <h3 className="mb-2 text-base md:text-lg lg:text-xl font-semibold">Rugalmas tanulás</h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                Saját tempódban haladhatsz, bárhonnan és bármikor tanulhatsz.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}
