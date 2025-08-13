import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import '../style/PaymentPage.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    const { shippingInfo, cartItems, cartTotal, itemCount, fromBuyNow } = location.state || {};

    const handlePayment = async (e) => {
        e.preventDefault();
        
        try {
            const orderData = {
                cartItems,
                shippingAddress: shippingInfo,
                paymentMethod: 'online',
                totalAmount: cartTotal
            };
            
            await createOrder(orderData);
            alert('¡Pago simulado exitoso! Tu pedido ha sido creado.');
            
            if (!fromBuyNow) {
                clearCart();
            }

            navigate('/mis-pedidos');

        } catch (error) {
            alert(`Error al crear la orden: ${error.message}`);
        }
    };

    if (!shippingInfo || !cartItems) {
        return <div>Error: Faltan datos para procesar el pago. <a href="/cart">Volver al carrito</a>.</div>;
    }

    return (
        <main className="payment-main-content">
            <form className="payment-layout" onSubmit={handlePayment}>
                <div className="payment-form-column">
                    <h3>Método de pago</h3>
                    <div className="payment-method-box">
                        <div className="method-option active">Pago con tarjeta (Simulado)</div>
                    </div>
                    <div className="card-form">
                        <div className="form-group"><label>Número de la tarjeta</label><input type="text" /></div>
                        <div className="form-row">
                            <div className="form-group"><label>Fecha de vencimiento</label><input type="text" placeholder="MM/AA" /></div>
                            <div className="form-group"><label>CVC</label><input type="text" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Nombre en la tarjeta</label><input type="text" /></div>
                            <div className="form-group"><label>CC</label><input type="text" /></div>
                        </div>
                    </div>
                </div>
                <div className="summary-column">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>
                        {cartItems.map(item => {
                            const uniqueKey = item.tipo ? `product-${item.id}` : `insumo-${item.id}`;
                            return (
                                <div key={uniqueKey} className="summary-item">
                                    <span>{item.nombre} x{item.quantity}</span>
                                    <span>${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</span>
                                </div>
                            );
                        })}
                        <div className="summary-total">
                            <span>Total ({itemCount} productos)</span>
                            <span>${new Intl.NumberFormat('es-CO').format(cartTotal)}</span>
                        </div>
                        <button type="submit" className="pay-btn">Paga ${new Intl.NumberFormat('es-CO').format(cartTotal)}</button>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default PaymentPage;