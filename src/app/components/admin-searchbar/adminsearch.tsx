'use client';

import './style.css';
import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { User } from '../../api/models/user';
import { UserEditDialog } from '../user-edit-dialog/user-edit-dialog';

interface AdminSearchBarProps {
    onUserFound: (users: User[]) => void; 
}

interface AdminSearchBarRef {
    fetchAllUsers: () => Promise<void>;
}

const roleEmojis = {
  1: '👨‍🎓',
  2: '👨‍🎓',
  3: '👨‍🏫',
  4: '👨‍💼',
  5: '👑'
} as const;

const roleNames = {
  1: 'Tanuló',
  2: 'Tanuló',
  3: 'Tanár',
  4: 'Admin',
  5: 'Szuperadmin'
} as const;

const AdminSearchBar = forwardRef<AdminSearchBarRef, AdminSearchBarProps>(function AdminSearchBar({ onUserFound }, ref) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userStats, setUserStats] = useState({
        total: 0,
        students: 0,
        teachers: 0,
        admins: 0,
        superadmins: 0
    });
    const searchTimeout = useRef<NodeJS.Timeout>();

    // Összes felhasználó betöltése
    const fetchAllUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('/api/services/users', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setAllUsers(data);
            setFilteredUsers(data);
            onUserFound(data);

            // Statisztikák számítása
            const stats = data.reduce((acc: any, user: User) => {
                acc.total++;
                if (user.roleId === 1 || user.roleId === 2) acc.students++;
                else if (user.roleId === 3) acc.teachers++;
                else if (user.roleId === 4) acc.admins++;
                else if (user.roleId === 5) acc.superadmins++;
                return acc;
            }, {
                total: 0,
                students: 0,
                teachers: 0,
                admins: 0,
                superadmins: 0
            });
            setUserStats(stats);
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
                setFilteredUsers(allUsers);
                onUserFound(allUsers);
            } else {
                const filtered = allUsers.filter(user => 
                    (user.email?.toLowerCase().includes(newSearchTerm.toLowerCase()) || 
                     user.name?.toLowerCase().includes(newSearchTerm.toLowerCase()))
                );
                setFilteredUsers(filtered);
                onUserFound(filtered);
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

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Statisztikák */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-lg font-semibold">👥 Összes</div>
                    <div className="text-2xl">{userStats.total}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-lg font-semibold">👨‍🎓 Diákok</div>
                    <div className="text-2xl">{userStats.students}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-lg font-semibold">👨‍🏫 Tanárok</div>
                    <div className="text-2xl">{userStats.teachers}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-lg font-semibold">👨‍💼 Adminok</div>
                    <div className="text-2xl">{userStats.admins}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-lg font-semibold">👑 Szuperadminok</div>
                    <div className="text-2xl">{userStats.superadmins}</div>
                </div>
            </div>

            {/* Keresés */}
            <div className="search-container">
                <div className="search-input-container">
                    <input 
                        type="text"
                        className="search-input"
                        placeholder="Keresés név vagy email alapján..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <button 
                        type="button"
                        className="search-button"
                        disabled={isLoading}
                    >
                        {isLoading ? '⌛' : '🔍'}
                    </button>
                </div>
                {error && <div className="search-error">{error}</div>}
                {isLoading && <div className="search-loading">Felhasználók betöltése...</div>}
            </div>

            {/* Találatok listája */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleUserClick(user)}
                    >
                        <div className="flex items-center gap-4">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || 'User'}
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    👤
                                </div>
                            )}
                            <div>
                                <div className="font-medium">{user.name || 'Névtelen felhasználó'}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-sm mt-1 flex items-center gap-1">
                                    <span>{roleEmojis[user.roleId as keyof typeof roleEmojis]}</span>
                                    <span>{roleNames[user.roleId as keyof typeof roleNames]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Felhasználó szerkesztése dialógus */}
            <UserEditDialog
                user={selectedUser}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={fetchAllUsers}
            />
        </div>
    );
});

export default AdminSearchBar;
