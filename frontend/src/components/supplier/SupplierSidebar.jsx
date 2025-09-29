import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    FiHome, FiGrid, FiPlus, FiBox, FiCoffee, FiShoppingBag,
    FiFileText, FiBarChart2, FiChevronDown, FiX, FiShoppingCart,
    FiTrendingUp, FiPackage, FiAlertTriangle, FiLogOut
} from 'react-icons/fi';
import '../../style/SupplierSidebar.css';

const SupplierSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useContext(AuthContext);
    const [isProductsOpen, setProductsOpen] = useState(false);
    const [isStatsOpen, setStatsOpen] = useState(false);
    const [isStoreOpen, setStoreOpen] = useState(false);
    const API_BASE_URL = 'http://localhost:5000';

    const profilePicture = user?.profile_picture_url 
        ? `${API_BASE_URL}/${user.profile_picture_url}`
        : `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=24651C&color=fff`;

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`supplier-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Panel Proveedor</h3>
                    <button onClick={onClose} className="close-btn"><FiX /></button>
                    <div className="profile-info-supplier">
                        <img src={profilePicture} alt="Perfil" className="sidebar-profile-picture" />
                        <span>{user?.nombre} {user?.apellido}</span>
                    </div>
                </div>
                <div className="sidebar-links">
                    <NavLink to="/home" className="sidebar-link" onClick={onClose}><FiHome /> Inicio</NavLink>
                    <NavLink to="/supplier/dashboard" className="sidebar-link" onClick={onClose}><FiGrid /> Dashboard</NavLink>
                    
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
                </div>
                <div className="sidebar-footer-supplier">
                    <button onClick={logout} className="logout-btn-supplier">
                        <FiLogOut /> Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SupplierSidebar;