import './style.css'

const SearchBar = () => {
    return(
        <div className="search-container">
            <form>
                <input type="text"  className='search-input' placeholder='Keresés' />
                <input type="button" className='search-button' value="🔍" />
            </form>
            
        </div>
    )
}

export default SearchBar