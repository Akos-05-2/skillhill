import './style.css'
import Image from 'next/image'
const Footer: React.FC = () => {
    return (
        <footer className='footer'>
            <div className='footer-content'>
                <div className='col-1'>
                    <label>Elérhetőség:</label>
                    <p>Telefonszám: +36 70 361 8844</p>
                    <p><a href="https://instagram.com/skillhillproject">Instagram</a></p>
                    <p>ProtonMail: olajkarakos05@proton.me</p>
                </div>
                <div className="col-2">
                    <Image src='https://authjs.dev/img/providers/spotify.svg' alt="Spotify logo" width={50} height={50} />
                </div>
                <div className='col-3'>
                    <p>Minden szerzői jog fenntartva!</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer