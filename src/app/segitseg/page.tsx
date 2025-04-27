"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

export default function Segitseg() {
    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Segítség és Támogatás</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Gyakran ismételt kérdések</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Hogyan regisztráljak a platformra?</AccordionTrigger>
                                <AccordionContent>
                                    A regisztrációhoz kattints a "Regisztráció" gombra a főoldalon, majd töltsd ki a szükséges adatokat. 
                                    A regisztráció után egy megerősítő e-mailt fogsz kapni, amit aktiválnod kell a fiókod használatához.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger>Hogyan jelentkezzek be?</AccordionTrigger>
                                <AccordionContent>
                                    A bejelentkezéshez használd az e-mail címedet és jelszavadat a bejelentkezési oldalon. 
                                    Ha elfelejtetted a jelszavad, használd a "Jelszóemlékeztető" funkciót.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>Hogyan fizessek a tanfolyamokért?</AccordionTrigger>
                                <AccordionContent>
                                    A fizetés bankkártyával vagy PayPal-lal lehetséges. A fizetés után azonnal hozzáférsz a tanfolyam 
                                    anyagaihoz. A számlát automatikusan küldjük az e-mail címedre.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                                <AccordionTrigger>Hogyan tudok tanárként tanfolyamot létrehozni?</AccordionTrigger>
                                <AccordionContent>
                                    A tanárként való regisztráció után a "Tanár kezelőfelület" menüpontban találod a "Új tanfolyam" 
                                    gombot. Itt feltöltheted a tanfolyam anyagait, beállíthatod az árat és a hozzáférést.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                                <AccordionTrigger>Hogyan kapok segítséget technikai problémák esetén?</AccordionTrigger>
                                <AccordionContent>
                                    Technikai problémák esetén írj nekünk a support@skillhill.hu e-mail címre, vagy használd a 
                                    "Kapcsolat" űrlapot. A problémát általában 24 órán belül megoldjuk.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Kapcsolat</h2>
                        <div className="space-y-4">
                            <p>
                                Ha nem találod a választ a kérdésedre, vagy további segítségre van szükséged, 
                                keress minket az alábbi módokon:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>E-mail: support@skillhill.hu</li>
                                <li>Telefon: +36 1 234 5678 (hétfő-péntek 9:00-17:00)</li>
                                <li>Online chat: A jobb alsó sarokban található chat ikonra kattintva</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Hasznos források</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <a href="/gyik" className="text-primary hover:underline">
                                    Gyakran ismételt kérdések
                                </a>
                            </li>
                            <li>
                                <a href="/oldalterkep" className="text-primary hover:underline">
                                    Oldaltérkép
                                </a>
                            </li>
                            <li>
                                <a href="/felhasznalasi-feltetelek" className="text-primary hover:underline">
                                    Felhasználási feltételek
                                </a>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
} 