'use client';

export default function HeroSection(){
    return(
        <section style={{ marginTop: '-100px' }} className="relative flex min-h-[50vh] md:min-h-[60vh] items-center justify-center bg-primary/5 px-4 md:px-6">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 md:mb-6 text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              Tanuld a jövő technológiáit
            </h1>
            <p className="mx-auto mb-6 md:mb-8 max-w-2xl text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
              Csatlakozz a SkillHill közösségéhez és fejleszd készségeidet a legújabb technológiákkal
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="/courses"
                className="inline-flex h-9 md:h-10 lg:h-11 items-center justify-center rounded-md bg-primary px-3 md:px-4 lg:px-8 text-xs md:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Fedezd fel a kurzusokat
              </a>
              <a
                href="/about"
                className="inline-flex h-9 md:h-10 lg:h-11 items-center justify-center rounded-md border bg-background px-3 md:px-4 lg:px-8 text-xs md:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Tudj meg többet
              </a>
            </div>
          </div>
        </div>
      </section>
    );
}