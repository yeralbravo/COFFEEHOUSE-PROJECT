import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAlerts } from '../hooks/useAlerts'; // Asegúrate de importar tu hook de alertas
import '../style/CartPage.css';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, loading } = useCart();
    const navigate = useNavigate();
    const { showErrorAlert } = useAlerts(); // Y de usarlo
    const API_BASE_URL = 'http://localhost:5000';

    const [selectedBrands, setSelectedBrands] = useState(new Set());

    const groupedItems = cartItems.reduce((acc, item) => {
        const brand = item.marca || 'Otros Productos';
        if (!acc[brand]) {
            acc[brand] = [];
        }
        acc[brand].push(item);
        return acc;
    }, {});

    // ================== 1. LÍNEA AÑADIDA ==================
    // Contamos cuántas marcas (grupos) diferentes hay en el carrito.
    const brandCount = Object.keys(groupedItems).length;

    useEffect(() => {
        // Inicializa la selección marcando todos los checkboxes
        setSelectedBrands(new Set(Object.keys(groupedItems)));
    // ================== 2. LÍNEA MODIFICADA ==================
    // Ahora, este efecto solo se ejecuta si el número de marcas cambia,
    // no cuando solo cambia la cantidad de un producto.
    }, [brandCount]);

    const handleBrandSelection = (brand) => {
        const newSelection = new Set(selectedBrands);
        if (newSelection.has(brand)) {
            newSelection.delete(brand);
        } else {
            newSelection.add(brand);
        }
        setSelectedBrands(newSelection);
    };

    const handleCheckout = () => {
        const itemsForCheckout = cartItems.filter(item => selectedBrands.has(item.marca || 'Otros Productos'));
        
        if (itemsForCheckout.length === 0) {
            showErrorAlert("Por favor, selecciona al menos un producto para continuar.");
            return;
        }
        
        const totalAmount = itemsForCheckout.reduce((total, item) => total + item.quantity * item.precio, 0);
        const itemCount = itemsForCheckout.reduce((total, item) => total + item.quantity, 0);
        
        navigate('/checkout/shipping', {
            state: {
                cartItems: itemsForCheckout,
                cartTotal: totalAmount,
                itemCount: itemCount
            }
        });
    };

    const selectedTotal = cartItems
        .filter(item => selectedBrands.has(item.marca || 'Otros Productos'))
        .reduce((total, item) => total + item.quantity * item.precio, 0);

    const selectedItemCount = cartItems
        .filter(item => selectedBrands.has(item.marca || 'Otros Productos'))
        .reduce((total, item) => total + item.quantity, 0);
        
    if (loading) {
        return <main className="cart-main-content">Cargando carrito...</main>;
    }

    return (
        <main className="cart-main-content">
            <div className="cart-layout">
                <div className="cart-items-section">
                    {cartItems.length === 0 ? (
                        <div className="cart-group"><h2>Tu carrito está vacío.</h2></div>
                    ) : (
                        Object.entries(groupedItems).map(([brand, items]) => (
                            <div key={brand} className="cart-group">
                                <div className="cart-group-header">
                                    <input 
                                        type="checkbox" 
                                        id={`select-group-${brand}`} 
                                        checked={selectedBrands.has(brand)}
                                        onChange={() => handleBrandSelection(brand)}
                                    />
                                    <label htmlFor={`select-group-${brand}`}>Productos de {brand.toUpperCase()}</label>
                                </div>
                                {items.map(item => {
                                    const linkUrl = item.isProduct ? `/product/${item.id}` : `/insumo/${item.id}`;
                                    const imageUrl = item.images && item.images.length > 0
                                        ? `${API_BASE_URL}/${item.images[0]}`
                                        : 'https://placehold.co/100x100/EFEFEF/8B8B8B?text=Sin+Imagen';

                                    return (
                                        <div key={item.cartItemId} className={`cart-item ${!selectedBrands.has(brand) ? 'disabled' : ''}`}>
                                            <img src={imageUrl} alt={item.nombre} className="cart-item-image" />
                                            <div className="cart-item-details">
                                                <p className="item-name">{item.nombre}</p>
                                                <p className="item-desc">
                                                    {item.descripcion ? `${item.descripcion.substring(0, 30)}...` : 'Descripción no disponible.'}
                                                    <Link to={linkUrl}> Ver más</Link>
                                                </p>
                                                <button onClick={() => removeFromCart(item.id, item.isProduct)} className="item-remove-btn">Eliminar</button>
                                            </div>
                                            <div className="cart-item-quantity">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.isProduct)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.isProduct)}>+</button>
                                            </div>
                                            <p className="cart-item-price">${new Intl.NumberFormat('es-CO').format(item.precio * item.quantity)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <aside className="order-summary-section">
                        <div className="summary-card">
                            <h3>Resumen de compra</h3>
                            <div className="summary-row">
                                <span>Productos ({selectedItemCount})</span>
                                <span>${new Intl.NumberFormat('es-CO').format(selectedTotal)}</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>${new Intl.NumberFormat('es-CO').format(selectedTotal)}</span>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Continuar con la compra
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </main>
    );
};

export default CartPage;