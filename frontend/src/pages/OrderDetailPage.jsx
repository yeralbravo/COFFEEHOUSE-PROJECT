import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/orderService';
import { useAlerts } from '../hooks/useAlerts';
import ReviewModal from '../components/client/ReviewModal';
import { FiArrowLeft, FiTruck, FiMail, FiPhone } from 'react-icons/fi';
import '../style/OrderDetailPage.css';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemToReview, setItemToReview] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const API_BASE_URL = 'http://localhost:5000';

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleReviewSubmitted = () => {
        setItemToReview(null);
        fetchOrder();
    };

    const handleCancelOrder = () => {
        showConfirmDialog({
            title: '¿Estás seguro?',
            text: 'Esta acción cancelará tu pedido y devolverá los productos al stock. No se puede deshacer.'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await cancelOrder(orderId);
                    showSuccessAlert(response.message);
                    fetchOrder();
                } catch (error) {
                    showErrorAlert(error.message);
                }
            }
        });
    };

    if (loading) return <div className="page-loading">Cargando detalle del pedido...</div>;
    if (!order) return <div className="page-loading">Pedido no encontrado.</div>;

    const { shipping_address: address } = order;

    return (
        <>
            <main className="order-detail-main">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FiArrowLeft /> Detalle del pedido
                </button>
                
                <div className="order-detail-layout">
                    <div className="order-products-column">
                        <h2>Productos</h2>
                        <div className="order-date-header">
                            <span>{order.date}</span>
                            {order.shipping_company && (
                                <span>{order.shipping_company}: <a href="#">{order.tracking_number}</a></span>
                            )}
                        </div>
                        
                        <div className="product-list">
                            {order.items.map(item => (
                                <div key={item.id} className="product-card-detail">
                                    <img src={`${API_BASE_URL}/${item.image}`} alt={item.name} className="product-image-detail" />
                                    <div className="product-info-detail">
                                        <span className={`status-tag status-${order.status.toLowerCase()}`}>{order.status}</span>
                                        {order.status === 'Entregado' && <p className="delivery-date">Llegó el {order.updated_at}</p>}
                                        <p className="product-name-detail">{item.name}</p>
                                        <p className="product-brand-detail">{item.brand}</p>
                                        <p className="product-quantity-detail">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="product-actions-detail">
                                        <p className="product-price-detail">${new Intl.NumberFormat('es-CO').format(item.price * item.quantity)}</p>
                                        {order.status === 'Entregado' && (
                                            item.is_reviewed ? (
                                                <span className="review-submitted">Calificado</span>
                                            ) : (
                                                <button 
                                                    className="btn-review"
                                                    onClick={() => setItemToReview(item)}
                                                >
                                                    Calificar producto
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-summary-column">
                        <div className="summary-card">
                            <h3>Detalle de la compra</h3>
                            <div className="summary-line"><span>Productos ({order.items.length})</span><span>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</span></div>
                            <div className="order-item">
                                <span>Envío</span>
                                <span className='gratis-detalle'>Gratis</span>
                            </div>
                            <div className="summary-line total">
                                <span>Total</span>
                                {/* El total ahora es solo el total de los productos */}
                                <span>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</span>
                            </div>
                            
                            {order.status === 'Pendiente' && (
                                <button onClick={handleCancelOrder} className="btn-cancel-order">
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>

                        <div className="info-card">
                            <h3>Envío</h3>
                            <div className="info-card-content">
                                <FiTruck size={24} className="info-icon" />
                                <div>
                                    <p>{address.direccion}</p>
                                    <p>{address.ciudad}, {address.departamento}</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Correo electrónico</h3>
                             <div className="info-card-content">
                                <FiMail size={24} className="info-icon" />
                                <p>{address.correo}</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <h3>Número de teléfono</h3>
                             <div className="info-card-content">
                                <FiPhone size={24} className="info-icon" />
                                <p>{address.telefono}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {itemToReview && (
                <ReviewModal
                    item={itemToReview}
                    orderId={order.id}
                    onClose={() => setItemToReview(null)}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </>
    );
};

export default OrderDetailPage;
