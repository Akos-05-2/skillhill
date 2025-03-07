'use client';
import './page.css';
import { signOut } from 'next-auth/react';

export default function LogOut() {
    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            window.location.href = 'http://localhost:3000/login';
        } catch (error) {
            console.error('Hiba a kijelentkezés során: ', error);
        }
    };

    return (
        <main>
            <div className="logout-container">
                <div className="logout-content">
                    <h2 className="heading-2">Kijelentkezés</h2>
                    <p className="logout-message">
                        Biztosan ki szeretnél jelentkezni?
                    </p>
                    <button className="logout-button" onClick={handleSignOut}>
                        Kijelentkezés
                    </button>
                </div>
            </div>
        </main>
    );
}