import './page.css';
import { signOut } from 'next-auth/react';

const handleSignOut = async () => {
    try {
      await signOut({redirect: false});
      window.location.href = 'http://localhost:3000/login';
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

export default function LogOut(){
    return(
        <button className='logout-button' onClick={handleSignOut}>Kijelentkezés</button>
    );
}