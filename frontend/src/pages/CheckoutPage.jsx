import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAlerts } from '../hooks/useAlerts';
import { createOrder } from '../services/orderService';
import { createPaymentOrder } from '../services/paymentService';
import '../style/CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showErrorAlert, showSuccessAlert } = useAlerts();
    const cartContext = useCart();

    // ================== AQUÍ ESTÁ LA CORRECCIÓN ==================
    // 1. Verificamos si la página anterior nos envió datos específicos (los items seleccionados).
    const passedState = location.state;

    // 2. Usamos los datos pasados si existen; de lo contrario, usamos los datos del carrito completo.
    // Esto asegura que si venimos del carrito con una selección, se respete.
    const cartItems = passedState?.cartItems || cartContext.cartItems;
    const cartTotal = passedState?.cartTotal || cartContext.cartTotal;
    
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        nombre: '', apellido: '', telefono: '', correo: '', 
        direccion: '', departamento: '', ciudad: '', nota: ''
    });

    const handleShippingChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleContinue = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        const requiredFields = ['nombre', 'apellido', 'telefono', 'correo', 'direccion', 'departamento', 'ciudad'];
        const missingField = requiredFields.find(field => !shippingInfo[field]);
        if (missingField) {
            showErrorAlert(`Por favor, completa el campo "${missingField}".`);
            setIsProcessing(false);
            return;
        }

        const orderPayload = {
            cartItems,
            shippingAddress: shippingInfo,
            paymentMethod: paymentMethod === 'online' ? 'mercado_pago' : 'contra_entrega',
            totalAmount: cartTotal
        };

        try {
            const newOrderResponse = await createOrder(orderPayload);
            const newOrderId = newOrderResponse.data.id;

            if (paymentMethod === 'online') {
                const paymentResponse = await createPaymentOrder({ cartItems, orderId: newOrderId });
                if (paymentResponse.success && paymentResponse.payment_url) {
                    // 3. Limpiamos solo los items que se compraron.
                    // Para simplificar, si se compró desde el carrito, lo vaciamos.
                    if (passedState) {
                        cartContext.clearCart();
                    }
                    window.open(paymentResponse.payment_url, '_blank');
                    navigate('/mis-pedidos'); 
                } else {
                    throw new Error('No se pudo generar el link de pago.');
                }
            } else {
                showSuccessAlert('¡Pedido creado con éxito!');
                if (passedState) {
                    cartContext.clearCart();
                }
                navigate('/mis-pedidos');
            }
        } catch (error) {
            showErrorAlert(`Error al procesar la orden: ${error.message}`);
            setIsProcessing(false);
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
                                Pago en línea con Mercado Pago
                            </label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={isProcessing}>
                                {isProcessing ? 'Procesando...' : 'Continuar'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>Cancelar</button>
                        </div>
                    </section>
                </div>
            </form>
        </main>
    );
};

export default CheckoutPage;