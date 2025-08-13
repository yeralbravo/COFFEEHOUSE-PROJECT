import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import UserMenu from '../client/UserMenu';
import Notifications from '../client/Notifications';
import { getMyNotifications, markAllAsRead } from '../../services/notificationService';
import logo from '../../assets/logo.png';
import '../../style/AdminHeader.css';

const AdminHeader = ({ onMenuClick }) => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
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
            } catch (error) {
                console.error("Error al obtener notificaciones");
            }
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
            } catch (error) {
                console.error("No se pudieron marcar como leídas", error);
            }
        }
    };

    return (
        <header className="admin-header-container">
            <div className="header-left-admin">
                <button onClick={onMenuClick} className="icon-btn-admin hamburger-btn-admin">
                    <FiMenu />
                </button>
                <Link to="/admin" className="logo-container-admin">
                    <img src={logo} alt="Coffee House Logo" className="logo-img-admin" />
                    <span className="logo-text-admin">COFFEE HOUSE</span>
                </Link>
            </div>
            
            <div className="user-actions-admin">
                <div className="user-menu-wrapper-admin">
                    <button className="icon-btn-admin" onClick={handleToggleNotifications}>
                        <FiBell />
                        {unreadCount > 0 && <span className="notification-badge-admin">{unreadCount}</span>}
                    </button>
                    {isNotificationsOpen && 
                        <Notifications 
                            notifications={notifications}
                            setNotifications={setNotifications}
                            onClose={() => setNotificationsOpen(false)} 
                        />
                    }
                </div>
                <div className="user-menu-wrapper-admin">
                    <button className="icon-btn-admin" onClick={() => setMenuOpen(!isMenuOpen)}>
                        {user?.profile_picture_url ? (
                            <img src={`${API_BASE_URL}/${user.profile_picture_url}`} alt="Perfil" className="header-profile-picture" />
                        ) : (
                            <FiUser />
                        )}
                    </button>
                    {isMenuOpen && <UserMenu onLogout={logout} closeMenu={() => setMenuOpen(false)} />}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;