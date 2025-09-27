import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import {
    FiGrid, FiUsers, FiFileText, FiActivity, FiMessageSquare, FiLogOut,
    FiChevronDown, FiBriefcase, FiBarChart2, FiUserCheck, FiTrendingUp, FiPackage
} from 'react-icons/fi';
import '../../style/AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useContext(AuthContext);
    const [isUsersMenuOpen, setUsersMenuOpen] = useState(false);    
    const [isGestionMenuOpen, setGestionMenuOpen] = useState(false);  

    const API_BASE_URL = 'http://localhost:5000';

    const profilePicture = user?.profile_picture_url 
        ? `${API_BASE_URL}/${user.profile_picture_url}`
        : `https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=24651C&color=fff`;

    return (
        <>
            <div className={`sidebar-overlay-admin ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header-admin">
                    <h3>Panel Administrador</h3>
                    <div className="profile-info-admin">
                        <img src={profilePicture} alt="Perfil" className="sidebar-profile-picture" />
                        <span>{user?.nombre} {user?.apellido}</span>
                    </div>
                </div>
                <nav className="sidebar-nav-admin">
                    <NavLink to="/admin" className="sidebar-link-admin" onClick={onClose} end><FiGrid /> Dashboard</NavLink>
                    
                    <div className="submenu-container-admin">
                        <button onClick={() => setGestionMenuOpen(!isGestionMenuOpen)} className="sidebar-link-admin submenu-toggle-admin">
                            <span><FiBriefcase /> Gestión Coffee House</span>
                            <FiChevronDown className={`arrow-icon ${isGestionMenuOpen ? 'open' : ''}`} />
                        </button>
                        {isGestionMenuOpen && (
                            <div className="submenu-links-admin">
                                <NavLink to="/admin/stats/sales" className="sidebar-link-admin sub-link-admin" onClick={onClose}><FiTrendingUp /> Ventas</NavLink>
                                <NavLink to="/admin/stats/products" className="sidebar-link-admin sub-link-admin" onClick={onClose}><FiPackage /> Productos</NavLink>
                                <NavLink to="/admin/stats/users" className="sidebar-link-admin sub-link-admin" onClick={onClose}><FiUsers /> Usuarios</NavLink>
                                <NavLink to="/admin/stats/orders" className="sidebar-link-admin sub-link-admin" onClick={onClose}><FiFileText /> Pedidos</NavLink>
                            </div>
                        )}
                    </div>

                    <div className="submenu-container-admin">
                        <button onClick={() => setUsersMenuOpen(!isUsersMenuOpen)} className="sidebar-link-admin submenu-toggle-admin">
                            <span><FiUsers /> Usuarios</span>
                            <FiChevronDown className={`arrow-icon ${isUsersMenuOpen ? 'open' : ''}`} />
                        </button>
                        {isUsersMenuOpen && (
                            <div className="submenu-links-admin">
                                <NavLink to="/admin/create-user" className="sidebar-link-admin sub-link-admin" onClick={onClose}>Crear Usuario</NavLink>
                                <NavLink to="/admin/clients" className="sidebar-link-admin sub-link-admin" onClick={onClose}>Clientes</NavLink>
                                <NavLink to="/admin/suppliers" className="sidebar-link-admin sub-link-admin" onClick={onClose}>Proveedores</NavLink>
                                <NavLink to="/admin/admins" className="sidebar-link-admin sub-link-admin" onClick={onClose}>Administradores</NavLink>
                            </div>
                        )}
                    </div>
                    
                    <NavLink to="/admin/supplier-requests" className="sidebar-link-admin" onClick={onClose}><FiUserCheck /> Solicitudes Proveedor</NavLink>
                    <NavLink to="/admin/orders" className="sidebar-link-admin" onClick={onClose}><FiFileText /> Pedidos</NavLink>
                    <NavLink to="/admin/activity-log" className="sidebar-link-admin" onClick={onClose}><FiActivity /> Registro de Actividad</NavLink>
                    <NavLink to="/admin/support" className="sidebar-link-admin" onClick={onClose}><FiMessageSquare /> Soporte</NavLink>
                </nav>
                <div className="sidebar-footer-admin">
                    <button onClick={logout} className="logout-btn-admin">
                        <FiLogOut /> Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;