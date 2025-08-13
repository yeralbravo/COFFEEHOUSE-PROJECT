import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/OrderCard.css';

const statusInfo = {
    Pendiente: { color: '#f5a623', text: 'El proveedor esta empacando tú pedido' },
    Enviado: { color: '#4a90e2', text: 'La transportadora tiene tú pedido' },
    Entregado: { color: '#24651C', text: 'Llegó el ' }
};

const OrderCard = ({ order }) => {
    const API_BASE_URL = 'http://localhost:5000';
    const status = statusInfo[order.status] || { color: '#8B8B8B', text: 'Estado desconocido' };
    
    const firstItem = order.items && order.items[0] ? order.items[0] : null;

    const imageUrl = firstItem?.image 
        ? `${API_BASE_URL}/${firstItem.image}` 
        : 'https://placehold.co/100x100/EFEFEF/8B8B8B?text=Sin+Imagen';

    return (
        <div className="order-card-container">
            <div className="order-card-image-wrapper">
                <img src={imageUrl} alt={firstItem?.name || 'Producto'} />
            </div>

            <div className="order-card-details">
                <div className="order-status">
                    <span className="status-dot" style={{ backgroundColor: status.color }}></span>
                    <span className="status-text">{order.status}</span>
                </div>
                <p className="status-description">
                    {order.status === 'Entregado' ? `${status.text} ${order.updated_at}` : status.text}
                </p>
                {firstItem ? (
                    <>
                        <p className="order-item-name">{firstItem.name}</p>
                        <p className="order-item-quantity">Cantidad: {firstItem.quantity}</p>
                        {order.items.length > 1 && <p className="order-item-quantity">...y {order.items.length - 1} más</p>}
                    </>
                ) : (
                    <p className="order-item-name">Información del producto no disponible</p>
                )}
            </div>

            <div className="order-card-shipping-info">
                {order.status === 'Pendiente' && (
                    <span className="supplier-name">{firstItem?.marca || 'Varios'}</span>
                )}
                {(order.status === 'Enviado' || order.status === 'Entregado') && (
                    <div className="tracking-info">
                        <span>{order.shipping_company}</span>
                        <a href="#" className="tracking-number">{order.tracking_number}</a>
                    </div>
                )}
            </div>

            <div className="order-card-action">
                <Link to={`/order/${order.id}`} className="view-order-btn">
                    Ver pedido
                </Link>
            </div>
        </div>
    );
};

export default OrderCard;