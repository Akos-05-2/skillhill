import './style.css';
import axios from 'axios';
import React, { useState } from 'react';
import { User } from '../../api/models/user'; 

async function fetchUserByEmail(email: string): Promise<User | null> {
    try {
        console.log('Keresés:', email);
        const response = await axios.get(`http://localhost:3000/api/services/user`);
        return response.data; 
    } catch (error) {
        console.error('Hiba a felhasználó keresése során:', error);
        return null; 
    }
}

interface AdminSearchBarProps {
    onUserFound: (user: User | null) => void; 
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ onUserFound }) => {
    const [email, setEmail] = useState('');

    const handleSearch = async () => {
        if (email.trim() === '') {
            alert('A keresési mező nem lehet üres!');
            onUserFound(null); 
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            alert('A bemenet értéke érvénytelen!');
            onUserFound(null);
            return;
        }
        const foundUser = await fetchUserByEmail(email);
        console.log('Talált felhasználó:', foundUser); 
        onUserFound(foundUser); 
        setEmail(''); 
    };

    return (
        <div className="search-container">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <input 
                    type="text"
                    className='search-input'
                    placeholder='Keresés'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="button" 
                    onClick={handleSearch} 
                    className='search-button' 
                    value="🔍" 
                />
            </form>
        </div>
    );
};

export default AdminSearchBar;
