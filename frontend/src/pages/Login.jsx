import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Auth.css'; 
import logo from '../assets/logo.png';
import loginImage from '../assets/image1.png';

const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> );
const KeyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3L22 7l-3-3"></path></svg> );
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeSlashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> );

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!errors.general) { return; }
    const timer = setTimeout(() => { setErrors({}); }, 7000);
    return () => clearTimeout(timer);
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!correo) { newErrors.correo = 'Ingresa tú correo electrónico.'; } else if (!/^\S+@\S+\.\S+$/.test(correo)) { newErrors.correo = 'El formato del correo no es válido.'; }
    if (!contraseña) { newErrors.contraseña = 'Ingresa tú contraseña.'; }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    try {
      await login(correo.trim(), contraseña.trim());
    } catch (error) {
      setErrors({ general: error.message || 'Usuario o contraseña incorrecta' });
    }
  };

  const handleCorreoBlur = () => {
    if (correo && !/^\S+@\S+\.\S+$/.test(correo)) {
      setErrors({ general: 'Formato de correo inválido. Asegúrate de que sea como "nombre@dominio.com".' });
    }
  };

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
    if (errors.general && errors.general.startsWith('Formato de correo inválido')) {
      setErrors({});
    }
    if (errors.correo) {
      setErrors(prev => ({ ...prev, correo: undefined }));
    }
  };

  const handleRegister = () => {
    navigate('/register');
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
        <div className='auth-container'>
          <div className='auth-image-panel'>
            <img src={loginImage} alt="Café servido en una taza" />
          </div>
          <div className='auth-form-panel'>
            <form onSubmit={handleSubmit} className="auth-box" noValidate>
              <h2>Iniciar Sesión</h2>
              {errors.general && <p className="general-error">{errors.general}</p>}
              <div className="input-group">
                <span className="input-icon"><MailIcon /></span>
                <input type="email" placeholder="Correo electrónico" value={correo} onChange={handleCorreoChange} onBlur={handleCorreoBlur} />
              </div>
              {errors.correo && <p className="error-text">{errors.correo}</p>}
              <div className="input-group">
                   <span className="input-icon"><KeyIcon /></span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </span>
              </div>
              {errors.contraseña && <p className="error-text">{errors.contraseña}</p>}
              <p className="forgot-password">
                <Link to="/forgot-password" className="link">¿Olvidaste tu contraseña?</Link>
              </p>
              <button type="submit">Iniciar sesión</button>
              <hr />
              <p>
                ¿No tienes una cuenta?{' '}
                <a className="link" onClick={handleRegister} href="#">Regístrate aquí</a>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        <span>© 2025 Coffee House. Todos los derechos reservados.</span>
        <a href="#" className='link'>Política de privacidad</a>
      </footer>
    </div>
  );
};

export default Login;