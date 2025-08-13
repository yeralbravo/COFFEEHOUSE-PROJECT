import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../../style/SupplierProductCard.css';

const SupplierProductCard = ({ product, onEdit, onDelete }) => {
    const API_BASE_URL = 'http://localhost:5000';
    const imageUrl = product.images.length > 0 
        ? `${API_BASE_URL}/${product.images[0]}` 
        : 'https://placehold.co/200x200/EFEFEF/8B8B8B?text=Sin+Imagen';

    return (
        <div className="supplier-product-card">
            <div className="card-image-container">
                <img src={imageUrl} alt={product.nombre} className="card-image" />
                <div className={`card-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    Stock: {product.stock}
                </div>
            </div>
            <div className="card-info">
                <h3 className="card-title">{product.nombre}</h3>
                <p className="card-brand">{product.marca}</p>
                <p className="card-price">${new Intl.NumberFormat('es-CO').format(product.precio)}</p>
            </div>
            <div className="card-actions">
                <button onClick={() => onEdit(product)} className="action-btn edit-btn">
                    <FiEdit /> Editar
                </button>
                <button onClick={() => onDelete(product.id)} className="action-btn delete-btn">
                    <FiTrash2 /> Eliminar
                </button>
            </div>
        </div>
    );
};

export default SupplierProductCard;