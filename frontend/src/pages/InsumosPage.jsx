import React, { useState, useEffect } from 'react';
import ProductCard from '../components/client/ProductCard';
import { getPublicInsumos } from '../services/insumoService';
import '../style/CatalogPage.css';

const InsumosPage = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const response = await getPublicInsumos();
                if (response.success) setInsumos(response.data);
            } catch (error) {
                console.error("Error cargando insumos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInsumos();
    }, []);

    return (
        <main className="catalog-main">
            <h1>Insumos y Accesorios</h1>
            <p>Todo lo que necesitas para preparar y disfrutar el café perfecto.</p>
            <div className="catalog-grid">
                {loading ? <p>Cargando...</p> : insumos.map(insumo => (
                    <ProductCard key={`insumo-${insumo.id}`} item={insumo} />
                ))}
            </div>
        </main>
    );
};

export default InsumosPage;