"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";

export default function Oldalterkep() {
    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Oldaltérkép</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Főoldal</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/" className="text-primary hover:underline">
                                    Kezdőlap
                                </Link>
                            </li>
                            <li>
                                <Link href="/kategoriak" className="text-primary hover:underline">
                                    Kategóriák
                                </Link>
                            </li>
                            <li>
                                <Link href="/tanfolyamok" className="text-primary hover:underline">
                                    Tanfolyamok
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Felhasználói fiók</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/bejelentkezes" className="text-primary hover:underline">
                                    Bejelentkezés
                                </Link>
                            </li>
                            <li>
                                <Link href="/regisztracio" className="text-primary hover:underline">
                                    Regisztráció
                                </Link>
                            </li>
                            <li>
                                <Link href="/profil" className="text-primary hover:underline">
                                    Profil
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Tanár</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/teacher" className="text-primary hover:underline">
                                    Tanár kezelőfelület
                                </Link>
                            </li>
                            <li>
                                <Link href="/teacher/course/new" className="text-primary hover:underline">
                                    Új tanfolyam létrehozása
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Admin</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/admin" className="text-primary hover:underline">
                                    Admin kezelőfelület
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Jogi információk</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/adatvedelmi-iranyelvek" className="text-primary hover:underline">
                                    Adatvédelmi irányelvek
                                </Link>
                            </li>
                            <li>
                                <Link href="/felhasznalasi-feltetelek" className="text-primary hover:underline">
                                    Felhasználási feltételek
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookie-szabalyzat" className="text-primary hover:underline">
                                    Cookie szabályzat
                                </Link>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Segítség</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <Link href="/segitseg" className="text-primary hover:underline">
                                    Segítség és támogatás
                                </Link>
                            </li>
                            <li>
                                <Link href="/gyik" className="text-primary hover:underline">
                                    Gyakran ismételt kérdések
                                </Link>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
} 