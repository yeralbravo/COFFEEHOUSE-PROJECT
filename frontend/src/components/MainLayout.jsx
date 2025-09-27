import React, { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ClientHeader from './client/ClientHeader';
import SupplierHeader from './supplier/SupplierHeader';
import SupplierSidebar from './supplier/SupplierSidebar';
import Footer from './client/Footer';
import { FiHome, FiCoffee, FiShoppingBag, FiFileText, FiLogOut, FiX } from 'react-icons/fi';
import '../style/SupplierSidebar.css'; // Importamos el CSS aquí también por si acaso

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext); // Obtenemos user y logout
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const API_BASE_URL = 'http://localhost:5000';

    const profilePicture = user?.profile_picture_url 
        ? `${API_BASE_URL}/${user.profile_picture_url}`
        : `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=24651C&color=fff`;

    const renderHeader = () => {
        if (user?.role === 'supplier') {
            return <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />;
        }
        return <ClientHeader onMenuClick={() => setSidebarOpen(true)} />;
    };

    const renderClientSidebar = () => (
        <aside className={`supplier-sidebar ${isSidebarOpen ? 'open' : ''}`}>
             <div className="sidebar-header">
                <h3>Menú</h3>
                <button onClick={() => setSidebarOpen(false)} className="close-btn"><FiX /></button>
                {/* SECCIÓN DE PERFIL AÑADIDA */}
                {user && (
                    <div className="profile-info-supplier">
                        <img src={profilePicture} alt="Perfil" className="sidebar-profile-picture" />
                        <span>{user?.nombre} {user?.apellido}</span>
                    </div>
                )}
             </div>
            <div className="sidebar-links">
                <NavLink to="/home" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiHome /> Inicio</NavLink>
                <NavLink to="/cafe" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiCoffee /> Café</NavLink>
                <NavLink to="/insumos" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiShoppingBag /> Insumos</NavLink>
                <NavLink to="/mis-pedidos" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiFileText /> Mis pedidos</NavLink>
            </div>
            {/* FOOTER CON BOTÓN DE LOGOUT AÑADIDO */}
            {user && (
                <div className="sidebar-footer-supplier">
                    <button onClick={logout} className="logout-btn-supplier">
                        <FiLogOut /> Cerrar sesión
                    </button>
                </div>
            )}
        </aside>
    );

    return (
        <div className="main-layout">
            {renderHeader()}
            
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

            {user?.role === 'supplier' ? (
                <SupplierSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            ) : (
                renderClientSidebar()
            )}

            <Outlet />
            
            <Footer />
        </div>
    );
};

export default MainLayout;