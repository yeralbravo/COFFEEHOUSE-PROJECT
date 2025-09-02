import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import { useCart } from '../../context/CartContext';
import { useAlerts } from '../../hooks/useAlerts';
import '../../style/ProductCard.css';

const ProductCard = ({ item }) => {
    const { addToCart } = useCart();
    const { showSuccessAlert } = useAlerts();
    const navigate = useNavigate(); // 2. Hook para la navegación
    const API_BASE_URL = 'http://localhost:5000';
    
    if (!item) {
        return null;
    }

    const isCoffee = item.hasOwnProperty('tipo');
    const linkUrl = isCoffee ? `/product/${item.id}` : `/insumo/${item.id}`;
    
    const imageUrl = item.images && item.images.length > 0
        ? `${API_BASE_URL}/${item.images[0]}`
        : 'https://placehold.co/250x250/EFEFEF/8B8B8B?text=Sin+Imagen';

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que el Link se active al hacer clic
        const wasAdded = await addToCart(item); 
        if (wasAdded) {
            showSuccessAlert(`${item.nombre} ha sido añadido al carrito!`);
        }
    };

    // 3. Nueva función para el botón "Comprar"
    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que el Link se active

        // Preparamos un objeto con solo este producto para enviarlo a la página de checkout
        const itemForCheckout = {
            cartItems: [{ ...item, quantity: 1 }], // Lo ponemos en un array como espera la pág. de checkout
            cartTotal: item.precio,
            itemCount: 1,
            fromBuyNow: true // Una bandera para indicar que es una compra directa
        };

        // Navegamos a la página de envío, pasándole los datos del producto
        navigate('/checkout/shipping', { state: itemForCheckout });
    };

    return (
        <Link to={linkUrl} className="product-card-link-wrapper">
            <div className="product-card-client">
                <div className="product-card-image-wrapper">
                    <img src={imageUrl} alt={item.nombre} className="product-card-image" />
                </div>
                <div className="product-card-info">
                    <h3 className="product-card-name">{item.nombre}</h3>
                    <p className="product-card-type">{isCoffee ? item.tipo : item.categoria}</p>
                    <p className="product-card-price">${new Intl.NumberFormat('es-CO').format(item.precio)}</p>
                </div>
                <div className="product-card-actions">
                    {/* 4. Asignamos la nueva función al botón */}
                    <button onClick={handleBuyNow} className="btn btn-buy">Comprar</button>
                    <button onClick={handleAddToCart} className="btn btn-add-cart">Añadir al carrito</button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
