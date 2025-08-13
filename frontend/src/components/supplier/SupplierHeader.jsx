import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiBell, FiShoppingCart, FiUser, FiSearch, FiMenu } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import UserMenu from '../client/UserMenu';
import Notifications from '../client/Notifications';
import { getMyNotifications, markAllAsRead } from '../../services/notificationService';
import logo from '../../assets/logo.png';
import '../../style/ClientHeader.css';

const SupplierHeader = ({ onMenuClick }) => {
    const { itemCount } = useCart();
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:5000';

    const fetchNotifications = async () => {
        if (user) {
            try {
                const response = await getMyNotifications();
                if (response.success) {
                    setNotifications(response.data);
                    setUnreadCount(response.data.filter(n => !n.is_read).length);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) { console.error("Error al obtener notificaciones"); }
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const handleToggleNotifications = async () => {
        setNotificationsOpen(prev => !prev);
        if (!isNotificationsOpen && unreadCount > 0) {
            try {
                await markAllAsRead();
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            } catch (error) { console.error("No se pudieron marcar como leídas", error); }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="client-header-container">
            <div className="top-bar">
                <div className="header-left">
                    <button onClick={onMenuClick} className="icon-btn hamburger-btn">
                        <FiMenu />
                    </button>
                    <Link to="/home" className="logo-container">
                        <img src={logo} alt="Coffee House Logo" className="logo-img" />
                        <span className="logo-text">COFFEE HOUSE</span>
                    </Link>
                </div>
                
                <div className="user-actions">
                    <div className="user-menu-wrapper">
                        <button className="icon-btn" onClick={handleToggleNotifications}>
                            <FiBell />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </button>
                        {isNotificationsOpen && 
                            <Notifications 
                                notifications={notifications}
                                setNotifications={setNotifications}
                                onClose={() => setNotificationsOpen(false)} 
                            />
                        }
                    </div>
                    <Link to="/cart" className="icon-btn cart-icon-wrapper">
                        <FiShoppingCart />
                        {itemCount > 0 && <span className="cart-item-count">{itemCount}</span>}
                    </Link>
                    <div className="user-menu-wrapper">
                        <button className="icon-btn" onClick={() => setMenuOpen(!isMenuOpen)}>
                            {user?.profile_picture_url ? (
                                <img src={`${API_BASE_URL}/${user.profile_picture_url}`} alt="Perfil" className="header-profile-picture" />
                            ) : (
                                <FiUser />
                            )}
                        </button>
                        {isMenuOpen && <UserMenu onLogout={logout} closeMenu={() => setMenuOpen(false)} />}
                    </div>
                </div>
            </div>
            <div className="navigation-and-search-bar">
                <nav className="main-nav">
                    <NavLink to="/home" className="nav-link" end>Inicio</NavLink>
                    <NavLink to="/cafe" className="nav-link">Café</NavLink>
                    <NavLink to="/insumos" className="nav-link">Insumos</NavLink>
                    <NavLink to="/mis-pedidos" className="nav-link">Mis pedidos</NavLink>
                </nav>
                <div className="search-bar-wrapper">
                    <form onSubmit={handleSearchSubmit} className="search-bar">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </header>
    );
};

export default SupplierHeader;