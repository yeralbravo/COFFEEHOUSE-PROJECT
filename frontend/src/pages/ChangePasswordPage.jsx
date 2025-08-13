import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/userService';
import { useAlerts } from '../hooks/useAlerts';
import '../style/ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const { showSuccessAlert, showErrorAlert } = useAlerts();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            showErrorAlert('Las nuevas contraseñas no coinciden.');
            return;
        }
        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            showSuccessAlert('Contraseña actualizada con éxito.');
            navigate('/profile');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <main className="change-password-main">
            <div className="change-password-container">
                <h2>Modificar contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Contraseña actual</label>
                        <input type="password" name="currentPassword" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input type="password" name="newPassword" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input type="password" name="confirmPassword" onChange={handleChange} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ChangePasswordPage;