'use client'
import { SessionProvider, signIn, useSession } from "next-auth/react";
import './page.css';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Login() {
  return (
    <SessionProvider>
      <LoginInner />
    </SessionProvider>
  );
}

function LoginInner() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.location.href = 'http://localhost:3000';
    }
  }, [session]);

  const handleSingInGoogle = async () => {
    try {
      await signIn('google', { redirect: false });
    } catch (error) {
      console.error('Error signing in', error);
    }
  }
  
  const handleSingInDiscord = async () => {
    try {
      await signIn('discord', { redirect: false });
    } catch (error) {
      console.error('Error signing in', error);
    }
  }

  const handleSignInSpotify = async () => {
    try {
      await signIn('spotify', { redirect: false });
    } catch (error) {
      console.error('Error signing in', error);
    }
  }

  return (
    <div id="login">
      <form onSubmit={(e) => e.preventDefault()}> {}
        <b>Bejelentkezés</b>
        <button onClick={handleSingInGoogle}>
          Bejelentkezés Google-lel
          <Image src="https://authjs.dev/img/providers/google.svg" width={30} height={30} alt="Google logo" />
        </button>
        <button type="button" onClick={handleSingInDiscord}>
          Bejelentkezés Discorddal
          <Image src="https://authjs.dev/img/providers/discord.svg" width={30} height={30} alt="Discord logo" />
        </button>
        <button type="button" onClick={handleSignInSpotify}>
          Bejelentkezés Spotify-al
          <Image src="https://authjs.dev/img/providers/spotify.svg" width={30} height={30} alt="Spotify logo" />
        </button>
        
      </form>
    </div>
  );
}