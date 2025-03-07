'use client';

import { signIn, useSession } from "next-auth/react";
import './page.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    google: false,
    discord: false,
    spotify: false
  });

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // @ts-ignore - Adding role type to session user
      const userRole = session.user?.role || 'user';
      if (userRole === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [status, session, router]);

  const handleSignIn = async (provider: string) => {
    setError(null);
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await signIn(provider, { 
        redirect: false
      });
      
      if (result?.error) {
        setError('Sikertelen bejelentkezés. Kérjük próbáld újra!');
        console.error('Bejelentkezési hiba:', result.error);
      }
      // A sikeres bejelentkezés után a useEffect fogja kezelni az átirányítást
    } catch (error) {
      setError('Hiba történt a bejelentkezés során. Kérjük próbáld újra!');
      console.error('Hiba a bejelentkezés során:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  if (status === 'loading') {
    return (
      <div className="login-container">
        <div className="loading-spinner">⌛</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {status === 'loading' ? (
        <div className="loading-spinner">⌛</div>
      ) : (
        <div className="login-box">
          <h1 className="login-title">Üdvözlünk!</h1>
          <p className="login-subtitle">Válassz bejelentkezési módot</p>
          
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}
          
          <div className="login-buttons">
            <button 
              className="login-button google"
              onClick={() => handleSignIn('google')}
              disabled={isLoading.google}
            >
              <img src="/icons/google.svg" alt="Google" />
              {isLoading.google ? 'Bejelentkezés...' : 'Bejelentkezés Google-lal'}
            </button>
            
            <button 
              className="login-button discord"
              onClick={() => handleSignIn('discord')}
              disabled={isLoading.discord}
            >
              <img src="/icons/discord.svg" alt="Discord" />
              {isLoading.discord ? 'Bejelentkezés...' : 'Bejelentkezés Discord-dal'}
            </button>
            
            <button 
              className="login-button spotify"
              onClick={() => handleSignIn('spotify')}
              disabled={isLoading.spotify}
            >
              <img src="/icons/spotify.svg" alt="Spotify" />
              {isLoading.spotify ? 'Bejelentkezés...' : 'Bejelentkezés Spotify-jal'}
            </button>
          </div>

          <p className="login-info">
            A bejelentkezéssel elfogadod az <a href="/terms">ÁSZF</a>-et és az <a href="/privacy">Adatvédelmi irányelveket</a>
          </p>
        </div>
      )}
    </div>
  );
}