'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LoginDialog } from '../login-dialog/login-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          SkillHill
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                Üdv, {session.user?.name || 'Felhasználó'}!
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Kilépés
              </Button>
            </div>
          ) : (
            <LoginDialog />
          )}
        </nav>
      </div>
    </header>
  );
}
