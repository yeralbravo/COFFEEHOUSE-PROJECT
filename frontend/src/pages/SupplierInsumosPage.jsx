import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';
import * as insumoService from '../services/insumoService';
import '../style/SupplierProductsPage.css';

const SupplierInsumosPage = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const fetchInsumos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await insumoService.getSupplierInsumos(debouncedSearchTerm);
            setInsumos(response.data);
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, showErrorAlert]);

    useEffect(() => {
        fetchInsumos();
    }, [fetchInsumos]);

    const handleDelete = (insumoId) => {
        showConfirmDialog({ title: '¿Estás seguro?', text: 'Este insumo se eliminará permanentemente.' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await insumoService.deleteInsumo(insumoId);
                        showSuccessAlert('Insumo eliminado con éxito.');
                        fetchInsumos();
                    } catch (error) {
                        showErrorAlert(error.message);
                    }
                }
            });
    };

    return (
        <div className="supplier-products-page">
            <header className="page-header">
                <h1 className="page-title">Mis Insumos</h1>
                <button className="btn-add-product" onClick={() => navigate('/supplier/item/create?type=insumo')}>
                    <FiPlus /> Añadir Insumo
                </button>
            </header>

            <div className="search-bar-container">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por nombre de insumo..."
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
                            {insumos.length > 0 ? insumos.map(insumo => (
                                <tr key={insumo.id}>
                                    <td data-label="Imagen"><img src={insumo.images.length > 0 ? `http://localhost:5000/${insumo.images[0]}` : 'https://placehold.co/60x60'} alt={insumo.nombre} className="product-image-thumbnail" /></td>
                                    <td data-label="Nombre">{insumo.nombre}</td>
                                    <td data-label="Precio">${new Intl.NumberFormat('es-CO').format(insumo.precio)}</td>
                                    <td data-label="Stock">
                                        <span className={`stock-badge ${insumo.stock > 10 ? 'stock-high' : insumo.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                                            {insumo.stock}
                                        </span>
                                    </td>
                                    <td data-label="Acciones">
                                        <div className="action-buttons">
                                            <button onClick={() => navigate(`/supplier/item/edit/insumo/${insumo.id}`)} className="action-btn edit-btn" title="Editar"><FiEdit /></button>
                                            <button onClick={() => handleDelete(insumo.id)} className="action-btn delete-btn" title="Eliminar"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="no-results-cell">No se encontraron insumos con ese nombre.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SupplierInsumosPage;