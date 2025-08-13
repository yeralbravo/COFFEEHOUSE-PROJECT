import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import '../../style/AdminLayout.css'; // Nuevo archivo CSS

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout-container">
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="admin-main-content">
                <Outlet /> {/* Aquí se renderizarán las páginas como AdminPanel, ClientsPage, etc. */}
            </main>
        </div>
    );
};

export default AdminLayout;