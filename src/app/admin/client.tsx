'use client';

import AdminSearchBar from '../components/admin-searchbar/adminsearch';
import AdminBody from '../components/admin-body/page';
import { User } from '../api/models/user';
import { useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import type { AdminSearchBarRef } from '../components/admin-searchbar/adminsearch';

export default function AdminPageClient() {
    const { data: session, status } = useSession();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchBarRef = useRef<AdminSearchBarRef>(null);

    // Ha nincs session, átirányítjuk a login oldalra
    if (status === 'unauthenticated') {
        redirect('/login');
    }

    const handleUserFound = useCallback((foundUsers: User[]) => {
        setUsers(foundUsers);
    }, []);

    const handleUserSelect = useCallback((user: User) => {
        setSelectedUser(prev => prev?.id === user.id ? null : user);
    }, []);

    const refreshUsers = useCallback(async () => {
        if (searchBarRef.current) {
            await searchBarRef.current.fetchAllUsers();
        }
    }, []);

    const handleUserUpdated = useCallback(async () => {
        setIsLoading(true);
        try {
            await refreshUsers();
            setSelectedUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [refreshUsers]);

    // Statisztikák számítása
    const stats = {
        total: users.length,
        students: users.filter(user => user.roleId === 2).length,
        teachers: users.filter(user => user.roleId === 3).length,
        admins: users.filter(user => user.roleId === 4 || user.roleId === 5).length
    };

    // Loading állapot megjelenítése
    if (status === 'loading' || isLoading) {
        return (
            <div className="admin-container">
                <div className="loading-state">
                    <div className="loading-spinner">⌛</div>
                    <p>Betöltés...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Összes Felhasználó</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-value">{stats.students}</div>
                    <div className="stat-label">Diákok</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-value">{stats.teachers}</div>
                    <div className="stat-label">Oktatók</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍💼</div>
                    <div className="stat-value">{stats.admins}</div>
                    <div className="stat-label">Adminisztrátorok</div>
                </div>
            </div>
            
            <div className="admin-content">
                <div className="admin-section">
                    <h2>Felhasználók kezelése</h2>
                    <AdminSearchBar 
                        ref={searchBarRef}
                        onUserFound={handleUserFound} 
                    />
                    
                    <div className="users-list">
                        {users.map(user => (
                            <div 
                                key={user.id} 
                                className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className="user-card-content">
                                    <div className="user-card-header">
                                        <h3>{user.name || 'Névtelen felhasználó'}</h3>
                                        <span className={`role-badge role-${user.roleId}`}>
                                            {user.roleId === 2 ? 'Diák' :
                                             user.roleId === 3 ? 'Oktató' :
                                             user.roleId === 4 ? 'Admin' :
                                             user.roleId === 5 ? 'Szuper Admin' : 'Ismeretlen'}
                                        </span>
                                    </div>
                                    <p className="user-email">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="admin-section">
                    {selectedUser && (
                        <AdminBody 
                            user={selectedUser} 
                            onUserUpdated={handleUserUpdated}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
