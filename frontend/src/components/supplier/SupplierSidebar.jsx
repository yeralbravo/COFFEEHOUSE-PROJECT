import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid, FiPlus, FiBox, FiCoffee, FiShoppingBag,
    FiFileText, FiBarChart2, FiChevronDown, FiX, FiShoppingCart,
    FiTrendingUp, FiPackage, FiAlertTriangle
} from 'react-icons/fi';
import '../../style/SupplierSidebar.css';

const SupplierSidebar = ({ isOpen, onClose }) => {
    const [isProductsOpen, setProductsOpen] = useState(true);
    const [isStatsOpen, setStatsOpen] = useState(true);
    const [isStoreOpen, setStoreOpen] = useState(true);

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`supplier-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Panel Proveedor</h3>
                    <button onClick={onClose} className="close-btn"><FiX /></button>
                </div>
                <div className="sidebar-links">
                    <NavLink to="/supplier/dashboard" className="sidebar-link" onClick={onClose}><FiGrid /> Dashboard</NavLink>
                    <NavLink to="/supplier/item/create?type=product" className="sidebar-link" onClick={onClose}><FiPlus /> Crear producto</NavLink>
                    <NavLink to="/supplier/orders" className="sidebar-link" onClick={onClose}><FiFileText /> Pedidos</NavLink>
                    
                    <div className="submenu-container">
                        <button className="sidebar-link submenu-toggle" onClick={() => setProductsOpen(!isProductsOpen)}>
                            <span><FiBox /> Mis productos</span>
                            <FiChevronDown className={`arrow-icon ${isProductsOpen ? 'open' : ''}`} />
                        </button>
                        {isProductsOpen && (
                            <div className="submenu-links">
                                <NavLink to="/supplier/products" className="sidebar-link sub-link" onClick={onClose}><FiCoffee /> Cafés</NavLink>
                                <NavLink to="/supplier/insumos" className="sidebar-link sub-link" onClick={onClose}><FiShoppingBag /> Insumos</NavLink>
                            </div>
                        )}
                    </div>

                    <div className="submenu-container">
                        <button className="sidebar-link submenu-toggle" onClick={() => setStatsOpen(!isStatsOpen)}>
                            <span><FiBarChart2 /> Estadísticas</span>
                            <FiChevronDown className={`arrow-icon ${isStatsOpen ? 'open' : ''}`} />
                        </button>
                        {isStatsOpen && (
                            <div className="submenu-links">
                                <NavLink to="/supplier/stats/sales" className="sidebar-link sub-link" onClick={onClose}><FiTrendingUp /> Ventas</NavLink>
                                <NavLink to="/supplier/stats/products" className="sidebar-link sub-link" onClick={onClose}><FiPackage /> Productos</NavLink>
                                <NavLink to="/supplier/stats/orders" className="sidebar-link sub-link" onClick={onClose}><FiFileText /> Pedidos</NavLink>
                                <NavLink to="/supplier/stats/low-stock" className="sidebar-link sub-link" onClick={onClose}><FiAlertTriangle /> Productos bajo stock</NavLink>
                            </div>
                        )}
                    </div>
                    
                    <div className="submenu-container">
                        <button className="sidebar-link submenu-toggle" onClick={() => setStoreOpen(!isStoreOpen)}>
                            <span><FiShoppingCart /> Ver Tienda</span>
                            <FiChevronDown className={`arrow-icon ${isStoreOpen ? 'open' : ''}`} />
                        </button>
                        {isStoreOpen && (
                            <div className="submenu-links">
                                <NavLink to="/cafe" className="sidebar-link sub-link" onClick={onClose}><FiCoffee /> Ver Cafés</NavLink>
                                <NavLink to="/insumos" className="sidebar-link sub-link" onClick={onClose}><FiShoppingBag /> Ver Insumos</NavLink>
                                <NavLink to="/mis-pedidos" className="sidebar-link sub-link" onClick={onClose}><FiFileText /> Mis Pedidos</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SupplierSidebar;