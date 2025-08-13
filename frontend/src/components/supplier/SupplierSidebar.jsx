import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiPlus, FiBox, FiCoffee, FiShoppingBag, FiFileText, FiBarChart2, FiChevronDown, FiX } from 'react-icons/fi';
import '../../style/SupplierSidebar.css';

const SupplierSidebar = ({ isOpen, onClose }) => {
    const [isProductsOpen, setProductsOpen] = useState(true); // Abierto por defecto
    const [isStatsOpen, setStatsOpen] = useState(true);     // Abierto por defecto

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`supplier-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Panel Proveedor</h3>
                    <button onClick={onClose} className="close-btn"><FiX /></button>
                </div>
                <div className="sidebar-links">
                    <NavLink to="/home" className="sidebar-link" onClick={onClose}><FiHome /> Inicio</NavLink>
                    <NavLink to="/supplier/dashboard" className="sidebar-link" onClick={onClose}><FiGrid /> Dashboard</NavLink>
                    <NavLink to="/supplier/item/create?type=product" className="sidebar-link" onClick={onClose}><FiPlus /> Crear producto</NavLink>
                    <NavLink to="/supplier/orders" className="sidebar-link" onClick={onClose}><FiFileText /> Pedidos</NavLink>
                    
                    {/* Submenú Mis Productos */}
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

                    {/* Submenú Estadísticas */}
                    <div className="submenu-container">
                        <button className="sidebar-link submenu-toggle" onClick={() => setStatsOpen(!isStatsOpen)}>
                            <span><FiBarChart2 /> Estadísticas</span>
                            <FiChevronDown className={`arrow-icon ${isStatsOpen ? 'open' : ''}`} />
                        </button>
                        {isStatsOpen && (
                            <div className="submenu-links">
                                <NavLink to="/supplier/stats/sales" className="sidebar-link sub-link" onClick={onClose}>Ventas</NavLink>
                                <NavLink to="/supplier/stats/products" className="sidebar-link sub-link" onClick={onClose}>Productos</NavLink>
                                <NavLink to="/supplier/stats/orders" className="sidebar-link sub-link" onClick={onClose}>Pedidos</NavLink>
                                <NavLink to="/supplier/stats/low-stock" className="sidebar-link sub-link" onClick={onClose}>Productos bajo stock</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SupplierSidebar;