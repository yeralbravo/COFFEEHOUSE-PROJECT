import React, { useState, useEffect } from 'react';
import { getLowStockItems } from '../services/supplierService';
import '../style/UserList.css';
import '../style/AdminPanel.css';
import '../style/SupplierLowStockPage.css';

const SupplierLowStockPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchItems();
    }, []);

    return (
        <div className="supplier-low-stock-page">
            <header className="admin-header">
                <h1>Productos con Bajo Stock</h1>
                {/* ✅ CAMBIO EN EL TEXTO */}
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
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map(item => (
                                <tr key={`${item.type}-${item.id}`}>
                                    <td>
                                        <img 
                                            src={item.image ? `http://localhost:5000/${item.image}` : 'https://placehold.co/60x60'} 
                                            alt={item.nombre} 
                                            className="product-image-thumbnail" 
                                        />
                                    </td>
                                    <td>{item.nombre}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span className="stock-badge stock-low">
                                            {item.stock}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
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