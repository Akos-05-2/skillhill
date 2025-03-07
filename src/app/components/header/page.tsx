'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/app/components/login-dialog/login-dialog';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold">SkillHill</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              Kurzusok
            </Link>
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      👤
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <span className="text-lg">🚪</span>
                  Kijelentkezés
                </Button>
              </>
            ) : (
              <Button 
                className="flex items-center gap-2"
                onClick={() => setShowLogin(true)}
              >
                <span className="text-lg">🔑</span>
                Bejelentkezés
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginDialog 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
}