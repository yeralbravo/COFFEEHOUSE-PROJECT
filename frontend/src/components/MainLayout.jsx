import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ClientHeader from './client/ClientHeader';
import SupplierHeader from './supplier/SupplierHeader';
import SupplierSidebar from './supplier/SupplierSidebar';
import Footer from './client/Footer';

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderHeader = () => {
        if (user?.role === 'supplier') {
            return <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />;
        }
        return <ClientHeader />;
    };

    return (
        <div className="main-layout">
            {renderHeader()}
            
            {user?.role === 'supplier' && (
                <SupplierSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            )}

            {/* <Outlet> renderiza la página actual SIN su propio header/footer */}
            <Outlet />
            
            <Footer />
        </div>
    );
};

export default MainLayout;