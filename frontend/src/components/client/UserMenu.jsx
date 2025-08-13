import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiLogOut, FiX } from 'react-icons/fi'; // <-- 1. Importar FiX
import AuthContext from '../../context/AuthContext';
import '../../style/UserMenu.css';

const UserMenu = ({ onLogout, closeMenu }) => {
    const { user } = useContext(AuthContext);

    const handleLogout = () => {
        onLogout();
        closeMenu();
    };

    const profilePath = user?.role === 'admin' ? '/admin/profile' : '/profile';
    const changePasswordPath = user?.role === 'admin' ? '/admin/change-password' : '/change-password';

    return (
        <div className="user-menu-container">
            {/* --- 2. AÑADIR BOTÓN DE CIERRE --- */}
            <button onClick={closeMenu} className="close-dropdown-btn top-right">
                <FiX size={20} />
            </button>
            <Link to={profilePath} className="user-menu-item" onClick={closeMenu}>
                <FiUser /> Mi perfil
            </Link>
            <Link to={changePasswordPath} className="user-menu-item" onClick={closeMenu}>
                <FiLock /> Modificar contraseña
            </Link>
            <button onClick={handleLogout} className="user-menu-item logout">
                <FiLogOut /> Cerrar sesión
            </button>
        </div>
    );
};

export default UserMenu;