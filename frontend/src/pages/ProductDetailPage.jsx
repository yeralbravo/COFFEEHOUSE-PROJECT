import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService'; 
import { useCart } from '../context/CartContext';
import { useAlerts } from '../hooks/useAlerts';
import ImageGallery from '../components/client/ImageGallery';
import ProductSpecs from '../components/client/ProductSpecs';
import ProductReviews from '../components/client/ProductReviews';
import { FaStar } from 'react-icons/fa';
import '../style/ProductDetailPage.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showSuccessAlert } = useAlerts();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductById(productId);
                if (response.success) {
                    setProduct(response.data);
                } else {
                    setError('Producto no encontrado.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const handleBuyNow = () => {
        if (!product) return;
        
        const singleItemCart = {
            cartItems: [{ ...product, quantity: 1 }],
            cartTotal: product.precio,
            itemCount: 1
        };

        navigate('/checkout/shipping', { state: { fromBuyNow: true, ...singleItemCart } });
    };

    const handleAddToCart = () => {
        const wasAdded = addToCart(product);
        if (wasAdded) {
            showSuccessAlert(`${product.nombre} ha sido añadido al carrito.`);
        }
    };

    if (loading) return <div className="page-message">Cargando producto...</div>;
    if (error) return <div className="page-message error">Error: {error}</div>;
    if (!product) return <div className="page-message">Producto no encontrado.</div>;

    return (
        <main className="detail-main-content">
            <div className="product-layout-grid">
                <div className="image-gallery-container">
                    <ImageGallery images={product.images} />
                </div>

                <div className="basic-info-container">
                    <h3>Información básica</h3>
                    <div className="section-content">
                        <div>
                            <div className="info-line">
                                <h2>{product.nombre}</h2>
                                <p className="price">${new Intl.NumberFormat('es-CO').format(product.precio)}</p>
                            </div>
                            {product.peso_neto && <p className="meta-info">Gramos: {product.peso_neto} g</p>}
                            <p className="meta-info">Stock: {product.stock}</p>
                            
                            {product.review_count > 0 ? (
                                <div className="rating-line">
                                    <span>{parseFloat(product.avg_rating).toFixed(1)}</span>
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <FaStar
                                                key={index}
                                                color={ratingValue <= Math.round(product.avg_rating) ? "#ffc107" : "#e4e5e9"}
                                            />
                                        );
                                    })}
                                    <span className="rating-count">({product.review_count})</span>
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
                        <p>{product.descripcion}</p>
                    </div>
                </div>

                {product.caracteristicas && Object.keys(product.caracteristicas).length > 0 && (
                    <div className="specs-container">
                        <h3>Características</h3>
                        <div className="section-content">
                            <ProductSpecs specs={product.caracteristicas} />
                        </div>
                    </div>
                )}

                <div className="reviews-container-section">
                    <ProductReviews type="product" itemId={product.id} />
                </div>
            </div>
        </main>
    );
};

export default ProductDetailPage;
