import React from 'react';
import '../style/OrderDetailsModal.css';
import { FiX, FiInfo } from 'react-icons/fi';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="odm-overlay" onClick={onClose}>
            <div className="odm-modal" onClick={(e) => e.stopPropagation()}>
                <header className="odm-header">
                    <h2>Detalles del Pedido #{order.id}</h2>
                    <button onClick={onClose} className="odm-close-btn"><FiX /></button>
                </header>

                <div className="odm-content">
                    <div className="odm-customer-info">
                        <h3>Información del Cliente y Envío</h3>
                        <p><strong>Nombre:</strong> {order.user_name} {order.user_lastname}</p>
                        <p><strong>Correo:</strong> {order.user_email}</p>
                        <p><strong>Dirección:</strong> {`${order.user_address || 'No especificada'}, ${order.user_city || ''}, ${order.user_department || ''}`}</p>
                        <p><strong>Fecha del Pedido:</strong> {new Date(order.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        
                        {/* --- LÍNEAS AÑADIDAS --- */}
                        {order.user_note && order.user_note !== 'null' && (
                            <div className="odm-note-section">
                                <FiInfo className="note-icon" />
                                <p><strong>Nota del Cliente:</strong> {order.user_note}</p>
                            </div>
                        )}
                    </div>

                    <div className="odm-items-section">
                        <h3>Productos del Pedido</h3>
                        <table className="odm-items-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${new Intl.NumberFormat('es-CO').format(item.price_at_purchase)}</td>
                                        <td>${new Intl.NumberFormat('es-CO').format(item.quantity * item.price_at_purchase)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="odm-total-summary">
                        <strong>Total General del Pedido:</strong>
                        <span>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;