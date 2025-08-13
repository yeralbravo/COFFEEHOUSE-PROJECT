import React, { useState, useEffect } from 'react';
import ProductCard from '../components/client/ProductCard';
import { getPublicProducts } from '../services/productService';
import '../style/CatalogPage.css';

const CafePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await getPublicProducts();
                if (response.success) setProducts(response.data);
            } catch (error) {
                console.error("Error cargando cafés:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    return (
        <main className="catalog-main">
            <h1>Nuestros Cafés</h1>
            <p>Descubre granos seleccionados de las mejores fincas.</p>
            <div className="catalog-grid">
                {loading ? <p>Cargando...</p> : products.map(product => (
                    <ProductCard key={`product-${product.id}`} item={product} />
                ))}
            </div>
        </main>
    );
};

export default CafePage;