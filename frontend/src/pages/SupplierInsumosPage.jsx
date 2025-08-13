import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';
import * as insumoService from '../services/insumoService';
import '../style/SupplierProductsPage.css';

const SupplierInsumosPage = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const navigate = useNavigate();

    const fetchInsumos = async () => {
        try {
            setLoading(true);
            const response = await insumoService.getSupplierInsumos();
            setInsumos(response.data);
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

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
                            {insumos.map(insumo => (
                                <tr key={insumo.id}>
                                    <td><img src={insumo.images.length > 0 ? `http://localhost:5000/${insumo.images[0]}` : 'https://placehold.co/60x60'} alt={insumo.nombre} className="product-image-thumbnail" /></td>
                                    <td>{insumo.nombre}</td>
                                    <td>${new Intl.NumberFormat('es-CO').format(insumo.precio)}</td>
                                    <td>
                                        <span className={`stock-badge ${insumo.stock > 10 ? 'stock-high' : insumo.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                                            {insumo.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => navigate(`/supplier/item/edit/insumo/${insumo.id}`)} className="action-btn edit-btn" title="Editar"><FiEdit /></button>
                                            <button onClick={() => handleDelete(insumo.id)} className="action-btn delete-btn" title="Eliminar"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SupplierInsumosPage;