import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNotification } from '../../services/notificationService';
import { FiBell, FiMoreVertical, FiTrash2, FiX } from 'react-icons/fi'; // <-- 1. Importar FiX
import '../../style/Notifications.css';

const Notifications = ({ notifications, setNotifications, onClose }) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleNotificationClick = (notification) => {
        if (notification.link_url) {
            navigate(notification.link_url);
        }
        onClose();
    };

    const handleDelete = async (e, notificationId) => {
        e.stopPropagation();
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error("Error al eliminar notificación", error);
        }
        setOpenMenuId(null);
    };
    
    const toggleMenu = (e, notificationId) => {
        e.stopPropagation();
        setOpenMenuId(prev => (prev === notificationId ? null : notificationId));
    };

    return (
        <div className="notifications-dropdown-menu">
            <div className="notifications-header">
                <h3>Notificaciones</h3>
                {/* --- 2. AÑADIR BOTÓN DE CIERRE --- */}
                <button onClick={onClose} className="close-dropdown-btn">
                    <FiX size={20} />
                </button>
            </div>
            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="notification-item empty">
                        No tienes notificaciones.
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item ${notif.is_read ? 'read' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <FiBell className="notification-icon" />
                            <p>{notif.message}</p>
                            <div className="notification-options">
                                <button className="options-btn" onClick={(e) => toggleMenu(e, notif.id)}>
                                    <FiMoreVertical />
                                </button>
                                {openMenuId === notif.id && (
                                    <div className="options-menu">
                                        <button onClick={(e) => handleDelete(e, notif.id)}>
                                            <FiTrash2 /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;