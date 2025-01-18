import LogOut from '../logout/page'
import './style.css'
const Header = () => {
    return(
        <>
            <div className='navbar'>
                <h1>SkillHill</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="#">Kurzusaim</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='logout'>
                <LogOut />
            </div>
        </>
    )
}

export default Header