import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsumoById } from '../services/insumoService';
import { useCart } from '../context/CartContext';
import { useAlerts } from '../hooks/useAlerts';
import ImageGallery from '../components/client/ImageGallery';
import ProductSpecs from '../components/client/ProductSpecs';
import ProductReviews from '../components/client/ProductReviews';
import { FaStar } from 'react-icons/fa';
import '../style/ProductDetailPage.css';

const InsumoDetailPage = () => {
    const { insumoId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showSuccessAlert } = useAlerts();
    const [insumo, setInsumo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInsumo = async () => {
            try {
                setLoading(true);
                const response = await getInsumoById(insumoId);
                if (response.success) {
                    setInsumo(response.data);
                } else {
                    setError('Insumo no encontrado.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadInsumo();
    }, [insumoId]);

    const handleBuyNow = () => {
        if (!insumo) return;
        
        const singleItemCart = {
            cartItems: [{ ...insumo, quantity: 1 }],
            cartTotal: insumo.precio,
            itemCount: 1
        };

        navigate('/checkout/shipping', { state: { fromBuyNow: true, ...singleItemCart } });
    };

    const handleAddToCart = () => {
        const wasAdded = addToCart(insumo);
        if (wasAdded) {
            showSuccessAlert(`${insumo.nombre} ha sido añadido al carrito.`);
        }
    };

    if (loading) return <div className="page-message">Cargando insumo...</div>;
    if (error) return <div className="page-message error">Error: {error}</div>;
    if (!insumo) return <div className="page-message">Insumo no encontrado.</div>;

    return (
        <main className="detail-main-content">
            <div className="product-layout-grid">
                <div className="image-gallery-container">
                    <ImageGallery images={insumo.images} />
                </div>

                <div className="basic-info-container">
                    <h3>Información básica</h3>
                    <div className="section-content">
                        <div>
                            <div className="info-line">
                                <h2>{insumo.nombre}</h2>
                                <p className="price">${new Intl.NumberFormat('es-CO').format(insumo.precio)}</p>
                            </div>
                            {insumo.marca && <p className="meta-info">Marca: {insumo.marca}</p>}
                            <p className="meta-info">Stock: {insumo.stock}</p>
                            
                            {insumo.review_count > 0 ? (
                                <div className="rating-line">
                                    <span>{parseFloat(insumo.avg_rating).toFixed(1)}</span>
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <FaStar
                                                key={index}
                                                color={ratingValue <= Math.round(insumo.avg_rating) ? "#ffc107" : "#e4e5e9"}
                                            />
                                        );
                                    })}
                                    <span className="rating-count">({insumo.review_count})</span>
                                </div>
                            ) : (
                                <p className="meta-info">Aún no hay calificaciones.</p>
                            )}
                        </div>

                        <div className="product-actions-group">
                            <button onClick={handleBuyNow} className="buy-now-btn">Comprar ahora</button>
                            <button onClick={handleAddToCart} className="add-to-cart-btn">Añadir al carrito</button>
                        </div>
                    </div>
                </div>

                <div className="description-container">
                     <h3>Descripción</h3>
                     <div className="section-content">
                        <p>{insumo.descripcion}</p>
                     </div>
                </div>

                {insumo.caracteristicas && Object.keys(insumo.caracteristicas).length > 0 && (
                    <div className="specs-container">
                        <h3>Características</h3>
                        <div className="section-content">
                            <ProductSpecs specs={insumo.caracteristicas} />
                        </div>
                    </div>
                )}

                <div className="reviews-container-section">
                    <ProductReviews type="insumo" itemId={insumo.id} />
                </div>
            </div>
        </main>
    );
};

export default InsumoDetailPage;