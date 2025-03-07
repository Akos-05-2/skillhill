'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import './page.css';

export default function AuthHeader() {
  const { data: session, status } = useSession();
  console.log(session);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="auth-header">
        <Link href="/login" className="btn btn-outline">
          Bejelentkezés
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-header">
      <div className="auth-content">
        <div className="user-info">
          {session?.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profilkép"
              className="user-avatar" 
            />
          )}
          <span className="welcome-text">
            Üdvözlünk, <span className="user-name">{session?.user?.name}</span>!
          </span>
        </div>
        <button onClick={handleSignOut} className="btn btn-outline">
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}
