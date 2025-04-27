"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function CookieSzabalyzat() {
    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Cookie Szabályzat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">1. Bevezetés</h2>
                        <p className="mb-4">
                            A SkillHill (a továbbiakban: "Szolgáltatás") cookie-kat használ a weboldal működéséhez és 
                            a felhasználói élmény javításához. Ez a szabályzat ismerteti, hogy milyen cookie-kat használunk 
                            és hogyan kezeljük azokat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">2. Cookie-k típusai</h2>
                        <h3 className="text-lg font-medium mb-2">2.1. Szükséges cookie-k</h3>
                        <p className="mb-4">
                            Ezek a cookie-k elengedhetetlenek a weboldal működéséhez. Nélkülük a weboldal nem működne megfelelően.
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Munkamenet cookie-k (session cookies)</li>
                            <li>Biztonsági cookie-k</li>
                            <li>Bejelentkezési cookie-k</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">2.2. Analitikai cookie-k</h3>
                        <p className="mb-4">
                            Ezek a cookie-k segítenek megérteni, hogyan használják a látogatók a weboldalt.
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Google Analytics</li>
                            <li>Oldalhasználati statisztikák</li>
                            <li>Felhasználói viselkedés elemzése</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">2.3. Funkcionális cookie-k</h3>
                        <p className="mb-4">
                            Ezek a cookie-k lehetővé teszik a weboldal további funkcióinak használatát.
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Nyelvi beállítások</li>
                            <li>Felhasználói preferenciák</li>
                            <li>Egyéb személyre szabott beállítások</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">3. Cookie-k kezelése</h2>
                        <h3 className="text-lg font-medium mb-2">3.1. Cookie-k elfogadása</h3>
                        <p className="mb-4">
                            Az első látogatáskor a felhasználó elfogadhatja vagy elutasíthatja a nem szükséges cookie-kat. 
                            A szükséges cookie-k automatikusan kerülnek telepítésre.
                        </p>

                        <h3 className="text-lg font-medium mb-2">3.2. Cookie-k törlése</h3>
                        <p className="mb-4">
                            A felhasználó bármikor törölheti a cookie-kat a böngésző beállításaiban. Ez azonban befolyásolhatja 
                            a weboldal működését.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">4. Harmadik fél cookie-k</h2>
                        <p className="mb-4">
                            Egyes cookie-k harmadik fél szolgáltatóktól származnak, például:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Google Analytics</li>
                            <li>Közösségi média integrációk</li>
                            <li>Reklámhálózatok</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">5. Adatvédelmi jogok</h2>
                        <p className="mb-4">
                            A felhasználóknak joga van:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Hozzáférni a cookie-k által gyűjtött adatokhoz</li>
                            <li>Korrigálni a pontatlan adatokat</li>
                            <li>Törölni az adatokat</li>
                            <li>Korlátozni az adatkezelést</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">6. Módosítások</h2>
                        <p className="mb-4">
                            Fenntartjuk a jogot, hogy bármikor módosítsuk ezt a Cookie Szabályzatot. A módosításokról 
                            értesítjük felhasználóinkat, és a módosított Szabályzat azonnal hatályba lép.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">7. Kapcsolat</h2>
                        <p className="mb-4">
                            Cookie-kkal kapcsolatos kérdésekkel kérjük, lépjen kapcsolatba velünk:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>E-mail: adatvedelem@skillhill.hu</li>
                            <li>Telefon: +36 1 234 5678</li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
} 