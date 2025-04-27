"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function FelhasznalasiFeltetelek() {
    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Felhasználási Feltételek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">1. Általános rendelkezések</h2>
                        <p className="mb-4">
                            A SkillHill (a továbbiakban: "Szolgáltatás") használatával a felhasználó elfogadja ezeket a 
                            Felhasználási Feltételeket. A Szolgáltatás használata kizárólag ezen feltételek betartásával lehetséges.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">2. Fiókkezelés</h2>
                        <h3 className="text-lg font-medium mb-2">2.1. Regisztráció</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>A regisztrációhoz érvényes e-mail cím szükséges</li>
                            <li>A felhasználó köteles valós adatokat megadni</li>
                            <li>A fiók személyes használatra szól</li>
                            <li>A jelszó titkos kezelése kötelező</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">2.2. Fiók törlése</h3>
                        <p className="mb-4">
                            A felhasználó bármikor törölheti fiókját. A törlés után az adatok véglegesen törlődnek, 
                            kivéve, ha jogszabályi kötelezettség áll fenn az adatok megőrzésére.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">3. Tartalom és viselkedés</h2>
                        <h3 className="text-lg font-medium mb-2">3.1. Felhasználói tartalom</h3>
                        <p className="mb-4">
                            A felhasználók kötelesek:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Tisztelni mások jogait és méltóságát</li>
                            <li>Nem feltölteni jogvédett vagy jogosulatlan tartalmat</li>
                            <li>Nem terjeszteni káros vagy sértő anyagot</li>
                            <li>Nem végezni csalárd vagy visszaélő tevékenységet</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">3.2. Szolgáltatói jogok</h3>
                        <p className="mb-4">
                            A Szolgáltató fenntartja a jogot, hogy:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Ellenőrizze a feltöltött tartalmakat</li>
                            <li>Törölje a szabályzatba ütköző anyagokat</li>
                            <li>Ideiglenesen vagy véglegesen felfüggessze a fiókokat</li>
                            <li>Módosítsa a Szolgáltatás tartalmát és működését</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">4. Szellemi tulajdon</h2>
                        <p className="mb-4">
                            A Szolgáltatás minden tartalma, beleértve a tananyagokat, a Szolgáltató szellemi tulajdonát képezi. 
                            A felhasználók kizárólag személyes tanulási célokra használhatják a tartalmakat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">5. Felelősség</h2>
                        <p className="mb-4">
                            A Szolgáltató nem vállal felelősséget:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>A Szolgáltatás ideiglenes kieséséért</li>
                            <li>Felhasználói tartalmak pontosságáért</li>
                            <li>Harmadik fél által okozott károkért</li>
                            <li>Felhasználói adatok elvesztéséért</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">6. Módosítások</h2>
                        <p className="mb-4">
                            A Szolgáltató fenntartja a jogot, hogy bármikor módosítsa ezeket a Feltételeket. A módosításokról 
                            értesítjük felhasználóinkat, és a módosított Feltételek azonnal hatályba lépnek.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">7. Kapcsolat</h2>
                        <p className="mb-4">
                            Kérdésekkel kapcsolatban kérjük, lépjen kapcsolatba velünk:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>E-mail: info@skillhill.hu</li>
                            <li>Telefon: +36 1 234 5678</li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
} 