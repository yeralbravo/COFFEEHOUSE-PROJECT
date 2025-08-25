import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNotification } from '../../services/notificationService';
import { FiBell, FiMoreVertical, FiTrash2, FiX } from 'react-icons/fi';
import '../../style/Notifications.css';

const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} h`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} min`;
    return `hace ${Math.floor(seconds)} seg`;
};

const Notifications = ({ notifications, setNotifications, onClose }) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);

    // ================== LÓGICA DE AGRUPACIÓN AÑADIDA ==================
    const groupedNotifications = notifications.reduce((acc, notif) => {
        // Usamos la fecha formateada que viene del backend como clave
        const date = notif.formatted_date || 'Fecha desconocida';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(notif);
        return acc;
    }, {});

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
                    // ================== RENDERIZADO MODIFICADO ==================
                    // Mapeamos sobre el objeto de grupos en lugar del array plano
                    Object.entries(groupedNotifications).map(([date, notifsOnDate]) => (
                        <div key={date} className="notification-date-group">
                            <h4 className="notification-date-header">{date}</h4>
                            {notifsOnDate.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${notif.is_read ? 'read' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <FiBell className="notification-icon" />
                                    <div className="notification-content">
                                        <p>{notif.message}</p>
                                        <span className="notification-time">{timeAgo(notif.created_at)}</span>
                                    </div>
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
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;