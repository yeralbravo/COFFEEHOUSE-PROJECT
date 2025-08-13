import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
// 1. Importar los íconos necesarios
import { FiGrid, FiPackage, FiFileText, FiLogOut, FiChevronDown, FiCoffee, FiShoppingBag } from 'react-icons/fi';
import '../style/SidebarSupplier.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // 2. Añadir un estado para controlar el submenú de productos
    const [isProductsOpen, setProductsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // 3. Función para abrir/cerrar el submenú
    const toggleProductsMenu = () => {
        setProductsOpen(!isProductsOpen);
    };

    // Menú específico para el rol de Proveedor
    const renderSupplierMenu = () => (
        <>
            <NavLink to="/supplier/dashboard" className="nav-link" end>
                <FiGrid /> Dashboard
            </NavLink>

            {/* --- vvv CAMBIO PRINCIPAL AQUÍ vvv --- */}
            <div className="submenu-container">
                {/* 4. Convertimos el enlace en un botón que controla el estado */}
                <button onClick={toggleProductsMenu} className="nav-link submenu-toggle">
                    <span>
                        <FiPackage /> Mis Productos
                    </span>
                    <FiChevronDown className={`arrow-icon ${isProductsOpen ? 'open' : ''}`} />
                </button>

                {/* 5. Mostramos el submenú solo si el estado es 'true' */}
                {isProductsOpen && (
                    <div className="submenu-links">
                        <NavLink to="/supplier/products" className="nav-link sub-link">
                            <FiCoffee /> Café
                        </NavLink>
                        <NavLink to="/supplier/insumos" className="nav-link sub-link">
                           <FiShoppingBag /> Insumos
                        </NavLink>
                    </div>
                )}
            </div>
            {/* --- ^^^ FIN DEL CAMBIO ^^^ --- */}

            <NavLink to="/supplier/orders" className="nav-link">
                <FiFileText /> Mis Pedidos
            </NavLink>
        </>
    );
    
    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                VC COFFEE HOUSE
            </div>

            <div className="profile-section">
                <div className="profile-icon">{user?.nombre.charAt(0)}</div>
                <div className="profile-info">
                    <p className="profile-name">{user?.nombre} {user?.apellido}</p>
                    <p className="profile-role">{user?.role}</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {user?.role === 'supplier' && renderSupplierMenu()}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;