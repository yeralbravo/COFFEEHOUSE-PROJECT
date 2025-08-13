import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import '../style/Auth.css';
import logo from '../assets/logo.png';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await forgotPassword(email);
            // Si tiene éxito, redirigimos a la página de reinicio, pasando el email
            // para que el siguiente formulario sepa a qué cuenta pertenece el código.
            navigate('/reset-password', { state: { email: email } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                        <h2>Recuperar Contraseña</h2>
                        <p className="form-description">Introduce tu correo. Se generará un código de 6 dígitos que aparecerá en la consola de tu backend.</p>
                        
                        {error && <p className="general-error">{error}</p>}

                        <div className="input-group">
                            <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Código'}
                        </button>
                        <hr />
                        <p><Link to="/login" className="link">Volver a Iniciar Sesión</Link></p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordPage;