import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/client/ProductCard';
import { searchProducts } from '../services/searchService';
import '../style/CatalogPage.css'; // Reutilizamos estilos

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                try {
                    setLoading(true);
                    const response = await searchProducts(query);
                    if (response.success) {
                        setResults(response.data);
                    }
                } catch (error) {
                    console.error("Error en la búsqueda:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [query]);

    return (
        <main className="catalog-main">
            <h1>Resultados para "{query}"</h1>
            {loading ? <p>Buscando...</p> : (
                results.length > 0 ? (
                    <div className="catalog-grid">
                        {results.map(item => (
                            <ProductCard key={`${item.item_type}-${item.id}`} item={item} />
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron resultados para tu búsqueda.</p>
                )
            )}
        </main>
    );
};

export default SearchResultsPage;