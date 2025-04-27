'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { Container } from "../ui/container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Rólunk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  A SkillHill-ről
                </Link>
              </li>
              <li>
                <Link href="/tanarok" className="text-sm text-muted-foreground hover:text-foreground">
                  Tanáraink
                </Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="text-sm text-muted-foreground hover:text-foreground">
                  Kapcsolat
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Tanfolyamok</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kategoriak" className="text-sm text-muted-foreground hover:text-foreground">
                  Kategóriák
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                  Összes tanfolyam
                </Link>
              </li>
              <li>
                <Link href="/akciok" className="text-sm text-muted-foreground hover:text-foreground">
                  Akciók
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Segítség</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/segitseg" className="text-sm text-muted-foreground hover:text-foreground">
                  Segítség és támogatás
                </Link>
              </li>
              <li>
                <Link href="/gyik" className="text-sm text-muted-foreground hover:text-foreground">
                  Gyakran ismételt kérdések
                </Link>
              </li>
              <li>
                <Link href="/oldalterkep" className="text-sm text-muted-foreground hover:text-foreground">
                  Oldaltérkép
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Jogi információk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Adatvédelmi irányelvek
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Felhasználási feltételek
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie szabályzat
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SkillHill. Minden jog fenntartva.</p>
        </div>
      </Container>
    </footer>
  );
} 