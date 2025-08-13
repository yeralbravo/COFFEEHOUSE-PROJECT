import React from 'react';
import UserForm from '../components/UserForm';
import '../style/AdminPanel.css';

const CreateUserPage = () => {
    return (
        <div className="centered-content">
            <header className="admin-header">
                <h1>Crear Nuevo Usuario</h1>
            </header>
            <UserForm title="Completa los datos del nuevo usuario" />
        </div>
    );
};

export default CreateUserPage;