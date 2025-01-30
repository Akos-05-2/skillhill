import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../api/models/user';
import './page.css';

// Function to fetch users from the API
async function fetchUsers(): Promise<User[]> {
    const response = await axios.get("http://localhost:3000/api/services/user");
    return response.data;
}

// Function to delete a user by ID
async function deleteUser(userId: string): Promise<void> {
    try {
        await axios.delete(`http://localhost:3000/api/services/user/${userId}`); // Pass the user ID in the URL
        window.location.reload(); // Reload the page after deletion
    } catch (error) {
        console.error("Hiba a felhasználó törlése során:", error);
    }
}

interface AdminBodyProps {
    searchedUser: User | null; 
}

const AdminBody: React.FC<AdminBodyProps> = ({ searchedUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers()
            .then(data => {
                setUsers(data);
                setErrorMessage(null);
            })
            .catch(error => {
                console.error(error);
                setErrorMessage('Hiba történt a felhasználók betöltésekor.');
            });
    }, []);

    // Determine which users to display
    const displayedUsers = searchedUser ? [searchedUser] : users;

    return (
        <div className='container'>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {displayedUsers.length > 0 ? (
                displayedUsers.map(user => (
                    <div className='user-card' key={user.id}>
                        <p>Név: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <div className='button-container'>
                            <button onClick={() => {}} className='edit-button'>📝</button>
                            <button onClick={() => {
                                if (user.id) {
                                    console.log("Törlés folyamatban:", user.id);
                                    deleteUser(user.id); // Pass the user ID to deleteUser
                                }
                            }} className='delete-button'>🗑</button>
                        </div>
                    </div>
                ))
            ) : (
                searchedUser === null ? (
                    <p>Nincsenek felhasználók.</p>
                ) : (
                    <p>Nincs találat!</p>
                )
            )}
        </div>
    );
}

export default AdminBody;
