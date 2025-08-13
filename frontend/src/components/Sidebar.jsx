// import React, { useState, useContext } from 'react';
// import { NavLink } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import '../style/Sidebar.css';

// const Sidebar = () => {
//     const { user, logout } = useContext(AuthContext);
//     const [isUsersMenuOpen, setUsersMenuOpen] = useState(false);

//     const toggleUsersMenu = () => {
//         setUsersMenuOpen(!isUsersMenuOpen);
//     };

//     return (
//         <div className="sidebar">
//             <div className="sidebar-header">
//                 <h2>HC COFFEE HOUSE</h2>
//             </div>
//             <div className="profile">
//                 <div className="profile-icon">{user?.nombre.charAt(0)}</div>
//                 <p>Perfil</p>
//             </div>
//             <nav className="sidebar-nav">
//                 <NavLink to="/admin" end>Dashboard</NavLink>
//                 <NavLink to="/admin/products">Productos</NavLink>
//                 <NavLink to="/admin/orders">Pedidos</NavLink> {/* <-- ASEGÚRATE QUE ESTA LÍNEA ESTÉ ASÍ */}
                
//                 <div className="submenu-container">
//                     <button onClick={toggleUsersMenu} className="submenu-toggle">
//                         Usuarios
//                         <span className={`arrow ${isUsersMenuOpen ? 'open' : ''}`}>&#9660;</span>
//                     </button>
//                     {isUsersMenuOpen && (
//                         <div className="submenu">
//                             <NavLink to="/admin/create-user">Crear Usuario</NavLink>
//                             <NavLink to="/admin/clients">Clientes</NavLink>
//                             <NavLink to="/admin/suppliers">Proveedores</NavLink>
//                             <NavLink to="/admin/admins">Administradores</NavLink>
//                         </div>
//                     )}
//                 </div>
                
//                 <NavLink to="/admin/activity-log">Registro de Actividad</NavLink>
//                 <NavLink to="/admin/support">Soporte</NavLink>
//             </nav>
//             <div className="sidebar-footer">
//                 <button onClick={logout} className="logout-btn">
//                     Cerrar sesión
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;