'use client';

import { useSession, signOut } from 'next-auth/react';
import { LoginDialog } from '../LoginDialog';
import Link from 'next/link';
import styles from './header.module.css';
import { useState } from 'react';
import { EditNameDialog } from '../edit-name-dialog/edit-name-dialog';

export function Header() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        SkillHill
      </Link>
      <div className={styles.centerLinks}>
        <Link href="/courses">Kurzusok</Link>
        <Link href="/about">Rólunk</Link>
      </div>
      <div className={styles.rightSection} id="rightSection">
        {session ? (
          <>
            <button 
              onClick={() => setIsEditNameOpen(true)} 
              className={styles.userNameButton}
              id="userNameButton"
            >
              {session?.user?.name || 'Felhasználó'}
            </button>
            <button onClick={() => signOut()} className={styles.authButton}>
              Kijelentkezés
            </button>
            <EditNameDialog
              isOpen={isEditNameOpen} 
              onClose={() => setIsEditNameOpen(false)}
              currentName={session?.user?.name || 'Felhasználó'}
            />
          </>
        ) : (
          <>
            <button className={styles.authButton} onClick={() => setIsLoginOpen(true)}>
              Bejelentkezés
            </button>
            <LoginDialog 
              isOpen={isLoginOpen} 
              onClose={() => setIsLoginOpen(false)} 
              onLoginSuccess={() => setIsLoginOpen(false)} 
            />
          </>
        )}
      </div>
    </nav>
  );
} 