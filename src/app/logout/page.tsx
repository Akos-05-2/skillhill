import './page.css';
import { signOut } from 'next-auth/react';

export default function LogOut() {
    return (
        <button className='logout-button' onClick={handleSignOut}>
            Kijelentkezés
        </button>
    );
}

const handleSignOut = async () => {
    try {
        await signOut({ redirect: false });
        window.location.href = 'http://localhost:3000/login';
    } catch (error) {
        console.error('Hiba a kijelentkezés során: ', error);
    }
};