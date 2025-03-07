'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    google: false,
    discord: false,
    spotify: false
  });

  const handleSignIn = async (provider: string) => {
    setError(null);
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await signIn(provider, { 
        redirect: false,
        callbackUrl: '/admin'
      });
      
      if (result?.error) {
        setError('Sikertelen bejelentkezés. Kérjük próbáld újra!');
        console.error('Bejelentkezési hiba:', result.error);
      } else if (!result?.error) {
        onClose();
      }
    } catch (error) {
      setError('Hiba történt a bejelentkezés során. Kérjük próbáld újra!');
      console.error('Hiba a bejelentkezés során:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-[95vw] max-w-[400px] relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-2">Üdvözlünk!</h2>
        <p className="text-gray-600 text-center mb-6">Válassz bejelentkezési módot</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">
            ⚠️ {error}
          </div>
        )}
        
        <div className="space-y-3">
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
            onClick={() => handleSignIn('google')}
            disabled={isLoading.google}
          >
            <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
            {isLoading.google ? 'Bejelentkezés...' : 'Bejelentkezés Google-lal'}
          </button>
          
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white border border-[#4752C4] rounded-lg transition-colors"
            onClick={() => handleSignIn('discord')}
            disabled={isLoading.discord}
          >
            <img src="/icons/discord.svg" alt="Discord" className="w-6 h-6" />
            {isLoading.discord ? 'Bejelentkezés...' : 'Bejelentkezés Discord-dal'}
          </button>
          
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1DB954] hover:bg-[#1AA34A] text-white border border-[#1AA34A] rounded-lg transition-colors"
            onClick={() => handleSignIn('spotify')}
            disabled={isLoading.spotify}
          >
            <img src="/icons/spotify.svg" alt="Spotify" className="w-6 h-6" />
            {isLoading.spotify ? 'Bejelentkezés...' : 'Bejelentkezés Spotify-jal'}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          A bejelentkezéssel elfogadod az <a href="/terms" className="text-indigo-600 hover:text-indigo-500">ÁSZF</a>-et és az <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Adatvédelmi irányelveket</a>
        </p>
      </div>
    </div>
  );
}
