import { React, useState, useContext, useRef, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { updateUser, deleteAccount, updateProfilePicture, deleteProfilePicture } from '../services/userService';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../services/addressService';
import { useAlerts } from '../hooks/useAlerts';
import { FiCamera, FiTrash2, FiPlusCircle, FiMapPin, FiEdit, FiX } from 'react-icons/fi';
import '../style/ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, refreshUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        correo: user?.correo || '',
        telefono: user?.telefono || '',
    });

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressFormData, setAddressFormData] = useState({});
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressErrors, setAddressErrors] = useState({});

    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const fileInputRef = useRef(null);
    const API_BASE_URL = 'http://localhost:5000';

    const fetchAddresses = async () => {
        try {
            const response = await getMyAddresses();
            if (response.success) {
                setAddresses(response.data);
            }
        } catch (error) {
            showErrorAlert('No se pudieron cargar tus direcciones.');
        }
    };

    useEffect(() => {
        // Solo busca las direcciones si no es admin
        if (user?.role !== 'admin') {
            fetchAddresses();
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'telefono') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setAddressFormData({ ...addressFormData, [name]: numericValue });
        } else {
            setAddressFormData({ ...addressFormData, [name]: value });
        }

        if (addressErrors[name]) {
            setAddressErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateAddressForm = () => {
        const errors = {};
        if (!addressFormData.nombre?.trim()) errors.nombre = 'El nombre es obligatorio.';
        if (!addressFormData.apellido?.trim()) errors.apellido = 'El apellido es obligatorio.';
        if (!addressFormData.telefono?.trim()) {
            errors.telefono = 'El teléfono es obligatorio.';
        } else if (addressFormData.telefono.length < 10) {
            errors.telefono = 'El teléfono debe tener al menos 10 dígitos.';
        }
        if (!addressFormData.correo?.trim()) {
            errors.correo = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(addressFormData.correo)) {
            errors.correo = 'El formato del correo no es válido.';
        }
        if (!addressFormData.direccion?.trim()) errors.direccion = 'La dirección es obligatoria.';
        if (!addressFormData.departamento?.trim()) errors.departamento = 'El departamento es obligatorio.';
        if (!addressFormData.ciudad?.trim()) errors.ciudad = 'La ciudad es obligatoria.';

        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!validateAddressForm()) return;
        try {
            if (editingAddressId) {
                await updateAddress(editingAddressId, addressFormData);
                showSuccessAlert('Dirección actualizada con éxito.');
            } else {
                await createAddress(addressFormData);
                showSuccessAlert('Dirección guardada con éxito.');
            }
            fetchAddresses();
            setShowAddressForm(false);
            setEditingAddressId(null);
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setAddressFormData(address);
        setShowAddressForm(true);
        setAddressErrors({});
    };

    const handleAddNewAddressClick = () => {
        setEditingAddressId(null);
        setAddressFormData({ nombre: '', apellido: '', telefono: '', correo: '', direccion: '', departamento: '', ciudad: '', });
        setShowAddressForm(true);
        setAddressErrors({});
    };

    const handleCancelAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressErrors({});
    };

    const handleDeleteAddress = (addressId) => {
        showConfirmDialog({ title: '¿Eliminar dirección?', text: 'Esta dirección se eliminará permanentemente.' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteAddress(addressId);
                        setAddresses(addresses.filter(addr => addr.id !== addressId));
                        showSuccessAlert('Dirección eliminada.');
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

    const handleDeletePicture = () => {
        showConfirmDialog({ title: '¿Eliminar foto de perfil?', text: 'Tu foto de perfil será eliminada.' })
            .then(async (result) => {
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

    const profilePicture = user?.profile_picture_url 
        ? `${API_BASE_URL}/${user.profile_picture_url}`
        : `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=24651C&color=fff&size=128`;

    return (
        <main className="profile-page-main">
            <div className="profile-form-container">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <img src={profilePicture} alt="Foto de perfil" className="profile-avatar-img" />
                        <button className="avatar-edit-button" onClick={() => fileInputRef.current.click()}><FiCamera /></button>
                        {user?.profile_picture_url && (
                            <button className="avatar-delete-button" onClick={handleDeletePicture}><FiTrash2 /></button>
                        )}
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
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

                    {/* --- CONDICIÓN AÑADIDA AQUÍ --- */}
                    {user?.role !== 'admin' && (
                        <div className="profile-addresses-section">
                            <div className="addresses-header">
                                <h2>Mis Direcciones</h2>
                                <button 
                                    type="button" 
                                    onClick={showAddressForm ? handleCancelAddressForm : handleAddNewAddressClick} 
                                    className={showAddressForm ? "btn-cancel-address" : "btn-add-address"}
                                >
                                    {showAddressForm ? <FiX /> : <FiPlusCircle />} 
                                    {showAddressForm ? 'Cancelar' : 'Añadir Dirección'}
                                </button>
                            </div>

                            {showAddressForm && (
                                <div className="address-form">
                                    <h4>{editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}</h4>
                                    <div className="address-form-grid">
                                        {/* ... campos del formulario de dirección ... */}
                                    </div>
                                    <button type="button" onClick={handleSaveAddress} className="btn-save-address">
                                        {editingAddressId ? 'Actualizar Dirección' : 'Guardar Dirección'}
                                    </button>
                                </div>
                            )}

                            <div className="addresses-list">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="address-card">
                                        <FiMapPin className="address-icon" />
                                        <div className="address-details">
                                            <strong>{addr.nombre} {addr.apellido}</strong>
                                            <p>{addr.direccion}, {addr.ciudad}, {addr.departamento}</p>
                                            <p>Tel: {addr.telefono}</p>
                                        </div>
                                        <div className="address-actions">
                                            <button type="button" onClick={() => handleEditAddress(addr)} className="address-edit-btn"><FiEdit /></button>
                                            <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="address-delete-btn"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && !showAddressForm && <p className="no-addresses-message">No tienes direcciones guardadas.</p>}
                            </div>
                        </div>
                    )}

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