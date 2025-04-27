'use client'
import { LiteralUnion, SessionProvider, signIn, useSession } from "next-auth/react";
import './page.css';
import Image from 'next/image';
import { Provider, useEffect } from 'react';
import { BuiltInProviderType } from "next-auth/providers/index";

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

  const handleSignIn = async (provider: Provider<'google' | 'discord' | 'spotify'>) => {
    try {
      await signIn(provider as unknown as LiteralUnion<BuiltInProviderType>, { redirect: false });
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  return (
    <div id="login">
      <form onSubmit={(e) => e.preventDefault()}> {}
        <b>Bejelentkezés</b>
        <button type="button" onClick={() => handleSignIn('google')}>
          Bejelentkezés Google-el
          <Image src="https://authjs.dev/img/providers/google.svg" width={30} height={30} alt="Google logo" />
        </button>
        <button type="button" onClick={() => handleSignIn('discord')}>
          Bejelentkezés Discorddal
          <Image src="https://authjs.dev/img/providers/discord.svg" width={30} height={30} alt="Discord logo" />
        </button>
      </form>
    </div>
  );
}