import React, { useState, useEffect } from 'react';
import { getSupplierOrders, getSupplierOrderDetails, updateOrderStatusBySupplier } from '../services/orderService';
import { useAlerts } from '../hooks/useAlerts';
import { FiEye, FiEdit, FiCalendar } from 'react-icons/fi';
import UpdateStatusModal from '../components/UpdateStatusModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import '../style/SupplierOrders.css';

const SupplierOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();
    const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });

    // CORREGIDO: Se eliminaron los caracteres extra ('_') después de catch y finally
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getSupplierOrders(filters);
            if (response.success) setOrders(response.data);
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const handleViewDetails = async (orderId) => {
        try {
            const response = await getSupplierOrderDetails(orderId);
            if (response.success) {
                setViewingOrder(response.data);
            }
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSaveStatus = async (orderId, updateData) => {
        try {
            await updateOrderStatusBySupplier(orderId, updateData);
            showSuccessAlert('Estado del pedido actualizado.');
            setEditingOrder(null);
            fetchOrders();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };
    
    // ... (resto del componente sin cambios)
    
    return (
        <div className="so-page-container">
            <header className="so-header">
                <h1>Gestión de Pedidos</h1>
            </header>
            
            <div className="so-filter-bar">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="so-filter-select">
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <div className="so-filter-date-wrapper">
                    <input 
                        type="date" 
                        name="startDate" 
                        value={filters.startDate} 
                        onChange={handleFilterChange} 
                        className="so-filter-date-input"
                    />
                    <FiCalendar className="so-calendar-icon" />
                </div>
            </div>

            {loading ? <p>Cargando pedidos...</p> : (
                <div className="so-table-container">
                    {orders.length > 0 ? (
                        <table className="so-orders-table">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Dirección</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.user_name} {order.user_lastname}</td>
                                        <td>{new Date(order.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td>{order.address || 'No especificada'}</td>
                                        <td>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                        <td>
                                            <span className={`so-status-badge so-status-${order.status.toLowerCase()}`}>{order.status}</span>
                                        </td>
                                        <td>
                                            <div className="so-action-buttons">
                                                <button onClick={() => setEditingOrder(order)} className="so-action-btn" title="Editar Estado"><FiEdit /></button>
                                                <button onClick={() => handleViewDetails(order.id)} className="so-action-btn" title="Ver Detalles"><FiEye /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay pedidos que coincidan con los filtros.</p>
                    )}
                </div>
            )}
            
            {editingOrder && (
                <UpdateStatusModal
                    order={editingOrder}
                    onSave={handleSaveStatus}
                    onClose={() => setEditingOrder(null)}
                />
            )}
            {viewingOrder && (
                <OrderDetailsModal
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}
        </div>
    );
};

export default SupplierOrdersPage;