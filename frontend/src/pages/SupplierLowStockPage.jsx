import React, { useState, useEffect } from 'react';
import { getLowStockItems } from '../services/supplierService';
import { updateItemStock } from '../services/itemService';
import { useAlerts } from '../hooks/useAlerts';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
import '../style/UserList.css';
import '../style/AdminPanel.css';
import '../style/SupplierLowStockPage.css';

const SupplierLowStockPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const [editingItemId, setEditingItemId] = useState(null);
    const [currentStock, setCurrentStock] = useState('');

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await getLowStockItems();
            if (response.success) {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Error al cargar ítems con bajo stock", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setCurrentStock(item.stock);
    };

    const handleCancelClick = () => {
        setEditingItemId(null);
        setCurrentStock('');
    };

    const handleSaveClick = async (item) => {
        if (currentStock === '' || isNaN(currentStock) || currentStock < 0) {
            showErrorAlert('Por favor, introduce un número válido para el stock.');
            return;
        }

        try {
            await updateItemStock(item.type, item.id, Number(currentStock));
            showSuccessAlert('Stock actualizado correctamente.');
            setEditingItemId(null);
            fetchItems();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="supplier-low-stock-page">
            <header className="admin-header">
                <h1>Productos con Bajo Stock</h1>
                <p>Estos son los ítems con 5 o menos unidades disponibles.</p>
            </header>

            {loading ? <p>Cargando productos...</p> : (
                <div className="list-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre del Ítem</th>
                                <th>Tipo</th>
                                <th>Stock Restante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map(item => (
                                <tr key={`${item.type}-${item.id}`}>
                                    <td data-label="Imagen">
                                        <img 
                                            src={item.image ? `http://localhost:5000/${item.image}` : 'https://placehold.co/60x60'} 
                                            alt={item.nombre} 
                                            className="product-image-thumbnail" 
                                        />
                                    </td>
                                    <td data-label="Nombre">{item.nombre}</td>
                                    <td data-label="Tipo">{item.type}</td>
                                    <td data-label="Stock">
                                        {editingItemId === item.id ? (
                                            <input
                                                type="number"
                                                value={currentStock}
                                                onChange={(e) => setCurrentStock(e.target.value)}
                                                className="stock-input"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className={`stock-badge ${item.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                                                {item.stock}
                                            </span>
                                        )}
                                    </td>
                                    <td data-label="Acciones">
                                        <div className="action-buttons">
                                            {editingItemId === item.id ? (
                                                <>
                                                    <button onClick={() => handleSaveClick(item)} className="action-btn approve-btn" title="Guardar">
                                                        <FiSave />
                                                    </button>
                                                    <button onClick={handleCancelClick} className="action-btn delete-btn" title="Cancelar">
                                                        <FiX />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditClick(item)} className="action-btn edit-btn" title="Editar Stock">
                                                    <FiEdit />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                        ¡Felicidades! No tienes productos con bajo stock en este momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SupplierLowStockPage;