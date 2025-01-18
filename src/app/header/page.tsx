import LogOut from '../logout/page'
import SearchBar from '../search/page'
import './style.css'
const Header = () => {
    return(
        <>
            <div className='navbar'>
                <h1>SkillHill</h1>
                <nav>
                    <ul>
                        <li className='menu'>
                            <a href="#">Kurzusaim</a>
                        </li>
                    </ul>
                    <ul>
                        <li className='searchbar'>
                            <SearchBar />
                        </li>
                    </ul>
                    <ul>
                        <li className='logout'>
                            <LogOut />
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Header