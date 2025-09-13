import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../style/Forms.css';
import { FiUser, FiPhone, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';

const UserForm = ({ title }) => {
    const { createUserByAdmin } = useContext(AuthContext);
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        role: 'client',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        // --- EXPRESIÓN REGULAR CORREGIDA ---
        // Permite letras y espacios en medio de las palabras.
        const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(\s[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Se usa .trim() para eliminar espacios al inicio y al final antes de validar
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
        else if (!nameRegex.test(formData.nombre.trim())) newErrors.nombre = 'El nombre solo puede contener letras y espacios intermedios.';
        
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
        else if (!nameRegex.test(formData.apellido.trim())) newErrors.apellido = 'El apellido solo puede contener letras y espacios intermedios.';
        
        if (!formData.telefono) newErrors.telefono = 'El teléfono es obligatorio.';
        else if (!phoneRegex.test(formData.telefono)) newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
        
        if (!formData.correo) newErrors.correo = 'El correo es obligatorio.';
        else if (!emailRegex.test(formData.correo)) newErrors.correo = 'El formato del correo no es válido.';
        
        if (!formData.contraseña) newErrors.contraseña = 'La contraseña es obligatoria.';
        else if (!passwordRegex.test(formData.contraseña)) newErrors.contraseña = 'La contraseña debe ser de 8+ caracteres y contener mayúscula, minúscula, número y un carácter especial (@$!%*?).';
        
        if (formData.contraseña !== formData.confirmarContraseña) newErrors.confirmarContraseña = 'Las contraseñas no coinciden.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const { confirmarContraseña, ...dataToSend } = formData;
            // Enviamos los datos sin espacios extra
            dataToSend.nombre = dataToSend.nombre.trim();
            dataToSend.apellido = dataToSend.apellido.trim();
            
            const response = await createUserByAdmin(dataToSend);
            showSuccessAlert(response.message);
            setFormData({ nombre: '', apellido: '', telefono: '', correo: '', contraseña: '', confirmarContraseña: '', role: 'client' });
            setErrors({});
        } catch (err) {
            showErrorAlert(err.message);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">{title}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Rol del Usuario</label>
                    <div className="input-with-icon">
                        <FiBriefcase className="input-icon" />
                        <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                            <option value="client">Cliente</option>
                            <option value="supplier">Proveedor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Nombre</label>
                        <div className="input-with-icon">
                            <FiUser className="input-icon" />
                            <input type="text" name="nombre" placeholder="John" value={formData.nombre} onChange={handleChange} />
                        </div>
                        {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <div className="input-with-icon">
                            <FiUser className="input-icon" />
                            <input type="text" name="apellido" placeholder="Doe" value={formData.apellido} onChange={handleChange} />
                        </div>
                        {errors.apellido && <p className="error-text">{errors.apellido}</p>}
                    </div>
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <div className="input-with-icon">
                        <FiPhone className="input-icon" />
                        <input type="text" name="telefono" placeholder="3001234567" value={formData.telefono} onChange={handleChange} />
                    </div>
                    {errors.telefono && <p className="error-text">{errors.telefono}</p>}
                </div>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <div className="input-with-icon">
                        <FiMail className="input-icon" />
                        <input type="email" name="correo" placeholder="john.doe@example.com" value={formData.correo} onChange={handleChange} />
                    </div>
                    {errors.correo && <p className="error-text">{errors.correo}</p>}
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={showPassword ? "text" : "password"} name="contraseña" placeholder="••••••••" value={formData.contraseña} onChange={handleChange} />
                        <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errors.contraseña && <p className="error-text">{errors.contraseña}</p>}
                </div>
                <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={showPassword ? "text" : "password"} name="confirmarContraseña" placeholder="••••••••" value={formData.confirmarContraseña} onChange={handleChange} />
                    </div>
                    {errors.confirmarContraseña && <p className="error-text">{errors.confirmarContraseña}</p>}
                </div>
                <button type="submit" className="form-button">Crear Usuario</button>
            </form>
        </div>
    );
};

export default UserForm;