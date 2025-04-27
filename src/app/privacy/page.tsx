"use client";

import { Container } from "@/app/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function AdatvedelmiIranyelvek() {
    return (
        <Container>
            <Card className="max-w-4xl mx-auto my-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Adatvédelmi Irányelvek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">1. Bevezetés</h2>
                        <p className="mb-4">
                            A SkillHill (a továbbiakban: "Szolgáltatás") tiszteletben tartja felhasználóinak adatvédelmét. 
                            Ez az adatvédelmi irányelv (a továbbiakban: "Irányelv") ismerteti, hogyan gyűjtjük, használjuk, 
                            tároljuk és védjük a személyes adatokat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">2. Adatkezelés</h2>
                        <h3 className="text-lg font-medium mb-2">2.1. Gyűjtött adatok</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Név és elérhetőségi adatok</li>
                            <li>E-mail cím</li>
                            <li>Profilkép</li>
                            <li>Tanulási előrehaladás és teljesítmény</li>
                            <li>Böngészési adatok és cookie-k</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">2.2. Adatkezelés célja</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Fiókkezelés és azonosítás</li>
                            <li>Tanulási folyamat nyomon követése</li>
                            <li>Szolgáltatás fejlesztése</li>
                            <li>Kommunikáció a felhasználókkal</li>
                            <li>Jogi kötelezettségek teljesítése</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">3. Adatvédelmi jogok</h2>
                        <p className="mb-4">
                            A felhasználóknak joga van:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Adataikhoz való hozzáféréshez</li>
                            <li>Adataik helyesbítéséhez</li>
                            <li>Adataik törléséhez</li>
                            <li>Adatkezelés korlátozásához</li>
                            <li>Adathordozhatósághoz</li>
                            <li>Vetéshez az adatkezelés ellen</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">4. Adatbiztonság</h2>
                        <p className="mb-4">
                            Megfelelő technikai és szervezési intézkedéseket alkalmazunk az adatok védelme érdekében, 
                            beleértve a titkosítást, a hozzáférés-vezérlést és a rendszeres biztonsági ellenőrzéseket.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">5. Kapcsolat</h2>
                        <p className="mb-4">
                            Adatvédelmi kérdésekkel kapcsolatban kérjük, lépjen kapcsolatba velünk az alábbi elérhetőségeken:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>E-mail: adatvedelem@skillhill.hu</li>
                            <li>Telefon: +36 1 234 5678</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">6. Módosítások</h2>
                        <p className="mb-4">
                            Fenntartjuk a jogot, hogy bármikor módosítsuk ezt az Irányelvet. A módosításokról értesítjük 
                            felhasználóinkat, és a módosított Irányelv azonnal hatályba lép.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </Container>
    );
} 