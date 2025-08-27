import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/userService';
import { useAlerts } from '../hooks/useAlerts';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // <-- 1. Importar íconos
import '../style/ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { showSuccessAlert, showErrorAlert } = useAlerts();
    const navigate = useNavigate();

    // --- 2. Estados para controlar la visibilidad de cada contraseña ---
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es obligatoria.';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es obligatoria.';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Debe tener al menos 8 caracteres.';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña.';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
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
                    {/* --- 3. Campo de Contraseña Actual Actualizado --- */}
                    <div className="form-group">
                        <label>Contraseña actual</label>
                        <div className="password-input-wrapper">
                            <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" onChange={handleChange} className={errors.currentPassword ? 'input-error' : ''} />
                            <span className="password-toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
                    </div>

                    {/* --- 4. Campo de Nueva Contraseña Actualizado --- */}
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <div className="password-input-wrapper">
                            <input type={showNewPassword ? 'text' : 'password'} name="newPassword" onChange={handleChange} className={errors.newPassword ? 'input-error' : ''} />
                             <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
                    </div>

                    {/* --- 5. Campo de Confirmar Contraseña Actualizado --- */}
                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <div className="password-input-wrapper">
                            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" onChange={handleChange} className={errors.confirmPassword ? 'input-error' : ''} />
                            <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
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
