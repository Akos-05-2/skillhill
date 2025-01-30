'use client'
import React, { useState } from 'react';
import AdminSearchBar from '../components/admin-searchbar/adminsearch';
import AdminBody from '../components/admin-body/page';
import { User } from '../api/models/user';

const AdminPanel: React.FC = () => {
    const [searchedUser, setSearchedUser] = useState<User | null>(null);

    const handleUserFound = (foundUser: User | null) => {
        setSearchedUser(foundUser);
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <AdminSearchBar onUserFound={handleUserFound} />
            <AdminBody searchedUser={searchedUser} />
        </div>
    );
};

export default AdminPanel;