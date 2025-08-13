import React, { useState } from 'react';
import SupplierHeader from './SupplierHeader';
import SupplierSidebar from './SupplierSidebar';

const SupplierLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="supplier-layout">
            <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />
            <SupplierSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="supplier-main-content">
                {children}
            </main>
        </div>
    );
};

export default SupplierLayout;