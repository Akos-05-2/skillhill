'use client';

export default function About() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <section className="relative py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
              Rólunk
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              A SkillHill küldetése, hogy mindenki számára elérhetővé tegye a minőségi IT oktatást
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Mission */}
            <div>
              <h2 className="mb-4 text-2xl md:text-3xl font-semibold">
                Küldetésünk
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Hisszük, hogy a technológiai oktatásnak nem csak a programozási nyelvekről és eszközökről kell szólnia. 
                Célunk olyan szakemberek képzése, akik nemcsak a kódolásban jártasak, hanem értik az iparág működését, 
                és képesek komplex problémákat megoldani.
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="mb-4 text-2xl md:text-3xl font-semibold">
                Értékeink
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <div>
                    <h3 className="font-medium text-lg">Minőségi Oktatás</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Naprakész tudásanyag és gyakorlati tapasztalattal rendelkező oktatók
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <div>
                    <h3 className="font-medium text-lg">Gyakorlatorientált Megközelítés</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Valós projekteken keresztül tanulhatsz, hogy azonnal hasznosítható tudást szerezz
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <div>
                    <h3 className="font-medium text-lg">Közösségi Tanulás</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aktív közösség, ahol együtt fejlődhetsz más tanulókkal
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="p-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Elégedett Tanuló</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Aktív Kurzus</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Szakértő Oktató</div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Ajánlási Arány</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">
            Csapatunk
          </h2>
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative overflow-hidden rounded-full">
                <img
                  src="/images/bolc1252.jpg"
                  alt="Csapattag képe"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg md:text-xl font-medium">Olajkár Ákos</h3>
              <p className="text-gray-600 dark:text-gray-400">Alapító, Vezető Oktató</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative overflow-hidden rounded-full">
                  <img
                    src="/images/Flux_Dev_a_highresolution_digital_portrait_of_a_middleaged_Cau_1.jpg"
                  alt="Csapattag képe"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg md:text-xl font-medium">Nagy Péter</h3>
              <p className="text-gray-600 dark:text-gray-400">Oktatási Igazgató</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative overflow-hidden rounded-full">
                <img
                  src="/images/Flux_Dev_A_professional_highresolution_portrait_of_a_confident_1.jpg"
                  alt="Csapattag képe"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg md:text-xl font-medium">Kovács Anna</h3>
              <p className="text-gray-600 dark:text-gray-400">Technológiai Vezető</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 