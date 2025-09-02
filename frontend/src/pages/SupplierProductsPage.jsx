import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import * as productService from '../services/productService';
import { useAlerts } from '../hooks/useAlerts';
import '../style/SupplierProductsPage.css';

const SupplierProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const navigate = useNavigate();
    
    // --- ESTADOS PARA LA BÚSQUEDA ---
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Efecto para debounce (retrasar la búsqueda para no saturar la API)
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // Espera 300ms después de que el usuario deja de escribir

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // --- FUNCIÓN DE BÚSQUEDA ACTUALIZADA ---
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            // Pasamos el término de búsqueda al servicio
            const response = await productService.getSupplierProducts(debouncedSearchTerm);
            setProducts(response.data);
        } catch (error) {
            showErrorAlert(error.message || 'Error al obtener los productos.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, showErrorAlert]); // Se activa cuando el término de búsqueda cambia

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = (productId) => {
        showConfirmDialog({ title: '¿Estás seguro?', text: 'Este producto se eliminará permanentemente.' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await productService.deleteProduct(productId);
                        showSuccessAlert('Producto eliminado con éxito.');
                        fetchProducts();
                    } catch (error) {
                        showErrorAlert(error.message);
                    }
                }
            });
    };

    return (
        <div className="supplier-products-page">
            <header className="page-header">
                <h1 className="page-title">Mis Cafés</h1>
                <button className="btn-add-product" onClick={() => navigate('/supplier/item/create?type=product')}>
                    <FiPlus /> Añadir Café
                </button>
            </header>

            {/* --- BARRA DE BÚSQUEDA AÑADIDA --- */}
            <div className="search-bar-container">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por nombre de café..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="product-list-container">
                {loading ? <p>Cargando...</p> : (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map(product => (
                                <tr key={product.id}>
                                    <td><img src={product.images.length > 0 ? `http://localhost:5000/${product.images[0]}` : 'https://placehold.co/60x60'} alt={product.nombre} className="product-image-thumbnail" /></td>
                                    <td>{product.nombre}</td>
                                    <td>${new Intl.NumberFormat('es-CO').format(product.precio)}</td>
                                    <td>
                                        <span className={`stock-badge ${product.stock > 10 ? 'stock-high' : product.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => navigate(`/supplier/item/edit/product/${product.id}`)} className="action-btn edit-btn" title="Editar"><FiEdit /></button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="action-btn delete-btn" title="Eliminar"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="no-results-cell">No se encontraron cafés con ese nombre.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SupplierProductsPage;