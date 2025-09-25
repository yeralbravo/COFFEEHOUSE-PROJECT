import React, { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ClientHeader from './client/ClientHeader';
import SupplierHeader from './supplier/SupplierHeader';
import SupplierSidebar from './supplier/SupplierSidebar'; // Reutilizamos el sidebar del proveedor
import Footer from './client/Footer';
import { FiHome, FiCoffee, FiShoppingBag, FiFileText } from 'react-icons/fi';

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderHeader = () => {
        if (user?.role === 'supplier') {
            return <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />;
        }
        // Pasamos la función al ClientHeader también
        return <ClientHeader onMenuClick={() => setSidebarOpen(true)} />;
    };

    // Creamos una versión del Sidebar para clientes
    const renderClientSidebar = () => (
        <aside className={`supplier-sidebar ${isSidebarOpen ? 'open' : ''}`}>
             <div className="sidebar-header">
                <h3>Menú</h3>
             </div>
            <div className="sidebar-links">
                <NavLink to="/home" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiHome /> Inicio</NavLink>
                <NavLink to="/cafe" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiCoffee /> Café</NavLink>
                <NavLink to="/insumos" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiShoppingBag /> Insumos</NavLink>
                <NavLink to="/mis-pedidos" className="sidebar-link" onClick={() => setSidebarOpen(false)}><FiFileText /> Mis pedidos</NavLink>
            </div>
        </aside>
    );


    return (
        <div className="main-layout">
            {renderHeader()}
            
            {/* Overlay para cerrar el menú al hacer clic fuera */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

            {user?.role === 'supplier' ? (
                <SupplierSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            ) : (
                // Mostramos el sidebar de cliente si no es proveedor
                renderClientSidebar()
            )}

            <Outlet />
            
            <Footer />
        </div>
    );
};

export default MainLayout;