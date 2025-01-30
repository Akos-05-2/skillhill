import LogOut from '../../logout/page'
import './style.css'
import Image from 'next/image';
const Header = () => {
    return (
        <header className='header'>
            <div className='navbar'>
                <nav>
                    <ul className='menu'>
                        <li className='li-1'>
                            <a href="#">Kurzusaim</a>
                        </li>
                        <li className='li-2'>
                             <Image src='https://authjs.dev/img/providers/spotify.svg' alt="Spotify logo" width={50} height={50} />
                        </li>
                        <li className='logout'>
                            <LogOut />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header