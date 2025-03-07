'use client';
import './style.css';

const SearchBar = () => {
  return (
    <div className="container">
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text"  
            className="search-input" 
            placeholder="Keresés kurzusok között..." 
          />
          <button type="submit" className="search-button" aria-label="Keresés">
            🔍
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;