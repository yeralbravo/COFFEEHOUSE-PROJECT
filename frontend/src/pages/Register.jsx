import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useAlerts } from '../hooks/useAlerts';
import '../style/Auth.css';
import logo from '../assets/logo.png';
import registerImage from '../assets/image1.png';
import { FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
    });
    // eslint-disable-next-line no-unused-vars
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.contraseña !== form.confirmarContraseña) {
            showErrorAlert('Las contraseñas no coinciden.');
            return;
        }
        try {
            const response = await register(form);
            showSuccessAlert(response.message);
            navigate('/login');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <nav className='auth-nav'>
                <Link to="/" className="logo-link">
                    <div className="logo-section">
                        <img src={logo} alt="Coffee House" className="logo-img" />
                        <h2>COFFEE HOUSE</h2>
                    </div>
                </Link>
            </nav>
            <main className='auth-main'>
                <div className='auth-image-panel'>
                    <img src={registerImage} alt="Granos de café" />
                </div>
                <div className='auth-form-panel'>
                    <form onSubmit={handleSubmit} className="auth-box" noValidate>
                        <h2>Crea tu cuenta</h2>
                        <div className="form-row">
                            <div className="input-group">
                                <span className="input-icon"><FiUser /></span>
                                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
                            </div>
                            <div className="input-group">
                                <span className="input-icon"><FiUser /></span>
                                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
                            </div>
                        </div>
                        {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                        {errors.apellido && <p className="error-text">{errors.apellido}</p>}
                        <div className="input-group">
                            <span className="input-icon"><FiPhone /></span>
                            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
                        </div>
                        {errors.telefono && <p className="error-text">{errors.telefono}</p>}
                        <div className="input-group">
                            <span className="input-icon"><FiMail /></span>
                            <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" />
                        </div>
                        {errors.correo && <p className="error-text">{errors.correo}</p>}
                        <div className="input-group">
                            <span className="input-icon"><FiLock /></span>
                            <input type={showPassword ? "text" : "password"} name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        {errors.contraseña && <p className="error-text">{errors.contraseña}</p>}
                        <div className="input-group">
                            <span className="input-icon"><FiLock /></span>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmarContraseña" value={form.confirmarContraseña} onChange={handleChange} placeholder="Confirmar Contraseña" />
                            <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        {errors.confirmarContraseña && <p className="error-text">{errors.confirmarContraseña}</p>}
                        <button type="submit">Regístrate</button>
                        <p>
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="link">Inicia sesión aquí</Link>
                        </p>
                        {/* --- MODIFICACIÓN AQUÍ --- */}
                        <p>
                            ¿Eres proveedor?{' '}
                            <Link to="/supplier-request" className="link">Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;