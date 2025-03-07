'use client';

import './style.css';
import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { User } from '../../api/models/user'; 

interface AdminSearchBarProps {
    onUserFound: (users: User[]) => void; 
}

interface AdminSearchBarRef {
    fetchAllUsers: () => Promise<void>;
}

const AdminSearchBar = forwardRef<AdminSearchBarRef, AdminSearchBarProps>(function AdminSearchBar({ onUserFound }, ref) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const searchTimeout = useRef<NodeJS.Timeout>();

    // Összes felhasználó betöltése
    const fetchAllUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('/api/services/user', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setAllUsers(data);
            onUserFound(data); // Kezdetben minden felhasználót mutatunk
        } catch (error) {
            console.error('Hiba a felhasználók betöltése során:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError('Kérjük jelentkezzen be újra!');
                } else if (error.response?.status === 403) {
                    setError('Nincs jogosultsága a felhasználók megtekintéséhez!');
                } else {
                    setError('Hiba történt a felhasználók betöltése során!');
                }
            } else {
                setError('Ismeretlen hiba történt!');
            }
        } finally {
            setIsLoading(false);
        }
    }, [onUserFound]);

    // Expose fetchAllUsers method through ref
    useImperativeHandle(ref, () => ({
        fetchAllUsers
    }), [fetchAllUsers]);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    // Keresés a már betöltött felhasználók között
    const handleSearch = useCallback(() => {
        setError(null);
        
        if (!searchTerm.trim()) {
            onUserFound(allUsers);
            return;
        }

        // Keresés email és név alapján is
        const filteredUsers = allUsers.filter(user => 
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        onUserFound(filteredUsers);
    }, [searchTerm, allUsers, onUserFound]);

    // Keresés minden billentyűleütésre, debounce-al
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        // Töröljük az előző időzítőt
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Új időzítő beállítása
        searchTimeout.current = setTimeout(() => {
            if (!newSearchTerm.trim()) {
                onUserFound(allUsers);
            } else {
                const filteredUsers = allUsers.filter(user => 
                    (user.email?.toLowerCase().includes(newSearchTerm.toLowerCase()) || 
                     user.name?.toLowerCase().includes(newSearchTerm.toLowerCase()))
                );
                onUserFound(filteredUsers);
            }
        }, 300); // 300ms késleltetés
    };

    // Komponens unmount esetén töröljük az időzítőt
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    return (
        <div className="search-container">
            <div className="search-input-container">
                <input 
                    type="text"
                    className='search-input'
                    placeholder='Keresés név vagy email alapján...'
                    value={searchTerm}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <button 
                    type="button"
                    className='search-button'
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? '⌛' : '🔍'}
                </button>
            </div>
            {error && <div className="search-error">{error}</div>}
            {isLoading && <div className="search-loading">Felhasználók betöltése...</div>}
        </div>
    );
});

export default AdminSearchBar;
