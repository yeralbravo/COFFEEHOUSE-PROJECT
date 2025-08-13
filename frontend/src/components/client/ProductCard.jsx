import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAlerts } from '../../hooks/useAlerts';
import '../../style/ProductCard.css';

const ProductCard = ({ item }) => {
    if (!item) {
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { addToCart } = useCart();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { showSuccessAlert } = useAlerts();
    const API_BASE_URL = 'http://localhost:5000';
    
    const isCoffee = !!item.tipo;
    const linkUrl = isCoffee ? `/product/${item.id}` : `/insumo/${item.id}`;
    
    const imageUrl = item.images && item.images.length > 0
        ? `${API_BASE_URL}/${item.images[0]}`
        : 'https://placehold.co/250x250/EFEFEF/8B8B8B?text=Sin+Imagen';

    const handleAddToCart = (e) => {
        e.preventDefault();
        const wasAdded = addToCart(item); // Capturamos la respuesta (true o false)
        if (wasAdded) {
            // Solo mostramos la alerta de éxito si el producto se añadió
            showSuccessAlert(`${item.nombre} ha sido añadido al carrito!`);
        }
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
                    <button className="btn btn-buy">Comprar</button>
                    <button onClick={handleAddToCart} className="btn btn-add-cart">Añadir al carrito</button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;