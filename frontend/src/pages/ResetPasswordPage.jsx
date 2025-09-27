import React, { useState } from 'react'; // Se importa useState
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPasswordWithCode } from '../services/authService';
import '../style/Auth.css';
import logo from '../assets/logo.png';
// Se importan los íconos necesarios
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- ESTADOS AÑADIDOS ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!email) {
            setError('No se encontró el correo electrónico. Por favor, inicia el proceso de nuevo.');
            return;
        }
        setError('');
        setMessage('');
        try {
            const response = await resetPasswordWithCode(email, code, password);
            setMessage(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
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
            <main className='auth-main single-panel'>
                <div className='auth-form-panel'>
                    <form onSubmit={handleSubmit} className="auth-box" noValidate>
                        <h2>Establecer Nueva Contraseña</h2>
                        
                        {message && <p className="general-success">{message}</p>}
                        {error && <p className="general-error">{error}</p>}

                        <div className="input-group">
                            {/* Este campo no cambia, pero se le puede añadir un ícono si se desea */}
                            <input type="text" placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} required />
                        </div>
                        
                        {/* --- CAMPO DE NUEVA CONTRASEÑA MODIFICADO --- */}
                        <div className="input-group">
                            <FiLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        
                        {/* --- CAMPO DE CONFIRMAR CONTRASEÑA MODIFICADO --- */}
                        <div className="input-group">
                            <FiLock className="input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmar nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        
                        <button type="submit">Actualizar Contraseña</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ResetPasswordPage;