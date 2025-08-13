import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';
import EditUserModal from '../components/EditUserModal';
import AuthContext from '../context/AuthContext';
import { FiSearch } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';
import '../style/AdminPanel.css';

const SuppliersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const { editUser, deleteUser } = useContext(AuthContext);
    const { showConfirmDialog, showErrorAlert, showSuccessAlert } = useAlerts();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ role: 'supplier' });
            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }
            const res = await axios.get(`http://localhost:5000/api/user/admin?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.data.users);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('No se pudo cargar la lista de proveedores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearchTerm]);

    const handleEdit = (user) => setEditingUser(user);

    const handleDelete = async (userId) => {
        const result = await showConfirmDialog({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
        });
        if (result.isConfirmed) {
            try {
                const message = await deleteUser(userId);
                showSuccessAlert(message);
                fetchUsers();
            } catch (err) {
                showErrorAlert(err.message);
            }
        }
    };

    const handleSave = async (updatedUser) => {
        try {
            const message = await editUser(updatedUser.id, updatedUser);
            showSuccessAlert(message);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            showErrorAlert(err.message);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1>Lista de Proveedores</h1>
            </header>
            <div className="search-bar-container">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o teléfono..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {loading && <p>Cargando...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                users.length > 0 ? (
                    <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
                ) : (
                    <p>No se encontraron proveedores con ese criterio de búsqueda.</p>
                )
            )}
            {editingUser && (
                <EditUserModal 
                    user={editingUser} 
                    onClose={() => setEditingUser(null)} 
                    onSave={handleSave} 
                />
            )}
        </>
    );
};

export default SuppliersPage;