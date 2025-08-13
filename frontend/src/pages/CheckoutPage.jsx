import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import '../style/CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const buyNowData = location.state?.fromBuyNow ? location.state : null;
    const cartContext = useCart();

    const cartItems = buyNowData ? buyNowData.cartItems : cartContext.cartItems;
    const cartTotal = buyNowData ? buyNowData.cartTotal : cartContext.cartTotal;
    const itemCount = buyNowData ? buyNowData.itemCount : cartContext.itemCount;
    
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [shippingInfo, setShippingInfo] = useState({
        nombre: '', apellido: '', telefono: '', correo: '', 
        direccion: '', departamento: '', ciudad: '', nota: ''
    });

    const handleShippingChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleContinue = async (e) => {
        e.preventDefault();
        
        const requiredFields = ['nombre', 'apellido', 'telefono', 'correo', 'direccion', 'departamento', 'ciudad'];
        const missingField = requiredFields.find(field => !shippingInfo[field]);
        if (missingField) {
            alert(`Por favor, completa el campo "${missingField}".`);
            return;
        }

        if (paymentMethod === 'online') {
            navigate('/checkout/payment', { 
                state: { shippingInfo, cartItems, cartTotal, itemCount, fromBuyNow: !!buyNowData }
            });
        } else {
            try {
                const orderData = {
                    cartItems,
                    shippingAddress: shippingInfo,
                    paymentMethod: 'contra_entrega',
                    totalAmount: cartTotal
                };
                await createOrder(orderData);
                alert('¡Pedido creado con éxito!');
                if (!buyNowData) {
                    cartContext.clearCart();
                }
                navigate('/mis-pedidos');
            } catch (error) {
                alert(`Error al crear la orden: ${error.message}`);
            }
        }
    };

    return (
        <main className="checkout-main-content">
            <h1 className="page-title">Finalizar Compra</h1>
            <form className="checkout-form-layout" onSubmit={handleContinue}>
                <div className="form-column">
                    <section className="form-section">
                        <h3>Información de envío</h3>
                        <div className="form-grid">
                            <input type="text" name="nombre" placeholder="Nombre *" onChange={handleShippingChange} />
                            <input type="text" name="apellido" placeholder="Apellido *" onChange={handleShippingChange} />
                            <input type="tel" name="telefono" placeholder="Teléfono *" onChange={handleShippingChange} />
                            <input type="email" name="correo" placeholder="Correo electrónico *" onChange={handleShippingChange} />
                            <input type="text" name="direccion" placeholder="Dirección *" className="full-width" onChange={handleShippingChange} />
                            <input type="text" name="departamento" placeholder="Departamento *" onChange={handleShippingChange} />
                            <input type="text" name="ciudad" placeholder="Ciudad *" onChange={handleShippingChange} />
                            <textarea name="nota" placeholder="Nota adicional (opcional)" className="full-width" onChange={handleShippingChange}></textarea>
                        </div>
                    </section>
                </div>

                <div className="summary-column">
                    <section className="form-section">
                        <h3>Tu pedido</h3>
                        <div className="order-summary-box">
                            {cartItems.map(item => (
                                <div className="order-item" key={item.id}>
                                    <span>{item.nombre} x{item.quantity}</span>
                                    <span>${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="order-item total"><span>Valor total</span><span>${new Intl.NumberFormat('es-CO').format(cartTotal)}</span></div>
                        </div>
                    </section>
                    <section className="form-section">
                        <div className="payment-options">
                            <label className="radio-label">
                                <input type="radio" name="payment" value="contra_entrega" onChange={e => setPaymentMethod(e.target.value)} />
                                Contra entrega
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="payment" value="online" defaultChecked onChange={e => setPaymentMethod(e.target.value)} />
                                Pago en línea (Simulado)
                            </label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Continuar</button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>Cancelar</button>
                        </div>
                    </section>
                </div>
            </form>
        </main>
    );
};

export default CheckoutPage;