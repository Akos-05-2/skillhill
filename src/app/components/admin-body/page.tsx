import React from 'react';
import axios from 'axios';
import { User } from '../../api/models/user';
import './page.css';

interface AdminBodyProps {
    user: User | null;
    onUserUpdated?: () => void;
}

const AdminBody: React.FC<AdminBodyProps> = ({ user, onUserUpdated }) => {
    const handleRoleChange = async (userId: string, newRoleId: number) => {
        try {
            await axios.put('/api/services/user', {
                user_id: userId,
                roleId: newRoleId
            });
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('Hiba a szerepkör módosítása során:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('Kérjük jelentkezzen be újra!');
                } else if (error.response?.status === 403) {
                    alert('Nincs jogosultsága a művelet végrehajtásához!');
                } else {
                    alert('Hiba történt a szerepkör módosítása során!');
                }
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Biztosan törölni szeretné ezt a felhasználót?')) {
            return;
        }

        try {
            await axios.delete('/api/services/user', {
                data: { user_id: userId }
            });
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('Hiba a felhasználó törlése során:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('Kérjük jelentkezzen be újra!');
                } else if (error.response?.status === 403) {
                    alert('Nincs jogosultsága a művelet végrehajtásához!');
                } else {
                    alert('Hiba történt a felhasználó törlése során!');
                }
            }
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="admin-body">
            <div className="user-details">
                <h3>Felhasználó adatai</h3>
                <div className="user-info">
                    <p><strong>Név:</strong> {user.name || 'Nincs megadva'}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Szerepkör:</strong> {
                        user.roleId === 2 ? 'Diák' :
                        user.roleId === 3 ? 'Oktató' :
                        user.roleId === 4 ? 'Admin' :
                        user.roleId === 5 ? 'Szuper Admin' : 'Ismeretlen'
                    }</p>
                </div>
                <div className="user-actions">
                    <div className="role-selector">
                        <label>Szerepkör módosítása:</label>
                        <select 
                            value={user.roleId} 
                            onChange={(e) => handleRoleChange(user.id!, parseInt(e.target.value))}
                        >
                            <option value={2}>Diák</option>
                            <option value={3}>Oktató</option>
                            <option value={4}>Admin</option>
                            <option value={5}>Szuper Admin</option>
                        </select>
                    </div>
                    <button 
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id!)}
                    >
                        Felhasználó törlése
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBody;
