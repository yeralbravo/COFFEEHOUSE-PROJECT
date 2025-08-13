import React from 'react';
import ProductCard from './ProductCard';
import '../../style/ProductCarousel.css';

const ProductCarousel = ({ title, products }) => {
    return (
        <section className="carousel-section">
            <div className="carousel-header">
                <h2 className="carousel-title">{title}</h2>
            </div>
            <div className="carousel-container">
                {products && products.map(item => {
                    // --- CORRECCIÓN AQUÍ ---
                    // Usamos 'item_type' para garantizar una llave única, ya que 'tipo' puede existir en ambos.
                    const uniqueKey = `${item.item_type}-${item.id}`;
                    return <ProductCard key={uniqueKey} item={item} />;
                })}
            </div>
        </section>
    );
};

export default ProductCarousel;