import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useAlerts } from '../hooks/useAlerts';
import { createOrder } from '../services/orderService';
import { createPaymentOrder } from '../services/paymentService';
import { getMyAddresses } from '../services/addressService';
import '../style/CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showErrorAlert, showSuccessAlert } = useAlerts();
    const cartContext = useCart();
    const { user } = useContext(AuthContext);

    const passedState = location.state;
    const cartItems = passedState?.cartItems || cartContext.cartItems;
    const cartTotal = passedState?.cartTotal || cartContext.cartTotal;
    
    const { removePurchasedItems } = cartContext;
    
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [shippingInfo, setShippingInfo] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        telefono: user?.telefono || '',
        correo: user?.correo || '', 
        direccion: '',
        departamento: '',
        ciudad: '',
        nota: ''
    });
    
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [shippingErrors, setShippingErrors] = useState({});

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await getMyAddresses();
                if (response.success) {
                    setSavedAddresses(response.data);
                }
            } catch (error) {
                console.error("No se pudieron cargar las direcciones guardadas.");
            }
        };
        fetchAddresses();
    }, []);

    const handleAddressSelect = (e) => {
        const addressId = e.target.value;
        setSelectedAddressId(addressId);
        setShippingErrors({});

        if (addressId) {
            const selectedAddr = savedAddresses.find(addr => addr.id === parseInt(addressId));
            if (selectedAddr) {
                setShippingInfo({
                    ...shippingInfo,
                    nombre: selectedAddr.nombre,
                    apellido: selectedAddr.apellido,
                    telefono: selectedAddr.telefono,
                    correo: selectedAddr.correo,
                    direccion: selectedAddr.direccion,
                    departamento: selectedAddr.departamento,
                    ciudad: selectedAddr.ciudad,
                    nota: selectedAddr.nota || '',
                });
            }
        } else {
            setShippingInfo({
                nombre: user?.nombre || '', apellido: user?.apellido || '', telefono: user?.telefono || '', correo: user?.correo || '',
                direccion: '', departamento: '', ciudad: '', nota: ''
            });
        }
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
        setSelectedAddressId('');
        if (shippingErrors[name]) {
            setShippingErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateShippingForm = () => {
        const errors = {};
        if (!shippingInfo.nombre?.trim()) errors.nombre = 'El nombre es obligatorio.';
        if (!shippingInfo.apellido?.trim()) errors.apellido = 'El apellido es obligatorio.';
        if (!shippingInfo.telefono?.trim()) {
            errors.telefono = 'El teléfono es obligatorio.';
        } else if (shippingInfo.telefono.length < 10) {
            errors.telefono = 'El teléfono debe tener al menos 10 dígitos.';
        }
        if (!shippingInfo.correo?.trim()) {
            errors.correo = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(shippingInfo.correo)) {
            errors.correo = 'El formato del correo no es válido.';
        }
        if (!shippingInfo.direccion?.trim()) errors.direccion = 'La dirección es obligatoria.';
        if (!shippingInfo.departamento?.trim()) errors.departamento = 'El departamento es obligatorio.';
        if (!shippingInfo.ciudad?.trim()) errors.ciudad = 'La ciudad es obligatoria.';

        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinue = async (e) => {
        e.preventDefault();
        
        if (!validateShippingForm()) {
            return;
        }

        setIsProcessing(true);

        const orderPayload = {
            cartItems,
            shippingAddress: shippingInfo,
            paymentMethod: paymentMethod === 'online' ? 'mercado_pago' : 'contra_entrega',
            totalAmount: cartTotal
        };

        try {
            const newOrderResponse = await createOrder(orderPayload);

            if (paymentMethod === 'online') {
                const paymentResponse = await createPaymentOrder({ cartItems, orderId: newOrderResponse.data.orderId });
                if (paymentResponse.success && paymentResponse.payment_url) {
                    await removePurchasedItems(cartItems);
                    window.open(paymentResponse.payment_url, '_blank');
                } else {
                    throw new Error('No se pudo generar el link de pago.');
                }
            } else {
                showSuccessAlert('¡Pedido creado con éxito!');
                await removePurchasedItems(cartItems);
                navigate('/mis-pedidos');
            }
        } catch (error) {
            showErrorAlert(`Error al procesar la orden: ${error.message}`);
        } finally {
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
                        <div className="address-prompt">
                            <p>Puedes administrar tus direcciones o añadir una nueva en <Link to="/profile">tu perfil</Link>.</p>
                        </div>
                        {savedAddresses.length > 0 && (
                            <div className="form-group saved-addresses">
                                <label htmlFor="saved-address-select">O usa una dirección guardada:</label>
                                <select id="saved-address-select" value={selectedAddressId} onChange={handleAddressSelect}>
                                    <option value="">-- Elige una dirección --</option>
                                    {savedAddresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.direccion}, {addr.ciudad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="form-grid">
                            <div className="form-group">
                                <input type="text" name="nombre" value={shippingInfo.nombre} placeholder="Nombre *" onChange={handleShippingChange} className={shippingErrors.nombre ? 'input-error' : ''} />
                                {shippingErrors.nombre && <p className="error-text">{shippingErrors.nombre}</p>}
                            </div>
                            <div className="form-group">
                                <input type="text" name="apellido" value={shippingInfo.apellido} placeholder="Apellido *" onChange={handleShippingChange} className={shippingErrors.apellido ? 'input-error' : ''} />
                                {shippingErrors.apellido && <p className="error-text">{shippingErrors.apellido}</p>}
                            </div>
                            <div className="form-group">
                                <input type="tel" name="telefono" value={shippingInfo.telefono} placeholder="Teléfono *" onChange={handleShippingChange} className={shippingErrors.telefono ? 'input-error' : ''} />
                                {shippingErrors.telefono && <p className="error-text">{shippingErrors.telefono}</p>}
                            </div>
                            <div className="form-group">
                                <input type="email" name="correo" value={shippingInfo.correo} placeholder="Correo electrónico *" onChange={handleShippingChange} className={shippingErrors.correo ? 'input-error' : ''} />
                                {shippingErrors.correo && <p className="error-text">{shippingErrors.correo}</p>}
                            </div>
                            <div className="form-group full-width">
                                <input type="text" name="direccion" value={shippingInfo.direccion} placeholder="Dirección *" onChange={handleShippingChange} className={shippingErrors.direccion ? 'input-error' : ''} />
                                {shippingErrors.direccion && <p className="error-text">{shippingErrors.direccion}</p>}
                            </div>
                            <div className="form-group">
                                <input type="text" name="departamento" value={shippingInfo.departamento} placeholder="Departamento *" onChange={handleShippingChange} className={shippingErrors.departamento ? 'input-error' : ''} />
                                {shippingErrors.departamento && <p className="error-text">{shippingErrors.departamento}</p>}
                            </div>
                            <div className="form-group">
                                <input type="text" name="ciudad" value={shippingInfo.ciudad} placeholder="Ciudad *" onChange={handleShippingChange} className={shippingErrors.ciudad ? 'input-error' : ''} />
                                {shippingErrors.ciudad && <p className="error-text">{shippingErrors.ciudad}</p>}
                            </div>
                            <div className="form-group full-width">
                                <textarea name="nota" value={shippingInfo.nota} placeholder="Nota adicional para la entrega (opcional)" onChange={handleShippingChange}></textarea>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="summary-column">
                    <section className="form-section">
                        <h3>Tu pedido</h3>
                        <div className="order-summary-box">
                            {cartItems.map(item => (
                                <div className="order-item" key={item.cartItemId}>
                                    <span>{item.nombre} x{item.quantity}</span>
                                    <span>${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</span>
                                </div>
                            ))}
                            {/* --- LÍNEAS AÑADIDAS --- */}
                            <div className="order-item">
                                <span>Envío</span>
                                <span className='gratis'>Gratis</span>
                            </div>
                            <div className="order-item total">
                                <span>Valor total</span>
                                <span>${new Intl.NumberFormat('es-CO').format(cartTotal)}</span>
                            </div>
                        </div>
                    </section>
                    <section className="form-section">
                        <h3>Método de pago</h3>
                        <div className="payment-options">
                            <label className="radio-label">
                                <input type="radio" name="payment" value="contra_entrega" checked={paymentMethod === 'contra_entrega'} onChange={e => setPaymentMethod(e.target.value)} />
                                Contra entrega
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={e => setPaymentMethod(e.target.value)} />
                                Pago en línea con Mercado Pago
                            </label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={isProcessing}>
                                {isProcessing ? 'Procesando...' : 'Finalizar Pedido'}
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