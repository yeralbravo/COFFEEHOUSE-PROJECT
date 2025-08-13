import React, { useState, useContext, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { updateUser, deleteAccount, updateProfilePicture, deleteProfilePicture } from '../services/userService';
import { useAlerts } from '../hooks/useAlerts';
import { FiCamera, FiTrash2 } from 'react-icons/fi'; // <-- Importar ícono de basura
import '../style/ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, refreshUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        correo: user?.correo || '',
        telefono: user?.telefono || '',
    });
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const fileInputRef = useRef(null);
    const API_BASE_URL = 'http://localhost:5000';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const pictureFormData = new FormData();
        pictureFormData.append('profile_picture', file);

        try {
            await updateProfilePicture(user.id, pictureFormData);
            await refreshUser();
            showSuccessAlert('Foto de perfil actualizada.');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    // --- NUEVA FUNCIÓN PARA ELIMINAR LA FOTO ---
    const handleDeletePicture = () => {
        showConfirmDialog({
            title: '¿Eliminar foto de perfil?',
            text: 'Tu foto de perfil será eliminada.'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProfilePicture(user.id);
                    await refreshUser();
                    showSuccessAlert('Foto de perfil eliminada.');
                } catch (error) {
                    showErrorAlert(error.message);
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToUpdate = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
        };
        try {
            await updateUser(user.id, dataToUpdate);
            await refreshUser();
            showSuccessAlert('Perfil actualizado con éxito.');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };
    
    const handleDelete = () => {
        showConfirmDialog({ title: '¿Estás seguro?', text: 'Tu cuenta será eliminada permanentemente.' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteAccount(user.id);
                        showSuccessAlert('Tu cuenta ha sido eliminada.');
                        logout();
                    } catch (error) {
                        showErrorAlert(error.message);
                    }
                }
            });
    };

    const profilePicture = user?.profile_picture_url 
        ? `${API_BASE_URL}/${user.profile_picture_url}`
        : `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=24651C&color=fff&size=128`;

    return (
        <main className="profile-page-main">
            <div className="profile-form-container">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <img src={profilePicture} alt="Foto de perfil" className="profile-avatar-img" />
                        <button className="avatar-edit-button" onClick={() => fileInputRef.current.click()}>
                            <FiCamera />
                        </button>
                        {/* --- BOTÓN DE ELIMINAR FOTO --- */}
                        {user?.profile_picture_url && (
                            <button className="avatar-delete-button" onClick={handleDeletePicture}>
                                <FiTrash2 />
                            </button>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <p className="profile-name">{user?.nombre} {user?.apellido}</p>
                        <p className="profile-email">{user?.correo}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="profile-form-grid">
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Apellido *</label>
                            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Correo electrónico (no editable)</label>
                            <input type="email" name="correo" value={formData.correo} disabled />
                        </div>
                        <div className="form-group">
                            <label>Teléfono *</label>
                            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button type="submit" className="btn-save-profile">Guardar datos</button>
                        <button type="button" onClick={handleDelete} className="btn-delete-account">Eliminar cuenta</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ProfilePage;