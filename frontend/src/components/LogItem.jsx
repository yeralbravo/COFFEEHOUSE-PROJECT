import React from 'react';
import { FiUserPlus, FiUserMinus, FiEdit, FiFileText, FiCheckSquare, FiTrash2 } from 'react-icons/fi';
import '../style/ActivityLog.css';

const actionInfo = {
    USER_CREATED: {
        icon: <FiUserPlus />,
        colorClass: 'color-green',
        title: 'creó un nuevo usuario'
    },
    USER_DELETED: {
        icon: <FiUserMinus />,
        colorClass: 'color-red',
        title: 'eliminó un usuario'
    },
    USER_UPDATED: {
        icon: <FiEdit />,
        colorClass: 'color-blue',
        title: 'actualizó un usuario'
    },
    ORDER_STATUS_UPDATED: {
        icon: <FiFileText />,
        colorClass: 'color-blue',
        title: 'actualizó un pedido'
    },
    ORDER_DELETED: {
        icon: <FiTrash2 />,
        colorClass: 'color-red',
        title: 'eliminó un pedido'
    },
    SUPPLIER_REQUEST_UPDATED: {
        icon: <FiCheckSquare />,
        colorClass: 'color-purple',
        title: 'gestionó una solicitud de proveedor'
    }
};

const fieldTranslations = {
    nombre: 'Nombre',
    apellido: 'Apellido',
    telefono: 'Teléfono',
    correo: 'Correo',
    role: 'Rol',
};

const LogItem = ({ log }) => {
    const { icon, colorClass, title } = actionInfo[log.action] || { icon: '?', colorClass: 'color-grey', title: log.action };
    
    const formatDetails = () => {
        try {
            const detailsObj = JSON.parse(log.details);
            switch (log.action) {
                case 'USER_CREATED':
                    return `Se creó al usuario <strong>${detailsObj.createdUserName}</strong> con el rol de <strong>${detailsObj.createdUserRole}</strong>.`;
                case 'USER_DELETED':
                    return `Se eliminó al usuario <strong>${detailsObj.deletedUserName}</strong> (${detailsObj.deletedUserEmail}).`;
                case 'USER_UPDATED':
                    if (detailsObj.changes && detailsObj.changes.length > 0) {
                        const changesList = detailsObj.changes.map(c => 
                            `<li>Cambió <strong>${fieldTranslations[c.field] || c.field}</strong> de '<code>${c.from}</code>' a '<code>${c.to}</code>'.</li>`
                        ).join('');
                        return `Para el usuario <strong>${detailsObj.updatedUserName}</strong>: <ul>${changesList}</ul>`;
                    }
                    return `Se actualizó la información del usuario <strong>${detailsObj.updatedUserName}</strong>.`;
                
                case 'ORDER_STATUS_UPDATED':
                    return `Cambió el estado del pedido <strong>#${detailsObj.orderId}</strong> de '<code>${detailsObj.fromStatus}</code>' a '<code>${detailsObj.toStatus}</code>' para el cliente <strong>${detailsObj.customerName}</strong>.`;
                case 'ORDER_DELETED':
                    return `Eliminó el pedido <strong>#${detailsObj.orderId}</strong> del cliente <strong>${detailsObj.customerName}</strong> (Total: $${new Intl.NumberFormat('es-CO').format(detailsObj.totalAmount)}).`;
                case 'SUPPLIER_REQUEST_UPDATED':
                    return `Se <strong>${detailsObj.action}</strong> la solicitud de la empresa <strong>${detailsObj.companyName}</strong>.`;

                default:
                    return log.details;
            }
        } catch (e) {
            return log.details || 'N/A';
        }
    };

    return (
        <div className="log-timeline-item">
            <div className={`log-icon-wrapper ${colorClass}`}>
                {icon}
            </div>
            <div className="log-item-card">
                <p className="log-action-text">
                    <span className="log-admin-name">{log.admin_name}</span> {title}
                </p>
                <div className="log-details" dangerouslySetInnerHTML={{ __html: formatDetails() }} />
                <div className="log-timestamp">
                    {new Date(log.timestamp).toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default LogItem;