import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/client/HeroSlider';
import ProductCarousel from '../components/client/ProductCarousel';
import { getHomePageData } from '../services/catalogService';
import '../style/ClientHome.css';

const ClientHome = () => {
    const [popularItems, setPopularItems] = useState([]);
    const [interestItems, setInterestItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHomePageData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await getHomePageData();

                if (response.success) {
                    const { popularItems, recentItems } = response.data;
                    setPopularItems(popularItems);
                    
                    // ================== AQUÍ ESTÁ LA CORRECCIÓN ==================
                    // Cambiamos 'item_type' por 'itemType' para que coincida con la nueva respuesta de la API.
                    const popularIds = new Set(popularItems.map(p => `${p.itemType}-${p.id}`));
                    const filteredRecent = recentItems.filter(item => !popularIds.has(`${item.itemType}-${item.id}`));
                    
                    setInterestItems(filteredRecent.slice(0, 12));
                } else {
                    setError('No se pudieron cargar los productos.');
                }
            } catch (err) {
                console.error("Error al cargar los datos de la página de inicio:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadHomePageData();
    }, []);

    const renderContent = () => {
        if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando tienda...</p>;
        if (error) return <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</p>;
        if (popularItems.length === 0 && interestItems.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>No hay productos disponibles.</p>;
        
        return (
            <>
                {popularItems.length > 0 && <ProductCarousel title="Productos Populares" products={popularItems} />}
                {interestItems.length > 0 && <ProductCarousel title="También te puede interesar" products={interestItems} />}
            </>
        );
    };

    return (
        <main>
            <HeroSlider />
            <div className="home-content-wrapper">
                {renderContent()}
            </div>
        </main>
    );
};

export default ClientHome;